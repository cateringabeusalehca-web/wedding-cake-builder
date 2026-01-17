import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cake, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CakeSVG } from "./CakeSVG";
import { GuestSlider } from "./GuestSlider";
import { TierConfigPanel } from "./TierConfigPanel";
import { LeadForm } from "./LeadForm";
import { SuccessScreen } from "./SuccessScreen";
import { GlobalOptionsPanel } from "./GlobalOptionsPanel";
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
  const [currentView, setCurrentView] = useState<View>("configurator");

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
          <div className="flex items-center gap-3">
            <Cake className="h-5 w-5 text-secondary" />
            <span className="font-display text-lg tracking-wide">
              Abeu-Saleh
            </span>
          </div>
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
            Custom Cake / Wedding Cake Builder
          </h1>
          <p className="text-muted-foreground">
            Build your perfect celebration cake, tier by tier
          </p>
        </motion.div>

        {/* Price Display */}
        <motion.div
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
          {/* Left: SVG Cake */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative order-2 lg:order-1"
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
                  className="card-architectural space-y-4"
                >
                  <h3 className="heading-editorial text-xl">Your Tiers</h3>
                  <div className="space-y-2">
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
                          className="flex w-full items-center justify-between border-b border-border/50 py-3 text-left transition-colors hover:bg-muted/30"
                        >
                          <div>
                            <span className="text-sketch text-muted-foreground block">
                              {getTierLabel(tier.tierLevel, structure.tierCount)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {tier.sizeInches}" • {tier.servings} servings
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm block">
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
            />

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4 pt-4"
            >
              <Button
                onClick={() => setCurrentView("form")}
                className="btn-gold w-full"
              >
                Confirm Design & Request Quote
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
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-border py-8">
        <div className="container px-4 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Catering Abeu-Saleh. All designs
            require minimum 28 days lead time.
          </p>
        </div>
      </footer>
    </div>
  );
}
