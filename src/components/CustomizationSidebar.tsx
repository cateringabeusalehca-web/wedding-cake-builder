import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Camera, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReferencePhotoUpload } from "./ReferencePhotoUpload";
import { AdvancedDecorationPanel } from "./AdvancedDecorationPanel";
import { calculateDecorationTotal } from "@/data/decorationOptions";

interface CustomizationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  referenceImages: string[];
  onReferenceImagesChange: (images: string[]) => void;
  selectedDecorations: string[];
  onDecorationsChange: (decorations: string[]) => void;
  customInputs: Record<string, string>;
  onCustomInputChange: (decorationId: string, value: string) => void;
  selectedColorPalette: string | null;
  onColorPaletteChange: (paletteId: string | null) => void;
  eventTheme: string;
  onEventThemeChange: (theme: string) => void;
  eventStyle: string;
  onEventStyleChange: (style: string) => void;
  tierCount: number;
  basePrice: number;
}

export function CustomizationSidebar({
  isOpen,
  onClose,
  referenceImages,
  onReferenceImagesChange,
  selectedDecorations,
  onDecorationsChange,
  customInputs,
  onCustomInputChange,
  selectedColorPalette,
  onColorPaletteChange,
  eventTheme,
  onEventThemeChange,
  eventStyle,
  onEventStyleChange,
  tierCount,
  basePrice,
}: CustomizationSidebarProps) {
  const decorationTotal = calculateDecorationTotal(
    selectedDecorations,
    customInputs,
    tierCount
  );
  const grandTotal = basePrice + decorationTotal;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Sidebar Panel */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background border-l border-border shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-card/50">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-secondary" />
                <h2 className="font-display text-xl font-medium text-foreground">
                  Personaliza tu Diseño
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Reference Photos Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Camera className="h-4 w-4 text-secondary" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary">
                    Fotos de Referencia
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  Sube hasta 5 fotos de Pinterest o inspiración para ayudarnos a entender tu visión.
                </p>
                <ReferencePhotoUpload
                  images={referenceImages}
                  onImagesChange={onReferenceImagesChange}
                  maxImages={5}
                />
              </motion.div>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-border" />
                <Palette className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Decorations Section - Now only toppers + theme/style */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-secondary" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary">
                    Detalles del Evento
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  Cuéntanos sobre tu evento y selecciona un topper personalizado.
                </p>
                <AdvancedDecorationPanel
                  selectedDecorations={selectedDecorations}
                  onDecorationsChange={onDecorationsChange}
                  customInputs={customInputs}
                  onCustomInputChange={onCustomInputChange}
                  selectedColorPalette={selectedColorPalette}
                  onColorPaletteChange={onColorPaletteChange}
                  eventTheme={eventTheme}
                  onEventThemeChange={onEventThemeChange}
                  eventStyle={eventStyle}
                  onEventStyleChange={onEventStyleChange}
                  tierCount={tierCount}
                />
              </motion.div>
            </div>

            {/* Sticky Footer with Price Summary */}
            <div className="border-t border-border bg-card/80 backdrop-blur-sm p-4 space-y-3">
              {/* Price Breakdown */}
              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Precio base de la torta</span>
                  <span>${basePrice.toFixed(0)}</span>
                </div>
                {decorationTotal > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex justify-between text-muted-foreground"
                  >
                    <span>Toppers personalizados ({selectedDecorations.length})</span>
                    <span className="text-secondary">+${decorationTotal.toFixed(0)}</span>
                  </motion.div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                  <span>Total Actualizado</span>
                  <motion.span
                    key={grandTotal}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    className="text-secondary"
                  >
                    ${grandTotal.toFixed(0)}
                  </motion.span>
                </div>
              </div>

              {/* Apply Button */}
              <Button
                onClick={onClose}
                className="btn-gold w-full"
              >
                Aplicar Personalizaciones
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
