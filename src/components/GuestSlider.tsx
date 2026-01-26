import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";
import { Users, AlertTriangle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cakeStructures, CakeStructure, getRecommendedStructure } from "@/data/menuDatabase";

interface GuestSliderProps {
  value: number;
  onChange: (value: number) => void;
  tierCount: number;
  selectedStructure: CakeStructure;
  onStructureChange: (structureId: string) => void;
  isManualSelection: boolean;
  onResetToRecommended?: () => void;
  actualTotalServings?: number; // Dynamic servings based on shapes
  hasUserInteracted?: boolean; // Track if user has interacted with the configurator
}

export function GuestSlider({ 
  value, 
  onChange, 
  tierCount, 
  selectedStructure,
  onStructureChange,
  isManualSelection,
  onResetToRecommended,
  actualTotalServings,
  hasUserInteracted = false
}: GuestSliderProps) {
  const recommended = getRecommendedStructure(value);
  
  // Use actual servings if provided, otherwise use structure default
  const effectiveServings = actualTotalServings ?? selectedStructure.totalServings;
  
  const isTooSmall = effectiveServings < value;
  const servingsShort = value - effectiveServings;
  
  // Only show the error after user has interacted with the configurator
  const showServingsError = isTooSmall && hasUserInteracted;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="w-full space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-muted-foreground">Guests</span>
        </div>
        <div className="flex items-baseline gap-1 justify-end">
          <motion.span
            key={value}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="font-display text-3xl sm:text-4xl font-light text-foreground"
          >
            {value}
          </motion.span>
          <span className="text-xs text-muted-foreground">ppl</span>
        </div>
      </div>

      <div className="relative py-4">
        <Slider
          value={[value]}
          onValueChange={([v]) => onChange(v)}
          min={20}
          max={250}
          step={5}
          aria-label="Guest count slider"
          className="[&>span:first-child]:h-[2px] [&>span:first-child]:bg-primary/20 [&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:border-2 [&_[role=slider]]:border-primary [&_[role=slider]]:bg-background [&_[role=slider]]:shadow-md [&_[role=slider]]:transition-all [&_[role=slider]]:hover:scale-110 [&_[role=slider]]:focus-visible:ring-2 [&_[role=slider]]:focus-visible:ring-secondary [&>span:first-child>span]:bg-secondary"
        />
        
        {/* Scale markers */}
        <div className="absolute left-0 right-0 top-full mt-2 flex justify-between px-1">
          {[20, 75, 125, 175, 225, 250].map((mark) => (
            <span
              key={mark}
              className="text-[10px] text-muted-foreground"
            >
              {mark}
            </span>
          ))}
        </div>
      </div>

      {/* Structure selector */}
      <div className="pt-4 space-y-3">
        <div className="flex items-center justify-center gap-1 sm:gap-2">
          <div className="h-px flex-1 bg-border" />
          <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-foreground whitespace-nowrap">
            Structure
          </span>
          {onResetToRecommended && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetToRecommended}
              className="h-6 px-2.5 text-[10px] font-medium rounded-full bg-secondary/15 text-secondary hover:bg-secondary/25 hover:text-secondary"
            >
              Reset
            </Button>
          )}
          <div className="h-px flex-1 bg-border" />
        </div>

        <Select
          value={selectedStructure.id}
          onValueChange={onStructureChange}
        >
          <SelectTrigger className="w-full bg-background border-border text-foreground overflow-hidden">
            <SelectValue>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full pr-1 overflow-hidden">
                <span className="font-medium text-sm truncate max-w-[120px] sm:max-w-none">{selectedStructure.name}</span>
                <span className="text-[10px] sm:text-xs text-muted-foreground sm:ml-2 truncate">
                  {selectedStructure.tierCount}T • {effectiveServings} srv
                </span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-background border-border z-50">
            {cakeStructures.map((structure) => {
              const isRecommended = structure.totalServings >= value && 
                (cakeStructures.findIndex(s => s.totalServings >= value) === cakeStructures.indexOf(structure));
              const isTooSmall = structure.totalServings < value;
              
              return (
                <SelectItem 
                  key={structure.id} 
                  value={structure.id}
                  className={`cursor-pointer ${isTooSmall ? 'opacity-60' : ''}`}
                >
                  <div className="flex flex-col py-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{structure.name}</span>
                      {isRecommended && (
                        <span className="text-[10px] bg-secondary/20 text-secondary px-1.5 py-0.5 rounded-full">
                          Recommended
                        </span>
                      )}
                      {isTooSmall && (
                        <span className="text-[10px] bg-destructive/20 text-destructive px-1.5 py-0.5 rounded-full">
                          Too small
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {structure.tierCount} tiers • {structure.totalServings} servings
                      {!isTooSmall && ` (+${structure.totalServings - value} extra)`}
                    </span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        {/* Alert when structure is too small - only show after user interaction */}
        <AnimatePresence>
          {showServingsError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                <p className="text-xs text-destructive">
                  <span className="font-medium">Not enough servings!</span> You need {value} but this cake only provides {effectiveServings} ({servingsShort} short).
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isManualSelection && !isTooSmall && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-center text-muted-foreground"
          >
            Manual selection • <span className="text-secondary">
              {effectiveServings - value} extra servings
            </span>
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
