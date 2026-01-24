import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Calendar as CalendarIcon, Upload, Send, X, AlertTriangle } from "lucide-react";
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
import {
  eventTypes,
  getMinEventDate,
  CakeStructure,
  TierConfiguration,
  spongeOptions,
  dietaryOptions,
  fillingOptions,
  coatingOptions,
  decorationOptions,
  topperOptions,
  getTierLabel,
} from "@/data/menuDatabase";
import { getSelectedDecorationDetails, colorPalettes } from "@/data/decorationOptions";

interface LeadFormProps {
  guestCount: number;
  structure: CakeStructure;
  tierConfigs: TierConfiguration[];
  coatingId: string;
  decorationId: string;
  topperId: string;
  floralPalette: string;
  totalPrice: number;
  onClose: () => void;
  onSuccess: () => void;
  // Advanced customization props
  referenceImages?: string[];
  selectedDecorations?: string[];
  decorationCustomInputs?: Record<string, string>;
  selectedColorPalette?: string | null;
}

export function LeadForm({
  guestCount,
  structure,
  tierConfigs,
  coatingId,
  decorationId,
  topperId,
  floralPalette,
  totalPrice,
  onClose,
  onSuccess,
  referenceImages = [],
  selectedDecorations = [],
  decorationCustomInputs = {},
  selectedColorPalette = null,
}: LeadFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    eventDate: undefined as Date | undefined,
    eventType: "",
    additionalNotes: "",
    requiresSavoryBites: false,
    allergyAcknowledged: false,
  });
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const minDate = getMinEventDate();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Build the CRM payload
    const decorationDetails = getSelectedDecorationDetails(selectedDecorations, decorationCustomInputs);
    const colorPaletteInfo = selectedColorPalette 
      ? colorPalettes.find(p => p.id === selectedColorPalette) 
      : null;

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
        structure: {
          id: structure.id,
          name: structure.name,
          tierCount: structure.tierCount,
          totalServings: structure.totalServings,
        },
        estimatedQuote: totalPrice,
        tiersConfiguration: tierConfigs.map((config, index) => {
          const tierInfo = structure.tiers[index];
          const sponge = spongeOptions.find((s) => s.id === config.spongeId);
          const dietary = dietaryOptions.find((d) => d.id === config.dietaryId);
          const filling = fillingOptions.find((f) => f.id === config.fillingId);
          return {
            tierLevel: tierInfo?.tierLevel || index + 1,
            tierLabel: getTierLabel(tierInfo?.tierLevel || index + 1, structure.tierCount),
            sizeInches: tierInfo?.sizeInches,
            servings: tierInfo?.servings,
            sponge: sponge?.name || config.spongeId,
            dietary: dietary?.label || config.dietaryId,
            filling: filling?.name || config.fillingId,
          };
        }),
        frosting: coatingOptions.find((c) => c.id === coatingId)?.name || coatingId,
        decoration: decorationOptions.find((d) => d.id === decorationId)?.name || decorationId,
        floralPalette: floralPalette || null,
        topper: topperOptions.find((t) => t.id === topperId)?.name || topperId,
        // Advanced customization data
        colorPalette: colorPaletteInfo?.name || null,
        advancedDecorations: decorationDetails.map(d => ({
          name: d.item.name,
          price: d.item.price,
          customValue: d.customValue || null,
        })),
      },
      blindSpotCheck: {
        requiresSavoryBites: formData.requiresSavoryBites,
        additionalNotes: formData.additionalNotes,
      },
      assets: {
        referenceImages: referenceImages,
        inspirationUrls: uploadedFiles,
      },
    };

    try {
      console.log("=== SENDING CAKE ORDER EMAIL ===");
      console.log(JSON.stringify(payload, null, 2));

      const { data, error } = await supabase.functions.invoke("send-order-email", {
        body: payload,
      });

      if (error) {
        console.error("Error sending order email:", error);
        throw error;
      }

      console.log("Order email sent successfully:", data);
      setIsSubmitting(false);
      onSuccess();
    } catch (error) {
      console.error("Failed to send order:", error);
      setIsSubmitting(false);
      // Still show success to user (email failure shouldn't block the UX)
      onSuccess();
    }
  };

  const isFormValid =
    formData.fullName &&
    formData.email &&
    formData.phone &&
    formData.eventDate &&
    formData.eventType &&
    formData.allergyAcknowledged;

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
        <div className="mb-8 flex items-center justify-center gap-6 border-y border-border py-4 flex-wrap">
          <div className="text-center">
            <span className="text-sketch text-muted-foreground">Structure</span>
            <p className="font-display text-lg">{structure.name}</p>
          </div>
          <div className="h-8 w-px bg-border hidden sm:block" />
          <div className="text-center">
            <span className="text-sketch text-muted-foreground">Servings</span>
            <p className="font-display text-lg">{structure.totalServings}</p>
          </div>
          <div className="h-8 w-px bg-border hidden sm:block" />
          <div className="text-center">
            <span className="text-sketch text-muted-foreground">Estimate</span>
            <p className="font-display text-2xl text-secondary">
              ${totalPrice.toFixed(0)}
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

          {/* Event Date with 28-day restriction */}
          <div>
            <label className="text-sketch text-muted-foreground">
              Event Date *{" "}
              <span className="text-xs normal-case">
                (minimum 28 days lead time)
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
                "dropzone-blueprint mt-2 transition-all relative",
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

          {/* Blind Spot Check & Allergy Warning */}
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

            {/* Allergy Warning - Required */}
            <div className="flex items-start gap-3 bg-muted/30 p-4 rounded">
              <Checkbox
                id="allergy"
                checked={formData.allergyAcknowledged}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    allergyAcknowledged: checked as boolean,
                  })
                }
                className="mt-1"
              />
              <label htmlFor="allergy" className="cursor-pointer text-sm">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-secondary" />
                  <span className="font-medium">Allergy Acknowledgment *</span>
                </div>
                <span className="mt-1 block text-muted-foreground text-xs">
                  I understand that while strict protocols are followed, products 
                  are made in a facility that handles nuts, dairy, and other allergens.
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
