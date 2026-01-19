import { motion } from "framer-motion";
import { Users } from "lucide-react";

interface StickyPriceBarProps {
  guestCount: number;
  eventName: string;
  totalServings: number;
  totalPrice: number;
  isVisible: boolean;
}

export function StickyPriceBar({
  guestCount,
  eventName,
  totalServings,
  totalPrice,
  isVisible,
}: StickyPriceBarProps) {
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ 
        y: isVisible ? 0 : -100, 
        opacity: isVisible ? 1 : 0 
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-secondary/30 bg-background/95 backdrop-blur-md shadow-lg"
    >
      <div className="container px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Guest Count */}
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-secondary" />
            <span className="text-sm font-medium text-foreground">
              {guestCount}
            </span>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              guests
            </span>
          </div>

          {/* Event Name */}
          <div className="flex-1 text-center">
            <motion.span
              key={eventName}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sketch text-secondary text-sm md:text-base"
            >
              {eventName}
            </motion.span>
            <span className="text-xs text-muted-foreground ml-2 hidden md:inline">
              • {totalServings} servings
            </span>
          </div>

          {/* Price */}
          <div className="text-right">
            <span className="text-xs text-muted-foreground hidden sm:block">
              Estimated
            </span>
            <motion.span
              key={totalPrice}
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="font-display text-xl md:text-2xl font-semibold text-secondary"
            >
              ${totalPrice.toFixed(0)}
            </motion.span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
