import { motion } from "framer-motion";

interface CakeDecorationOverlaysProps {
  selectedDecorations: string[];
  centerX: number;
  topTierY: number;
  bottomTierY: number;
  topTierWidth: number;
  bottomTierWidth: number;
  tierCount: number;
}

// Decoration category helpers
const isFloral = (id: string) => id.startsWith("floral_");
const isMetallic = (id: string) => ["gold_leaf", "gold_paint", "silver_leaf", "metallic_drip", "rose_gold"].includes(id);
const isTopper = (id: string) => id.startsWith("topper_");
const isFondant = (id: string) => id.startsWith("fondant_");

export function CakeDecorationOverlays({
  selectedDecorations,
  centerX,
  topTierY,
  bottomTierY,
  topTierWidth,
  bottomTierWidth,
  tierCount,
}: CakeDecorationOverlaysProps) {
  const hasFloral = selectedDecorations.some(isFloral);
  const hasMetallic = selectedDecorations.some(isMetallic);
  const hasTopper = selectedDecorations.some(isTopper);
  const hasFondant = selectedDecorations.some(isFondant);

  // Specific floral positions
  const hasCascade = selectedDecorations.includes("floral_cascade");
  const hasCrown = selectedDecorations.includes("floral_crown");
  const hasScattered = selectedDecorations.includes("floral_scattered");
  const hasRing = selectedDecorations.includes("floral_ring");

  // Specific metallic options
  const hasGoldLeaf = selectedDecorations.includes("gold_leaf");
  const hasGoldPaint = selectedDecorations.includes("gold_paint");
  const hasDrip = selectedDecorations.includes("metallic_drip");
  const hasRoseGold = selectedDecorations.includes("rose_gold");

  // Specific toppers
  const hasInitials = selectedDecorations.includes("topper_initials");
  const hasNames = selectedDecorations.includes("topper_names");
  const hasDate = selectedDecorations.includes("topper_date");
  const hasSilhouette = selectedDecorations.includes("topper_silhouette");
  const hasMrMrs = selectedDecorations.includes("topper_mr_mrs");

  // Fondant options
  const hasPearls = selectedDecorations.includes("fondant_pearls");
  const hasBows = selectedDecorations.includes("fondant_bows");
  const hasLace = selectedDecorations.includes("fondant_lace");
  const hasGeometric = selectedDecorations.includes("fondant_geometric");
  const hasRuffles = selectedDecorations.includes("fondant_ruffles");

  return (
    <g className="decoration-overlays">
      {/* Cascading Florals - Left side */}
      {hasCascade && (
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          {/* Main cascade down left side */}
          <motion.text
            x={centerX - topTierWidth / 2 - 8}
            y={topTierY + 20}
            className="text-2xl"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            🌸
          </motion.text>
          <motion.text
            x={centerX - topTierWidth / 2 + 5}
            y={topTierY + 50}
            className="text-xl"
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 2.3, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          >
            🌺
          </motion.text>
          <motion.text
            x={centerX - bottomTierWidth / 3}
            y={bottomTierY - 30}
            className="text-lg"
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          >
            🌷
          </motion.text>
        </motion.g>
      )}

      {/* Floral Crown - Top */}
      {hasCrown && (
        <motion.g
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <motion.text
            x={centerX - 20}
            y={topTierY - 8}
            className="text-xl"
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            💐
          </motion.text>
          <motion.text
            x={centerX + 10}
            y={topTierY - 10}
            className="text-lg"
            animate={{ rotate: [5, -5, 5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          >
            🌸
          </motion.text>
        </motion.g>
      )}

      {/* Scattered Petals */}
      {hasScattered && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.text
              key={`petal-${i}`}
              x={centerX + (i - 2) * 30 + Math.sin(i) * 20}
              y={topTierY + 30 + (i % 2) * 40}
              className="text-sm opacity-70"
              animate={{ 
                y: [0, -5, 0],
                rotate: [0, 10, 0],
              }}
              transition={{ 
                duration: 2 + i * 0.3, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: i * 0.2 
              }}
            >
              🌼
            </motion.text>
          ))}
        </motion.g>
      )}

      {/* Floral Ring Base */}
      {hasRing && (
        <motion.g
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.text
            x={centerX - bottomTierWidth / 2 - 5}
            y={bottomTierY + 8}
            className="text-lg"
          >
            🌹
          </motion.text>
          <motion.text
            x={centerX - 10}
            y={bottomTierY + 10}
            className="text-lg"
          >
            🌸
          </motion.text>
          <motion.text
            x={centerX + bottomTierWidth / 2 - 15}
            y={bottomTierY + 8}
            className="text-lg"
          >
            🌺
          </motion.text>
        </motion.g>
      )}

      {/* Gold Leaf Accents */}
      {hasGoldLeaf && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {[...Array(4)].map((_, i) => (
            <motion.rect
              key={`gold-${i}`}
              x={centerX - 40 + i * 25}
              y={topTierY + 15 + (i % 2) * 30}
              width={8}
              height={8}
              rx={1}
              fill="hsl(43 80% 55%)"
              animate={{ 
                opacity: [0.6, 1, 0.6],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                delay: i * 0.3 
              }}
            />
          ))}
        </motion.g>
      )}

      {/* Gold Paint Details */}
      {hasGoldPaint && (
        <motion.g
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.path
            d={`M ${centerX - 30} ${topTierY + 35} Q ${centerX} ${topTierY + 25} ${centerX + 30} ${topTierY + 35}`}
            stroke="hsl(43 80% 55%)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.g>
      )}

      {/* Metallic Drip Effect */}
      {hasDrip && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.path
              key={`drip-${i}`}
              d={`M ${centerX - 40 + i * 20} ${topTierY} 
                  Q ${centerX - 40 + i * 20} ${topTierY + 10 + (i % 2) * 8} 
                  ${centerX - 40 + i * 20} ${topTierY + 15 + (i % 3) * 5}`}
              stroke="hsl(43 80% 55%)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
            />
          ))}
        </motion.g>
      )}

      {/* Rose Gold Shimmer */}
      {hasRoseGold && (
        <motion.g>
          {[...Array(6)].map((_, i) => (
            <motion.circle
              key={`rose-${i}`}
              cx={centerX - 50 + i * 20}
              cy={topTierY + 20 + (i % 2) * 25}
              r={3}
              fill="hsl(350 50% 70%)"
              animate={{ 
                opacity: [0.4, 0.9, 0.4],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{ 
                duration: 1.5 + i * 0.2, 
                repeat: Infinity,
                delay: i * 0.15 
              }}
            />
          ))}
        </motion.g>
      )}

      {/* Fondant Pearls */}
      {hasPearls && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {[...Array(8)].map((_, i) => (
            <motion.circle
              key={`pearl-${i}`}
              cx={centerX - 56 + i * 16}
              cy={topTierY + 5}
              r={3}
              fill="hsl(0 0% 95%)"
              stroke="hsl(0 0% 80%)"
              strokeWidth="0.5"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
        </motion.g>
      )}

      {/* Fondant Bows */}
      {hasBows && (
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          <motion.text
            x={centerX - 10}
            y={topTierY + 30}
            className="text-lg"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🎀
          </motion.text>
        </motion.g>
      )}

      {/* Lace Pattern */}
      {hasLace && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 0.5 }}
        >
          <motion.path
            d={`M ${centerX - topTierWidth / 2 + 10} ${topTierY + 20} 
                Q ${centerX - topTierWidth / 4} ${topTierY + 15} ${centerX} ${topTierY + 20}
                Q ${centerX + topTierWidth / 4} ${topTierY + 15} ${centerX + topTierWidth / 2 - 10} ${topTierY + 20}`}
            stroke="hsl(0 0% 85%)"
            strokeWidth="1"
            fill="none"
            strokeDasharray="3 2"
          />
        </motion.g>
      )}

      {/* Geometric Shapes */}
      {hasGeometric && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {[...Array(4)].map((_, i) => (
            <motion.polygon
              key={`hex-${i}`}
              points={`${centerX - 30 + i * 20},${topTierY + 25} 
                       ${centerX - 25 + i * 20},${topTierY + 20} 
                       ${centerX - 20 + i * 20},${topTierY + 25} 
                       ${centerX - 20 + i * 20},${topTierY + 32} 
                       ${centerX - 25 + i * 20},${topTierY + 37} 
                       ${centerX - 30 + i * 20},${topTierY + 32}`}
              fill="none"
              stroke="hsl(43 40% 65%)"
              strokeWidth="1"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </motion.g>
      )}

      {/* Ruffles */}
      {hasRuffles && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.path
              key={`ruffle-${i}`}
              d={`M ${centerX - topTierWidth / 2 + 15} ${topTierY + 15 + i * 12}
                  Q ${centerX - topTierWidth / 4} ${topTierY + 10 + i * 12} ${centerX} ${topTierY + 15 + i * 12}
                  Q ${centerX + topTierWidth / 4} ${topTierY + 20 + i * 12} ${centerX + topTierWidth / 2 - 15} ${topTierY + 15 + i * 12}`}
              stroke="hsl(0 0% 90%)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          ))}
        </motion.g>
      )}

      {/* Topper Visualizations */}
      {(hasInitials || hasNames || hasDate || hasSilhouette || hasMrMrs) && (
        <motion.g
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          {/* Topper stand */}
          <motion.line
            x1={centerX}
            y1={topTierY - 5}
            x2={centerX}
            y2={topTierY - 25}
            stroke="hsl(43 60% 52%)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          
          {/* Topper content based on type */}
          {hasSilhouette && (
            <motion.g
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {/* Minimalist couple silhouette - line art style */}
              <motion.path
                d={`
                  M ${centerX - 8} ${topTierY - 28}
                  C ${centerX - 10} ${topTierY - 32}, ${centerX - 8} ${topTierY - 38}, ${centerX - 5} ${topTierY - 42}
                  C ${centerX - 3} ${topTierY - 45}, ${centerX} ${topTierY - 46}, ${centerX + 2} ${topTierY - 45}
                  C ${centerX + 5} ${topTierY - 43}, ${centerX + 6} ${topTierY - 40}, ${centerX + 5} ${topTierY - 37}
                  C ${centerX + 4} ${topTierY - 34}, ${centerX + 2} ${topTierY - 32}, ${centerX} ${topTierY - 31}
                  C ${centerX - 2} ${topTierY - 30}, ${centerX - 5} ${topTierY - 29}, ${centerX - 8} ${topTierY - 28}
                `}
                fill="none"
                stroke="hsl(43 60% 52%)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Left figure (taller) */}
              <motion.path
                d={`
                  M ${centerX - 6} ${topTierY - 42}
                  C ${centerX - 7} ${topTierY - 44}, ${centerX - 6} ${topTierY - 47}, ${centerX - 4} ${topTierY - 48}
                  C ${centerX - 2} ${topTierY - 49}, ${centerX - 1} ${topTierY - 48}, ${centerX - 2} ${topTierY - 46}
                `}
                fill="none"
                stroke="hsl(43 60% 52%)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* Right figure (slightly shorter, leaning in) */}
              <motion.path
                d={`
                  M ${centerX + 4} ${topTierY - 40}
                  C ${centerX + 5} ${topTierY - 42}, ${centerX + 4} ${topTierY - 44}, ${centerX + 2} ${topTierY - 45}
                  C ${centerX} ${topTierY - 46}, ${centerX - 1} ${topTierY - 45}, ${centerX - 1} ${topTierY - 44}
                `}
                fill="none"
                stroke="hsl(43 60% 52%)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* Embrace arms */}
              <motion.path
                d={`
                  M ${centerX - 4} ${topTierY - 38}
                  Q ${centerX} ${topTierY - 36}, ${centerX + 3} ${topTierY - 37}
                `}
                fill="none"
                stroke="hsl(43 60% 52%)"
                strokeWidth="1"
                strokeLinecap="round"
              />
            </motion.g>
          )}
          
          {hasMrMrs && (
            <motion.text
              x={centerX}
              y={topTierY - 35}
              textAnchor="middle"
              className="fill-secondary font-display text-[10px] font-bold tracking-wide"
            >
              Mr & Mrs
            </motion.text>
          )}
          
          {hasInitials && (
            <motion.g>
              <motion.rect
                x={centerX - 18}
                y={topTierY - 45}
                width={36}
                height={18}
                rx={3}
                fill="hsl(43 60% 52%)"
              />
              <motion.text
                x={centerX}
                y={topTierY - 32}
                textAnchor="middle"
                className="fill-foreground font-display text-[9px] font-bold"
              >
                J & M
              </motion.text>
            </motion.g>
          )}
          
          {hasNames && (
            <motion.g>
              <motion.rect
                x={centerX - 35}
                y={topTierY - 48}
                width={70}
                height={18}
                rx={3}
                fill="hsl(43 60% 52%)"
              />
              <motion.text
                x={centerX}
                y={topTierY - 35}
                textAnchor="middle"
                className="fill-foreground font-display text-[7px] font-medium"
              >
                Jennifer & Matthew
              </motion.text>
            </motion.g>
          )}
          
          {hasDate && (
            <motion.g>
              <motion.rect
                x={centerX - 25}
                y={topTierY - 45}
                width={50}
                height={16}
                rx={3}
                fill="hsl(43 60% 52%)"
              />
              <motion.text
                x={centerX}
                y={topTierY - 33}
                textAnchor="middle"
                className="fill-foreground font-display text-[8px] font-medium"
              >
                06.15.25
              </motion.text>
            </motion.g>
          )}
        </motion.g>
      )}

      {/* Active decorations indicator badge */}
      {selectedDecorations.length > 0 && (
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          <motion.circle
            cx={centerX + bottomTierWidth / 2 + 30}
            cy={bottomTierY - 20}
            r={14}
            fill="hsl(43 60% 52%)"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.text
            x={centerX + bottomTierWidth / 2 + 30}
            y={bottomTierY - 16}
            textAnchor="middle"
            className="fill-foreground font-ui text-[10px] font-bold"
          >
            {selectedDecorations.length}
          </motion.text>
        </motion.g>
      )}
    </g>
  );
}
