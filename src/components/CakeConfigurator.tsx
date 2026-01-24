import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Instagram, Facebook, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CakeSVG } from "./CakeSVG";
import { GuestSlider } from "./GuestSlider";
import { TierConfigPanel } from "./TierConfigPanel";
import { LeadForm } from "./LeadForm";
import { SuccessScreen } from "./SuccessScreen";
import { GlobalOptionsPanel } from "./GlobalOptionsPanel";
import { ConfettiCelebration } from "./ConfettiCelebration";
import { StickyPriceBar } from "./StickyPriceBar";
import { PersonalizeDesignPanel } from "./PersonalizeDesignPanel";
import { CelebrationCheckout } from "./CelebrationCheckout";
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
import { calculateDecorationTotal } from "@/data/decorationOptions";

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
  
  // Personalization state
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const [selectedDecorations, setSelectedDecorations] = useState<string[]>([]);
  const [decorationCustomInputs, setDecorationCustomInputs] = useState<Record<string, string>>({});
  const [selectedColorPalette, setSelectedColorPalette] = useState<string | null>(null);
  const [eventTheme, setEventTheme] = useState("");
  const [eventStyle, setEventStyle] = useState("");

  const structure = useMemo(() => getRecommendedStructure(guestCount), [guestCount]);

  const basePrice = useMemo(
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

  const decorationTotal = useMemo(
    () => calculateDecorationTotal(selectedDecorations, decorationCustomInputs, structure.tierCount),
    [selectedDecorations, decorationCustomInputs, structure.tierCount]
  );

  const totalPrice = basePrice + decorationTotal;

  const handleDecorationCustomInputChange = useCallback((decorationId: string, value: string) => {
    setDecorationCustomInputs((prev) => ({ ...prev, [decorationId]: value }));
  }, []);

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
    setTopperNames("");
    setCurrentView("configurator");
    setIsReadyToOrder(false);
    // Reset personalization state
    setReferenceImages([]);
    setSelectedDecorations([]);
    setDecorationCustomInputs({});
    setSelectedColorPalette(null);
    setEventTheme("");
    setEventStyle("");
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
            referenceImages={referenceImages}
            selectedDecorations={selectedDecorations}
            decorationCustomInputs={decorationCustomInputs}
            selectedColorPalette={selectedColorPalette}
            eventTheme={eventTheme}
            eventStyle={eventStyle}
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
            className="h-14 md:h-16 w-auto mix-blend-multiply dark:mix-blend-screen dark:invert"
            style={{ background: 'transparent' }}
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
              selectedDecorations={selectedDecorations}
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

          <div className="order-1 space-y-6 lg:order-2">
            {/* Configuration Panels - Hidden when ready to order */}
            <AnimatePresence mode="wait">
              {!isReadyToOrder && (
                <motion.div
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
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
                        
                        <h3 className="font-display text-2xl md:text-3xl font-medium text-secondary mb-4 tracking-wide flex items-center gap-2">
                          <Layers className="h-6 w-6" />
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
                    floralPalette={floralPalette}
                    onFloralPaletteChange={setFloralPalette}
                  />

                  {/* Personalize Design Panel - Inline */}
                  <PersonalizeDesignPanel
                    referenceImages={referenceImages}
                    onReferenceImagesChange={setReferenceImages}
                    selectedDecorations={selectedDecorations}
                    onDecorationsChange={setSelectedDecorations}
                    customInputs={decorationCustomInputs}
                    onCustomInputChange={handleDecorationCustomInputChange}
                    selectedColorPalette={selectedColorPalette}
                    onColorPaletteChange={setSelectedColorPalette}
                    eventTheme={eventTheme}
                    onEventThemeChange={setEventTheme}
                    eventStyle={eventStyle}
                    onEventStyleChange={setEventStyle}
                    tierCount={structure.tierCount}
                  />

                  {/* Ready to Order Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-4 pt-4"
                  >
                    <a
                      href="https://cateringabeusaleh.ca/get-a-quote/"
                      className="block"
                    >
                      <Button
                        className="w-full text-base md:text-lg py-6 bg-foreground text-background hover:bg-foreground/90 font-semibold tracking-wide"
                      >
                        ✨ I'm Ready to Order My Cake! ✨
                      </Button>
                    </a>

                    <a
                      href="https://cateringabeusaleh.ca/product/catering-taster-box/"
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
                </motion.div>
              )}
            </AnimatePresence>

            {/* Celebration Checkout Section - Takes over full column */}
            <AnimatePresence>
              {isReadyToOrder && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="min-h-[70vh]"
                >
                  <ConfettiCelebration />
                  <CelebrationCheckout
                    totalPrice={totalPrice}
                    guestCount={guestCount}
                    structure={structure}
                    tierConfigs={tierConfigs}
                    coatingId={coatingId}
                    decorationId={decorationId}
                    topperId={topperId}
                    topperNames={topperNames}
                    floralPalette={floralPalette}
                    onGoBack={() => setIsReadyToOrder(false)}
                  />
                </motion.div>
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
