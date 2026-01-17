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
  outerFinishes,
  decorationOptions,
  topperOptions,
} from "@/data/menuDatabase";

interface GlobalOptionsPanelProps {
  finishId: string;
  onFinishChange: (id: string) => void;
  decorationId: string;
  onDecorationChange: (id: string) => void;
  topperId: string;
  onTopperChange: (id: string) => void;
  floralPalette: string;
  onFloralPaletteChange: (palette: string) => void;
}

export function GlobalOptionsPanel({
  finishId,
  onFinishChange,
  decorationId,
  onDecorationChange,
  topperId,
  onTopperChange,
  floralPalette,
  onFloralPaletteChange,
}: GlobalOptionsPanelProps) {
  const selectedDecoration = decorationOptions.find((d) => d.id === decorationId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="card-architectural space-y-5"
    >
      <h3 className="heading-editorial text-xl">Finish & Decoration</h3>

      {/* Outer Finish */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-muted-foreground" />
          <label className="text-sketch text-muted-foreground">
            Outer Finish
          </label>
        </div>
        <Select value={finishId} onValueChange={onFinishChange}>
          <SelectTrigger className="input-sketch border-0 border-b">
            <SelectValue placeholder="Select finish" />
          </SelectTrigger>
          <SelectContent>
            {outerFinishes.map((finish) => (
              <SelectItem key={finish.id} value={finish.id}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="font-medium">{finish.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {finish.description}
                    </span>
                  </div>
                  {finish.flatFee > 0 && (
                    <span className="text-xs text-secondary font-medium">
                      +${finish.flatFee}
                    </span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Decoration */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
          <label className="text-sketch text-muted-foreground">
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
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Crown className="h-4 w-4 text-muted-foreground" />
          <label className="text-sketch text-muted-foreground">
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
      </div>
    </motion.div>
  );
}
