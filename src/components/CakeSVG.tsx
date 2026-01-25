import { motion } from "framer-motion";
import { GoldDustParticles } from "./GoldDustParticles";
import { CakeDecorationOverlays } from "./CakeDecorationOverlays";
import { 
  CakeStructure, 
  calculateTierPrice, 
  getTierLabel, 
  TierConfiguration,
  getServingsForTier,
  calculateCakeWeight,
  formatWeight,
  calculateTotalServings
} from "@/data/menuDatabase";

interface CakeSVGProps {
  structure: CakeStructure;
  selectedTier: number | null;
  onTierSelect: (tier: number) => void;
  tierConfigs: TierConfiguration[];
  selectedDecorations?: string[];
}

export function CakeSVG({ structure, selectedTier, onTierSelect, tierConfigs, selectedDecorations = [] }: CakeSVGProps) {
  const centerX = 200;
  const baseY = 320;
  const standHeight = 35;
  const plateY = baseY;

  // Calculate actual total servings based on shapes
  const actualTotalServings = calculateTotalServings(structure, tierConfigs);
  const totalWeight = calculateCakeWeight(actualTotalServings);

  // Calculate tier visual properties dynamically
  const tierVisuals = structure.tiers.map((tier, index) => {
    const config = tierConfigs[index];
    const shape = config?.shape || "round";
    // Width based on size (inches * scale factor)
    const width = tier.sizeInches * 16;
    const height = tier.height;
    const hasSeparatorAbove = config?.hasSeparatorAbove || false;
    
    // Calculate Y position (stacked from bottom, add space for separators)
    let y = plateY;
    for (let i = 0; i < index; i++) {
      y -= structure.tiers[i].height;
      // Add separator gap if the tier below has a separator above
      if (tierConfigs[i]?.hasSeparatorAbove) {
        y -= 15; // Separator visual gap
      }
    }
    y -= height;
    
    return {
      ...tier,
      width,
      visualHeight: height,
      y,
      shape,
      hasSeparatorAbove,
      actualServings: getServingsForTier(tier.sizeInches, shape),
    };
  });

  // Reverse for rendering (bottom first)
  const visibleTiers = [...tierVisuals].reverse();

  return (
    <div className="relative flex items-center justify-center">
      <svg
        viewBox="0 0 400 420"
        className="h-[480px] w-full max-w-[480px] md:h-[580px] md:max-w-[520px]"
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

        {/* Elegant Cake Stand - Classic pedestal design */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Top plate with decorative edge */}
          <ellipse
            cx={centerX}
            cy={plateY + 3}
            rx={125}
            ry={8}
            className="fill-muted/20"
            stroke="hsl(0 0% 10%)"
            strokeWidth="1"
          />
          
          {/* Plate rim detail */}
          <ellipse
            cx={centerX}
            cy={plateY + 3}
            rx={115}
            ry={6}
            fill="none"
            stroke="hsl(0 0% 10% / 0.3)"
            strokeWidth="0.5"
          />
          
          {/* Elegant curved stem */}
          <path
            d={`M ${centerX - 40} ${plateY + 10}
                Q ${centerX - 50} ${plateY + 18} ${centerX - 35} ${plateY + 25}
                Q ${centerX - 20} ${plateY + 32} ${centerX - 25} ${plateY + 45}
                L ${centerX + 25} ${plateY + 45}
                Q ${centerX + 20} ${plateY + 32} ${centerX + 35} ${plateY + 25}
                Q ${centerX + 50} ${plateY + 18} ${centerX + 40} ${plateY + 10}
                Z`}
            className="fill-muted/15"
            stroke="hsl(0 0% 10%)"
            strokeWidth="1"
          />
          
          {/* Decorative middle ring */}
          <ellipse
            cx={centerX}
            cy={plateY + 28}
            rx={30}
            ry={4}
            className="fill-muted/25"
            stroke="hsl(0 0% 10%)"
            strokeWidth="0.8"
          />
          
          {/* Base foot with elegant curve */}
          <ellipse
            cx={centerX}
            cy={plateY + standHeight + 5}
            rx={55}
            ry={7}
            className="fill-muted/25"
            stroke="hsl(0 0% 10%)"
            strokeWidth="1"
          />
          
          {/* Base foot top detail */}
          <ellipse
            cx={centerX}
            cy={plateY + standHeight}
            rx={50}
            ry={5}
            className="fill-muted/15"
            stroke="hsl(0 0% 10%)"
            strokeWidth="0.8"
          />
        </motion.g>

        {/* Tiers */}
        {visibleTiers.map((tier, index) => {
          const tierIndex = structure.tiers.length - 1 - index;
          const actualTierNumber = tier.tierLevel;
          const isSelected = selectedTier === actualTierNumber;
          const hasSelection = selectedTier !== null;
          const opacity = hasSelection && !isSelected ? 0.3 : 1;

          // Calculate tier price for display
          const config = tierConfigs[tierIndex];
          const tierPrice = config
            ? calculateTierPrice(tier.servings, config.spongeId, config.dietaryId, config.fillingId)
            : null;

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
                delay: index * 0.1,
                ease: "easeOut",
              }}
              onClick={() => onTierSelect(actualTierNumber)}
              className="cursor-pointer"
              style={{ transformOrigin: `${centerX}px ${tier.y + tier.visualHeight / 2}px` }}
            >
              {/* Tier body - rounded rectangle with curved top edge */}
              <motion.path
                d={`M ${centerX - tier.width / 2 + 3} ${tier.y}
                    Q ${centerX - tier.width / 2} ${tier.y} ${centerX - tier.width / 2} ${tier.y + 3}
                    L ${centerX - tier.width / 2} ${tier.y + tier.visualHeight - 3}
                    Q ${centerX - tier.width / 2} ${tier.y + tier.visualHeight} ${centerX - tier.width / 2 + 3} ${tier.y + tier.visualHeight}
                    L ${centerX + tier.width / 2 - 3} ${tier.y + tier.visualHeight}
                    Q ${centerX + tier.width / 2} ${tier.y + tier.visualHeight} ${centerX + tier.width / 2} ${tier.y + tier.visualHeight - 3}
                    L ${centerX + tier.width / 2} ${tier.y + 3}
                    Q ${centerX + tier.width / 2} ${tier.y} ${centerX + tier.width / 2 - 3} ${tier.y}
                    Q ${centerX} ${tier.y - 8} ${centerX - tier.width / 2 + 3} ${tier.y}
                    Z`}
                className={isSelected ? "fill-secondary/15" : "fill-background"}
                stroke={isSelected ? "hsl(43 60% 52%)" : "hsl(0 0% 10%)"}
                strokeWidth={isSelected ? 2 : 1.5}
                whileHover={{ strokeWidth: 2 }}
              />

              {/* LEFT: Size in inches */}
              <g>
                <line
                  x1={centerX - tier.width / 2 - 25}
                  y1={tier.y}
                  x2={centerX - tier.width / 2 - 25}
                  y2={tier.y + tier.visualHeight}
                  stroke="hsl(0 0% 10%)"
                  strokeWidth="0.5"
                  opacity={isSelected ? 0.8 : 0.4}
                />
                <line
                  x1={centerX - tier.width / 2 - 30}
                  y1={tier.y}
                  x2={centerX - tier.width / 2 - 20}
                  y2={tier.y}
                  stroke="hsl(0 0% 10%)"
                  strokeWidth="0.5"
                  opacity={isSelected ? 0.8 : 0.4}
                />
                <line
                  x1={centerX - tier.width / 2 - 30}
                  y1={tier.y + tier.visualHeight}
                  x2={centerX - tier.width / 2 - 20}
                  y2={tier.y + tier.visualHeight}
                  stroke="hsl(0 0% 10%)"
                  strokeWidth="0.5"
                  opacity={isSelected ? 0.8 : 0.4}
                />
                <text
                  x={centerX - tier.width / 2 - 40}
                  y={tier.y + tier.visualHeight / 2 + 4}
                  textAnchor="middle"
                  className="fill-muted-foreground font-ui text-[11px] font-medium"
                  opacity={isSelected ? 1 : 0.8}
                >
                  {tier.sizeInches}"
                </text>
              </g>

              {/* RIGHT: Servings count */}
              <g>
                <line
                  x1={centerX + tier.width / 2 + 25}
                  y1={tier.y}
                  x2={centerX + tier.width / 2 + 25}
                  y2={tier.y + tier.visualHeight}
                  stroke="hsl(0 0% 10%)"
                  strokeWidth="0.5"
                  opacity={isSelected ? 0.8 : 0.4}
                />
                <line
                  x1={centerX + tier.width / 2 + 20}
                  y1={tier.y}
                  x2={centerX + tier.width / 2 + 30}
                  y2={tier.y}
                  stroke="hsl(0 0% 10%)"
                  strokeWidth="0.5"
                  opacity={isSelected ? 0.8 : 0.4}
                />
                <line
                  x1={centerX + tier.width / 2 + 20}
                  y1={tier.y + tier.visualHeight}
                  x2={centerX + tier.width / 2 + 30}
                  y2={tier.y + tier.visualHeight}
                  stroke="hsl(0 0% 10%)"
                  strokeWidth="0.5"
                  opacity={isSelected ? 0.8 : 0.4}
                />
                <text
                  x={centerX + tier.width / 2 + 50}
                  y={tier.y + tier.visualHeight / 2 + 4}
                  textAnchor="middle"
                  className="fill-muted-foreground font-ui text-[10px]"
                  opacity={isSelected ? 1 : 0.8}
                >
                  {tier.actualServings} srv
                </text>
              </g>

              {/* Shape indicator */}
              {tier.shape === "square" && (
                <rect
                  x={centerX - 6}
                  y={tier.y + tier.visualHeight - 14}
                  width={12}
                  height={8}
                  fill="none"
                  stroke="hsl(43 60% 52% / 0.6)"
                  strokeWidth={1}
                  rx={1}
                />
              )}

              {/* Separator visual above tier */}
              {tier.hasSeparatorAbove && (
                <g>
                  {/* Acrylic separator pillars */}
                  <rect
                    x={centerX - tier.width / 4 - 3}
                    y={tier.y - 14}
                    width={6}
                    height={14}
                    fill="hsl(200 30% 85% / 0.3)"
                    stroke="hsl(200 30% 70% / 0.5)"
                    strokeWidth={0.5}
                    rx={1}
                  />
                  <rect
                    x={centerX + tier.width / 4 - 3}
                    y={tier.y - 14}
                    width={6}
                    height={14}
                    fill="hsl(200 30% 85% / 0.3)"
                    stroke="hsl(200 30% 70% / 0.5)"
                    strokeWidth={0.5}
                    rx={1}
                  />
                  {/* Separator plate */}
                  <ellipse
                    cx={centerX}
                    cy={tier.y - 12}
                    rx={tier.width / 2 + 5}
                    ry={3}
                    fill="hsl(200 30% 90% / 0.2)"
                    stroke="hsl(200 30% 70% / 0.4)"
                    strokeWidth={0.5}
                  />
                </g>
              )}

              {/* Tier label (centered) */}
              <text
                x={centerX}
                y={tier.y + tier.visualHeight / 2 + 4}
                textAnchor="middle"
                className="fill-foreground font-ui text-[10px] uppercase tracking-widest pointer-events-none"
                opacity={isSelected ? 1 : 0.7}
              >
                {getTierLabel(actualTierNumber, structure.tierCount)}
              </text>

              {/* Price badge on selection */}
              {isSelected && tierPrice && (
                <motion.g
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <rect
                    x={centerX - 40}
                    y={tier.y - 28}
                    width={80}
                    height={22}
                    rx="4"
                    fill="hsl(43 60% 52%)"
                  />
                  <text
                    x={centerX}
                    y={tier.y - 13}
                    textAnchor="middle"
                    className="fill-foreground font-ui text-[11px] font-semibold"
                  >
                    ${tierPrice.total.toFixed(0)}
                  </text>
                </motion.g>
              )}

              {/* Gold particles effect */}
              {isSelected && (
                <foreignObject
                  x={centerX - tier.width / 2 - 50}
                  y={tier.y - 50}
                  width={tier.width + 100}
                  height={tier.visualHeight + 100}
                >
                  <GoldDustParticles
                    isActive={isSelected}
                    originX={50}
                    originY={50}
                    count={12}
                  />
                </foreignObject>
              )}
            </motion.g>
          );
        })}

        {/* Decoration Overlays */}
        {selectedDecorations.length > 0 && (
          <CakeDecorationOverlays
            selectedDecorations={selectedDecorations}
            centerX={centerX}
            topTierY={tierVisuals[tierVisuals.length - 1]?.y ?? plateY - 60}
            bottomTierY={plateY}
            topTierWidth={tierVisuals[tierVisuals.length - 1]?.width ?? 96}
            bottomTierWidth={tierVisuals[0]?.width ?? 192}
            tierCount={structure.tierCount}
          />
        )}

        {/* Total servings label */}
        <motion.text
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.8 }}
          x={centerX}
          y={plateY + standHeight + 25}
          textAnchor="middle"
          className="fill-muted-foreground font-ui text-[11px] uppercase tracking-wider"
        >
          {actualTotalServings} Total Servings
        </motion.text>
        
        {/* Weight label */}
        <motion.text
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.9 }}
          x={centerX}
          y={plateY + standHeight + 40}
          textAnchor="middle"
          className="fill-muted-foreground font-ui text-[10px] tracking-wider"
        >
          ≈ {formatWeight(totalWeight)}
        </motion.text>
      </svg>
    </div>
  );
}
