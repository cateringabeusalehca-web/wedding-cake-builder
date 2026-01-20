import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cake, ExternalLink, Sparkles, Instagram, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CakeSVG } from "./CakeSVG";
import { GuestSlider } from "./GuestSlider";
import { TierConfigPanel } from "./TierConfigPanel";
import { LeadForm } from "./LeadForm";
import { SuccessScreen } from "./SuccessScreen";
import { GlobalOptionsPanel } from "./GlobalOptionsPanel";
import { ConfettiCelebration } from "./ConfettiCelebration";
import { StickyPriceBar } from "./StickyPriceBar";
import { BrandLogoShape, BrandCornerDecor, BrandAccent } from "./BrandLogoShape";
import logoAbeusaleh from "@/assets/logo-abeusaleh.png";
import logoHorizontal from "@/assets/logo-horizontal.png";
import logoAmarillo from "@/assets/logo-amarillo.png";
import {
  getRecommendedStructure,
  TierConfiguration,
  calculateTotalPrice,
  coatingOptions,
  decorationOptions,
  topperOptions,
  spongeOptions,
  fillingOptions,
  getTierLabel,
} from "@/data/menuDatabase";

type View = "configurator" | "form" | "success";

const defaultTierConfig: TierConfiguration = {
  spongeId: spongeOptions[0].id,
  dietaryId: "none",
  fillingId: fillingOptions[0].id,
};

export function CakeConfigurator() {
  const [guestCount, setGuestCount] = useState(50);
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [tierConfigs, setTierConfigs] = useState<TierConfiguration[]>([
    { ...defaultTierConfig },
    { ...defaultTierConfig },
    { ...defaultTierConfig },
    { ...defaultTierConfig },
  ]);
  const [coatingId, setCoatingId] = useState(coatingOptions[0].id);
  const [decorationId, setDecorationId] = useState(decorationOptions[0].id);
  const [topperId, setTopperId] = useState(topperOptions[0].id);
  const [floralPalette, setFloralPalette] = useState("");
  const [topperNames, setTopperNames] = useState("");
  const [currentView, setCurrentView] = useState<View>("configurator");
  const [isReadyToOrder, setIsReadyToOrder] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const priceDisplayRef = useRef<HTMLDivElement>(null);

  const structure = useMemo(() => getRecommendedStructure(guestCount), [guestCount]);

  const totalPrice = useMemo(
    () =>
      calculateTotalPrice(
        structure,
        tierConfigs.slice(0, structure.tierCount),
        coatingId,
        decorationId,
        topperId
      ),
    [structure, tierConfigs, coatingId, decorationId, topperId]
  );

  const handleTierSelect = useCallback((tier: number) => {
    setSelectedTier((prev) => (prev === tier ? null : tier));
  }, []);

  const handleTierConfigChange = useCallback(
    (config: TierConfiguration) => {
      if (selectedTier === null) return;
      setTierConfigs((prev) => {
        const next = [...prev];
        const tierIndex = structure.tiers.findIndex(t => t.tierLevel === selectedTier);
        if (tierIndex !== -1) {
          next[tierIndex] = config;
        }
        return next;
      });
    },
    [selectedTier, structure.tiers]
  );

  const handleApplyToAll = useCallback(() => {
    if (selectedTier === null) return;
    const tierIndex = structure.tiers.findIndex(t => t.tierLevel === selectedTier);
    if (tierIndex !== -1) {
      const currentConfig = tierConfigs[tierIndex];
      setTierConfigs(Array(4).fill({ ...currentConfig }));
    }
  }, [selectedTier, tierConfigs, structure.tiers]);

  const handleReset = useCallback(() => {
    setGuestCount(50);
    setSelectedTier(null);
    setTierConfigs([
      { ...defaultTierConfig },
      { ...defaultTierConfig },
      { ...defaultTierConfig },
      { ...defaultTierConfig },
    ]);
    setCoatingId(coatingOptions[0].id);
    setDecorationId(decorationOptions[0].id);
    setTopperId(topperOptions[0].id);
    setFloralPalette("");
    setCurrentView("configurator");
  }, []);

  // Intersection observer to show sticky bar when price display scrolls out of view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyBar(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-80px 0px 0px 0px" }
    );

    if (priceDisplayRef.current) {
      observer.observe(priceDisplayRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const selectedTierInfo = selectedTier
    ? structure.tiers.find((t) => t.tierLevel === selectedTier)
    : null;
  const selectedTierIndex = selectedTier
    ? structure.tiers.findIndex((t) => t.tierLevel === selectedTier)
    : -1;

  if (currentView === "success") {
    return <SuccessScreen onReset={handleReset} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Price Bar */}
      <StickyPriceBar
        guestCount={guestCount}
        eventName={structure.name}
        totalServings={structure.totalServings}
        totalPrice={totalPrice}
        isVisible={showStickyBar}
      />
      {/* Lead Form Modal */}
      <AnimatePresence>
        {currentView === "form" && (
          <LeadForm
            guestCount={guestCount}
            structure={structure}
            tierConfigs={tierConfigs.slice(0, structure.tierCount)}
            coatingId={coatingId}
            decorationId={decorationId}
            topperId={topperId}
            floralPalette={floralPalette}
            totalPrice={totalPrice}
            onClose={() => setCurrentView("configurator")}
            onSuccess={() => setCurrentView("success")}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border bg-background/80 backdrop-blur-sm"
      >
        <div className="container flex h-16 items-center justify-between px-4">
          <motion.img 
            src={logoAmarillo} 
            alt="Abeu-Saleh Catering & Events" 
            className="h-14 md:h-16 w-auto"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          />
          <span className="text-sketch text-muted-foreground hidden sm:block">
            Cake Design Studio
          </span>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container px-4 py-8 md:py-12">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="heading-display mb-2 text-3xl md:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-secondary via-[hsl(43,70%,60%)] to-secondary bg-clip-text text-transparent">
              Wedding Cake
            </span>
            {" "}
            <span className="text-foreground">Builder</span>
          </h1>
          <p className="text-muted-foreground">
            Build your perfect celebration cake, tier by tier
          </p>
        </motion.div>

        {/* Price Display */}
        <motion.div
          ref={priceDisplayRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 flex items-center justify-center"
        >
          <div className="card-architectural inline-flex items-center gap-6 px-8 py-4">
            <div className="text-center">
              <span className="text-sketch text-muted-foreground block">
                {structure.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {structure.totalServings} servings
              </span>
            </div>
            <div className="h-10 w-px bg-border" />
            <div className="text-center">
              <span className="text-sketch text-muted-foreground block">
                Estimated Total
              </span>
              <motion.span
                key={totalPrice}
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="font-display text-3xl text-secondary"
              >
                ${totalPrice.toFixed(0)}
              </motion.span>
            </div>
          </div>
        </motion.div>

        {/* Configurator Grid */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left: SVG Cake - Sticky */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative order-2 lg:order-1 lg:sticky lg:top-4 lg:self-start"
          >
            <CakeSVG
              structure={structure}
              selectedTier={selectedTier}
              onTierSelect={handleTierSelect}
              tierConfigs={tierConfigs}
            />

            {/* Hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-4 text-center text-xs text-muted-foreground"
            >
              Click on a tier to customize Sponge, Filling & Dietary options
            </motion.p>
          </motion.div>

          {/* Right: Controls */}
          <div className="order-1 space-y-6 lg:order-2">
            {/* Guest Slider */}
            <GuestSlider
              value={guestCount}
              onChange={setGuestCount}
              tierCount={structure.tierCount}
            />

            {/* Tier Config Panel */}
            <AnimatePresence mode="wait">
              {selectedTier && selectedTierInfo && selectedTierIndex !== -1 && (
                <TierConfigPanel
                  key={selectedTier}
                  tierNumber={selectedTier}
                  tierInfo={selectedTierInfo}
                  config={tierConfigs[selectedTierIndex]}
                  onConfigChange={handleTierConfigChange}
                  onApplyToAll={handleApplyToAll}
                  onClose={() => setSelectedTier(null)}
                  totalTiers={structure.tierCount}
                />
              )}
            </AnimatePresence>

            {/* No tier selected - show tier summary */}
            <AnimatePresence>
              {!selectedTier && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative overflow-hidden rounded-lg border-2 border-secondary/30 bg-gradient-to-br from-card via-card to-secondary/5 p-6 shadow-lg"
                >
                  {/* Decorative corner accents */}
                  <div className="absolute top-0 left-0 h-4 w-4 border-t-2 border-l-2 border-secondary/50" />
                  <div className="absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2 border-secondary/50" />
                  <div className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-secondary/50" />
                  <div className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-secondary/50" />
                  
                  <h3 className="font-display text-2xl md:text-3xl font-medium text-secondary mb-4 tracking-wide">
                    Your Tiers
                  </h3>
                  <div className="space-y-1">
                    {structure.tiers.map((tier, index) => {
                      const config = tierConfigs[index];
                      const sponge = spongeOptions.find(
                        (s) => s.id === config?.spongeId
                      );
                      const filling = fillingOptions.find(
                        (f) => f.id === config?.fillingId
                      );
                      return (
                        <button
                          key={tier.tierLevel}
                          onClick={() => handleTierSelect(tier.tierLevel)}
                          className="group flex w-full items-center justify-between rounded-md border border-transparent bg-background/50 px-4 py-3 text-left transition-all duration-300 hover:border-secondary/40 hover:bg-secondary/10 hover:shadow-md"
                        >
                          <div>
                            <span className="text-sketch text-foreground block group-hover:text-secondary transition-colors">
                              {getTierLabel(tier.tierLevel, structure.tierCount)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {tier.sizeInches}" • {tier.servings} servings
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm block text-foreground group-hover:text-secondary transition-colors">
                              {sponge?.name || "Configure →"}
                            </span>
                            {filling && (
                              <span className="text-xs text-muted-foreground">
                                {filling.name}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Global Options */}
            <GlobalOptionsPanel
              coatingId={coatingId}
              onCoatingChange={setCoatingId}
              decorationId={decorationId}
              onDecorationChange={setDecorationId}
              topperId={topperId}
              onTopperChange={setTopperId}
              floralPalette={floralPalette}
              onFloralPaletteChange={setFloralPalette}
              topperNames={topperNames}
              onTopperNamesChange={setTopperNames}
            />

            {/* Ready to Order Button */}
            <AnimatePresence>
              {!isReadyToOrder && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-4 pt-4"
                >
                  <Button
                    onClick={() => setIsReadyToOrder(true)}
                    className="btn-gold w-full text-base md:text-lg py-6"
                  >
                    ✨ I'm Ready to Order My Cake! ✨
                  </Button>

                  <a
                    href="https://cateringabeusaleh.ca/product/cake-taster-box/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button
                      variant="outline"
                      className="btn-architectural w-full gap-2"
                    >
                      <span>Not sure? Order a Cake Taster Box</span>
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </a>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Celebration Checkout Section - Royal Awards Ceremony */}
            <AnimatePresence>
              {isReadyToOrder && (
                <>
                  {/* Confetti Animation */}
                  <ConfettiCelebration />
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="relative mt-8 overflow-hidden rounded-3xl shadow-2xl"
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

                    {/* Floating golden particles */}
                    {Array.from({ length: 12 }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ 
                          opacity: [0, 0.8, 0],
                          y: [-10, -40, -70],
                        }}
                        transition={{
                          duration: 3,
                          delay: 1 + i * 0.2,
                          repeat: Infinity,
                          repeatDelay: 2,
                        }}
                        className="absolute w-1 h-1 rounded-full bg-secondary"
                        style={{
                          left: `${10 + (i * 7)}%`,
                          bottom: "20%",
                          boxShadow: "0 0 6px hsl(43, 74%, 49%)",
                        }}
                      />
                    ))}

                    <div className="relative z-10 p-8 md:p-12 text-center space-y-6">
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
                              className="w-48 h-48 md:w-64 md:h-64 rounded-full blur-3xl" 
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
                                left: `calc(50% + ${Math.cos(angle * Math.PI / 180) * 80}px)`,
                                top: `calc(50% + ${Math.sin(angle * Math.PI / 180) * 60}px)`,
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
                            className="w-48 h-auto md:w-72 relative z-10"
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
                            className="block text-lg md:text-2xl lg:text-3xl mb-1"
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
                            className="block text-4xl md:text-6xl lg:text-7xl"
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
                        className="text-lg md:text-xl max-w-lg mx-auto"
                        style={{ color: "hsl(43, 30%, 75%)" }}
                      >
                        Your design is unique and spectacular. Don't let someone else take your date.
                      </motion.p>

                      {/* Decorative divider */}
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                        className="flex items-center justify-center gap-4 py-2"
                      >
                        <div className="h-px w-16 bg-gradient-to-r from-transparent to-secondary/60" />
                        <BrandLogoShape size={24} color="hsl(43, 74%, 49%)" />
                        <div className="h-px w-16 bg-gradient-to-l from-transparent to-secondary/60" />
                      </motion.div>

                      {/* Price Display */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 }}
                        className="py-6"
                      >
                        <span 
                          className="text-sketch block text-base uppercase tracking-widest mb-2"
                          style={{ color: "hsl(43, 30%, 60%)" }}
                        >
                          Your Investment
                        </span>
                        <motion.span 
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 1, type: "spring" }}
                          className="font-display text-5xl md:text-7xl font-bold block"
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
                            onClick={() => {
                              const productId = "PRODUCT_ID";
                              const checkoutUrl = `https://cateringabeusaleh.ca/?add-to-cart=${productId}&custom_price=${totalPrice.toFixed(2)}`;
                              
                              const configData = {
                                guests: guestCount,
                                tiers: structure.tiers.map((tier, index) => {
                                  const config = tierConfigs[index];
                                  return {
                                    tier: tier.tierLevel,
                                    size: tier.sizeInches,
                                    servings: tier.servings,
                                    sponge: spongeOptions.find(s => s.id === config?.spongeId)?.name,
                                    filling: fillingOptions.find(f => f.id === config?.fillingId)?.name,
                                  };
                                }),
                                coating: coatingOptions.find(c => c.id === coatingId)?.name,
                                decoration: decorationOptions.find(d => d.id === decorationId)?.name,
                                topper: topperOptions.find(t => t.id === topperId)?.name,
                                topperNames: topperNames || null,
                                floralPalette: floralPalette || null,
                                totalPrice: totalPrice,
                              };
                              console.log("Wedding Cake Configuration:", JSON.stringify(configData, null, 2));
                              
                              window.open(checkoutUrl, "_blank");
                            }}
                            className="w-full py-6 font-bold tracking-wide rounded-xl transition-all duration-300 hover:scale-105"
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
                              <span className="text-2xl md:text-3xl font-extrabold">
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
                        onClick={() => setIsReadyToOrder(false)}
                        className="text-sm transition-colors underline underline-offset-4 mt-4"
                        style={{ color: "hsl(43, 20%, 50%)" }}
                        onMouseEnter={(e) => e.currentTarget.style.color = "hsl(43, 30%, 70%)"}
                        onMouseLeave={(e) => e.currentTarget.style.color = "hsl(43, 20%, 50%)"}
                      >
                        ← Go back and edit my design
                      </motion.button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-border py-4">
        <div className="container px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <motion.img 
            src={logoHorizontal} 
            alt="Abeu-Saleh Catering & Events" 
            className="h-8 w-auto"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          />
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} All designs require minimum 28 days lead time.
          </p>
          <div className="flex items-center gap-3">
            <a 
              href="https://www.instagram.com/abeusalehcatering/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a 
              href="https://www.facebook.com/abeusalehcatering/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
