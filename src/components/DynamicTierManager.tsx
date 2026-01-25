import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Users, AlertTriangle, Layers, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TierConfiguration,
  TierStructure,
  availableTierSizes,
  getServingsForTier,
  servingsPerSize,
} from "@/data/menuDatabase";

// Tier templates based on size
const tierTemplates: Record<number, { height: number }> = {
  4: { height: 40 },
  6: { height: 45 },
  8: { height: 50 },
  10: { height: 55 },
  12: { height: 55 },
  14: { height: 55 },
  16: { height: 60 },
  18: { height: 60 },
};

interface DynamicTierManagerProps {
  guestCount: number;
  onGuestCountChange: (count: number) => void;
  tiers: TierStructure[];
  tierConfigs: TierConfiguration[];
  onTiersChange: (tiers: TierStructure[], configs: TierConfiguration[]) => void;
  onTierSelect: (tierLevel: number) => void;
  selectedTier: number | null;
  totalServings: number;
}

const defaultTierConfig: TierConfiguration = {
  spongeId: "sp_vanilla",
  dietaryId: "none",
  fillingId: "fil_van_bc",
  shape: "round",
  hasSeparatorAbove: false,
};

export function DynamicTierManager({
  guestCount,
  onGuestCountChange,
  tiers,
  tierConfigs,
  onTiersChange,
  onTierSelect,
  selectedTier,
  totalServings,
}: DynamicTierManagerProps) {
  // Track if user has interacted with the configurator
  const [hasInteracted, setHasInteracted] = useState(false);
  
  const isSufficient = totalServings >= guestCount;
  const servingsDiff = totalServings - guestCount;
  
  // Show warning only after user has made changes
  const showInsufficientWarning = hasInteracted && !isSufficient;
  
  // Mark as interacted when user changes guest count or tiers
  const handleGuestCountChange = (count: number) => {
    setHasInteracted(true);
    onGuestCountChange(count);
  };

  // Get the maximum allowed size for adding a new tier (must be <= smallest existing tier)
  const getMaxSizeForNewTier = (): number => {
    if (tiers.length === 0) return 18;
    // New tier goes on top, so it must be <= the current top tier
    const currentTopTier = tiers[tiers.length - 1];
    const currentTopConfig = tierConfigs[tiers.length - 1];
    const topSize = currentTopConfig?.customSizeInches || currentTopTier.sizeInches;
    return topSize;
  };

  // Get suggested size for a new tier
  const getSuggestedNewTierSize = (): number => {
    const maxSize = getMaxSizeForNewTier();
    // Suggest a size 2" smaller than top tier, minimum 4"
    const suggestedSize = Math.max(4, maxSize - 2);
    // Round to even number
    return suggestedSize % 2 === 0 ? suggestedSize : suggestedSize - 1;
  };

  const addTier = () => {
    if (tiers.length >= 6) return; // Max 6 tiers
    setHasInteracted(true);
    
    const newSize = getSuggestedNewTierSize();
    const newTierLevel = tiers.length + 1;
    
    const newTier: TierStructure = {
      tierLevel: newTierLevel,
      sizeInches: newSize,
      servings: getServingsForTier(newSize, "round"),
      height: tierTemplates[newSize]?.height || 50,
    };
    
    const newConfig: TierConfiguration = {
      ...defaultTierConfig,
      customSizeInches: newSize,
    };
    
    onTiersChange([...tiers, newTier], [...tierConfigs, newConfig]);
  };

  const removeTier = () => {
    if (tiers.length <= 1) return; // Min 1 tier
    setHasInteracted(true);
    
    // Remove the top tier and its separator from the tier below
    const updatedTiers = tiers.slice(0, -1);
    const updatedConfigs = tierConfigs.slice(0, -1).map((config, index) => {
      // If this is now the top tier, remove its separator
      if (index === updatedTiers.length - 1) {
        return { ...config, hasSeparatorAbove: false, separatorConfig: undefined };
      }
      return config;
    });
    
    // Deselect if the removed tier was selected
    if (selectedTier === tiers.length) {
      onTierSelect(0); // Will be handled to deselect
    }
    
    onTiersChange(updatedTiers, updatedConfigs);
  };

  const changeTierSize = (tierIndex: number, newSize: number) => {
    setHasInteracted(true);
    const updatedTiers = tiers.map((tier, index) => {
      if (index === tierIndex) {
        return {
          ...tier,
          sizeInches: newSize,
          servings: getServingsForTier(newSize, tierConfigs[index]?.shape || "round"),
          height: tierTemplates[newSize]?.height || 50,
        };
      }
      return tier;
    });
    
    const updatedConfigs = tierConfigs.map((config, index) => {
      if (index === tierIndex) {
        return { ...config, customSizeInches: newSize };
      }
      return config;
    });
    
    onTiersChange(updatedTiers, updatedConfigs);
  };

  // Get available sizes for a tier (structural constraints)
  const getAvailableSizes = (tierIndex: number): number[] => {
    let minSize = 4;
    let maxSize = 18;
    
    // Must be >= tier above
    if (tierIndex < tiers.length - 1) {
      const tierAbove = tiers[tierIndex + 1];
      const tierAboveConfig = tierConfigs[tierIndex + 1];
      const aboveSize = tierAboveConfig?.customSizeInches || tierAbove.sizeInches;
      minSize = Math.max(minSize, aboveSize);
    }
    
    // Must be <= tier below
    if (tierIndex > 0) {
      const tierBelow = tiers[tierIndex - 1];
      const tierBelowConfig = tierConfigs[tierIndex - 1];
      const belowSize = tierBelowConfig?.customSizeInches || tierBelow.sizeInches;
      maxSize = Math.min(maxSize, belowSize);
    }
    
    // Top tier restricted to 4-10"
    if (tierIndex === tiers.length - 1 && tiers.length > 1) {
      maxSize = Math.min(maxSize, 10);
    }
    
    return availableTierSizes.filter(size => size >= minSize && size <= maxSize);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Guest Count */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sketch text-muted-foreground">Guest Count</span>
          </div>
          <div className="flex items-baseline gap-2">
            <motion.span
              key={guestCount}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="font-display text-4xl font-light text-foreground"
            >
              {guestCount}
            </motion.span>
            <span className="text-sm text-muted-foreground">guests</span>
          </div>
        </div>

        <div className="relative py-4">
          <Slider
            value={[guestCount]}
            onValueChange={([v]) => handleGuestCountChange(v)}
            min={20}
            max={250}
            step={5}
            aria-label="Guest count slider"
            className="[&>span:first-child]:h-[2px] [&>span:first-child]:bg-primary/20 [&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:border-2 [&_[role=slider]]:border-primary [&_[role=slider]]:bg-background [&_[role=slider]]:shadow-md"
          />
          <div className="absolute left-0 right-0 top-full mt-2 flex justify-between px-1">
            {[20, 75, 125, 175, 225, 250].map((mark) => (
              <span key={mark} className="text-[10px] text-muted-foreground">
                {mark}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Servings Status - Always show status, but warning style only after interaction */}
      <div className={`rounded-lg p-4 border transition-colors ${
        isSufficient 
          ? 'bg-secondary/10 border-secondary/30' 
          : showInsufficientWarning
            ? 'bg-destructive/10 border-destructive/30'
            : 'bg-muted/30 border-muted-foreground/20'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isSufficient ? (
              <Layers className="h-5 w-5 text-secondary" />
            ) : showInsufficientWarning ? (
              <AlertTriangle className="h-5 w-5 text-destructive" />
            ) : (
              <Layers className="h-5 w-5 text-muted-foreground" />
            )}
            <span className={`font-medium ${
              isSufficient 
                ? 'text-secondary' 
                : showInsufficientWarning 
                  ? 'text-destructive' 
                  : 'text-muted-foreground'
            }`}>
              {totalServings} servings
            </span>
          </div>
          <span className={`text-sm ${
            isSufficient 
              ? 'text-secondary' 
              : showInsufficientWarning 
                ? 'text-destructive' 
                : 'text-muted-foreground'
          }`}>
            {isSufficient 
              ? `+${servingsDiff} extra` 
              : `${Math.abs(servingsDiff)} needed`}
          </span>
        </div>
        <AnimatePresence>
          {showInsufficientWarning && (
            <motion.p 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-xs text-destructive mt-2"
            >
              Add more tiers or increase tier sizes to serve all guests
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Dynamic Tier List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sketch text-foreground flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Cake Tiers ({tiers.length})
          </h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={removeTier}
              disabled={tiers.length <= 1}
              className="h-8 w-8 p-0 border-destructive/50 text-destructive hover:bg-destructive/10"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={addTier}
              disabled={tiers.length >= 6 || getSuggestedNewTierSize() < 4}
              className="h-8 w-8 p-0 border-secondary/50 text-secondary hover:bg-secondary/10"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <AnimatePresence mode="popLayout">
          {[...tiers].reverse().map((tier, reversedIndex) => {
            const tierIndex = tiers.length - 1 - reversedIndex;
            const config = tierConfigs[tierIndex];
            const isTop = tierIndex === tiers.length - 1;
            const isBottom = tierIndex === 0;
            const effectiveSize = config?.customSizeInches || tier.sizeInches;
            const shape = config?.shape || "round";
            const servings = getServingsForTier(effectiveSize, shape);
            const isSelected = selectedTier === tier.tierLevel;
            const availableSizes = getAvailableSizes(tierIndex);
            
            const tierLabel = isTop && tiers.length > 1 
              ? "Top" 
              : isBottom 
                ? "Base" 
                : `Middle ${tierIndex}`;

            return (
              <motion.div
                key={tier.tierLevel}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                className={`rounded-lg border p-3 transition-all ${
                  isSelected 
                    ? 'border-secondary bg-secondary/10 shadow-md' 
                    : 'border-border bg-card hover:border-secondary/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Tier indicator */}
                  <button
                    onClick={() => onTierSelect(tier.tierLevel)}
                    className="flex-shrink-0 h-10 w-10 rounded-full border-2 border-secondary/50 flex items-center justify-center text-xs font-bold text-secondary hover:bg-secondary/10 transition-colors"
                  >
                    {tier.tierLevel}
                  </button>
                  
                  {/* Tier info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{tierLabel}</span>
                      <span className="text-xs text-muted-foreground">
                        {shape === "square" ? "◼" : "●"} {servings} srv
                      </span>
                    </div>
                    
                    {/* Size selector */}
                    <Select
                      value={effectiveSize.toString()}
                      onValueChange={(value) => changeTierSize(tierIndex, parseInt(value))}
                    >
                      <SelectTrigger className="h-7 mt-1 text-xs bg-background">
                        <SelectValue>
                          {effectiveSize}" ({Math.round(effectiveSize * 2.54)} cm)
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-background z-50">
                        {availableSizes.map((size) => (
                          <SelectItem key={size} value={size.toString()}>
                            <span className="flex items-center justify-between gap-4">
                              <span>{size}" ({Math.round(size * 2.54)} cm)</span>
                              <span className="text-muted-foreground text-xs">
                                {getServingsForTier(size, shape)} srv
                              </span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Customize button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onTierSelect(tier.tierLevel)}
                    className="text-xs text-muted-foreground hover:text-secondary"
                  >
                    {isSelected ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>

                {/* Separator indicator */}
                {config?.hasSeparatorAbove && !isTop && (
                  <div className="mt-2 pt-2 border-t border-border/50">
                    <span className="text-[10px] text-secondary uppercase tracking-wider">
                      + Acrylic separator above
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Add tier hint */}
        {tiers.length < 6 && getSuggestedNewTierSize() >= 4 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={addTier}
            className="w-full py-3 border-2 border-dashed border-muted-foreground/30 rounded-lg text-muted-foreground text-sm hover:border-secondary/50 hover:text-secondary transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add tier ({getSuggestedNewTierSize()}" suggested)
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
