import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Palette, Sparkles, Check, ChevronDown, ChevronUp, PartyPopper, Crown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ReferencePhotoUpload } from "./ReferencePhotoUpload";
import {
  topperOptions3D,
  colorPalettes,
  type DecorationItem,
} from "@/data/decorationOptions";

interface PersonalizeDesignPanelProps {
  referenceImages: string[];
  onReferenceImagesChange: (images: string[]) => void;
  selectedDecorations: string[];
  onDecorationsChange: (decorations: string[]) => void;
  customInputs: Record<string, string>;
  onCustomInputChange: (decorationId: string, value: string) => void;
  selectedColorPalette: string | null;
  onColorPaletteChange: (paletteId: string | null) => void;
  eventTheme: string;
  onEventThemeChange: (theme: string) => void;
  eventStyle: string;
  onEventStyleChange: (style: string) => void;
  tierCount: number;
}

export function PersonalizeDesignPanel({
  referenceImages,
  onReferenceImagesChange,
  selectedDecorations,
  onDecorationsChange,
  customInputs,
  onCustomInputChange,
  selectedColorPalette,
  onColorPaletteChange,
  eventTheme,
  onEventThemeChange,
  eventStyle,
  onEventStyleChange,
  tierCount,
}: PersonalizeDesignPanelProps) {
  const [showToppers, setShowToppers] = useState(true);

  const toggleDecoration = (decorationId: string) => {
    onDecorationsChange(
      selectedDecorations.includes(decorationId)
        ? selectedDecorations.filter((id) => id !== decorationId)
        : [...selectedDecorations, decorationId]
    );
  };

  const getPrice = (item: DecorationItem) => {
    if (item.priceType === "per_tier") {
      return item.price * tierCount;
    }
    return item.price;
  };

  const selectedToppersCount = topperOptions3D.filter((o) =>
    selectedDecorations.includes(o.id)
  ).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="relative overflow-hidden rounded-lg border-2 border-secondary/30 bg-gradient-to-br from-card via-card to-secondary/5 p-6 shadow-lg"
    >
      {/* Decorative corner accents */}
      <div className="absolute top-0 left-0 h-4 w-4 border-t-2 border-l-2 border-secondary/50" />
      <div className="absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2 border-secondary/50" />
      <div className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-secondary/50" />
      <div className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-secondary/50" />

      <h2 className="font-display text-2xl md:text-3xl font-medium text-secondary mb-5 tracking-wide flex items-center gap-2">
        <Sparkles className="h-6 w-6" />
        Personalize Design
      </h2>

      <div className="space-y-6">
        {/* Reference Photos Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Camera className="h-4 w-4 text-muted-foreground" />
            <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
              Reference Photos
            </label>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Upload up to 5 Pinterest or inspiration photos to help us understand your vision.
          </p>
          <ReferencePhotoUpload
            images={referenceImages}
            onImagesChange={onReferenceImagesChange}
            maxImages={5}
          />
        </div>

        {/* Color Palette Selection */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Palette className="h-4 w-4 text-muted-foreground" />
            <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
              Color Palette
            </label>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Select the colors that best represent your event
          </p>
          <div className="grid grid-cols-2 gap-2">
            {colorPalettes.map((palette) => (
              <button
                key={palette.id}
                onClick={() =>
                  onColorPaletteChange(
                    selectedColorPalette === palette.id ? null : palette.id
                  )
                }
                className={`
                  relative p-2 rounded-lg border transition-all duration-200 text-left
                  ${
                    selectedColorPalette === palette.id
                      ? "border-secondary bg-secondary/10 ring-1 ring-secondary"
                      : "border-border hover:border-secondary/50"
                  }
                `}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex -space-x-1">
                    {palette.colors.map((color, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 rounded-full border border-white shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  {selectedColorPalette === palette.id && (
                    <Check className="h-3 w-3 text-secondary ml-auto" />
                  )}
                </div>
                <span className="text-xs font-medium text-foreground">
                  {palette.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Event Theme & Style */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <PartyPopper className="h-4 w-4 text-muted-foreground" />
            <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
              Event Theme & Style
            </label>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Tell us about your event vision
          </p>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-foreground mb-2 block">
                Event Theme
              </label>
              <Input
                value={eventTheme}
                onChange={(e) => onEventThemeChange(e.target.value)}
                placeholder="E.g., Enchanted garden, Tropical beach, Classic elegance..."
                className="input-sketch text-sm"
                maxLength={100}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground mb-2 block">
                Style / Vibes
              </label>
              <Textarea
                value={eventStyle}
                onChange={(e) => onEventStyleChange(e.target.value)}
                placeholder="Describe the atmosphere you want: romantic, modern, rustic, minimalist, glamorous..."
                className="input-sketch text-sm min-h-[80px] resize-none"
                maxLength={300}
              />
            </div>
          </div>
        </div>

        {/* Cake Toppers Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Crown className="h-4 w-4 text-muted-foreground" />
            <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
              Cake Toppers
            </label>
          </div>

          {/* 3D Print Toppers */}
          <div className="rounded-lg border border-border bg-card/50 overflow-hidden">
            <button
              onClick={() => setShowToppers(!showToppers)}
              className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">👑</span>
                <div className="text-left">
                  <span className="text-sm font-semibold text-foreground block">
                    3D Print Toppers
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Custom 3D printed cake toppers
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selectedToppersCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-bold">
                    {selectedToppersCount}
                  </span>
                )}
                {showToppers ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </button>

          <AnimatePresence>
            {showToppers && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-border"
              >
                <div className="p-3 space-y-2">
                  {topperOptions3D.map((option) => {
                    const isSelected = selectedDecorations.includes(option.id);
                    const price = getPrice(option);

                    return (
                      <div key={option.id}>
                        <button
                          onClick={() => toggleDecoration(option.id)}
                          className={`
                            w-full p-3 rounded-lg border transition-all duration-200 text-left
                            ${
                              isSelected
                                ? "border-secondary bg-secondary/10"
                                : "border-transparent bg-muted/30 hover:bg-muted/50"
                            }
                          `}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className={`
                                  w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                                  ${
                                    isSelected
                                      ? "border-secondary bg-secondary"
                                      : "border-muted-foreground"
                                  }
                                `}
                              >
                                {isSelected && (
                                  <Check className="h-3 w-3 text-secondary-foreground" />
                                )}
                              </div>
                              <div>
                                <span className="text-sm font-medium text-foreground block">
                                  {option.name}
                                </span>
                                {option.description && (
                                  <span className="text-xs text-muted-foreground">
                                    {option.description}
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="text-sm font-bold text-secondary">
                              +${price}
                            </span>
                          </div>
                        </button>

                        <AnimatePresence>
                          {isSelected && option.hasCustomInput && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="mt-2 ml-8"
                            >
                              <Input
                                value={customInputs[option.id] || ""}
                                onChange={(e) =>
                                  onCustomInputChange(option.id, e.target.value)
                                }
                                placeholder={option.customInputLabel}
                                className="input-sketch text-sm"
                                maxLength={50}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
