import { motion } from "framer-motion";
import { GoldDustParticles } from "./GoldDustParticles";
import { CakeDecorationOverlays } from "./CakeDecorationOverlays";
import { CakeStructure, calculateTierPrice, getTierLabel, TierConfiguration, getServingsForTier, PORTION_SIZE_DESCRIPTION, PORTION_WEIGHT_GRAMS, inchesToCm, RECTANGULAR_WIDTH_CM } from "@/data/menuDatabase";

interface CakeSVGProps {
  structure: CakeStructure;
  selectedTier: number | null;
  onTierSelect: (tier: number) => void;
  tierConfigs: TierConfiguration[];
  selectedDecorations?: string[];
  totalServings: number;
}

export function CakeSVG({ structure, selectedTier, onTierSelect, tierConfigs, selectedDecorations = [], totalServings }: CakeSVGProps) {
  const centerX = 200;
  const baseY = 320;
  const standHeight = 35;
  const plateY = baseY;

  // Convert separator height from cm to pixels (scale factor)
  const cmToPixels = (cm: number) => cm * 4.5; // 5cm = 22.5px, 10cm = 45px

  // Calculate tier visual properties dynamically with separators and custom sizes
  const tierVisuals = structure.tiers.map((tier, index) => {
    const config = tierConfigs[index];
    // Use custom size if set, otherwise use default
    const effectiveSize = config?.customSizeInches || tier.sizeInches;
    const shape = config?.shape || "round";
    const isRectangular = shape === "rectangular";
    
    // Width calculation: rectangular cakes use proportional width, others use size in inches
    const rectangularWidthCm = config?.rectangularWidthCm || 40;
    const rectangularLengthCm = config?.rectangularLengthCm || 50;
    // For rectangular: scale based on width (40cm = 160px, 80cm = 220px)
    const width = isRectangular ? (rectangularWidthCm === 80 ? 220 : 160) : effectiveSize * 16;
    
    const height = tier.height;
    const hasSeparatorAbove = config?.hasSeparatorAbove || false;
    const separatorConfig = config?.separatorConfig;
    const actualServings = getServingsForTier(effectiveSize, shape, config?.rectangularLengthCm, config?.rectangularWidthCm);
    
    // Calculate separator visual height in pixels
    const separatorHeightPx = separatorConfig ? cmToPixels(separatorConfig.heightCm) : 0;
    
    // Calculate Y position (stacked from bottom, accounting for separators)
    let y = plateY;
    for (let i = 0; i < index; i++) {
      y -= structure.tiers[i].height;
      // Add separator space if the tier below has a separator above
      const prevConfig = tierConfigs[i];
      if (prevConfig?.hasSeparatorAbove && prevConfig?.separatorConfig) {
        y -= cmToPixels(prevConfig.separatorConfig.heightCm);
      }
    }
    y -= height;
    
    return {
      ...tier,
      sizeInches: effectiveSize, // Use effective size
      width,
      visualHeight: height,
      y,
      shape,
      hasSeparatorAbove,
      separatorConfig,
      separatorHeightPx,
      actualServings,
      isRectangular,
      rectangularLengthCm,
      rectangularWidthCm,
    };
  });

  // Reverse for rendering (bottom first)
  const visibleTiers = [...tierVisuals].reverse();

  return (
    <div className="relative flex items-center justify-center">
      <svg
        viewBox="0 0 400 440"
        className="h-[500px] w-full max-w-[480px] md:h-[600px] md:max-w-[520px]"
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

        {/* Tiers with perspective */}
        {visibleTiers.map((tier, index) => {
          const tierIndex = structure.tiers.length - 1 - index;
          const actualTierNumber = tier.tierLevel;
          const isSelected = selectedTier === actualTierNumber;
          const hasSelection = selectedTier !== null;
          const opacity = hasSelection && !isSelected ? 0.3 : 1;
          const isSquare = tier.shape === "square";
          const isRectangular = tier.shape === "rectangular";

          // Calculate tier price for display
          const config = tierConfigs[tierIndex];
          const tierPrice = config
            ? calculateTierPrice(tier.actualServings, config.spongeId, config.dietaryId, config.fillingId)
            : null;

          // Perspective parameters
          const perspectiveSkew = 6; // Vertical offset for 3D effect
          const topWidth = tier.width * 0.92; // Top is slightly smaller for perspective

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
              {/* Acrylic Separator above tier - tall cylinder/box with texture */}
              {tier.hasSeparatorAbove && tier.separatorConfig && (
                <g>
                  {/* Defs for acrylic texture pattern */}
                  <defs>
                    <pattern id={`acrylic-pattern-${actualTierNumber}`} width="4" height="4" patternUnits="userSpaceOnUse">
                      <rect width="4" height="4" fill="hsl(200 40% 95% / 0.3)" />
                      <line x1="0" y1="0" x2="4" y2="4" stroke="hsl(200 30% 80% / 0.4)" strokeWidth="0.5" />
                      <line x1="4" y1="0" x2="0" y2="4" stroke="hsl(200 30% 85% / 0.3)" strokeWidth="0.3" />
                    </pattern>
                    <linearGradient id={`acrylic-gradient-${actualTierNumber}`} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(200 40% 92% / 0.7)" />
                      <stop offset="30%" stopColor="hsl(200 30% 96% / 0.5)" />
                      <stop offset="70%" stopColor="hsl(200 30% 96% / 0.5)" />
                      <stop offset="100%" stopColor="hsl(200 40% 88% / 0.7)" />
                    </linearGradient>
                  </defs>
                  
                  {/* Separator with custom diameter, height, and shape */}
                  {(() => {
                    const sepDiameterInches = tier.separatorConfig!.diameterInches;
                    const sepHeightCm = tier.separatorConfig!.heightCm;
                    const sepShape = tier.separatorConfig!.shape;
                    const sepWidth = sepDiameterInches * 16; // Convert inches to pixels
                    const sepHeight = tier.separatorHeightPx;
                    const sepY = tier.y - sepHeight;
                    const perspectiveSkew = 5;
                    const isSquareSep = sepShape === "square";
                    
                    return (
                      <>
                        {isSquareSep ? (
                          // SQUARE SEPARATOR
                          <>
                            {/* Front face */}
                            <path
                              d={`M ${centerX - sepWidth / 2} ${sepY + perspectiveSkew}
                                  L ${centerX - sepWidth / 2} ${tier.y - 2}
                                  L ${centerX + sepWidth / 2} ${tier.y - 2}
                                  L ${centerX + sepWidth / 2} ${sepY + perspectiveSkew}
                                  Z`}
                              fill={`url(#acrylic-gradient-${actualTierNumber})`}
                              stroke="hsl(200 30% 75%)"
                              strokeWidth={1}
                            />
                            {/* Texture overlay */}
                            <path
                              d={`M ${centerX - sepWidth / 2} ${sepY + perspectiveSkew}
                                  L ${centerX - sepWidth / 2} ${tier.y - 2}
                                  L ${centerX + sepWidth / 2} ${tier.y - 2}
                                  L ${centerX + sepWidth / 2} ${sepY + perspectiveSkew}
                                  Z`}
                              fill={`url(#acrylic-pattern-${actualTierNumber})`}
                              opacity={0.6}
                            />
                            {/* Top face */}
                            <path
                              d={`M ${centerX - sepWidth / 2} ${sepY + perspectiveSkew}
                                  L ${centerX - sepWidth / 2 * 0.92} ${sepY}
                                  L ${centerX + sepWidth / 2 * 0.92} ${sepY}
                                  L ${centerX + sepWidth / 2} ${sepY + perspectiveSkew}
                                  Z`}
                              fill="hsl(200 40% 96% / 0.6)"
                              stroke="hsl(200 30% 75%)"
                              strokeWidth={0.8}
                            />
                          </>
                        ) : (
                          // ROUND SEPARATOR
                          <>
                            {/* Separator cylinder body */}
                            <path
                              d={`M ${centerX - sepWidth / 2} ${sepY + perspectiveSkew}
                                  L ${centerX - sepWidth / 2} ${tier.y - 2}
                                  A ${sepWidth / 2} ${perspectiveSkew} 0 0 0 ${centerX + sepWidth / 2} ${tier.y - 2}
                                  L ${centerX + sepWidth / 2} ${sepY + perspectiveSkew}
                                  A ${sepWidth / 2} ${perspectiveSkew} 0 0 0 ${centerX - sepWidth / 2} ${sepY + perspectiveSkew}
                                  Z`}
                              fill={`url(#acrylic-gradient-${actualTierNumber})`}
                              stroke="hsl(200 30% 75%)"
                              strokeWidth={1}
                            />
                            {/* Texture overlay */}
                            <path
                              d={`M ${centerX - sepWidth / 2} ${sepY + perspectiveSkew}
                                  L ${centerX - sepWidth / 2} ${tier.y - 2}
                                  A ${sepWidth / 2} ${perspectiveSkew} 0 0 0 ${centerX + sepWidth / 2} ${tier.y - 2}
                                  L ${centerX + sepWidth / 2} ${sepY + perspectiveSkew}
                                  A ${sepWidth / 2} ${perspectiveSkew} 0 0 0 ${centerX - sepWidth / 2} ${sepY + perspectiveSkew}
                                  Z`}
                              fill={`url(#acrylic-pattern-${actualTierNumber})`}
                              opacity={0.6}
                            />
                            {/* Top ellipse */}
                            <ellipse
                              cx={centerX}
                              cy={sepY + perspectiveSkew}
                              rx={sepWidth / 2}
                              ry={perspectiveSkew}
                              fill="hsl(200 40% 96% / 0.6)"
                              stroke="hsl(200 30% 75%)"
                              strokeWidth={0.8}
                            />
                          </>
                        )}
                        
                        {/* Shine effect */}
                        <ellipse
                          cx={centerX - sepWidth / 4}
                          cy={sepY + sepHeight / 2}
                          rx={3}
                          ry={sepHeight / 3}
                          fill="hsl(0 0% 100% / 0.3)"
                        />
                        
                        {/* Size label */}
                        <text
                          x={centerX}
                          y={sepY + sepHeight / 2 + 3}
                          textAnchor="middle"
                          className="fill-muted-foreground/60 font-ui text-[7px] uppercase tracking-wider"
                        >
                          {sepDiameterInches}" × {sepHeightCm}cm
                        </text>
                      </>
                    );
                  })()}
                </g>
              )}

              {/* Tier body - with perspective (different for round vs square vs rectangular) */}
              {isRectangular ? (
                // RECTANGULAR TIER - elongated 3D box
                <g>
                  {/* Front face */}
                  <motion.path
                    d={`M ${centerX - tier.width / 2} ${tier.y + perspectiveSkew}
                        L ${centerX - tier.width / 2} ${tier.y + tier.visualHeight}
                        L ${centerX + tier.width / 2} ${tier.y + tier.visualHeight}
                        L ${centerX + tier.width / 2} ${tier.y + perspectiveSkew}
                        Z`}
                    className={isSelected ? "fill-secondary/15" : "fill-background"}
                    stroke={isSelected ? "hsl(43 60% 52%)" : "hsl(0 0% 10%)"}
                    strokeWidth={isSelected ? 2 : 1.5}
                  />
                  {/* Top face (showing it's rectangular) */}
                  <motion.path
                    d={`M ${centerX - tier.width / 2} ${tier.y + perspectiveSkew}
                        L ${centerX - topWidth / 2} ${tier.y}
                        L ${centerX + topWidth / 2} ${tier.y}
                        L ${centerX + tier.width / 2} ${tier.y + perspectiveSkew}
                        Z`}
                    className={isSelected ? "fill-secondary/25" : "fill-muted/10"}
                    stroke={isSelected ? "hsl(43 60% 52%)" : "hsl(0 0% 10%)"}
                    strokeWidth={isSelected ? 1.5 : 1}
                  />
                  {/* Rectangular indicator - horizontal line pattern */}
                  <line
                    x1={centerX - topWidth / 2 + 10}
                    y1={tier.y + perspectiveSkew / 2}
                    x2={centerX + topWidth / 2 - 10}
                    y2={tier.y + perspectiveSkew / 2}
                    stroke={isSelected ? "hsl(43 60% 52% / 0.5)" : "hsl(0 0% 10% / 0.2)"}
                    strokeWidth={1}
                    strokeDasharray="4,4"
                  />
                </g>
              ) : isSquare ? (
                // SQUARE TIER - 3D box with visible top
                <g>
                  {/* Front face */}
                  <motion.path
                    d={`M ${centerX - tier.width / 2} ${tier.y + perspectiveSkew}
                        L ${centerX - tier.width / 2} ${tier.y + tier.visualHeight}
                        L ${centerX + tier.width / 2} ${tier.y + tier.visualHeight}
                        L ${centerX + tier.width / 2} ${tier.y + perspectiveSkew}
                        Z`}
                    className={isSelected ? "fill-secondary/15" : "fill-background"}
                    stroke={isSelected ? "hsl(43 60% 52%)" : "hsl(0 0% 10%)"}
                    strokeWidth={isSelected ? 2 : 1.5}
                  />
                  {/* Top face (showing it's square) */}
                  <motion.path
                    d={`M ${centerX - tier.width / 2} ${tier.y + perspectiveSkew}
                        L ${centerX - topWidth / 2} ${tier.y}
                        L ${centerX + topWidth / 2} ${tier.y}
                        L ${centerX + tier.width / 2} ${tier.y + perspectiveSkew}
                        Z`}
                    className={isSelected ? "fill-secondary/25" : "fill-muted/10"}
                    stroke={isSelected ? "hsl(43 60% 52%)" : "hsl(0 0% 10%)"}
                    strokeWidth={isSelected ? 1.5 : 1}
                  />
                  {/* Square indicator on top */}
                  <rect
                    x={centerX - topWidth / 2 + 4}
                    y={tier.y + 1}
                    width={topWidth - 8}
                    height={perspectiveSkew - 2}
                    fill="none"
                    stroke={isSelected ? "hsl(43 60% 52% / 0.5)" : "hsl(0 0% 10% / 0.2)"}
                    strokeWidth={0.5}
                    strokeDasharray="2,2"
                  />
                </g>
              ) : (
                // ROUND TIER - cylinder with elliptical top
                <g>
                  {/* Cylinder body */}
                  <motion.path
                    d={`M ${centerX - tier.width / 2} ${tier.y + perspectiveSkew}
                        L ${centerX - tier.width / 2} ${tier.y + tier.visualHeight - 3}
                        Q ${centerX - tier.width / 2} ${tier.y + tier.visualHeight} ${centerX - tier.width / 2 + 3} ${tier.y + tier.visualHeight}
                        L ${centerX + tier.width / 2 - 3} ${tier.y + tier.visualHeight}
                        Q ${centerX + tier.width / 2} ${tier.y + tier.visualHeight} ${centerX + tier.width / 2} ${tier.y + tier.visualHeight - 3}
                        L ${centerX + tier.width / 2} ${tier.y + perspectiveSkew}
                        A ${tier.width / 2} ${perspectiveSkew} 0 0 0 ${centerX - tier.width / 2} ${tier.y + perspectiveSkew}
                        Z`}
                    className={isSelected ? "fill-secondary/15" : "fill-background"}
                    stroke={isSelected ? "hsl(43 60% 52%)" : "hsl(0 0% 10%)"}
                    strokeWidth={isSelected ? 2 : 1.5}
                  />
                  {/* Elliptical top (showing it's round) */}
                  <motion.ellipse
                    cx={centerX}
                    cy={tier.y + perspectiveSkew}
                    rx={tier.width / 2}
                    ry={perspectiveSkew}
                    className={isSelected ? "fill-secondary/25" : "fill-muted/10"}
                    stroke={isSelected ? "hsl(43 60% 52%)" : "hsl(0 0% 10%)"}
                    strokeWidth={isSelected ? 1.5 : 1}
                  />
                </g>
              )}

              {/* LEFT: Size in inches + shape */}
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
                  y={tier.y + tier.visualHeight / 2}
                  textAnchor="middle"
                  className="fill-muted-foreground font-ui text-[10px] font-medium"
                  opacity={isSelected ? 1 : 0.8}
                >
                  {isRectangular ? `${tier.rectangularWidthCm}×${tier.rectangularLengthCm}` : `${tier.sizeInches}"`}
                </text>
                <text
                  x={centerX - tier.width / 2 - 40}
                  y={tier.y + tier.visualHeight / 2 + 10}
                  textAnchor="middle"
                  className="fill-muted-foreground/70 font-ui text-[8px]"
                  opacity={isSelected ? 1 : 0.7}
                >
                  {isRectangular ? "cm ▬" : `(${Math.round(tier.sizeInches * 2.54)} cm) ${isSquare ? "□" : "○"}`}
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

              {/* Tier label (centered) */}
              <text
                x={centerX}
                y={tier.y + tier.visualHeight / 2 + 8}
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
                    y={tier.y - (tier.hasSeparatorAbove && tier.separatorHeightPx > 0 ? tier.separatorHeightPx + 5 : 28)}
                    width={80}
                    height={22}
                    rx="4"
                    fill="hsl(43 60% 52%)"
                  />
                  <text
                    x={centerX}
                    y={tier.y - (tier.hasSeparatorAbove && tier.separatorHeightPx > 0 ? tier.separatorHeightPx - 10 : 13)}
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

        {/* Total servings + portion info */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.8 }}
        >
          <text
            x={centerX}
            y={plateY + standHeight + 25}
            textAnchor="middle"
            className="fill-foreground font-ui text-[12px] font-semibold uppercase tracking-wider"
          >
            {totalServings} Servings
          </text>
          <text
            x={centerX}
            y={plateY + standHeight + 45}
            textAnchor="middle"
            className="fill-muted-foreground/70 font-ui text-[9px]"
          >
            Portion: {PORTION_SIZE_DESCRIPTION}
          </text>
          <text
            x={centerX}
            y={plateY + standHeight + 60}
            textAnchor="middle"
            className="fill-muted-foreground/50 font-ui text-[9px]"
          >
            ~{PORTION_WEIGHT_GRAMS}g per portion
          </text>
        </motion.g>
      </svg>
    </div>
  );
}
