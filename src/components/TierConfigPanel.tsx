import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  dietaryCategories,
  flavorDetails,
  fillingDetails,
  DietaryCategory,
} from "@/data/menuDatabase";

export interface TierConfig {
  dietaryId: string;
  flavorId: string;
  fillingId: string;
}

interface TierConfigPanelProps {
  tierNumber: number;
  config: TierConfig;
  onConfigChange: (config: TierConfig) => void;
  onApplyToAll: () => void;
  onClose: () => void;
  totalTiers: number;
}

export function TierConfigPanel({
  tierNumber,
  config,
  onConfigChange,
  onApplyToAll,
  onClose,
  totalTiers,
}: TierConfigPanelProps) {
  const selectedCategory = dietaryCategories.find(
    (cat) => cat.id === config.dietaryId
  );

  const availableFlavors = selectedCategory?.allowedFlavors || [];
  const availableFillings = selectedCategory?.allowedFillings || [];

  const handleDietaryChange = (dietaryId: string) => {
    const newCategory = dietaryCategories.find((cat) => cat.id === dietaryId);
    onConfigChange({
      dietaryId,
      flavorId: newCategory?.allowedFlavors[0] || "",
      fillingId: newCategory?.allowedFillings[0] || "",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="card-architectural space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="h-4 w-4 text-secondary" />
          <h3 className="heading-editorial text-xl">Tier {tierNumber}</h3>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          ✕
        </button>
      </div>

      <div className="space-y-5">
        {/* Dietary Category */}
        <div className="space-y-2">
          <label className="text-sketch text-muted-foreground">
            Dietary Style
          </label>
          <Select value={config.dietaryId} onValueChange={handleDietaryChange}>
            <SelectTrigger className="input-sketch border-0 border-b">
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              {dietaryCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  <div>
                    <span className="font-medium">{cat.label}</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {cat.description}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Flavor */}
        <AnimatePresence mode="wait">
          {selectedCategory && (
            <motion.div
              key={`flavor-${config.dietaryId}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <label className="text-sketch text-muted-foreground">
                Sponge Flavor
              </label>
              <Select
                value={config.flavorId}
                onValueChange={(flavorId) =>
                  onConfigChange({ ...config, flavorId })
                }
              >
                <SelectTrigger className="input-sketch border-0 border-b">
                  <SelectValue placeholder="Select flavor" />
                </SelectTrigger>
                <SelectContent>
                  {availableFlavors.map((flavorId) => {
                    const flavor = flavorDetails[flavorId];
                    return (
                      <SelectItem key={flavorId} value={flavorId}>
                        <div>
                          <span className="font-medium">{flavor?.name}</span>
                          <span className="ml-2 text-xs text-muted-foreground">
                            {flavor?.description}
                          </span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filling */}
        <AnimatePresence mode="wait">
          {selectedCategory && (
            <motion.div
              key={`filling-${config.dietaryId}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <label className="text-sketch text-muted-foreground">
                Filling
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
                  {availableFillings.map((fillingId) => {
                    const filling = fillingDetails[fillingId];
                    return (
                      <SelectItem key={fillingId} value={fillingId}>
                        <div>
                          <span className="font-medium">{filling?.name}</span>
                          <span className="ml-2 text-xs text-muted-foreground">
                            {filling?.description}
                          </span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 pt-4">
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
