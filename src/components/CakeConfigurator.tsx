import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Instagram, Facebook, Layers, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CakeSVG } from "./CakeSVG";
import { DynamicTierManager } from "./DynamicTierManager";
import { TierConfigPanel } from "./TierConfigPanel";
import { LeadForm } from "./LeadForm";
import { SuccessScreen } from "./SuccessScreen";
import { GlobalOptionsPanel } from "./GlobalOptionsPanel";
import { ConfettiCelebration } from "./ConfettiCelebration";
import { StickyPriceBar } from "./StickyPriceBar";
import { PersonalizeDesignPanel } from "./PersonalizeDesignPanel";
import { CelebrationCheckout } from "./CelebrationCheckout";
import logoAmarillo from "@/assets/logo-amarillo.png";
import {
  TierConfiguration,
  TierStructure,
  CakeStructure,
  calculateTotalPrice,
  coatingOptions,
  decorationOptions,
  topperOptions,
  spongeOptions,
  fillingOptions,
  getTierLabel,
  getServingsForTier,
  calculateTotalServings,
  appConfig,
  getSeparatorPrice,
} from "@/data/menuDatabase";
import { calculateDecorationTotal } from "@/data/decorationOptions";

type View = "configurator" | "form" | "success";

const defaultTierConfig: TierConfiguration = {
  spongeId: spongeOptions[0].id,
  dietaryId: "none",
  fillingId: fillingOptions[0].id,
  shape: "round",
  hasSeparatorAbove: false,
};

// Default initial tiers for a 2-tier cake
const getInitialTiers = (): TierStructure[] => [
  { tierLevel: 1, sizeInches: 10, servings: 30, height: 55 },
  { tierLevel: 2, sizeInches: 6, servings: 8, height: 45 },
];

const getInitialTierConfigs = (): TierConfiguration[] => [
  { ...defaultTierConfig, customSizeInches: 10 },
  { ...defaultTierConfig, customSizeInches: 6 },
];

export function CakeConfigurator() {
  const [guestCount, setGuestCount] = useState(50);
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  
  // Dynamic tiers state
  const [dynamicTiers, setDynamicTiers] = useState<TierStructure[]>(getInitialTiers());
  const [tierConfigs, setTierConfigs] = useState<TierConfiguration[]>(getInitialTierConfigs());
  
  const [coatingId, setCoatingId] = useState(coatingOptions[0].id);
  const [decorationId, setDecorationId] = useState(decorationOptions[0].id);
  const [topperId, setTopperId] = useState(topperOptions[0].id);
  const [floralPalette, setFloralPalette] = useState("");
  const [fondantPalette, setFondantPalette] = useState("");
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
  
  // Create a dynamic structure from the current tiers
  const structure: CakeStructure = useMemo(() => {
    const totalServings = dynamicTiers.reduce((sum, tier, index) => {
      const config = tierConfigs[index];
      const size = config?.customSizeInches || tier.sizeInches;
      const shape = config?.shape || "round";
      return sum + getServingsForTier(size, shape);
    }, 0);
    
    const basePrice = totalServings * appConfig.pricingBase.basePricePerServing;
    
    return {
      id: "dynamic",
      name: dynamicTiers.length === 1 ? "Single Tier" : `${dynamicTiers.length}-Tier Cake`,
      description: "Custom designed cake",
      tierCount: dynamicTiers.length,
      tiers: dynamicTiers,
      totalServings,
      basePrice,
    };
  }, [dynamicTiers, tierConfigs]);

  // Handle tier changes from DynamicTierManager
  const handleTiersChange = useCallback((newTiers: TierStructure[], newConfigs: TierConfiguration[]) => {
    setDynamicTiers(newTiers);
    setTierConfigs(newConfigs);
    // Deselect if selected tier no longer exists
    if (selectedTier && selectedTier > newTiers.length) {
      setSelectedTier(null);
    }
  }, [selectedTier]);

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
  
  // Calculate dynamic total servings based on tier shapes
  const totalServings = useMemo(
    () => calculateTotalServings(structure, tierConfigs.slice(0, structure.tierCount)),
    [structure, tierConfigs]
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
      // Apply to all tiers that exist
      setTierConfigs(prev => prev.map(() => ({ ...currentConfig })));
    }
  }, [selectedTier, tierConfigs, structure.tiers]);

  const handleReset = useCallback(() => {
    // Reset to initial 2-tier cake
    setSelectedTier(null);
    setDynamicTiers(getInitialTiers());
    setTierConfigs(getInitialTierConfigs());
    setCoatingId(coatingOptions[0].id);
    setDecorationId(decorationOptions[0].id);
    setTopperId(topperOptions[0].id);
    setFloralPalette("");
    setFondantPalette("");
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
            Wedding Cake Builder
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
                {totalServings} servings
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

        {/* Configurator Grid - Fixed left column, scrollable right */}
        <div className="grid gap-8 lg:grid-cols-[1fr,1fr] lg:gap-12">
          {/* Left: SVG Cake - Fixed position on desktop */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative order-2 lg:order-1 lg:sticky lg:top-20 lg:self-start flex flex-col items-center"
          >
            <CakeSVG
              structure={structure}
              selectedTier={selectedTier}
              onTierSelect={handleTierSelect}
              tierConfigs={tierConfigs}
              selectedDecorations={selectedDecorations}
              totalServings={totalServings}
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
                  {/* Dynamic Tier Manager */}
                  <DynamicTierManager
                    guestCount={guestCount}
                    onGuestCountChange={setGuestCount}
                    tiers={dynamicTiers}
                    tierConfigs={tierConfigs}
                    onTiersChange={handleTiersChange}
                    onTierSelect={handleTierSelect}
                    selectedTier={selectedTier}
                    totalServings={totalServings}
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
                        isTopTier={selectedTier === structure.tierCount}
                        allTierConfigs={tierConfigs}
                        allDefaultTierSizes={structure.tiers.map(t => t.sizeInches)}
                      />
                    )}
                  </AnimatePresence>

                  {/* Reset Button */}
                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleReset}
                      className="gap-2 border-secondary/40 text-secondary hover:bg-secondary/10"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Reset to Default
                    </Button>
                  </div>

                  {/* Global Options */}
                  <GlobalOptionsPanel
                    coatingId={coatingId}
                    onCoatingChange={setCoatingId}
                    decorationId={decorationId}
                    onDecorationChange={setDecorationId}
                    floralPalette={floralPalette}
                    onFloralPaletteChange={setFloralPalette}
                    fondantPalette={fondantPalette}
                    onFondantPaletteChange={setFondantPalette}
                  />

                  {/* Personalize Design Panel - Inline */}
                  <PersonalizeDesignPanel
                    referenceImages={referenceImages}
                    onReferenceImagesChange={setReferenceImages}
                    selectedDecorations={selectedDecorations}
                    onDecorationsChange={setSelectedDecorations}
                    customInputs={decorationCustomInputs}
                    onCustomInputChange={handleDecorationCustomInputChange}
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
                    <Button
                      onClick={() => setIsReadyToOrder(true)}
                      className="w-full text-base md:text-lg py-6 bg-foreground text-background hover:bg-foreground/90 font-semibold tracking-wide"
                    >
                      ✨ I'm Ready to Order My Cake! ✨
                    </Button>

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
            src={logoAmarillo} 
            alt="Abeu-Saleh Catering & Events" 
            className="h-8 w-auto mix-blend-multiply dark:mix-blend-screen dark:invert"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          />
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} All designs require minimum 28 days lead time.
          </p>
          <div className="flex items-center gap-3">
            <a 
              href="https://www.instagram.com/catering.abeusaleh/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a 
              href="https://www.facebook.com/Catering.AbeuSaleh"
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
