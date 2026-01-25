import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";
import { Users, RotateCcw, AlertTriangle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cakeStructures, CakeStructure, getRecommendedStructure } from "@/data/menuDatabase";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useRef } from "react";

interface GuestSliderProps {
  value: number;
  onChange: (value: number) => void;
  tierCount: number;
  selectedStructure: CakeStructure;
  onStructureChange: (structureId: string) => void;
  isManualSelection: boolean;
  onResetToRecommended?: () => void;
}

export function GuestSlider({ 
  value, 
  onChange, 
  tierCount, 
  selectedStructure,
  onStructureChange,
  isManualSelection,
  onResetToRecommended
}: GuestSliderProps) {
  const recommended = getRecommendedStructure(value);
  const { toast } = useToast();
  const prevStructureRef = useRef(selectedStructure.id);
  
  const isTooSmall = selectedStructure.totalServings < value;
  const servingsShort = value - selectedStructure.totalServings;

  // Show toast when selecting a structure that's too small
  useEffect(() => {
    if (prevStructureRef.current !== selectedStructure.id && isTooSmall) {
      toast({
        variant: "destructive",
        title: "⚠️ Structure too small",
        description: `This cake provides ${selectedStructure.totalServings} servings but you need ${value}. You're ${servingsShort} servings short.`,
      });
    }
    prevStructureRef.current = selectedStructure.id;
  }, [selectedStructure.id, isTooSmall, toast, value, servingsShort, selectedStructure.totalServings]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="w-full space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sketch text-muted-foreground">Guest Count</span>
        </div>
        <div className="flex items-baseline gap-2">
          <motion.span
            key={value}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="font-display text-4xl font-light text-foreground"
          >
            {value}
          </motion.span>
          <span className="text-sm text-muted-foreground">guests</span>
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
        <div className="flex items-center justify-center gap-2">
          <div className="h-px flex-1 bg-border" />
          <span className="text-sketch text-foreground text-sm">
            Cake Structure
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <Select
          value={selectedStructure.id}
          onValueChange={onStructureChange}
        >
          <SelectTrigger className="w-full bg-background border-border text-foreground">
            <SelectValue>
              <div className="flex items-center justify-between w-full pr-2">
                <span className="font-medium">{selectedStructure.name}</span>
                <span className="text-xs text-muted-foreground ml-2">
                  {selectedStructure.tierCount} tiers • {selectedStructure.totalServings} servings
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

        {/* Alert when structure is too small */}
        <AnimatePresence>
          {isTooSmall && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                <p className="text-xs text-destructive">
                  <span className="font-medium">Not enough servings!</span> You need {value} but this cake only provides {selectedStructure.totalServings} ({servingsShort} short).
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isManualSelection && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-2"
          >
            {!isTooSmall && (
              <p className="text-xs text-center text-muted-foreground">
                Manual selection • <span className="text-secondary">
                  {selectedStructure.totalServings - value} extra servings
                </span>
              </p>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetToRecommended}
              className="h-7 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-3 w-3" />
              Use recommended: {recommended.name}
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
