import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfettiPiece {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  color: string;
  rotation: number;
}

export function ConfettiCelebration() {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const colors = [
      "hsl(43, 74%, 49%)", // Gold
      "hsl(43, 70%, 60%)", // Light gold
      "hsl(43, 80%, 70%)", // Champagne
      "hsl(30, 70%, 50%)", // Bronze
      "hsl(45, 100%, 85%)", // Cream gold
      "hsl(0, 0%, 100%)", // White
    ];

    const pieces: ConfettiPiece[] = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.8,
      duration: 2.5 + Math.random() * 2,
      size: 4 + Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
    }));

    setConfetti(pieces);

    // Clean up after animation
    const timer = setTimeout(() => {
      setConfetti([]);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {confetti.map((piece) => (
          <motion.div
            key={piece.id}
            initial={{
              y: -20,
              x: `${piece.x}vw`,
              opacity: 1,
              rotate: 0,
              scale: 0,
            }}
            animate={{
              y: "110vh",
              opacity: [1, 1, 0.8, 0],
              rotate: piece.rotation + 720,
              scale: [0, 1, 1, 0.5],
            }}
            transition={{
              duration: piece.duration,
              delay: piece.delay,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="absolute"
            style={{
              width: piece.size,
              height: piece.size * (Math.random() > 0.5 ? 1 : 0.6),
              backgroundColor: piece.color,
              borderRadius: Math.random() > 0.5 ? "50%" : "2px",
              boxShadow: `0 0 ${piece.size}px ${piece.color}`,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Golden sparkles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 1.5,
            delay: 0.5 + Math.random() * 2,
            repeat: 2,
            repeatDelay: Math.random() * 0.5,
          }}
          className="absolute"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 60}%`,
            width: 8,
            height: 8,
          }}
        >
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <path
              d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z"
              fill="hsl(43, 74%, 49%)"
              style={{ filter: "drop-shadow(0 0 4px hsl(43, 74%, 49%))" }}
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
