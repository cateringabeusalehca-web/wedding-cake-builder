import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, ChevronUp, Palette } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  decorationCategories,
  colorPalettes,
  type DecorationItem,
} from "@/data/decorationOptions";

interface AdvancedDecorationPanelProps {
  selectedDecorations: string[];
  onDecorationsChange: (decorations: string[]) => void;
  customInputs: Record<string, string>;
  onCustomInputChange: (decorationId: string, value: string) => void;
  selectedColorPalette: string | null;
  onColorPaletteChange: (paletteId: string | null) => void;
  tierCount: number;
}

export function AdvancedDecorationPanel({
  selectedDecorations,
  onDecorationsChange,
  customInputs,
  onCustomInputChange,
  selectedColorPalette,
  onColorPaletteChange,
  tierCount,
}: AdvancedDecorationPanelProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["florals"]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

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

  return (
    <div className="space-y-4">
      {/* Color Palette Selection */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg border border-border bg-card/50 overflow-hidden"
      >
        <div className="p-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-secondary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
              Color Palette
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Choose your wedding color scheme
          </p>
        </div>
        
        <div className="p-4 grid grid-cols-2 gap-2">
          {colorPalettes.map((palette) => (
            <button
              key={palette.id}
              onClick={() => onColorPaletteChange(
                selectedColorPalette === palette.id ? null : palette.id
              )}
              className={`
                relative p-2 rounded-lg border transition-all duration-200 text-left
                ${selectedColorPalette === palette.id
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
      </motion.div>

      {/* Decoration Categories */}
      {decorationCategories.map((category, categoryIndex) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: categoryIndex * 0.1 }}
          className="rounded-lg border border-border bg-card/50 overflow-hidden"
        >
          {/* Category Header */}
          <button
            onClick={() => toggleCategory(category.id)}
            className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{category.icon}</span>
              <div className="text-left">
                <span className="text-sm font-semibold text-foreground block">
                  {category.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {category.description}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Count badge */}
              {category.options.filter((o) => selectedDecorations.includes(o.id)).length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-bold">
                  {category.options.filter((o) => selectedDecorations.includes(o.id)).length}
                </span>
              )}
              {expandedCategories.includes(category.id) ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </button>

          {/* Category Options */}
          <AnimatePresence>
            {expandedCategories.includes(category.id) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-border"
              >
                <div className="p-3 space-y-2">
                  {category.options.map((option) => {
                    const isSelected = selectedDecorations.includes(option.id);
                    const price = getPrice(option);

                    return (
                      <div key={option.id}>
                        <button
                          onClick={() => toggleDecoration(option.id)}
                          className={`
                            w-full p-3 rounded-lg border transition-all duration-200 text-left
                            ${isSelected
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
                                  ${isSelected
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
                              {option.priceType === "per_tier" && (
                                <span className="text-xs text-muted-foreground font-normal ml-1">
                                  ({tierCount} tiers)
                                </span>
                              )}
                            </span>
                          </div>
                        </button>

                        {/* Custom Input Field */}
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
        </motion.div>
      ))}
    </div>
  );
}
