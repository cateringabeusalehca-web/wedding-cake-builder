import { motion } from "framer-motion";
import { GoldDustParticles } from "./GoldDustParticles";

interface CakeSVGProps {
  tierCount: number;
  selectedTier: number | null;
  onTierSelect: (tier: number) => void;
}

export function CakeSVG({ tierCount, selectedTier, onTierSelect }: CakeSVGProps) {
  const tierConfigs = [
    { y: 280, width: 200, height: 60, label: "Tier 1" },
    { y: 210, width: 160, height: 55, label: "Tier 2" },
    { y: 145, width: 120, height: 50, label: "Tier 3" },
    { y: 85, width: 80, height: 45, label: "Tier 4" },
  ];

  const visibleTiers = tierConfigs.slice(0, tierCount).reverse();
  const plateY = 350;
  const centerX = 200;

  return (
    <div className="relative flex items-center justify-center">
      <svg
        viewBox="0 0 400 420"
        className="h-[400px] w-full max-w-[400px] md:h-[500px]"
        style={{ overflow: "visible" }}
      >
        {/* Blueprint grid lines */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="hsl(0 0% 10% / 0.05)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Cake plate / base */}
        <motion.ellipse
          cx={centerX}
          cy={plateY}
          rx="130"
          ry="20"
          className="sketch-line-thin"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />

        {/* Plate stand */}
        <motion.path
          d={`M ${centerX - 60} ${plateY + 15} Q ${centerX} ${plateY + 50} ${centerX + 60} ${plateY + 15}`}
          className="sketch-line-thin"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        />

        {/* Tiers */}
        {visibleTiers.map((tier, index) => {
          const actualTierNumber = tierCount - index;
          const isSelected = selectedTier === actualTierNumber;
          const hasSelection = selectedTier !== null;
          const opacity = hasSelection && !isSelected ? 0.3 : 1;

          return (
            <motion.g
              key={actualTierNumber}
              initial={{ opacity: 0, y: -20 }}
              animate={{
                opacity,
                y: 0,
                scale: isSelected ? 1.02 : 1,
              }}
              transition={{
                duration: 0.4,
                delay: index * 0.15,
                ease: "easeOut",
              }}
              onClick={() => onTierSelect(actualTierNumber)}
              className="cursor-pointer"
              style={{ transformOrigin: `${centerX}px ${tier.y + tier.height / 2}px` }}
            >
              {/* Tier body - rounded rectangle */}
              <motion.rect
                x={centerX - tier.width / 2}
                y={tier.y}
                width={tier.width}
                height={tier.height}
                rx="4"
                ry="4"
                className={isSelected ? "fill-secondary/10" : "fill-transparent"}
                stroke={isSelected ? "hsl(43 60% 52%)" : "hsl(0 0% 10%)"}
                strokeWidth={isSelected ? 2 : 1.5}
                whileHover={{ strokeWidth: 2 }}
              />

              {/* Decorative lines on tier */}
              <motion.line
                x1={centerX - tier.width / 2 + 8}
                y1={tier.y + tier.height / 2}
                x2={centerX + tier.width / 2 - 8}
                y2={tier.y + tier.height / 2}
                stroke={isSelected ? "hsl(43 60% 52%)" : "hsl(0 0% 10%)"}
                strokeWidth={0.5}
                strokeDasharray="4 4"
                opacity={0.5}
              />

              {/* Top ellipse for 3D effect */}
              <motion.ellipse
                cx={centerX}
                cy={tier.y}
                rx={tier.width / 2}
                ry="8"
                className={isSelected ? "fill-secondary/5" : "fill-transparent"}
                stroke={isSelected ? "hsl(43 60% 52%)" : "hsl(0 0% 10%)"}
                strokeWidth={isSelected ? 2 : 1.5}
              />

              {/* Tier label */}
              <text
                x={centerX}
                y={tier.y + tier.height / 2 + 5}
                textAnchor="middle"
                className="fill-muted-foreground font-ui text-[10px] uppercase tracking-widest"
                opacity={isSelected ? 1 : 0.6}
              >
                {tier.label}
              </text>

              {/* Gold particles effect */}
              {isSelected && (
                <foreignObject
                  x={centerX - tier.width / 2 - 50}
                  y={tier.y - 50}
                  width={tier.width + 100}
                  height={tier.height + 100}
                >
                  <GoldDustParticles
                    isActive={isSelected}
                    originX={50}
                    originY={50}
                    count={15}
                  />
                </foreignObject>
              )}
            </motion.g>
          );
        })}

        {/* Cake topper suggestion */}
        {tierCount >= 3 && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 0.8 }}
          >
            <line
              x1={centerX}
              y1={visibleTiers[visibleTiers.length - 1]?.y - 10 || 75}
              x2={centerX}
              y2={visibleTiers[visibleTiers.length - 1]?.y - 35 || 50}
              stroke="hsl(0 0% 10%)"
              strokeWidth="0.75"
              strokeDasharray="3 3"
            />
            <circle
              cx={centerX}
              cy={visibleTiers[visibleTiers.length - 1]?.y - 45 || 40}
              r="10"
              fill="none"
              stroke="hsl(0 0% 10%)"
              strokeWidth="0.75"
              strokeDasharray="2 2"
            />
          </motion.g>
        )}

        {/* Dimension lines */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 1.2 }}
        >
          <line
            x1="50"
            y1={plateY}
            x2="50"
            y2={visibleTiers[visibleTiers.length - 1]?.y || plateY - 50}
            stroke="hsl(0 0% 10%)"
            strokeWidth="0.5"
            markerEnd="url(#arrow)"
            markerStart="url(#arrow)"
          />
          <text
            x="35"
            y={(plateY + (visibleTiers[visibleTiers.length - 1]?.y || plateY - 50)) / 2}
            className="fill-muted-foreground font-ui text-[8px] uppercase"
            textAnchor="middle"
            transform={`rotate(-90, 35, ${(plateY + (visibleTiers[visibleTiers.length - 1]?.y || plateY - 50)) / 2})`}
          >
            {tierCount} {tierCount === 1 ? "tier" : "tiers"}
          </text>
        </motion.g>
      </svg>
    </div>
  );
}
