import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cake, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CakeSVG } from "./CakeSVG";
import { GuestSlider } from "./GuestSlider";
import { TierConfigPanel, TierConfig } from "./TierConfigPanel";
import { LeadForm } from "./LeadForm";
import { SuccessScreen } from "./SuccessScreen";
import { calculateTiers, dietaryCategories } from "@/data/menuDatabase";

type View = "configurator" | "form" | "success";

const defaultTierConfig: TierConfig = {
  dietaryId: dietaryCategories[0].id,
  flavorId: dietaryCategories[0].allowedFlavors[0],
  fillingId: dietaryCategories[0].allowedFillings[0],
};

export function CakeConfigurator() {
  const [guestCount, setGuestCount] = useState(50);
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [tierConfigs, setTierConfigs] = useState<TierConfig[]>([
    { ...defaultTierConfig },
    { ...defaultTierConfig },
    { ...defaultTierConfig },
    { ...defaultTierConfig },
  ]);
  const [currentView, setCurrentView] = useState<View>("configurator");

  const tierCount = calculateTiers(guestCount);

  const handleTierSelect = useCallback((tier: number) => {
    setSelectedTier((prev) => (prev === tier ? null : tier));
  }, []);

  const handleTierConfigChange = useCallback(
    (config: TierConfig) => {
      if (selectedTier === null) return;
      setTierConfigs((prev) => {
        const next = [...prev];
        next[selectedTier - 1] = config;
        return next;
      });
    },
    [selectedTier]
  );

  const handleApplyToAll = useCallback(() => {
    if (selectedTier === null) return;
    const currentConfig = tierConfigs[selectedTier - 1];
    setTierConfigs(Array(4).fill({ ...currentConfig }));
  }, [selectedTier, tierConfigs]);

  const handleReset = useCallback(() => {
    setGuestCount(50);
    setSelectedTier(null);
    setTierConfigs([
      { ...defaultTierConfig },
      { ...defaultTierConfig },
      { ...defaultTierConfig },
      { ...defaultTierConfig },
    ]);
    setCurrentView("configurator");
  }, []);

  // Success screen
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
            tierCount={tierCount}
            tierConfigs={tierConfigs.slice(0, tierCount)}
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
          className="mb-12 text-center"
        >
          <h1 className="heading-display mb-3">Design Your Masterpiece</h1>
          <p className="text-muted-foreground">
            Craft your perfect celebration cake with our architectural studio
          </p>
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
              tierCount={tierCount}
              selectedTier={selectedTier}
              onTierSelect={handleTierSelect}
            />

            {/* Hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-4 text-center text-xs text-muted-foreground"
            >
              Click on a tier to customize its flavor
            </motion.p>
          </motion.div>

          {/* Right: Controls */}
          <div className="order-1 space-y-8 lg:order-2">
            {/* Guest Slider */}
            <GuestSlider
              value={guestCount}
              onChange={setGuestCount}
              tierCount={tierCount}
            />

            {/* Tier Config Panel */}
            <AnimatePresence mode="wait">
              {selectedTier && (
                <TierConfigPanel
                  key={selectedTier}
                  tierNumber={selectedTier}
                  config={tierConfigs[selectedTier - 1]}
                  onConfigChange={handleTierConfigChange}
                  onApplyToAll={handleApplyToAll}
                  onClose={() => setSelectedTier(null)}
                  totalTiers={tierCount}
                />
              )}
            </AnimatePresence>

            {/* No tier selected - show summary */}
            <AnimatePresence>
              {!selectedTier && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="card-architectural space-y-4"
                >
                  <h3 className="heading-editorial text-xl">Your Design</h3>
                  <div className="space-y-2">
                    {Array.from({ length: tierCount }, (_, i) => i + 1).map(
                      (tier) => {
                        const config = tierConfigs[tier - 1];
                        return (
                          <button
                            key={tier}
                            onClick={() => handleTierSelect(tier)}
                            className="flex w-full items-center justify-between border-b border-border/50 py-2 text-left transition-colors hover:bg-muted/30"
                          >
                            <span className="text-sketch text-muted-foreground">
                              Tier {tier}
                            </span>
                            <span className="text-sm">
                              {config.flavorId
                                ? config.flavorId.replace(/_/g, " ")
                                : "Configure →"}
                            </span>
                          </button>
                        );
                      }
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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
                <Button variant="outline" className="btn-architectural w-full gap-2">
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
            require minimum 30 days lead time.
          </p>
        </div>
      </footer>
    </div>
  );
}
