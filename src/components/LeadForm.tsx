import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Upload, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { TierConfig } from "./TierConfigPanel";
import {
  eventTypes,
  getMinEventDate,
  calculateEstimate,
  flavorDetails,
  fillingDetails,
} from "@/data/menuDatabase";

interface LeadFormProps {
  guestCount: number;
  tierCount: number;
  tierConfigs: TierConfig[];
  onClose: () => void;
  onSuccess: () => void;
}

export function LeadForm({
  guestCount,
  tierCount,
  tierConfigs,
  onClose,
  onSuccess,
}: LeadFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    eventDate: undefined as Date | undefined,
    eventType: "",
    additionalNotes: "",
    requiresSavoryBites: false,
  });
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const minDate = getMinEventDate();
  const estimatedQuote = calculateEstimate(guestCount, tierCount);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    const fileNames = files.map((f) => f.name);
    setUploadedFiles((prev) => [...prev, ...fileNames]);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      const fileNames = files.map((f) => f.name);
      setUploadedFiles((prev) => [...prev, ...fileNames]);
    },
    []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Build the CRM payload
    const payload = {
      client: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        eventDate: formData.eventDate?.toISOString(),
        eventType: formData.eventType,
      },
      project: {
        guestCount,
        calculatedTiers: tierCount,
        estimatedQuote,
        tiersConfiguration: tierConfigs.map((config, index) => ({
          tierLevel: index + 1,
          flavorID: config.flavorId,
          flavorName: flavorDetails[config.flavorId]?.name || "",
          fillingID: config.fillingId,
          fillingName: fillingDetails[config.fillingId]?.name || "",
          dietary: config.dietaryId,
        })),
      },
      blindSpotCheck: {
        requiresSavoryBites: formData.requiresSavoryBites,
        additionalNotes: formData.additionalNotes,
      },
      assets: {
        inspirationUrls: uploadedFiles,
      },
      targetEmail: "orders@cateringabeusaleh.ca",
    };

    // Log the payload for CRM integration
    console.log("=== CAKE DESIGN LEAD ===");
    console.log(JSON.stringify(payload, null, 2));

    // Simulate submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess();
    }, 1500);
  };

  const isFormValid =
    formData.fullName &&
    formData.email &&
    formData.phone &&
    formData.eventDate &&
    formData.eventType;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto bg-background p-8 shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-8 text-center">
          <h2 className="heading-display text-3xl md:text-4xl">
            Finalize Your Blueprint
          </h2>
          <p className="mt-2 text-muted-foreground">
            Our atelier will review your specifications within 24 hours
          </p>
        </div>

        {/* Summary */}
        <div className="mb-8 flex items-center justify-center gap-8 border-y border-border py-4">
          <div className="text-center">
            <span className="text-sketch text-muted-foreground">Guests</span>
            <p className="font-display text-2xl">{guestCount}</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <span className="text-sketch text-muted-foreground">Tiers</span>
            <p className="font-display text-2xl">{tierCount}</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <span className="text-sketch text-muted-foreground">Estimate</span>
            <p className="font-display text-2xl text-secondary">
              ${estimatedQuote.toFixed(0)}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sketch text-muted-foreground">
                Full Name *
              </label>
              <Input
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="input-sketch mt-2"
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label className="text-sketch text-muted-foreground">
                Email *
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="input-sketch mt-2"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sketch text-muted-foreground">
                Phone *
              </label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="input-sketch mt-2"
                placeholder="+1 (555) 000-0000"
                required
              />
            </div>
            <div>
              <label className="text-sketch text-muted-foreground">
                Event Type *
              </label>
              <Select
                value={formData.eventType}
                onValueChange={(value) =>
                  setFormData({ ...formData, eventType: value })
                }
              >
                <SelectTrigger className="input-sketch mt-2 border-0 border-b">
                  <SelectValue placeholder="Select event" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Event Date with 30-day restriction */}
          <div>
            <label className="text-sketch text-muted-foreground">
              Event Date *{" "}
              <span className="text-xs normal-case">
                (minimum 30 days lead time)
              </span>
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "input-sketch mt-2 w-full justify-start border-0 border-b text-left font-normal",
                    !formData.eventDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.eventDate ? (
                    format(formData.eventDate, "PPP")
                  ) : (
                    <span>Pick your event date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.eventDate}
                  onSelect={(date) =>
                    setFormData({ ...formData, eventDate: date })
                  }
                  disabled={(date) => date < minDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Inspiration Upload Zone */}
          <div>
            <label className="text-sketch text-muted-foreground">
              Inspiration & References
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "dropzone-blueprint mt-2 transition-all",
                isDragging && "border-secondary bg-secondary/10"
              )}
            >
              <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">
                Drag & drop Pinterest screenshots or moodboards
              </p>
              <p className="mt-1 text-xs text-muted-foreground/60">
                or click to browse
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileInput}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </div>
            {uploadedFiles.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {uploadedFiles.map((file, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 bg-muted px-2 py-1 text-xs"
                  >
                    {file}
                    <button
                      type="button"
                      onClick={() =>
                        setUploadedFiles((prev) =>
                          prev.filter((_, idx) => idx !== i)
                        )
                      }
                      className="text-muted-foreground hover:text-foreground"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Blind Spot Check */}
          <div className="space-y-4 border-t border-border pt-6">
            <div className="flex items-start gap-3">
              <Checkbox
                id="savory"
                checked={formData.requiresSavoryBites}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    requiresSavoryBites: checked as boolean,
                  })
                }
                className="mt-1"
              />
              <label htmlFor="savory" className="cursor-pointer text-sm">
                <span className="font-medium">
                  I'm interested in Savory Bites or a Dessert Table add-on
                </span>
                <span className="mt-1 block text-muted-foreground">
                  Let us know if you'd like to elevate your event with
                  additional catering
                </span>
              </label>
            </div>

            <div>
              <label className="text-sketch text-muted-foreground">
                Additional Notes
              </label>
              <Textarea
                value={formData.additionalNotes}
                onChange={(e) =>
                  setFormData({ ...formData, additionalNotes: e.target.value })
                }
                className="input-sketch mt-2 min-h-[80px] resize-none border"
                placeholder="Any specific requirements, allergies, or design preferences..."
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex flex-col gap-3 pt-4">
            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="btn-gold w-full gap-2"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                  />
                  Sending Blueprint...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Confirm Design & Request Quote
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
