import { motion } from "framer-motion";
import { Palette, Sparkles, Crown, AlertTriangle } from "lucide-react";
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
  topperOptions,
} from "@/data/menuDatabase";

interface GlobalOptionsPanelProps {
  coatingId: string;
  onCoatingChange: (id: string) => void;
  decorationId: string;
  onDecorationChange: (id: string) => void;
  topperId: string;
  onTopperChange: (id: string) => void;
  floralPalette: string;
  onFloralPaletteChange: (palette: string) => void;
  topperNames: string;
  onTopperNamesChange: (names: string) => void;
}

export function GlobalOptionsPanel({
  coatingId,
  onCoatingChange,
  decorationId,
  onDecorationChange,
  topperId,
  onTopperChange,
  floralPalette,
  onFloralPaletteChange,
  topperNames,
  onTopperNamesChange,
}: GlobalOptionsPanelProps) {
  const selectedDecoration = decorationOptions.find((d) => d.id === decorationId);
  const selectedTopper = topperOptions.find((t) => t.id === topperId);

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

      <h3 className="font-display text-2xl md:text-3xl font-medium text-secondary mb-5 tracking-wide">
        Frosting & Decoration
      </h3>

      {/* Frosting / Coating */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-muted-foreground" />
          <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
            Frosting (Outer Coating)
          </label>
        </div>
        <Select value={coatingId} onValueChange={onCoatingChange}>
          <SelectTrigger className="input-sketch border-0 border-b">
            <SelectValue placeholder="Select frosting" />
          </SelectTrigger>
          <SelectContent>
            {coatingOptions.map((coating) => (
              <SelectItem key={coating.id} value={coating.id}>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-medium">{coating.name}</span>
                  {coating.flatFee > 0 && (
                    <span className="text-xs text-secondary font-medium">
                      +${coating.flatFee}
                    </span>
                  )}
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
          <SelectTrigger className="input-sketch border-0 border-b">
            <SelectValue placeholder="Select decoration" />
          </SelectTrigger>
          <SelectContent>
            {decorationOptions.map((decoration) => (
              <SelectItem key={decoration.id} value={decoration.id}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="font-medium">{decoration.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {decoration.description}
                    </span>
                  </div>
                  {decoration.flatFee > 0 && (
                    <span className="text-xs text-secondary font-medium">
                      +${decoration.flatFee}
                    </span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Floral palette input */}
        {selectedDecoration?.hasPaletteInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="pt-2"
          >
            <Input
              value={floralPalette}
              onChange={(e) => onFloralPaletteChange(e.target.value)}
              placeholder="Color palette (e.g., White/Green, Pink/Blush)"
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
      </div>

      {/* Topper */}
      <div className="space-y-2 mt-8">
        <div className="flex items-center gap-2">
          <Crown className="h-4 w-4 text-muted-foreground" />
          <label className="text-xs font-semibold uppercase tracking-wider text-secondary">
            Cake Topper
          </label>
        </div>
        <Select value={topperId} onValueChange={onTopperChange}>
          <SelectTrigger className="input-sketch border-0 border-b">
            <SelectValue placeholder="Select topper" />
          </SelectTrigger>
          <SelectContent>
            {topperOptions.map((topper) => (
              <SelectItem key={topper.id} value={topper.id}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="font-medium">{topper.name}</span>
                    {topper.description && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        {topper.description}
                      </span>
                    )}
                  </div>
                  {topper.price > 0 && (
                    <span className="text-xs text-secondary font-medium">
                      +${topper.price}
                    </span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Custom names input */}
        {selectedTopper?.hasNameInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="pt-2"
          >
            <Input
              value={topperNames}
              onChange={(e) => onTopperNamesChange(e.target.value)}
              placeholder="e.g., Jennifer & Matthew"
              className="input-sketch"
              maxLength={50}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Enter both names as you'd like them printed
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
