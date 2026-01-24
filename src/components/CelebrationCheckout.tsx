import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BrandCornerDecor, BrandAccent } from "./BrandLogoShape";
import { LeadForm } from "./LeadForm";
import logoHorizontal from "@/assets/logo-horizontal.png";
import {
  coatingOptions,
  decorationOptions,
  topperOptions,
  spongeOptions,
  fillingOptions,
} from "@/data/menuDatabase";
import type { CakeStructure, TierConfiguration } from "@/data/menuDatabase";

interface CelebrationCheckoutProps {
  totalPrice: number;
  guestCount: number;
  structure: CakeStructure;
  tierConfigs: TierConfiguration[];
  coatingId: string;
  decorationId: string;
  topperId: string;
  topperNames: string;
  floralPalette: string;
  onGoBack: () => void;
  // Advanced customization props for LeadForm
  referenceImages?: string[];
  selectedDecorations?: string[];
  decorationCustomInputs?: Record<string, string>;
  selectedColorPalette?: string | null;
  eventTheme?: string;
  eventStyle?: string;
}

export function CelebrationCheckout({
  totalPrice,
  guestCount,
  structure,
  tierConfigs,
  coatingId,
  decorationId,
  topperId,
  topperNames,
  floralPalette,
  onGoBack,
  referenceImages = [],
  selectedDecorations = [],
  decorationCustomInputs = {},
  selectedColorPalette = null,
  eventTheme = "",
  eventStyle = "",
}: CelebrationCheckoutProps) {
  const [showLeadForm, setShowLeadForm] = useState(false);

  const handleFormSuccess = () => {
    // Build WooCommerce checkout URL with custom price
    const checkoutUrl = `https://cateringabeusaleh.ca/product/custom-wedding-cake-2/?custom_price=${totalPrice.toFixed(2)}`;
    
    // Redirect to WooCommerce product page in new tab
    window.open(checkoutUrl, "_blank");
    
    // Close the form
    setShowLeadForm(false);
  };

  return (
    <>
      <AnimatePresence>
        {showLeadForm && (
          <LeadForm
            guestCount={guestCount}
            structure={structure}
            tierConfigs={tierConfigs}
            coatingId={coatingId}
            decorationId={decorationId}
            topperId={topperId}
            floralPalette={floralPalette}
            totalPrice={totalPrice}
            onClose={() => setShowLeadForm(false)}
            onSuccess={handleFormSuccess}
            referenceImages={referenceImages}
            selectedDecorations={selectedDecorations}
            decorationCustomInputs={decorationCustomInputs}
            selectedColorPalette={selectedColorPalette}
            eventTheme={eventTheme}
            eventStyle={eventStyle}
          />
        )}
      </AnimatePresence>
      
      <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1],
        scale: { type: "spring", stiffness: 100, damping: 15 }
      }}
      className="relative overflow-hidden rounded-3xl shadow-2xl min-h-[65vh] flex flex-col justify-center"
      style={{
        background: "linear-gradient(135deg, hsl(20, 15%, 8%) 0%, hsl(25, 20%, 12%) 30%, hsl(30, 25%, 10%) 70%, hsl(20, 15%, 6%) 100%)",
      }}
    >
      {/* Golden Light Rays */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-[200%]"
          style={{
            background: "conic-gradient(from 180deg at 50% 0%, transparent 40%, hsl(43, 74%, 49%) 48%, hsl(45, 80%, 70%) 50%, hsl(43, 74%, 49%) 52%, transparent 60%)",
            opacity: 0.15,
          }}
        />
      </div>

      {/* Spotlight effect from top */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1.5 }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-80"
        style={{
          background: "radial-gradient(ellipse at top, hsl(43, 74%, 49%, 0.25) 0%, hsl(43, 74%, 49%, 0.1) 30%, transparent 70%)",
        }}
      />

      {/* Golden border glow */}
      <div className="absolute inset-0 rounded-3xl border-2 border-secondary/60" 
        style={{ boxShadow: "inset 0 0 60px hsl(43, 74%, 49%, 0.2), 0 0 40px hsl(43, 74%, 49%, 0.15)" }} 
      />

      {/* Brand logo corner decorations */}
      <div className="absolute top-3 left-3">
        <BrandCornerDecor size={35} color="hsl(43, 74%, 49%)" opacity={0.7} />
      </div>
      <div className="absolute top-3 right-3 -scale-x-100">
        <BrandCornerDecor size={35} color="hsl(43, 74%, 49%)" opacity={0.7} />
      </div>
      <div className="absolute bottom-3 left-3 -scale-y-100">
        <BrandCornerDecor size={35} color="hsl(43, 74%, 49%)" opacity={0.7} />
      </div>
      <div className="absolute bottom-3 right-3 scale-[-1]">
        <BrandCornerDecor size={35} color="hsl(43, 74%, 49%)" opacity={0.7} />
      </div>

      {/* Subtle brand accents floating */}
      <div className="absolute top-1/4 left-6 opacity-20">
        <BrandAccent size={25} color="hsl(43, 74%, 49%)" />
      </div>
      <div className="absolute top-1/3 right-8 opacity-15">
        <BrandAccent size={20} color="hsl(43, 74%, 49%)" />
      </div>
      <div className="absolute bottom-1/4 left-10 opacity-10">
        <BrandAccent size={18} color="hsl(43, 74%, 49%)" />
      </div>

      {/* Floating golden particles - more particles for excitement */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20, scale: 0 }}
          animate={{ 
            opacity: [0, 1, 0.8, 0],
            y: [-10, -60, -120],
            scale: [0, 1.2, 0.8, 0],
            x: [0, Math.sin(i) * 20, Math.sin(i) * 40],
          }}
          transition={{
            duration: 4,
            delay: 0.5 + i * 0.15,
            repeat: Infinity,
            repeatDelay: 1.5,
            ease: "easeOut",
          }}
          className="absolute rounded-full"
          style={{
            width: `${3 + (i % 4)}px`,
            height: `${3 + (i % 4)}px`,
            background: `radial-gradient(circle, hsl(43, 74%, ${70 + (i % 20)}%) 0%, hsl(43, 74%, 49%) 100%)`,
            left: `${5 + (i * 4.5)}%`,
            bottom: "15%",
            boxShadow: `0 0 ${6 + (i % 4)}px hsl(43, 74%, 49%)`,
          }}
        />
      ))}

      {/* Extra sparkle stars floating */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={`star-${i}`}
          initial={{ opacity: 0, scale: 0, rotate: 0 }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 3,
            delay: 1 + i * 0.4,
            repeat: Infinity,
            repeatDelay: 2,
          }}
          className="absolute"
          style={{
            left: `${10 + (i * 11)}%`,
            top: `${20 + (i % 3) * 20}%`,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24">
            <path
              d="M12 0L13 9L22 10L13 11L12 20L11 11L2 10L11 9L12 0Z"
              fill="hsl(43, 74%, 70%)"
              style={{ filter: "drop-shadow(0 0 4px hsl(43, 74%, 60%))" }}
            />
          </svg>
        </motion.div>
      ))}

      <div className="relative z-10 p-6 md:p-8 text-center space-y-4">
        {/* Full Brand Logo with golden effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
          className="flex justify-center"
        >
          <div className="relative">
            {/* Glowing backdrop */}
            <motion.div
              animate={{ 
                opacity: [0.4, 0.7, 0.4],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 flex justify-center items-center -z-10"
            >
              <div 
                className="w-32 h-32 md:w-48 md:h-48 rounded-full blur-3xl" 
                style={{ background: "radial-gradient(circle, hsl(43, 74%, 49%, 0.5) 0%, hsl(43, 74%, 49%, 0.2) 50%, transparent 70%)" }}
              />
            </motion.div>

            {/* Sparkle effects around logo */}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <motion.div
                key={angle}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0.5, 1.2, 0.5],
                }}
                transition={{ 
                  duration: 2, 
                  delay: 0.5 + i * 0.3, 
                  repeat: Infinity,
                  repeatDelay: 1.5,
                }}
                className="absolute w-2 h-2"
                style={{
                  left: `calc(50% + ${Math.cos(angle * Math.PI / 180) * 60}px)`,
                  top: `calc(50% + ${Math.sin(angle * Math.PI / 180) * 45}px)`,
                }}
              >
                <svg viewBox="0 0 24 24" className="w-full h-full">
                  <path
                    d="M12 0L13 9L22 10L13 11L12 20L11 11L2 10L11 9L12 0Z"
                    fill="hsl(43, 74%, 70%)"
                    style={{ filter: "drop-shadow(0 0 3px hsl(43, 74%, 60%))" }}
                  />
                </svg>
              </motion.div>
            ))}

            {/* Logo image - using horizontal gold logo */}
            <motion.img 
              src={logoHorizontal} 
              alt="Abeu-Saleh Catering" 
              className="w-36 h-auto md:w-48 relative z-10"
              animate={{
                filter: [
                  "drop-shadow(0 0 20px hsl(43, 74%, 49%, 0.6))",
                  "drop-shadow(0 0 35px hsl(43, 74%, 49%, 0.9))",
                  "drop-shadow(0 0 20px hsl(43, 74%, 49%, 0.6))",
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>

        {/* Title with golden glow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="font-display font-bold tracking-wider text-center">
            <span 
              className="block text-sm md:text-lg lg:text-xl mb-1"
              style={{ 
                background: "linear-gradient(180deg, hsl(45, 100%, 85%) 0%, hsl(43, 74%, 49%) 50%, hsl(35, 70%, 40%) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
              }}
            >
              YOU BUILT THE WEDDING CAKE OF
            </span>
            <span 
              className="block text-2xl md:text-4xl lg:text-5xl"
              style={{ 
                background: "linear-gradient(180deg, hsl(45, 100%, 90%) 0%, hsl(43, 74%, 49%) 40%, hsl(35, 70%, 40%) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 0 50px hsl(43, 74%, 49%, 0.6)",
                filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.4))",
              }}
            >
              YOUR DREAMS!
            </span>
          </h2>
        </motion.div>
        
        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-sm md:text-base max-w-sm mx-auto"
          style={{ color: "hsl(43, 30%, 75%)" }}
        >
          Your design is unique and spectacular. Don't let someone else take your date.
        </motion.p>

        {/* Decorative divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex items-center justify-center gap-4 py-1"
        >
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-secondary/60" />
          <div className="w-2 h-2 rounded-full bg-secondary/60" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-secondary/60" />
        </motion.div>

        {/* Price Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="py-3"
        >
          <span 
            className="text-sketch block text-xs uppercase tracking-widest mb-1"
            style={{ color: "hsl(43, 30%, 60%)" }}
          >
            Your Investment
          </span>
          <motion.span 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, type: "spring" }}
            className="font-display text-4xl md:text-5xl font-bold block"
            style={{ 
              background: "linear-gradient(180deg, hsl(45, 100%, 90%) 0%, hsl(43, 74%, 49%) 40%, hsl(38, 70%, 45%) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.4))",
            }}
          >
            ${totalPrice.toFixed(0)}
          </motion.span>
        </motion.div>

        {/* CTA Button with pulsing animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <motion.div
            animate={{ 
              scale: [1, 1.03, 1],
              boxShadow: [
                "0 0 30px hsl(43, 74%, 49%, 0.5), 0 10px 40px rgba(0,0,0,0.4)",
                "0 0 50px hsl(43, 74%, 49%, 0.8), 0 15px 50px rgba(0,0,0,0.5)",
                "0 0 30px hsl(43, 74%, 49%, 0.5), 0 10px 40px rgba(0,0,0,0.4)",
              ]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="rounded-xl"
          >
            <Button
              onClick={() => setShowLeadForm(true)}
              className="w-full py-5 font-bold tracking-wide rounded-xl transition-all duration-300 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, hsl(43, 74%, 49%) 0%, hsl(38, 80%, 45%) 50%, hsl(43, 74%, 49%) 100%)",
                color: "hsl(20, 15%, 8%)",
                border: "2px solid hsl(43, 74%, 60%)",
              }}
            >
              <motion.span 
                className="flex items-center justify-center gap-3"
                animate={{ 
                  textShadow: [
                    "0 0 0px transparent",
                    "0 0 10px hsl(43, 74%, 49%, 0.5)",
                    "0 0 0px transparent",
                  ]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <span className="text-lg md:text-xl font-extrabold">
                  YES! I WANT THIS CAKE!
                </span>
              </motion.span>
            </Button>
          </motion.div>
        </motion.div>

        {/* Back button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          onClick={onGoBack}
          className="text-xs transition-colors underline underline-offset-4 mt-2"
          style={{ color: "hsl(43, 20%, 50%)" }}
          onMouseEnter={(e) => e.currentTarget.style.color = "hsl(43, 30%, 70%)"}
          onMouseLeave={(e) => e.currentTarget.style.color = "hsl(43, 20%, 50%)"}
        >
          ← Go back and edit my design
        </motion.button>
      </div>
    </motion.div>
    </>
  );
}
