import { motion } from "framer-motion";
import { CakeShape, getServingsForTier } from "@/data/menuDatabase";

interface PortionDiagramProps {
  sizeInches: number;
  shape: CakeShape;
}

export function PortionDiagram({ sizeInches, shape }: PortionDiagramProps) {
  const servings = getServingsForTier(sizeInches, shape);
  
  // Calculate grid for portion visualization
  const getPortionLayout = () => {
    if (shape === "square") {
      // For square cakes, create a grid
      const gridSize = Math.ceil(Math.sqrt(servings));
      const rows = Math.ceil(servings / gridSize);
      return { type: "grid" as const, cols: gridSize, rows, total: servings };
    } else {
      // For round cakes, create concentric rings
      return { type: "radial" as const, total: servings };
    }
  };
  
  const layout = getPortionLayout();
  const viewBoxSize = 120;
  const padding = 10;
  const cakeSize = viewBoxSize - padding * 2;
  
  const renderSquarePortions = () => {
    const { cols, rows, total } = layout as { type: "grid"; cols: number; rows: number; total: number };
    const cellWidth = cakeSize / cols;
    const cellHeight = cakeSize / rows;
    const portions = [];
    
    let count = 0;
    for (let row = 0; row < rows && count < total; row++) {
      for (let col = 0; col < cols && count < total; col++) {
        portions.push(
          <motion.rect
            key={`${row}-${col}`}
            x={padding + col * cellWidth + 1}
            y={padding + row * cellHeight + 1}
            width={cellWidth - 2}
            height={cellHeight - 2}
            fill="hsl(var(--secondary) / 0.2)"
            stroke="hsl(var(--secondary) / 0.5)"
            strokeWidth={0.5}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: count * 0.01 }}
          />
        );
        count++;
      }
    }
    return portions;
  };
  
  const renderRoundPortions = () => {
    const total = layout.total;
    const centerX = viewBoxSize / 2;
    const centerY = viewBoxSize / 2;
    const radius = cakeSize / 2;
    
    // Determine ring structure based on total servings (adjusted for smaller round cakes)
    const getRings = (total: number) => {
      if (total <= 6) return [total];
      if (total <= 10) return [4, total - 4];
      if (total <= 16) return [4, 6, total - 10];
      if (total <= 24) return [4, 8, 8, total - 20];
      if (total <= 36) return [4, 8, 10, 10, total - 32];
      if (total <= 50) return [4, 8, 10, 12, 12, total - 46];
      return [4, 8, 10, 14, 16, total - 52];
    };
    
    const rings = getRings(total);
    const portions: JSX.Element[] = [];
    let portionIndex = 0;
    
    rings.forEach((count, ringIndex) => {
      const innerRadius = ringIndex === 0 ? 0 : (radius * ringIndex) / rings.length;
      const outerRadius = (radius * (ringIndex + 1)) / rings.length;
      const angleStep = (2 * Math.PI) / count;
      
      for (let i = 0; i < count; i++) {
        const startAngle = i * angleStep - Math.PI / 2;
        const endAngle = (i + 1) * angleStep - Math.PI / 2;
        
        const x1 = centerX + innerRadius * Math.cos(startAngle);
        const y1 = centerY + innerRadius * Math.sin(startAngle);
        const x2 = centerX + outerRadius * Math.cos(startAngle);
        const y2 = centerY + outerRadius * Math.sin(startAngle);
        const x3 = centerX + outerRadius * Math.cos(endAngle);
        const y3 = centerY + outerRadius * Math.sin(endAngle);
        const x4 = centerX + innerRadius * Math.cos(endAngle);
        const y4 = centerY + innerRadius * Math.sin(endAngle);
        
        const largeArc = angleStep > Math.PI ? 1 : 0;
        
        const path = ringIndex === 0
          ? `M ${centerX} ${centerY} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x3} ${y3} Z`
          : `M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x1} ${y1}`;
        
        portions.push(
          <motion.path
            key={portionIndex}
            d={path}
            fill="hsl(var(--secondary) / 0.2)"
            stroke="hsl(var(--secondary) / 0.5)"
            strokeWidth={0.5}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: portionIndex * 0.01 }}
          />
        );
        portionIndex++;
      }
    });
    
    return portions;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-2"
    >
      <p className="text-xs text-muted-foreground uppercase tracking-wider">
        Cutting Guide
      </p>
      
      <div className="relative">
        <svg
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
          className="w-28 h-28"
        >
          {/* Outer border */}
          {shape === "round" ? (
            <circle
              cx={viewBoxSize / 2}
              cy={viewBoxSize / 2}
              r={cakeSize / 2}
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth={1}
            />
          ) : (
            <rect
              x={padding}
              y={padding}
              width={cakeSize}
              height={cakeSize}
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth={1}
            />
          )}
          
          {/* Portion slices */}
          {shape === "square" ? renderSquarePortions() : renderRoundPortions()}
        </svg>
        
        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-lg font-display font-bold text-secondary">
            {servings}
          </span>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">
          {servings} portions
        </p>
        <p className="text-xs text-muted-foreground">
          {sizeInches}" {shape}
        </p>
      </div>
    </motion.div>
  );
}
