import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles, Copy, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  spongeOptions,
  dietaryUpgrades,
  fillingOptions,
  TierConfiguration,
  calculateTierPrice,
  getTierLabel,
  TierStructure,
} from "@/data/menuDatabase";

interface TierConfigPanelProps {
  tierNumber: number;
  tierInfo: TierStructure;
  config: TierConfiguration;
  onConfigChange: (config: TierConfiguration) => void;
  onApplyToAll: () => void;
  onClose: () => void;
  totalTiers: number;
}

export function TierConfigPanel({
  tierNumber,
  tierInfo,
  config,
  onConfigChange,
  onApplyToAll,
  onClose,
  totalTiers,
}: TierConfigPanelProps) {
  const tierLabel = getTierLabel(tierNumber, totalTiers);
  const pricing = calculateTierPrice(
    tierInfo.servings,
    config.spongeId,
    config.dietaryId,
    config.fillingId
  );

  const selectedSponge = spongeOptions.find((s) => s.id === config.spongeId);
  const selectedDietary = dietaryUpgrades.find((d) => d.id === config.dietaryId);
  const selectedFilling = fillingOptions.find((f) => f.id === config.fillingId);

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
          <Sparkles className="h-4 w-4 text-secondary" />
          <div>
            <h3 className="heading-editorial text-xl">{tierLabel}</h3>
            <p className="text-xs text-muted-foreground">
              {tierInfo.sizeInches}" • {tierInfo.servings} servings
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

      {/* Price breakdown */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-secondary" />
          <span className="text-sketch text-muted-foreground">Tier Price</span>
        </div>
        <motion.span
          key={pricing.total}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="font-display text-2xl text-secondary"
        >
          ${pricing.total.toFixed(0)}
        </motion.span>
      </div>

      <div className="space-y-5">
        {/* Sponge Selection */}
        <div className="space-y-2">
          <label className="text-sketch text-muted-foreground">
            Choose Sponge
          </label>
          <Select
            value={config.spongeId}
            onValueChange={(spongeId) =>
              onConfigChange({ ...config, spongeId })
            }
          >
            <SelectTrigger className="input-sketch border-0 border-b">
              <SelectValue placeholder="Select sponge" />
            </SelectTrigger>
            <SelectContent>
              {spongeOptions.map((sponge) => (
                <SelectItem key={sponge.id} value={sponge.id}>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <span className="font-medium">{sponge.name}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {sponge.description}
                      </span>
                    </div>
                    {sponge.pricePerServing > 0 && (
                      <span className="text-xs text-secondary font-medium">
                        +${sponge.pricePerServing.toFixed(2)}/srv
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedSponge && selectedSponge.pricePerServing > 0 && (
            <p className="text-xs text-secondary">
              +${(selectedSponge.pricePerServing * tierInfo.servings).toFixed(0)} for this tier
            </p>
          )}
        </div>

        {/* Dietary Upgrade */}
        <div className="space-y-2">
          <label className="text-sketch text-muted-foreground">
            Dietary Upgrade (Optional)
          </label>
          <Select
            value={config.dietaryId}
            onValueChange={(dietaryId) =>
              onConfigChange({ ...config, dietaryId })
            }
          >
            <SelectTrigger className="input-sketch border-0 border-b">
              <SelectValue placeholder="Select dietary option" />
            </SelectTrigger>
            <SelectContent>
              {dietaryUpgrades.map((dietary) => (
                <SelectItem key={dietary.id} value={dietary.id}>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <span className="font-medium">{dietary.label}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {dietary.description}
                      </span>
                    </div>
                    {dietary.pricePerServing > 0 && (
                      <span className="text-xs text-secondary font-medium">
                        +${dietary.pricePerServing.toFixed(2)}/srv
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedDietary && selectedDietary.pricePerServing > 0 && (
            <p className="text-xs text-secondary">
              +${(selectedDietary.pricePerServing * tierInfo.servings).toFixed(0)} for this tier
            </p>
          )}
        </div>

        {/* Filling Selection */}
        <div className="space-y-2">
          <label className="text-sketch text-muted-foreground">
            Choose Filling
          </label>
          <Select
            value={config.fillingId}
            onValueChange={(fillingId) =>
              onConfigChange({ ...config, fillingId })
            }
          >
            <SelectTrigger className="input-sketch border-0 border-b">
              <SelectValue placeholder="Select filling" />
            </SelectTrigger>
            <SelectContent>
              {fillingOptions.map((filling) => (
                <SelectItem key={filling.id} value={filling.id}>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <span className="font-medium">{filling.name}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {filling.description}
                      </span>
                    </div>
                    {filling.pricePerServing > 0 && (
                      <span className="text-xs text-secondary font-medium">
                        +${filling.pricePerServing.toFixed(2)}/srv
                      </span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedFilling && selectedFilling.pricePerServing > 0 && (
            <p className="text-xs text-secondary">
              +${(selectedFilling.pricePerServing * tierInfo.servings).toFixed(0)} for this tier
            </p>
          )}
        </div>
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

// Export for compatibility
export type TierConfig = TierConfiguration;
