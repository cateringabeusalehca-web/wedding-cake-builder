import { motion } from "framer-motion";
import { Palette, Sparkles, AlertTriangle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  coatingOptions,
  decorationOptions,
} from "@/data/menuDatabase";

interface GlobalOptionsPanelProps {
  coatingId: string;
  onCoatingChange: (id: string) => void;
  decorationId: string;
  onDecorationChange: (id: string) => void;
  floralPalette: string;
  onFloralPaletteChange: (palette: string) => void;
  fondantPalette: string;
  onFondantPaletteChange: (palette: string) => void;
}

export function GlobalOptionsPanel({
  coatingId,
  onCoatingChange,
  decorationId,
  onDecorationChange,
  floralPalette,
  onFloralPaletteChange,
  fondantPalette,
  onFondantPaletteChange,
}: GlobalOptionsPanelProps) {
  const selectedDecoration = decorationOptions.find((d) => d.id === decorationId);
  const isChocolateCoating = coatingId === "coat_choc_ganache" || coatingId === "coat_wht_choc";
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="relative overflow-hidden rounded-lg border-2 border-secondary/30 bg-gradient-to-br from-card via-card to-secondary/5 p-6 shadow-lg"
    >
      {/* Decorative corner accents */}
      <div className="absolute top-0 left-0 h-4 w-4 border-t-2 border-l-2 border-secondary/50" />
      <div className="absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2 border-secondary/50" />
      <div className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-secondary/50" />
      <div className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-secondary/50" />

      <h2 className="font-display text-2xl md:text-3xl font-medium text-secondary mb-5 tracking-wide flex items-center gap-2">
        <Sparkles className="h-6 w-6" />
        Frosting & Decoration
      </h2>

      {/* Frosting / Coating */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-muted-foreground" />
          <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
            Frosting (Outer Coating)
          </label>
        </div>
        <Select value={coatingId} onValueChange={onCoatingChange}>
          <SelectTrigger className="input-sketch border-0 border-b" aria-label="Select frosting type">
            <SelectValue placeholder="Select frosting" />
          </SelectTrigger>
          <SelectContent className="bg-background border-border z-50">
            {/* Included options first */}
            {coatingOptions.filter(c => c.flatFee === 0).map((coating) => (
              <SelectItem key={coating.id} value={coating.id}>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{coating.name}</span>
                  <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">
                    Included
                  </span>
                </div>
              </SelectItem>
            ))}
            
            {/* Premium separator */}
            {coatingOptions.some(c => c.flatFee > 0) && (
              <div className="flex items-center gap-2 px-2 py-2 border-t border-border mt-1">
                <div className="h-px flex-1 bg-secondary/30" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-secondary">
                  Premium
                </span>
                <div className="h-px flex-1 bg-secondary/30" />
              </div>
            )}
            
            {/* Premium options */}
            {coatingOptions.filter(c => c.flatFee > 0).map((coating) => (
              <SelectItem key={coating.id} value={coating.id}>
                <div className="flex items-center gap-3">
                  <span className="font-medium">{coating.name}</span>
                  <span className="text-[10px] bg-secondary/20 text-secondary px-1.5 py-0.5 rounded-full font-medium">
                    +${coating.flatFee}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Decoration */}
      <div className="space-y-2 mt-8">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
          <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
            Decoration & Florals
          </label>
        </div>
        <Select value={decorationId} onValueChange={onDecorationChange}>
          <SelectTrigger className="input-sketch border-0 border-b" aria-label="Select decoration and florals">
            <SelectValue placeholder="Select decoration" />
          </SelectTrigger>
          <SelectContent className="bg-background border-border z-50">
            {/* Included options first */}
            {decorationOptions.filter(d => d.flatFee === 0).map((decoration) => (
              <SelectItem key={decoration.id} value={decoration.id}>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{decoration.name}</span>
                    <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">
                      Included
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {decoration.description}
                  </span>
                </div>
              </SelectItem>
            ))}
            
            {/* Premium separator */}
            {decorationOptions.some(d => d.flatFee > 0) && (
              <div className="flex items-center gap-2 px-2 py-2 border-t border-border mt-1">
                <div className="h-px flex-1 bg-secondary/30" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-secondary">
                  Premium
                </span>
                <div className="h-px flex-1 bg-secondary/30" />
              </div>
            )}
            
            {/* Premium options */}
            {decorationOptions.filter(d => d.flatFee > 0).map((decoration) => (
              <SelectItem key={decoration.id} value={decoration.id}>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{decoration.name}</span>
                    <span className="text-[10px] bg-secondary/20 text-secondary px-1.5 py-0.5 rounded-full font-medium">
                      +${decoration.flatFee}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {decoration.description}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Floral/Fruit palette input */}
        {selectedDecoration?.hasFloralPaletteInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="pt-2"
          >
            <Input
              value={floralPalette}
              onChange={(e) => onFloralPaletteChange(e.target.value)}
              placeholder="Flower/Fruit colors (e.g., White/Green, Pink/Blush)"
              className="input-sketch"
            />
            <div className="mt-3 flex items-start gap-2 bg-muted/30 p-3 rounded">
              <AlertTriangle className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                Fresh flowers and fruits are subject to seasonal availability. 
                We will match your color palette, but specific varieties cannot be guaranteed.
              </p>
            </div>
          </motion.div>
        )}

        {/* Fondant palette input - only if not chocolate coating */}
        {selectedDecoration?.hasFondantPaletteInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="pt-2"
          >
            {isChocolateCoating ? (
              <div className="flex items-start gap-2 bg-muted/30 p-3 rounded">
                <AlertTriangle className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  Fondant colors are not available with chocolate coating. 
                  Consider switching to buttercream for colored fondant decorations.
                </p>
              </div>
            ) : (
              <>
                <Input
                  value={fondantPalette}
                  onChange={(e) => onFondantPaletteChange(e.target.value)}
                  placeholder="Fondant colors (e.g., White/Gold, Pastel Blue/Pink)"
                  className="input-sketch"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Specify the colors for your fondant decorations.
                </p>
              </>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
