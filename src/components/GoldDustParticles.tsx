import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

interface GoldDustParticlesProps {
  isActive: boolean;
  originX?: number;
  originY?: number;
  count?: number;
}

export function GoldDustParticles({
  isActive,
  originX = 50,
  originY = 50,
  count = 20,
}: GoldDustParticlesProps) {
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    if (isActive) {
      particlesRef.current = Array.from({ length: count }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 200,
        size: Math.random() * 6 + 2,
        duration: Math.random() * 1 + 0.8,
        delay: Math.random() * 0.3,
      }));
    }
  }, [isActive, count]);

  return (
    <AnimatePresence>
      {isActive && (
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{ zIndex: 50 }}
        >
          {particlesRef.current.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{
                opacity: 0,
                scale: 0,
                x: `${originX}%`,
                y: `${originY}%`,
              }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0, 1.5, 1, 0],
                x: `calc(${originX}% + ${particle.x}px)`,
                y: `calc(${originY}% + ${particle.y}px)`,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                ease: "easeOut",
              }}
              className="absolute rounded-full"
              style={{
                width: particle.size,
                height: particle.size,
                background: `radial-gradient(circle, hsl(43 80% 60%) 0%, hsl(43 60% 52%) 50%, transparent 100%)`,
                boxShadow: `0 0 ${particle.size * 2}px hsl(43 60% 52% / 0.6)`,
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
