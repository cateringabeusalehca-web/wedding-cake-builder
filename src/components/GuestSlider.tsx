import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import { Users } from "lucide-react";

interface GuestSliderProps {
  value: number;
  onChange: (value: number) => void;
  tierCount: number;
}

export function GuestSlider({ value, onChange, tierCount }: GuestSliderProps) {
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
          max={150}
          step={5}
          className="[&>span:first-child]:h-[2px] [&>span:first-child]:bg-primary/20 [&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:border-2 [&_[role=slider]]:border-primary [&_[role=slider]]:bg-background [&_[role=slider]]:shadow-md [&_[role=slider]]:transition-all [&_[role=slider]]:hover:scale-110 [&_[role=slider]]:focus-visible:ring-2 [&_[role=slider]]:focus-visible:ring-secondary [&>span:first-child>span]:bg-secondary"
        />
        
        {/* Scale markers */}
        <div className="absolute left-0 right-0 top-full mt-2 flex justify-between px-1">
          {[20, 50, 75, 100, 125, 150].map((mark) => (
            <span
              key={mark}
              className="text-[10px] text-muted-foreground/60"
            >
              {mark}
            </span>
          ))}
        </div>
      </div>

      <motion.div
        key={tierCount}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-center gap-2 pt-4"
      >
        <div className="h-px flex-1 bg-border" />
        <span className="text-sketch text-secondary">
          {tierCount} {tierCount === 1 ? "Tier" : "Tiers"} Recommended
        </span>
        <div className="h-px flex-1 bg-border" />
      </motion.div>
    </motion.div>
  );
}
