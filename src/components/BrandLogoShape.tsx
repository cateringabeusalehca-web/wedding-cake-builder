import { motion } from "framer-motion";

interface BrandLogoShapeProps {
  className?: string;
  size?: number;
  color?: string;
  opacity?: number;
  animate?: boolean;
}

// Crown/Cloche shape extracted from the Abeu-Saleh logo - no text, just the figure
export function BrandLogoShape({ 
  className = "", 
  size = 40, 
  color = "currentColor",
  opacity = 1,
  animate = false 
}: BrandLogoShapeProps) {
  const ShapeContent = (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 70" 
      className={className}
      style={{ opacity }}
    >
      {/* Cherry/top decoration */}
      <circle cx="50" cy="5" r="4" fill={color} />
      <path d="M50 9 L50 15" stroke={color} strokeWidth="2" />
      
      {/* Main crown/dome petals */}
      <path 
        d="M50 15 
           C30 15 20 30 25 45 
           C15 40 10 50 15 55
           L85 55
           C90 50 85 40 75 45
           C80 30 70 15 50 15Z"
        fill={color}
      />
      
      {/* Inner dome shape (white/transparent to create the layered look) */}
      <path 
        d="M50 20 
           C35 20 28 32 32 42
           L68 42
           C72 32 65 20 50 20Z"
        fill="transparent"
        stroke={color}
        strokeWidth="1.5"
      />
      
      {/* Base ellipses */}
      <ellipse cx="50" cy="55" rx="38" ry="8" fill="none" stroke={color} strokeWidth="2" />
      <ellipse cx="50" cy="62" rx="45" ry="8" fill={color} opacity="0.8" />
    </svg>
  );

  if (animate) {
    return (
      <motion.div
        animate={{ 
          opacity: [opacity * 0.5, opacity, opacity * 0.5],
          scale: [0.98, 1.02, 0.98],
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        {ShapeContent}
      </motion.div>
    );
  }

  return ShapeContent;
}

// Simplified corner version - just the dome petals
export function BrandCornerDecor({ 
  className = "", 
  size = 30, 
  color = "currentColor",
  opacity = 0.6,
}: BrandLogoShapeProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 50 50" 
      className={className}
      style={{ opacity }}
    >
      {/* Simplified petal curves for corners */}
      <path 
        d="M0 50 
           C0 30 10 10 25 5
           C15 15 10 25 10 40
           L0 50Z"
        fill={color}
      />
      <path 
        d="M5 50 
           C5 35 12 20 25 12
           C18 22 15 32 15 45
           L5 50Z"
        fill={color}
        opacity="0.5"
      />
    </svg>
  );
}

// Small accent shape for subtle branding
export function BrandAccent({ 
  className = "", 
  size = 20, 
  color = "currentColor",
  opacity = 0.4,
}: BrandLogoShapeProps) {
  return (
    <svg 
      width={size} 
      height={size * 0.7} 
      viewBox="0 0 40 28" 
      className={className}
      style={{ opacity }}
    >
      {/* Single petal shape */}
      <path 
        d="M20 0 
           C8 0 0 10 5 22
           L35 22
           C40 10 32 0 20 0Z"
        fill={color}
      />
      <ellipse cx="20" cy="24" rx="18" ry="4" fill={color} opacity="0.6" />
    </svg>
  );
}
