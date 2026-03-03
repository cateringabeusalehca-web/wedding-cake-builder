import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Calendar as CalendarIcon, Send, X, AlertTriangle } from "lucide-react";
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
  orderType?: "taster" | "quote";
  onClose: () => void;
  onSuccess: () => void;
  // Advanced customization props
  referenceImages?: string[];
  selectedDecorations?: string[];
  decorationCustomInputs?: Record<string, string>;
  selectedColorPalette?: string | null;
  eventTheme?: string;
  eventStyle?: string;
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
  orderType = "quote",
  onClose,
  onSuccess,
  referenceImages = [],
  selectedDecorations = [],
  decorationCustomInputs = {},
  selectedColorPalette = null,
  eventTheme = "",
  eventStyle = "",
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
    honeypot: "", // Anti-bot honeypot field
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const minDate = getMinEventDate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Build the CRM payload
    const decorationDetails = getSelectedDecorationDetails(selectedDecorations, decorationCustomInputs);
    const colorPaletteInfo = selectedColorPalette 
      ? colorPalettes.find(p => p.id === selectedColorPalette) 
      : null;

    const payload = {
      honeypot: formData.honeypot, // Anti-bot field - should be empty
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
        eventTheme: eventTheme || null,
        eventStyle: eventStyle || null,
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
        inspirationUrls: referenceImages,
      },
    };

    try {
      // Save order to database first
      const { error: dbError } = await supabase.from("cake_orders").insert({
        customer_name: formData.fullName,
        customer_email: formData.email,
        customer_phone: formData.phone,
        event_date: formData.eventDate?.toISOString().split("T")[0],
        guest_count: guestCount,
        estimated_price: totalPrice,
        special_requests: formData.additionalNotes || null,
        reference_images: referenceImages,
        cake_config: {
          orderType,
          structure: {
            id: structure.id,
            name: structure.name,
            tierCount: structure.tierCount,
            totalServings: structure.totalServings,
          },
          tiersConfiguration: payload.project.tiersConfiguration,
          frosting: payload.project.frosting,
          decoration: payload.project.decoration,
          floralPalette: payload.project.floralPalette,
          topper: payload.project.topper,
          colorPalette: payload.project.colorPalette,
          eventTheme: payload.project.eventTheme,
          eventStyle: payload.project.eventStyle,
          advancedDecorations: payload.project.advancedDecorations,
          eventType: formData.eventType,
          requiresSavoryBites: formData.requiresSavoryBites,
        },
        status: "pending",
      });

      if (dbError) {
        console.error("Error saving order to database:", dbError);
        // Continue with email even if DB save fails
      }

      // Send order email
      const { data, error } = await supabase.functions.invoke("send-order-email", {
        body: payload,
      });

      if (error) {
        console.error("Error sending order email:", error);
        // Don't throw - we still saved to DB
      }

      setIsSubmitting(false);
      onSuccess();
    } catch (error) {
      console.error("Failed to process order:", error);
      setIsSubmitting(false);
      // Still show success to user (partial failure shouldn't block the UX)
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, hsla(20, 15%, 8%, 0.85) 0%, hsla(25, 20%, 12%, 0.9) 50%, hsla(20, 15%, 8%, 0.85) 100%)",
        backdropFilter: "blur(8px)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto p-8 shadow-2xl rounded-2xl border border-secondary/20"
        style={{
          background: `
            linear-gradient(135deg, hsla(30, 10%, 96%, 0.97) 0%, hsla(35, 15%, 93%, 0.95) 50%, hsla(30, 10%, 96%, 0.97) 100%),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600'%3E%3Cfilter id='m'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.012' numOctaves='6' stitchTiles='stitch' seed='3'/%3E%3CfeColorMatrix values='0 0 0 0 0.85 0 0 0 0 0.82 0 0 0 0 0.78 0 0 0 0.35 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23m)'/%3E%3C/svg%3E")
          `,
          backgroundSize: "cover",
          backdropFilter: "blur(12px)",
        }}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-8 text-center">
          <h2 className="heading-display text-2xl sm:text-3xl md:text-4xl">
            {orderType === "taster" ? "Reserve Your Tasting" : "Finalize Your Blueprint"}
          </h2>
          <p className="mt-2 text-muted-foreground text-sm">
            {orderType === "taster" 
              ? "Secure your date & taste your dream flavors — $80 applied as credit" 
              : "Our atelier will review your specifications within 24 hours"}
          </p>
        </div>

        {/* Summary */}
        <div className="mb-8 flex items-center justify-center gap-4 sm:gap-6 border-y border-border py-4 flex-wrap">
          <div className="text-center">
            <span className="text-sketch text-muted-foreground text-xs sm:text-sm">Structure</span>
            <p className="font-display text-base sm:text-lg">{structure.name}</p>
          </div>
          <div className="h-8 w-px bg-border hidden sm:block" />
          <div className="text-center">
            <span className="text-sketch text-muted-foreground text-xs sm:text-sm">Servings</span>
            <p className="font-display text-base sm:text-lg">{structure.totalServings}</p>
          </div>
          <div className="h-8 w-px bg-border hidden sm:block" />
          <div className="text-center">
            <span className="text-sketch text-muted-foreground text-xs sm:text-sm">
              {orderType === "taster" ? "Tasting Fee" : "Estimate"}
            </span>
            <p className="font-display text-xl sm:text-2xl text-secondary">
              {orderType === "taster" ? "$80" : `$${totalPrice.toFixed(0)}`}
            </p>
            {orderType === "taster" && (
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Credit toward your ${totalPrice.toFixed(0)} cake
              </p>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Honeypot field - hidden from users, visible to bots */}
          <div className="absolute -left-[9999px] opacity-0 pointer-events-none" aria-hidden="true">
            <label htmlFor="website" className="sr-only">Website</label>
            <input
              type="text"
              id="website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={formData.honeypot}
              onChange={(e) =>
                setFormData({ ...formData, honeypot: e.target.value })
              }
            />
          </div>
          
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

          {/* Reference Images Summary (uploaded in previous step) */}
          {referenceImages.length > 0 && (
            <div className="bg-muted/30 p-4 rounded">
              <p className="text-sketch text-muted-foreground mb-2">
                Reference Images Attached ({referenceImages.length}/5)
              </p>
              <div className="flex gap-2 flex-wrap">
                {referenceImages.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`Reference ${i + 1}`}
                    className="w-16 h-16 object-cover rounded border border-border"
                  />
                ))}
              </div>
            </div>
          )}

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
                  {orderType === "taster" ? "Reserve & Pay $80" : "Confirm Design & Request Quote"}
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
