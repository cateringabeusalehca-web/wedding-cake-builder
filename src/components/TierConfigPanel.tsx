import { motion } from "framer-motion";
import { Check, Copy, DollarSign, Cake, Layers, Palette, Circle, Square, Minus, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  spongeOptions,
  SpongeOption,
  dietaryOptions,
  fillingOptions,
  fillingCategories,
  FillingCategory,
  FillingOptionWithCategory,
  TierConfiguration,
  calculateTierPrice,
  getTierLabel,
  TierStructure,
  getAllowedFillings,
  getSpongesForDietary,
  getFillingsForDietary,
  CakeShape,
  getServingsForTier,
  getSeparatorPrice,
  availableTierSizes,
  getEffectiveTierSize,
  availableSeparatorDiameters,
  availableSeparatorHeights,
  SeparatorConfig,
  SeparatorShape,
  SeparatorHeight,
  getDefaultSeparatorConfig,
  formatSizeWithUnits,
  getAvailableSizesForTier,
} from "@/data/menuDatabase";
import { useMemo, useState } from "react";
import { PortionDiagram } from "./PortionDiagram";
import { Toggle } from "@/components/ui/toggle";

// Dietary tag definitions for filtering
const dietaryTags = [
  { id: "GF", label: "Gluten-Free", color: "bg-amber-100 text-amber-700 border-amber-300" },
  { id: "SF", label: "Sugar-Free", color: "bg-blue-100 text-blue-700 border-blue-300" },
  { id: "V", label: "Vegan", color: "bg-green-100 text-green-700 border-green-300" },
  { id: "DF", label: "Dairy-Free", color: "bg-purple-100 text-purple-700 border-purple-300" },
] as const;

type DietaryTag = typeof dietaryTags[number]["id"];

// Separate component for filling selection with dietary filters
interface FillingSelectorProps {
  config: TierConfiguration;
  availableFillings: FillingOptionWithCategory[];
  selectedFilling: FillingOptionWithCategory | undefined;
  tierInfo: TierStructure;
  onConfigChange: (config: TierConfiguration) => void;
}

function FillingSelector({
  config,
  availableFillings,
  selectedFilling,
  tierInfo,
  onConfigChange,
}: FillingSelectorProps) {
  const [activeDietaryFilters, setActiveDietaryFilters] = useState<Set<DietaryTag>>(new Set());

  const toggleDietaryFilter = (tag: DietaryTag) => {
    setActiveDietaryFilters((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }
      return next;
    });
  };

  // Filter fillings based on active dietary tags
  const filteredFillings = useMemo(() => {
    if (activeDietaryFilters.size === 0) {
      return availableFillings;
    }
    return availableFillings.filter((filling) => {
      // Check if filling has all the active dietary tags
      return Array.from(activeDietaryFilters).every((tag) =>
        filling.dietary?.includes(tag)
      );
    });
  }, [availableFillings, activeDietaryFilters]);

  // Count fillings per tag for showing availability
  const tagCounts = useMemo(() => {
    const counts: Record<DietaryTag, number> = { GF: 0, SF: 0, V: 0, DF: 0 };
    availableFillings.forEach((filling) => {
      filling.dietary?.forEach((tag) => {
        if (tag in counts) {
          counts[tag as DietaryTag]++;
        }
      });
    });
    return counts;
  }, [availableFillings]);

  return (
    <div className="space-y-3">
      <div>
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-secondary" />
          <span className="text-sm font-semibold uppercase tracking-wider text-secondary">
            Filling
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Select the cream between your cake layers
        </p>
      </div>

      {/* Dietary Filter Toggles */}
      <div className="flex flex-wrap gap-2">
        {dietaryTags.map((tag) => {
          const isActive = activeDietaryFilters.has(tag.id);
          const count = tagCounts[tag.id];
          return (
            <Toggle
              key={tag.id}
              pressed={isActive}
              onPressedChange={() => toggleDietaryFilter(tag.id)}
              variant="outline"
              size="sm"
              className={`text-xs px-2.5 py-1 h-auto transition-all ${
                isActive
                  ? tag.color + " border"
                  : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
              }`}
              disabled={count === 0}
            >
              {tag.id}
              <span className="ml-1 text-[10px] opacity-70">({count})</span>
            </Toggle>
          );
        })}
      </div>

      {activeDietaryFilters.size > 0 && (
        <p className="text-xs text-secondary">
          Showing {filteredFillings.length} of {availableFillings.length} fillings
        </p>
      )}

      <Select
        value={config.fillingId}
        onValueChange={(fillingId) =>
          onConfigChange({ ...config, fillingId })
        }
      >
        <SelectTrigger className="input-sketch border-0 border-b">
          <SelectValue placeholder="Select filling" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {(Object.keys(fillingCategories) as FillingCategory[]).map((category) => {
            const categoryFillings = filteredFillings.filter(
              (f) => 'category' in f && f.category === category
            );
            if (categoryFillings.length === 0) return null;

            const categoryInfo = fillingCategories[category];
            return (
              <div key={category}>
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50 sticky top-0">
                  {categoryInfo.emoji} {categoryInfo.label}
                </div>
                    {categoryFillings.map((filling) => (
                      <SelectItem key={filling.id} value={filling.id}>
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{filling.name}</span>
                            {filling.dietary && filling.dietary.length > 0 && (
                              <span className="text-[10px] text-muted-foreground">
                                {filling.dietary.join(" · ")}
                              </span>
                            )}
                          </div>
                      {filling.priceExtra > 0 && (
                        <span className="text-xs text-secondary font-medium">
                          +${filling.priceExtra.toFixed(2)}/srv
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </div>
            );
          })}
          {filteredFillings.length === 0 && (
            <div className="px-3 py-4 text-center text-sm text-muted-foreground">
              No fillings match selected dietary filters
            </div>
          )}
        </SelectContent>
      </Select>
      {selectedFilling && selectedFilling.priceExtra > 0 && (
        <p className="text-xs text-secondary">
          +${(selectedFilling.priceExtra * tierInfo.servings).toFixed(0)} for this tier
        </p>
      )}
    </div>
  );
}

// Separate component for sponge selection with dietary filters
interface SpongeSelectorProps {
  config: TierConfiguration;
  availableSponges: SpongeOption[];
  selectedSponge: SpongeOption | undefined;
  tierInfo: TierStructure;
  onSpongeChange: (spongeId: string) => void;
}

function SpongeSelector({
  config,
  availableSponges,
  selectedSponge,
  tierInfo,
  onSpongeChange,
}: SpongeSelectorProps) {
  const [activeDietaryFilters, setActiveDietaryFilters] = useState<Set<DietaryTag>>(new Set());

  const toggleDietaryFilter = (tag: DietaryTag) => {
    setActiveDietaryFilters((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }
      return next;
    });
  };

  // Filter sponges based on active dietary tags
  const filteredSponges = useMemo(() => {
    if (activeDietaryFilters.size === 0) {
      return availableSponges;
    }
    return availableSponges.filter((sponge) => {
      return Array.from(activeDietaryFilters).every((tag) =>
        sponge.dietary?.includes(tag)
      );
    });
  }, [availableSponges, activeDietaryFilters]);

  // Count sponges per tag for showing availability
  const tagCounts = useMemo(() => {
    const counts: Record<DietaryTag, number> = { GF: 0, SF: 0, V: 0, DF: 0 };
    availableSponges.forEach((sponge) => {
      sponge.dietary?.forEach((tag) => {
        if (tag in counts) {
          counts[tag as DietaryTag]++;
        }
      });
    });
    return counts;
  }, [availableSponges]);

  // Group sponges by category
  const standardSponges = filteredSponges.filter((s) => s.category === "Standard");
  const premiumSponges = filteredSponges.filter((s) => s.category === "Premium");

  return (
    <div className="space-y-3">
      <div>
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-secondary" />
          <span className="text-sm font-semibold uppercase tracking-wider text-secondary">
            Sponge
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Choose the cake base flavor for this tier
        </p>
      </div>

      {/* Dietary Filter Toggles */}
      <div className="flex flex-wrap gap-2">
        {dietaryTags.map((tag) => {
          const isActive = activeDietaryFilters.has(tag.id);
          const count = tagCounts[tag.id];
          return (
            <Toggle
              key={tag.id}
              pressed={isActive}
              onPressedChange={() => toggleDietaryFilter(tag.id)}
              variant="outline"
              size="sm"
              className={`text-xs px-2.5 py-1 h-auto transition-all ${
                isActive
                  ? tag.color + " border"
                  : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
              }`}
              disabled={count === 0}
            >
              {tag.id}
              <span className="ml-1 text-[10px] opacity-70">({count})</span>
            </Toggle>
          );
        })}
      </div>

      {activeDietaryFilters.size > 0 && (
        <p className="text-xs text-secondary">
          Showing {filteredSponges.length} of {availableSponges.length} sponges
        </p>
      )}

      <Select
        value={config.spongeId}
        onValueChange={onSpongeChange}
      >
        <SelectTrigger className="input-sketch border-0 border-b">
          <SelectValue placeholder="Select sponge" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {standardSponges.length > 0 && (
            <div>
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50 sticky top-0">
                🍰 Standard
              </div>
              {standardSponges.map((sponge) => (
                <SelectItem key={sponge.id} value={sponge.id}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{sponge.name}</span>
                      {sponge.dietary && sponge.dietary.length > 0 && (
                        <span className="text-[10px] text-muted-foreground">
                          {sponge.dietary.join(" · ")}
                        </span>
                      )}
                    </div>
                    {sponge.priceExtra > 0 && (
                      <span className="text-xs text-secondary font-medium">
                        +${sponge.priceExtra.toFixed(2)}/srv
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </div>
          )}
          {premiumSponges.length > 0 && (
            <div>
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50 sticky top-0">
                ✨ Premium
              </div>
              {premiumSponges.map((sponge) => (
                <SelectItem key={sponge.id} value={sponge.id}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{sponge.name}</span>
                      {sponge.dietary && sponge.dietary.length > 0 && (
                        <span className="text-[10px] text-muted-foreground">
                          {sponge.dietary.join(" · ")}
                        </span>
                      )}
                    </div>
                    {sponge.priceExtra > 0 && (
                      <span className="text-xs text-secondary font-medium">
                        +${sponge.priceExtra.toFixed(2)}/srv
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </div>
          )}
          {filteredSponges.length === 0 && (
            <div className="px-3 py-4 text-center text-sm text-muted-foreground">
              No sponges match selected dietary filters
            </div>
          )}
        </SelectContent>
      </Select>
      {selectedSponge && selectedSponge.priceExtra > 0 && (
        <p className="text-xs text-secondary">
          +${(selectedSponge.priceExtra * tierInfo.servings).toFixed(0)} for this tier
        </p>
      )}
    </div>
  );
}

interface TierConfigPanelProps {
  tierNumber: number;
  tierInfo: TierStructure;
  config: TierConfiguration;
  onConfigChange: (config: TierConfiguration) => void;
  onApplyToAll: () => void;
  onClose: () => void;
  totalTiers: number;
  isTopTier?: boolean;
  allTierConfigs: TierConfiguration[];
  allDefaultTierSizes: number[];
}

export function TierConfigPanel({
  tierNumber,
  tierInfo,
  config,
  onConfigChange,
  onApplyToAll,
  onClose,
  totalTiers,
  isTopTier = false,
  allTierConfigs,
  allDefaultTierSizes,
}: TierConfigPanelProps) {
  const tierLabel = getTierLabel(tierNumber, totalTiers);
  
  // Get effective size (custom or default)
  const effectiveSize = config.customSizeInches || tierInfo.sizeInches;
  
  // Get available sizes for this tier based on structural constraints
  const tierIndex = tierNumber - 1; // Convert tier number (1-based) to index (0-based)
  const availableSizes = useMemo(() => {
    return getAvailableSizesForTier(tierIndex, totalTiers, allTierConfigs, allDefaultTierSizes);
  }, [tierIndex, totalTiers, allTierConfigs, allDefaultTierSizes]);
  
  // Get actual servings based on shape and size
  const actualServings = getServingsForTier(effectiveSize, config.shape);
  
  const pricing = calculateTierPrice(
    actualServings,
    config.spongeId,
    config.dietaryId,
    config.fillingId
  );
  
  // Calculate separator price if enabled
  const separatorPrice = config.hasSeparatorAbove && config.separatorConfig 
    ? getSeparatorPrice(config.separatorConfig) 
    : 0;

  // Filter sponges based on dietary selection
  const availableSponges = useMemo(() => {
    return getSpongesForDietary(config.dietaryId);
  }, [config.dietaryId]);

  // Filter fillings based on sponge selection AND dietary
  const availableFillings = useMemo(() => {
    const spongeFillings = getAllowedFillings(config.spongeId);
    const dietaryFillings = getFillingsForDietary(config.dietaryId);
    
    // Intersection of both
    if (config.dietaryId && config.dietaryId !== "none") {
      return spongeFillings.filter((f) => 
        dietaryFillings.some((df) => df.id === f.id)
      );
    }
    return spongeFillings;
  }, [config.spongeId, config.dietaryId]);

  const selectedSponge = spongeOptions.find((s) => s.id === config.spongeId);
  const selectedDietary = dietaryOptions.find((d) => d.id === config.dietaryId);
  const selectedFilling = fillingOptions.find((f) => f.id === config.fillingId);

  // Handle dietary change - reset sponge and filling if not compatible
  const handleDietaryChange = (dietaryId: string) => {
    const newSponges = getSpongesForDietary(dietaryId);
    const currentSpongeValid = newSponges.some((s) => s.id === config.spongeId);
    
    let newSpongeId = config.spongeId;
    if (!currentSpongeValid && newSponges.length > 0) {
      newSpongeId = newSponges[0].id;
    }

    const newFillings = getAllowedFillings(newSpongeId);
    const dietaryFillings = getFillingsForDietary(dietaryId);
    const compatibleFillings = dietaryId && dietaryId !== "none"
      ? newFillings.filter((f) => dietaryFillings.some((df) => df.id === f.id))
      : newFillings;

    const currentFillingValid = compatibleFillings.some((f) => f.id === config.fillingId);
    let newFillingId = config.fillingId;
    if (!currentFillingValid && compatibleFillings.length > 0) {
      newFillingId = compatibleFillings[0].id;
    }

    onConfigChange({
      ...config,
      dietaryId,
      spongeId: newSpongeId,
      fillingId: newFillingId,
    });
  };

  // Handle sponge change - reset filling if not compatible
  const handleSpongeChange = (spongeId: string) => {
    const newFillings = getAllowedFillings(spongeId);
    const dietaryFillings = getFillingsForDietary(config.dietaryId);
    const compatibleFillings = config.dietaryId && config.dietaryId !== "none"
      ? newFillings.filter((f) => dietaryFillings.some((df) => df.id === f.id))
      : newFillings;

    const currentFillingValid = compatibleFillings.some((f) => f.id === config.fillingId);
    const newFillingId = currentFillingValid
      ? config.fillingId
      : compatibleFillings[0]?.id || config.fillingId;

    onConfigChange({
      ...config,
      spongeId,
      fillingId: newFillingId,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="card-architectural space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Cake className="h-5 w-5 text-secondary" />
          <div>
            <h3 className="font-display text-2xl font-bold uppercase tracking-wide text-foreground">
              {tierLabel}
            </h3>
            <p className="text-sm text-muted-foreground">
              {formatSizeWithUnits(effectiveSize)} {config.shape} • {actualServings} servings
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          ✕
        </button>
      </div>

      {/* Size Selection */}
      <div className="space-y-2 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <Ruler className="h-4 w-4 text-secondary" />
          <span className="text-sm font-semibold uppercase tracking-wider text-secondary">
            Tier Size
          </span>
          {totalTiers > 1 && (
            <span className="text-xs text-muted-foreground">(bottom tiers must be ≥ top tiers)</span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {availableSizes.map((size) => {
            const isSelected = (config.customSizeInches || tierInfo.sizeInches) === size;
            const isDefault = size === tierInfo.sizeInches && !config.customSizeInches;
            return (
              <Button
                key={size}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => onConfigChange({ 
                  ...config, 
                  customSizeInches: size === tierInfo.sizeInches ? undefined : size 
                })}
                className={`min-w-[80px] flex flex-col items-center py-2 h-auto ${isSelected ? "btn-gold" : ""}`}
              >
                <span className="font-semibold">{size}"</span>
                <span className="text-[10px] opacity-75">{Math.round(size * 2.54)} cm</span>
              </Button>
            );
          })}
        </div>
        {availableSizes.length === 0 && (
          <p className="text-xs text-destructive">
            No valid sizes available. Adjust other tiers first.
          </p>
        )}
        {config.customSizeInches && config.customSizeInches !== tierInfo.sizeInches && (
          <p className="text-xs text-secondary">
            Custom size (default: {formatSizeWithUnits(tierInfo.sizeInches)})
          </p>
        )}
      </div>

      {/* Shape Selection & Portion Diagram */}
      <div className="grid grid-cols-2 gap-4 border-b border-border pb-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold uppercase tracking-wider text-secondary">
              Shape
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant={config.shape === "round" ? "default" : "outline"}
              size="sm"
              onClick={() => onConfigChange({ ...config, shape: "round" })}
              className={`flex-1 gap-2 ${config.shape === "round" ? "btn-gold" : ""}`}
            >
              <Circle className="h-4 w-4" />
              Round
            </Button>
            <Button
              variant={config.shape === "square" ? "default" : "outline"}
              size="sm"
              onClick={() => onConfigChange({ ...config, shape: "square" })}
              className={`flex-1 gap-2 ${config.shape === "square" ? "btn-gold" : ""}`}
            >
              <Square className="h-4 w-4" />
              Square
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Square yields more portions per size
          </p>
        </div>
        
        <PortionDiagram 
          sizeInches={effectiveSize} 
          shape={config.shape} 
        />
      </div>

      {/* Acrylic Separator Option - Not for top tier */}
      {!isTopTier && (
        <div className="space-y-3 py-3 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Minus className="h-4 w-4 text-secondary" />
              <div>
                <Label htmlFor="separator" className="text-sm font-medium">
                  Acrylic Separator Above
                </Label>
                <p className="text-xs text-muted-foreground">
                  Decorative transparent stand
                </p>
              </div>
              <span className="text-xs text-muted-foreground ml-2">
                (Rental fee)
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-secondary font-medium">
                +${config.separatorConfig ? getSeparatorPrice(config.separatorConfig) : 0} rental
              </span>
              <Switch
                id="separator"
                checked={config.hasSeparatorAbove}
                onCheckedChange={(checked) => {
                  if (checked && !config.separatorConfig) {
                    // Initialize with default config
                    onConfigChange({ 
                      ...config, 
                      hasSeparatorAbove: checked,
                      separatorConfig: getDefaultSeparatorConfig(effectiveSize)
                    });
                  } else {
                    onConfigChange({ ...config, hasSeparatorAbove: checked });
                  }
                }}
              />
            </div>
          </div>
          
          {/* Separator Configuration - Only show when enabled */}
          {config.hasSeparatorAbove && config.separatorConfig && (
            <div className="ml-7 space-y-3 pt-2 border-t border-border/50">
              {/* Separator Shape */}
              <div className="flex items-center gap-4">
                <span className="text-xs font-medium text-muted-foreground w-16">Shape:</span>
                <div className="flex gap-2">
                  <Button
                    variant={config.separatorConfig.shape === "round" ? "default" : "outline"}
                    size="sm"
                    onClick={() => onConfigChange({ 
                      ...config, 
                      separatorConfig: { ...config.separatorConfig!, shape: "round" }
                    })}
                    className={`gap-1 px-3 ${config.separatorConfig.shape === "round" ? "btn-gold" : ""}`}
                  >
                    <Circle className="h-3 w-3" />
                    Round
                  </Button>
                  <Button
                    variant={config.separatorConfig.shape === "square" ? "default" : "outline"}
                    size="sm"
                    onClick={() => onConfigChange({ 
                      ...config, 
                      separatorConfig: { ...config.separatorConfig!, shape: "square" }
                    })}
                    className={`gap-1 px-3 ${config.separatorConfig.shape === "square" ? "btn-gold" : ""}`}
                  >
                    <Square className="h-3 w-3" />
                    Square
                  </Button>
                </div>
              </div>
              
              {/* Separator Diameter */}
              <div className="flex items-center gap-4">
                <span className="text-xs font-medium text-muted-foreground w-16">Diameter:</span>
                <div className="flex flex-wrap gap-2">
                  {availableSeparatorDiameters.map((size) => (
                    <Button
                      key={size}
                      variant={config.separatorConfig!.diameterInches === size ? "default" : "outline"}
                      size="sm"
                      onClick={() => onConfigChange({ 
                        ...config, 
                        separatorConfig: { ...config.separatorConfig!, diameterInches: size }
                      })}
                      className={`min-w-[60px] flex flex-col items-center py-1.5 h-auto ${config.separatorConfig!.diameterInches === size ? "btn-gold" : ""}`}
                    >
                      <span className="text-xs font-semibold">{size}"</span>
                      <span className="text-[9px] opacity-75">{Math.round(size * 2.54)} cm</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Separator Height */}
              <div className="flex items-center gap-4">
                <span className="text-xs font-medium text-muted-foreground w-16">Height:</span>
                <div className="flex gap-2">
                  {availableSeparatorHeights.map((height) => (
                    <Button
                      key={height}
                      variant={config.separatorConfig!.heightCm === height ? "default" : "outline"}
                      size="sm"
                      onClick={() => onConfigChange({ 
                        ...config, 
                        separatorConfig: { ...config.separatorConfig!, heightCm: height }
                      })}
                      className={`px-3 text-xs ${config.separatorConfig!.heightCm === height ? "btn-gold" : ""}`}
                    >
                      {height} cm ({Math.round(height / 2.54 * 10) / 10}")
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Price breakdown */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-secondary" />
          <span className="text-sketch text-muted-foreground">Tier Price</span>
        </div>
        <div className="text-right">
          <motion.span
            key={pricing.total + separatorPrice}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="font-display text-2xl text-secondary"
          >
            ${(pricing.total + separatorPrice).toFixed(0)}
          </motion.span>
          {separatorPrice > 0 && (
            <p className="text-xs text-muted-foreground">
              (includes ${separatorPrice} separator)
            </p>
          )}
        </div>
      </div>

      <div className="space-y-5">
        {/* Dietary Selection */}
        <div className="space-y-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold uppercase tracking-wider text-secondary">
                Dietary
              </span>
              <span className="text-xs text-muted-foreground">(Optional)</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Special dietary requirements for this tier
            </p>
          </div>
          <Select
            value={config.dietaryId}
            onValueChange={handleDietaryChange}
          >
            <SelectTrigger className="input-sketch border-0 border-b">
              <SelectValue placeholder="Select dietary option" />
            </SelectTrigger>
            <SelectContent>
              {dietaryOptions.map((dietary) => (
                <SelectItem key={dietary.id} value={dietary.id}>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <span className="font-medium">{dietary.label}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {dietary.description}
                      </span>
                    </div>
                    {dietary.surcharge > 0 && (
                      <span className="text-xs text-secondary font-medium">
                        +${dietary.surcharge.toFixed(2)}/srv
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedDietary && selectedDietary.surcharge > 0 && (
            <p className="text-xs text-secondary">
              +${(selectedDietary.surcharge * tierInfo.servings).toFixed(0)} for this tier
            </p>
          )}
        </div>

        {/* Sponge Selection with Dietary Filters */}
        <SpongeSelector
          config={config}
          availableSponges={availableSponges}
          selectedSponge={selectedSponge}
          tierInfo={tierInfo}
          onSpongeChange={handleSpongeChange}
        />

        {/* Filling Selection - Grouped by Category with Dietary Filters */}
        <FillingSelector
          config={config}
          availableFillings={availableFillings}
          selectedFilling={selectedFilling}
          tierInfo={tierInfo}
          onConfigChange={onConfigChange}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 pt-4 border-t border-border">
        {totalTiers > 1 && (
          <Button
            variant="outline"
            onClick={onApplyToAll}
            className="btn-architectural w-full gap-2"
          >
            <Copy className="h-3 w-3" />
            Apply to All Tiers
          </Button>
        )}
        <Button onClick={onClose} className="btn-gold w-full gap-2">
          <Check className="h-3 w-3" />
          Confirm Selection
        </Button>
      </div>
    </motion.div>
  );
}

export type TierConfig = TierConfiguration;
