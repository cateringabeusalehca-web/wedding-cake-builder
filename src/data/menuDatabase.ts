// Menu Database - Single Source of Truth
// Custom Cake / Wedding Cake Builder

export const appConfig = {
  leadTimeDays: 28,
  pricingBase: {
    currency: "CAD",
    basePricePerServing: 6.0,
  },
  dietarySurcharges: {
    GF: 0.5,   // Gluten-Free
    SF: 0.5,   // Sugar-Free
    V: 0.75,  // Vegan
    K: 1.0,   // Keto
    DF: 0.5,  // Dairy-Free
    NF: 0.5,  // Nut-Free
  } as Record<string, number>,
  // Separator RENTAL prices based on diameter and height (even sizes only: 4, 6, 8, 10)
  // These are rental fees, not purchase prices
  acrylicSeparatorRentalPrices: {
    // 5cm height rental prices
    "4-5": 8,
    "6-5": 10,
    "8-5": 14,
    "10-5": 18,
    // 10cm height rental prices
    "4-10": 12,
    "6-10": 15,
    "8-10": 20,
    "10-10": 25,
  } as Record<string, number>,
};

// ============= CAKE SHAPE & SERVINGS =============
export type CakeShape = "round" | "square" | "rectangular";

// Standard portion size for wedding cakes
export const PORTION_WEIGHT_GRAMS = 110; // ~110g per portion (industry standard)
export const PORTION_SIZE_DESCRIPTION = "1\"×2\"×4\" (2.5×5×10 cm)"; // Standard wedding cake portion

// Rectangular cake constraints - flexible dimensions
export const RECTANGULAR_MIN_DIMENSION_CM = 20; // Minimum dimension: 20cm
export const RECTANGULAR_MAX_DIMENSION_CM = 150; // Maximum dimension: 150cm  
export const RECTANGULAR_HEIGHT_CM = 15; // Fixed height: 15cm

// Legacy exports for backwards compatibility
export const RECTANGULAR_WIDTH_OPTIONS = [40, 80] as const;
export const RECTANGULAR_DEFAULT_WIDTH_CM = 40;
export const RECTANGULAR_MIN_LENGTH_CM = 20;
export const RECTANGULAR_MAX_LENGTH_CM = 120;
export const RECTANGULAR_WIDTH_CM = RECTANGULAR_DEFAULT_WIDTH_CM;

// Servings per size based on shape (even sizes only: 4, 6, 8, 10, 12, 14, 16, 18 inches)
// Round cakes yield fewer portions due to geometry
export const servingsPerSize: Record<"round" | "square", Record<number, number>> = {
  round: {
    4: 4,
    6: 8,
    8: 20,
    10: 30,
    12: 44,
    14: 63,
    16: 84,
    18: 110,
  },
  square: {
    4: 8,
    6: 18,
    8: 32,
    10: 50,
    12: 72,
    14: 98,
    16: 128,
    18: 162,
  },
};

// Calculate servings for rectangular cakes
// Based on standard portion: 5cm x 5cm from top view
export function getServingsForRectangular(lengthCm: number, widthCm: number = RECTANGULAR_DEFAULT_WIDTH_CM): number {
  const portionsWide = Math.floor(widthCm / 5);
  const portionsLong = Math.floor(lengthCm / 5);
  return portionsWide * portionsLong;
}

// ============= CAKE STRUCTURES =============
export interface CakeStructure {
  id: string;
  name: string;
  description: string;
  tierCount: number;
  tiers: TierStructure[];
  totalServings: number;
  basePrice: number;
}

export interface TierStructure {
  tierLevel: number;
  sizeInches: number;
  servings: number; // Default servings (round)
  height: number;
}

// Acrylic separator configuration
export type SeparatorShape = "round" | "square";
export type SeparatorHeight = 5 | 10; // cm

export interface SeparatorConfig {
  diameterInches: number;
  heightCm: SeparatorHeight;
  shape: SeparatorShape;
}

// Available separator sizes (even numbers only)
export const availableSeparatorDiameters = [4, 6, 8, 10] as const;
export const availableSeparatorHeights: SeparatorHeight[] = [5, 10];

// Convert inches to cm
export function inchesToCm(inches: number): number {
  return Math.round(inches * 2.54 * 10) / 10;
}

// Convert cm to inches
export function cmToInches(cm: number): number {
  return Math.round(cm / 2.54 * 10) / 10;
}

// Format size with both units (inches first, then cm)
export function formatSizeWithUnits(inches: number): string {
  return `${inches}" (${inchesToCm(inches)} cm)`;
}

// Format cm size with both units (cm first, then inches)
export function formatCmWithUnits(cm: number): string {
  return `${cm} cm (${cmToInches(cm)}")`;
}

// Format rectangular dimensions with both units
export function formatRectangularDimensions(widthCm: number, lengthCm: number): { 
  primary: string; 
  secondary: string;
} {
  const widthIn = cmToInches(widthCm);
  const lengthIn = cmToInches(lengthCm);
  return {
    primary: `${widthCm}×${lengthCm} cm`,
    secondary: `${widthIn}"×${lengthIn}"`,
  };
}

// Enhanced tier configuration with shape, separator, and custom size
export interface TierConfiguration {
  spongeId: string;
  dietaryId: string;
  fillingId: string;
  shape: CakeShape;
  hasSeparatorAbove: boolean; // Acrylic separator above this tier
  separatorConfig?: SeparatorConfig; // Separator configuration if enabled
  customSizeInches?: number; // Optional custom size (allows same-size tiers)
  rectangularLengthCm?: number; // Length in cm for rectangular cakes
  rectangularWidthCm?: number; // Width in cm for rectangular cakes (40 or 80)
}

// Available tier sizes (4" to 18", even numbers only)
export const availableTierSizes = [4, 6, 8, 10, 12, 14, 16, 18] as const;
export type TierSize = typeof availableTierSizes[number];

// Get available sizes for a specific tier based on structural constraints
// Bottom tier can be any size, middle tiers 6-12", top tier 4-10"
export function getAvailableSizesForTier(
  tierIndex: number,
  totalTiers: number,
  tierConfigs: TierConfiguration[],
  defaultTierSizes: number[]
): number[] {
  const isBottomTier = tierIndex === 0;
  const isTopTier = tierIndex === totalTiers - 1;
  const isMiddleTier = !isBottomTier && !isTopTier;
  
  // Base constraints for tier position
  let minSize = 4;
  let maxSize = 18;
  
  // Middle tiers: restricted to 6" - 12"
  if (isMiddleTier) {
    minSize = Math.max(minSize, 6);
    maxSize = Math.min(maxSize, 12);
  }
  
  // Top tier: restricted to 4" - 10" (can't be too large on top)
  if (isTopTier && totalTiers > 1) {
    maxSize = Math.min(maxSize, 10);
  }
  
  // Structural constraint: must be <= tier below
  if (tierIndex > 0) {
    const tierBelowIndex = tierIndex - 1;
    const tierBelowConfig = tierConfigs[tierBelowIndex];
    const tierBelowDefaultSize = defaultTierSizes[tierBelowIndex] || 18;
    const tierBelowSize = tierBelowConfig?.customSizeInches || tierBelowDefaultSize;
    maxSize = Math.min(maxSize, tierBelowSize);
  }
  
  // Structural constraint: must be >= tier above
  if (tierIndex < totalTiers - 1) {
    const tierAboveIndex = tierIndex + 1;
    const tierAboveConfig = tierConfigs[tierAboveIndex];
    const tierAboveDefaultSize = defaultTierSizes[tierAboveIndex] || 4;
    const tierAboveSize = tierAboveConfig?.customSizeInches || tierAboveDefaultSize;
    minSize = Math.max(minSize, tierAboveSize);
  }
  
  // Filter available sizes based on all constraints
  return availableTierSizes.filter(size => size >= minSize && size <= maxSize);
}

// Helper to get servings for a tier based on shape
export function getServingsForTier(sizeInches: number, shape: CakeShape, rectangularLengthCm?: number, rectangularWidthCm?: number): number {
  if (shape === "rectangular" && rectangularLengthCm) {
    return getServingsForRectangular(rectangularLengthCm, rectangularWidthCm || RECTANGULAR_DEFAULT_WIDTH_CM);
  }
  const shapeKey = shape === "rectangular" ? "square" : shape;
  return servingsPerSize[shapeKey][sizeInches] || servingsPerSize.round[sizeInches] || 0;
}

// Helper to get separator RENTAL price based on config
export function getSeparatorPrice(config?: SeparatorConfig): number {
  if (!config) return 0;
  const key = `${config.diameterInches}-${config.heightCm}`;
  return appConfig.acrylicSeparatorRentalPrices[key] || 12;
}

// Get default separator config for a tier
export function getDefaultSeparatorConfig(tierSizeInches: number): SeparatorConfig {
  // Default to 85% of tier diameter, max 10"
  const defaultDiameter = Math.min(10, Math.max(4, Math.round(tierSizeInches * 0.85)));
  return {
    diameterInches: defaultDiameter,
    heightCm: 5,
    shape: "round",
  };
}

export const cakeStructures: CakeStructure[] = [
  {
    id: "intimate",
    name: "The Intimate Wedding",
    description: "Perfect for small gatherings",
    tierCount: 2,
    tiers: [
      { tierLevel: 1, sizeInches: 8, servings: 20, height: 55 },
      { tierLevel: 2, sizeInches: 6, servings: 8, height: 50 },
    ],
    totalServings: 28,
    basePrice: 168, // 28 * $6.00
  },
  {
    id: "classic",
    name: "The Classic Reception",
    description: "Elegant two-tier design",
    tierCount: 2,
    tiers: [
      { tierLevel: 1, sizeInches: 10, servings: 30, height: 60 },
      { tierLevel: 2, sizeInches: 6, servings: 8, height: 55 },
    ],
    totalServings: 38,
    basePrice: 228, // 38 * $6.00
  },
  {
    id: "grand",
    name: "The Grand Celebration",
    description: "Statement three-tier masterpiece",
    tierCount: 3,
    tiers: [
      { tierLevel: 1, sizeInches: 10, servings: 30, height: 55 },
      { tierLevel: 2, sizeInches: 8, servings: 20, height: 50 },
      { tierLevel: 3, sizeInches: 6, servings: 8, height: 45 },
    ],
    totalServings: 58,
    basePrice: 348, // 58 * $6.00
  },
  {
    id: "gala",
    name: "The Gala Event",
    description: "Luxurious four-tier showpiece",
    tierCount: 4,
    tiers: [
      { tierLevel: 1, sizeInches: 12, servings: 44, height: 55 },
      { tierLevel: 2, sizeInches: 10, servings: 30, height: 50 },
      { tierLevel: 3, sizeInches: 8, servings: 20, height: 45 },
      { tierLevel: 4, sizeInches: 6, servings: 8, height: 40 },
    ],
    totalServings: 102,
    basePrice: 612, // 102 * $6.00
  },
  {
    id: "majestic",
    name: "The Majestic Celebration",
    description: "Impressive four-tier with grand proportions",
    tierCount: 4,
    tiers: [
      { tierLevel: 1, sizeInches: 14, servings: 63, height: 55 },
      { tierLevel: 2, sizeInches: 12, servings: 44, height: 50 },
      { tierLevel: 3, sizeInches: 10, servings: 30, height: 45 },
      { tierLevel: 4, sizeInches: 8, servings: 20, height: 40 },
    ],
    totalServings: 157,
    basePrice: 942, // 157 * $6.00
  },
  {
    id: "royal",
    name: "The Royal Affair",
    description: "Magnificent five-tier masterpiece",
    tierCount: 5,
    tiers: [
      { tierLevel: 1, sizeInches: 14, servings: 63, height: 55 },
      { tierLevel: 2, sizeInches: 12, servings: 44, height: 50 },
      { tierLevel: 3, sizeInches: 10, servings: 30, height: 45 },
      { tierLevel: 4, sizeInches: 8, servings: 20, height: 40 },
      { tierLevel: 5, sizeInches: 6, servings: 8, height: 35 },
    ],
    totalServings: 165,
    basePrice: 990, // 165 * $6.00
  },
];

// ============= SPONGE OPTIONS =============
export interface SpongeOption {
  id: string;
  name: string;
  description: string;
  category: "Standard" | "Premium";
  priceExtra: number;
  dietary: string[]; // Diets this sponge CAN be made in
  allowedFillings: string[]; // "all" or specific IDs
  structureSafeVegan: boolean;
}

export const spongeOptions: SpongeOption[] = [
  {
    id: "sp_van_classic",
    name: "Classic Vanilla",
    description: "Velvety vanilla sponge infused with Madagascar vanilla beans.",
    category: "Standard",
    priceExtra: 0,
    dietary: ["GF", "SF", "K", "NF", "DF", "V"],
    allowedFillings: ["all"],
    structureSafeVegan: true,
  },
  {
    id: "sp_van_rum",
    name: "Vanilla Rum",
    description: "Vanilla sponge soaked in premium Venezuelan aged rum with French crème mousseline.",
    category: "Standard",
    priceExtra: 0,
    dietary: ["GF", "SF", "K", "NF", "DF", "V"],
    allowedFillings: ["fil_mousseline", "fil_van_bc", "fil_dulce", "fil_coconut_bc", "fil_nutella", "fil_salt_caramel"],
    structureSafeVegan: true,
  },
  {
    id: "sp_confetti",
    name: "Confetti Cake",
    description: "Snowy-white velvet sponge studded with a kaleidoscope of vibrant colors.",
    category: "Standard",
    priceExtra: 0,
    dietary: ["GF", "NF", "DF"],
    allowedFillings: ["all"],
    structureSafeVegan: false,
  },
  {
    id: "sp_choc_classic",
    name: "Chocolate Classic",
    description: "Intense Dutch-processed cocoa crumb paired with 70% dark chocolate.",
    category: "Standard",
    priceExtra: 0,
    dietary: ["GF", "SF", "K", "NF", "DF", "V"],
    allowedFillings: [
      "fil_choc_ganache", "fil_cocoa_bc", "fil_mint", "fil_salt_caramel",
      "fil_van_bc", "fil_berry", "fil_coffee", "fil_nutella", "fil_orange", "fil_cream_cheese",
      "fil_raspberry", "fil_cherry", "fil_strawberry", "fil_passion"
    ],
    structureSafeVegan: true,
  },
  {
    id: "sp_choc_coffee",
    name: "Moka Lover",
    description: "Colombian espresso-infused chocolate sponge with deep dark cocoa.",
    category: "Standard",
    priceExtra: 0,
    dietary: ["GF", "SF", "K", "NF", "DF", "V"],
    allowedFillings: ["fil_cocoa_bc", "fil_coffee", "fil_choc_ganache", "fil_salt_caramel", "fil_van_bc"],
    structureSafeVegan: true,
  },
  {
    id: "sp_choc_ferrero",
    name: "Choco Ferrero",
    description: "Hazelnut-infused chocolate sponge with roasted hazelnut crunch.",
    category: "Premium",
    priceExtra: 1.5,
    dietary: ["GF", "SF"],
    allowedFillings: ["fil_nutella", "fil_choc_ganache", "fil_van_bc", "fil_cocoa_bc"],
    structureSafeVegan: false,
  },
  {
    id: "sp_van_oreo",
    name: "Cookies & Cream",
    description: "Vanilla sponge studded with hand-crushed cocoa biscuits.",
    category: "Standard",
    priceExtra: 0,
    dietary: ["GF", "SF", "NF"],
    allowedFillings: ["fil_van_bc", "fil_choc_ganache", "fil_cream_cheese"],
    structureSafeVegan: false,
  },
  {
    id: "sp_choc_orange",
    name: "Choco-Orange",
    description: "Bright Mexican orange zest combined with deep cocoa sponge.",
    category: "Standard",
    priceExtra: 0,
    dietary: ["GF", "SF", "K", "NF", "DF", "V"],
    allowedFillings: ["fil_choc_ganache", "fil_orange", "fil_cocoa_bc", "fil_van_bc"],
    structureSafeVegan: true,
  },
  {
    id: "sp_black_forest",
    name: "Black Forest",
    description: "Dark chocolate layers soaked in cherry nectar with Kirsch-macerated cherries.",
    category: "Premium",
    priceExtra: 1.0,
    dietary: ["GF", "SF", "K", "NF", "DF", "V"],
    allowedFillings: ["fil_cherry", "fil_choc_ganache", "fil_van_bc", "fil_cocoa_bc"],
    structureSafeVegan: true,
  },
  {
    id: "sp_red_velvet",
    name: "Red Velvet",
    description: "Delicate cocoa-vanilla sponge with a striking ruby hue.",
    category: "Standard",
    priceExtra: 0,
    dietary: ["GF", "SF", "K", "NF"],
    allowedFillings: ["fil_cream_cheese", "fil_van_bc", "fil_wht_choc"],
    structureSafeVegan: false,
  },
  {
    id: "sp_very_berry",
    name: "Very Berry",
    description: "Seasonal wild berries embedded in a light vanilla-bean crumb.",
    category: "Premium",
    priceExtra: 1.0,
    dietary: ["GF", "SF", "K", "NF", "DF", "V"],
    allowedFillings: ["fil_berry", "fil_raspberry", "fil_strawberry", "fil_van_bc", "fil_wht_choc", "fil_cream_cheese"],
    structureSafeVegan: true,
  },
  {
    id: "sp_lemon_rasp",
    name: "Lemon Raspberry",
    description: "Zesty lemon sponge layered with bright home-made raspberry coulis.",
    category: "Premium",
    priceExtra: 1.0,
    dietary: ["GF", "SF", "K", "NF", "DF", "V"],
    allowedFillings: ["fil_raspberry", "fil_lemon_curd", "fil_wht_choc", "fil_van_bc", "fil_berry"],
    structureSafeVegan: true,
  },
  {
    id: "sp_lemon_lime",
    name: "Lime-Lemon",
    description: "Vibrant Caribbean limes and lemons with dehydrated citrus jewels.",
    category: "Premium",
    priceExtra: 1.0,
    dietary: ["GF", "SF", "K", "NF", "DF", "V"],
    allowedFillings: ["fil_wht_choc", "fil_lemon_curd", "fil_berry", "fil_van_bc", "fil_raspberry", "fil_lime"],
    structureSafeVegan: true,
  },
  {
    id: "sp_coconut",
    name: "Coconut Cream",
    description: "Pure coconut bliss with silky coconut milk infusion and toasted flakes.",
    category: "Premium",
    priceExtra: 1.0,
    dietary: ["GF", "SF", "K", "NF", "DF", "V"],
    allowedFillings: ["fil_coconut_bc", "fil_pineapple", "fil_choc_ganache", "fil_dulce", "fil_van_bc", "fil_lime"],
    structureSafeVegan: true,
  },
  {
    id: "sp_almond",
    name: "Almond & Amaretto",
    description: "Italian almond-flour crumb kissed by premium Amaretto liqueur.",
    category: "Premium",
    priceExtra: 1.5,
    dietary: ["GF", "SF", "K", "NF", "DF", "V"],
    allowedFillings: ["fil_almond", "fil_wht_choc", "fil_van_bc", "fil_apricot"],
    structureSafeVegan: true,
  },
  {
    id: "sp_matcha",
    name: "Matcha Zen",
    description: "Ceremonial-grade Matcha tea with a soft, earthy sponge.",
    category: "Premium",
    priceExtra: 1.0,
    dietary: ["GF", "SF", "K", "NF", "DF", "V"],
    allowedFillings: ["fil_van_bc", "fil_wht_choc", "fil_coconut_bc", "fil_lemon_curd"],
    structureSafeVegan: true,
  },
  {
    id: "sp_carrot",
    name: "Carrot Classic",
    description: "Rustic sponge with fresh carrots, toasted walnuts, and warm heritage spices.",
    category: "Premium",
    priceExtra: 1.0,
    dietary: ["GF", "SF"],
    allowedFillings: ["fil_cream_cheese", "fil_van_bc", "fil_salt_caramel"],
    structureSafeVegan: false,
  },
  {
    id: "sp_mint",
    name: "Mint Fresh",
    description: "Refreshing garden mint paired with flecks of dark chocolate.",
    category: "Premium",
    priceExtra: 1.0,
    dietary: ["GF", "SF", "K", "NF", "DF", "V"],
    allowedFillings: ["fil_mint", "fil_choc_ganache", "fil_van_bc", "fil_cocoa_bc"],
    structureSafeVegan: true,
  },
  {
    id: "sp_salted_caramel",
    name: "Salted Caramel",
    description: "Hand-burnt amber caramel with Maldon sea salt.",
    category: "Premium",
    priceExtra: 1.0,
    dietary: ["GF", "NF", "V"],
    allowedFillings: ["fil_salt_caramel", "fil_van_bc", "fil_choc_ganache", "fil_dulce"],
    structureSafeVegan: true,
  },
];

// ============= FILLING OPTIONS =============
export interface FillingOption {
  id: string;
  name: string;
  dietary: string[];
  priceExtra: number;
}

// Filling categories for UI grouping
export type FillingCategory = "creamy" | "fruity" | "chocolate" | "specialty";

export const fillingCategories: Record<FillingCategory, { label: string; emoji: string }> = {
  creamy: { label: "Creamy & Classic", emoji: "🍦" },
  fruity: { label: "Fruity & Fresh", emoji: "🍓" },
  chocolate: { label: "Chocolate", emoji: "🍫" },
  specialty: { label: "Specialty", emoji: "✨" },
};

export interface FillingOptionWithCategory extends FillingOption {
  category: FillingCategory;
}

export const fillingOptions: FillingOptionWithCategory[] = [
  // Creamy & Classic
  { id: "fil_van_bc", name: "Vanilla Buttercream", dietary: ["GF", "SF", "K", "NF", "DF", "V"], priceExtra: 0, category: "creamy" },
  { id: "fil_pastry_cream", name: "Pastry Cream (Crema Pastelera)", dietary: ["GF", "SF", "NF"], priceExtra: 0, category: "creamy" },
  { id: "fil_cream_cheese", name: "Cream Cheese Frosting", dietary: ["GF", "SF", "K", "NF"], priceExtra: 0, category: "creamy" },
  { id: "fil_mousseline", name: "Classic Mousseline", dietary: ["GF", "SF", "K", "NF"], priceExtra: 0, category: "creamy" },
  { id: "fil_salt_caramel", name: "Salted Caramel Buttercream", dietary: ["GF", "NF", "V"], priceExtra: 0, category: "creamy" },
  { id: "fil_coffee", name: "Coffee Buttercream", dietary: ["GF", "SF", "K", "NF", "DF", "V"], priceExtra: 0, category: "creamy" },
  { id: "fil_mint", name: "Fresh Mint Buttercream", dietary: ["GF", "SF", "K", "NF", "DF", "V"], priceExtra: 0, category: "creamy" },
  { id: "fil_coconut_bc", name: "Coconut Buttercream", dietary: ["GF", "SF", "K", "NF", "DF", "V"], priceExtra: 0, category: "creamy" },
  { id: "fil_dulce", name: "Dulce de Leche", dietary: ["GF", "NF"], priceExtra: 0, category: "creamy" },
  { id: "fil_almond", name: "Almond Cream", dietary: ["GF", "SF", "V", "K", "DF"], priceExtra: 0, category: "creamy" },
  
  // Fruity & Fresh
  { id: "fil_strawberry", name: "Fresh Strawberry Cream", dietary: ["GF", "SF", "NF"], priceExtra: 0, category: "fruity" },
  { id: "fil_raspberry", name: "Raspberry Mousse", dietary: ["GF", "SF", "NF", "DF", "V"], priceExtra: 0, category: "fruity" },
  { id: "fil_blackberry", name: "Blackberry Compote (Moras)", dietary: ["GF", "SF", "V", "DF", "NF"], priceExtra: 0, category: "fruity" },
  { id: "fil_blueberry", name: "Blueberry Compote", dietary: ["GF", "SF", "V", "DF", "NF"], priceExtra: 0, category: "fruity" },
  { id: "fil_cherry", name: "Cherry Filling", dietary: ["GF", "SF", "V", "DF", "NF"], priceExtra: 0, category: "fruity" },
  { id: "fil_berry", name: "Mixed Berry Infusion", dietary: ["GF", "SF", "K", "NF", "DF", "V"], priceExtra: 0, category: "fruity" },
  { id: "fil_mango", name: "Fresh Mango Cream", dietary: ["GF", "SF", "NF"], priceExtra: 0, category: "fruity" },
  { id: "fil_kiwi", name: "Kiwi Cream", dietary: ["GF", "SF", "V", "DF", "NF"], priceExtra: 0, category: "fruity" },
  { id: "fil_peach", name: "Peach Cream (Melocotón)", dietary: ["GF", "SF", "NF"], priceExtra: 0, category: "fruity" },
  { id: "fil_banana", name: "Banana Cream", dietary: ["GF", "SF", "NF"], priceExtra: 0, category: "fruity" },
  { id: "fil_lemon_curd", name: "Lemon Mousseline/Curd", dietary: ["GF", "SF", "K", "NF", "DF", "V"], priceExtra: 0, category: "fruity" },
  { id: "fil_pineapple", name: "Pineapple Cream", dietary: ["GF", "SF", "NF", "DF", "V"], priceExtra: 0, category: "fruity" },
  { id: "fil_orange", name: "Orange Cream", dietary: ["GF", "SF", "K", "NF", "DF", "V"], priceExtra: 0, category: "fruity" },
  { id: "fil_lime", name: "Lime Cream", dietary: ["GF", "SF", "NF", "DF", "V"], priceExtra: 0, category: "fruity" },
  { id: "fil_apricot", name: "Apricot Preserve", dietary: ["GF", "SF", "V", "DF", "NF"], priceExtra: 0, category: "fruity" },
  { id: "fil_passion", name: "Passion Fruit Cream", dietary: ["GF", "SF", "NF"], priceExtra: 0, category: "fruity" },
  
  // Chocolate
  { id: "fil_choc_ganache", name: "Dark Chocolate Ganache", dietary: ["GF", "SF", "V", "K", "DF", "NF"], priceExtra: 0, category: "chocolate" },
  { id: "fil_wht_choc", name: "White Chocolate Cream", dietary: ["GF", "SF", "K", "NF", "DF", "V"], priceExtra: 0, category: "chocolate" },
  { id: "fil_cocoa_bc", name: "Cocoa Buttercream", dietary: ["GF", "SF", "K", "NF", "DF", "V"], priceExtra: 0, category: "chocolate" },
  { id: "fil_nutella", name: "Hazelnut Chocolate (Nutella)", dietary: ["GF", "SF"], priceExtra: 1.5, category: "chocolate" },
  
  // Specialty
  { id: "fil_fresh_fruit_mix", name: "Fresh Seasonal Fruit Mix", dietary: ["GF", "SF", "V", "DF", "NF"], priceExtra: 1.0, category: "specialty" },
];

// ============= FROSTING / COATING OPTIONS =============
export interface CoatingOption {
  id: string;
  name: string;
  dietary: string[];
  flatFee: number;
}

export const coatingOptions: CoatingOption[] = [
  { id: "coat_van_bc", name: "Smooth Vanilla Buttercream", dietary: ["GF", "SF", "K", "NF", "DF", "V"], flatFee: 0 },
  { id: "coat_rustic", name: "Rustic / Semi-Naked (Buttercream)", dietary: ["GF", "SF", "K", "NF", "DF", "V"], flatFee: 0 },
  { id: "coat_choc_ganache", name: "Dark Chocolate Ganache", dietary: ["GF", "SF", "V", "K", "DF", "NF"], flatFee: 45 },
  { id: "coat_wht_choc", name: "White Chocolate Ganache", dietary: ["GF", "SF", "K", "NF"], flatFee: 45 },
  { id: "coat_cream_cheese", name: "Cream Cheese Finish", dietary: ["GF", "SF", "K", "NF"], flatFee: 0 },
  { id: "coat_texture_line", name: "Textured Lines Buttercream", dietary: ["GF", "SF", "K", "NF", "DF", "V"], flatFee: 0 },
];

// ============= DECORATION OPTIONS =============
export interface DecorationOption {
  id: string;
  name: string;
  description: string;
  flatFee: number;
  hasFloralPaletteInput?: boolean;  // For flowers/greenery color palette
  hasFondantPaletteInput?: boolean; // For fondant color palette
}

export const decorationOptions: DecorationOption[] = [
  { id: "minimal", name: "Clean & Minimalist", description: "No flowers, pure elegance", flatFee: 0 },
  { id: "fresh_floral", name: "Fresh Floral Cascade", description: "Seasonal flowers & greenery", flatFee: 85, hasFloralPaletteInput: true },
  { id: "fresh_fruit", name: "Fresh Fruit Decorations", description: "Berries, cherries, kiwi, mango & more", flatFee: 55, hasFloralPaletteInput: true },
  { id: "fondant_decorations", name: "Fondant Decorations", description: "Handcrafted pearls, bows, geometric shapes", flatFee: 65, hasFondantPaletteInput: true },
  { id: "gold_leaf", name: "Edible Gold/Silver Leaf", description: "Luxurious metallic accents", flatFee: 80 },
  { id: "macarons_chocolates", name: "Macarons & Chocolates", description: "Gourmet confections as decoration", flatFee: 70 },
  { id: "chocolate_figures", name: "Decorative Chocolate Figures", description: "Handcrafted chocolate art pieces", flatFee: 90 },
];

// ============= TOPPER OPTIONS =============
export interface TopperOption {
  id: string;
  name: string;
  description: string;
  price: number;
  hasNameInput?: boolean;
}

export const topperOptions: TopperOption[] = [
  { id: "none", name: "No Topper", description: "", price: 0 },
  { id: "custom_names", name: "Custom 3D Print Names", description: "Two names included", price: 28, hasNameInput: true },
];

// ============= EVENT TYPES =============
export const eventTypes = [
  "Wedding",
  "Corporate Event",
  "Birthday Celebration",
  "Anniversary",
  "Baby Shower",
  "Social Gathering",
];

// ============= DIETARY OPTIONS FOR GLOBAL FILTER =============
export interface DietaryOption {
  id: string;
  label: string;
  description: string;
  surcharge: number;
}

export const dietaryOptions: DietaryOption[] = [
  { id: "none", label: "Classic", description: "Traditional recipe", surcharge: 0 },
  { id: "GF", label: "Gluten-Free", description: "Certified rice & potato starches", surcharge: 0.5 },
  { id: "SF", label: "Sugar-Free", description: "Alulose & Monk Fruit sweetened", surcharge: 0.5 },
  { id: "K", label: "Keto", description: "Almond flour, no sugar", surcharge: 1.0 },
  { id: "V", label: "Vegan", description: "100% plant-based", surcharge: 0.75 },
  { id: "DF", label: "Dairy-Free", description: "No dairy products", surcharge: 0.5 },
  { id: "NF", label: "Nut-Free", description: "Sunflower seed & coconut flour", surcharge: 0.5 },
];

// ============= HELPER FUNCTIONS =============

export function getRecommendedStructure(guests: number): CakeStructure {
  if (guests <= 35) return cakeStructures[0]; // intimate (2 tiers, 35 servings)
  if (guests <= 55) return cakeStructures[1]; // classic (2 tiers, 55 servings)
  if (guests <= 73) return cakeStructures[2]; // grand (3 tiers, 73 servings)
  if (guests <= 129) return cakeStructures[3]; // gala (4 tiers, 129 servings)
  if (guests <= 196) return cakeStructures[4]; // majestic (4 tiers, 196 servings)
  return cakeStructures[5]; // royal (5 tiers, 207 servings)
}

// Get fillings allowed for a specific sponge
export function getAllowedFillings(spongeId: string): FillingOptionWithCategory[] {
  const sponge = spongeOptions.find((s) => s.id === spongeId);
  if (!sponge) return fillingOptions;
  
  if (sponge.allowedFillings.includes("all")) {
    return fillingOptions;
  }
  
  return fillingOptions.filter((f) => sponge.allowedFillings.includes(f.id));
}

// Get sponges available for a dietary restriction
export function getSpongesForDietary(dietaryId: string): SpongeOption[] {
  if (!dietaryId || dietaryId === "none") {
    return spongeOptions;
  }
  return spongeOptions.filter((s) => s.dietary.includes(dietaryId));
}

// Get fillings available for a dietary restriction
export function getFillingsForDietary(dietaryId: string): FillingOptionWithCategory[] {
  if (!dietaryId || dietaryId === "none") {
    return fillingOptions;
  }
  return fillingOptions.filter((f) => f.dietary.includes(dietaryId));
}

// Get coatings available for a dietary restriction
export function getCoatingsForDietary(dietaryId: string): CoatingOption[] {
  if (!dietaryId || dietaryId === "none") {
    return coatingOptions;
  }
  return coatingOptions.filter((c) => c.dietary.includes(dietaryId));
}

// ============= TIER CONFIGURATION =============
export interface TierConfiguration {
  spongeId: string;
  dietaryId: string;
  fillingId: string;
}

// ============= PRICING CALCULATIONS =============
export interface TierPricing {
  basePrice: number;
  spongeUpgrade: number;
  dietaryUpgrade: number;
  fillingUpgrade: number;
  total: number;
}

export function calculateTierPrice(
  servings: number,
  spongeId: string,
  dietaryId: string,
  fillingId: string
): TierPricing {
  const sponge = spongeOptions.find((s) => s.id === spongeId);
  const filling = fillingOptions.find((f) => f.id === fillingId);
  const dietarySurcharge = dietaryId && dietaryId !== "none" 
    ? (appConfig.dietarySurcharges[dietaryId] || 0) 
    : 0;

  const basePrice = servings * appConfig.pricingBase.basePricePerServing;
  const spongeUpgrade = servings * (sponge?.priceExtra || 0);
  const dietaryUpgrade = servings * dietarySurcharge;
  const fillingUpgrade = servings * (filling?.priceExtra || 0);

  return {
    basePrice,
    spongeUpgrade,
    dietaryUpgrade,
    fillingUpgrade,
    total: basePrice + spongeUpgrade + dietaryUpgrade + fillingUpgrade,
  };
}

export function calculateTotalPrice(
  structure: CakeStructure,
  tierConfigs: TierConfiguration[],
  coatingId: string,
  decorationId: string,
  topperId: string
): number {
  let total = 0;

  // Calculate each tier with shape-adjusted servings and custom sizes
  structure.tiers.forEach((tier, index) => {
    const config = tierConfigs[index];
    if (config) {
      // Use custom size if set, otherwise use default
      const effectiveSize = config.customSizeInches || tier.sizeInches;
      const actualServings = getServingsForTier(effectiveSize, config.shape, config.rectangularLengthCm, config.rectangularWidthCm);
      const tierPrice = calculateTierPrice(
        actualServings,
        config.spongeId,
        config.dietaryId,
        config.fillingId
      );
      total += tierPrice.total;
      
      // Add separator cost if enabled
      if (config.hasSeparatorAbove && config.separatorConfig) {
        total += getSeparatorPrice(config.separatorConfig);
      }
    }
  });

  // Add coating fee
  const coating = coatingOptions.find((c) => c.id === coatingId);
  total += coating?.flatFee || 0;

  // Add decoration fee
  const decoration = decorationOptions.find((d) => d.id === decorationId);
  total += decoration?.flatFee || 0;

  // Add topper fee
  const topper = topperOptions.find((t) => t.id === topperId);
  total += topper?.price || 0;

  return total;
}

// Calculate total servings based on tier shapes and custom sizes
export function calculateTotalServings(
  structure: CakeStructure,
  tierConfigs: TierConfiguration[]
): number {
  return structure.tiers.reduce((total, tier, index) => {
    const config = tierConfigs[index];
    const shape = config?.shape || "round";
    const size = config?.customSizeInches || tier.sizeInches;
    return total + getServingsForTier(size, shape, config?.rectangularLengthCm, config?.rectangularWidthCm);
  }, 0);
}

// Get effective tier size (custom or default)
export function getEffectiveTierSize(tier: TierStructure, config?: TierConfiguration): number {
  return config?.customSizeInches || tier.sizeInches;
}

export function getMinEventDate(): Date {
  const date = new Date();
  date.setDate(date.getDate() + appConfig.leadTimeDays);
  return date;
}

export function getTierLabel(tierLevel: number, totalTiers: number): string {
  if (totalTiers === 2) {
    return tierLevel === 1 ? "Base Tier" : "Top Tier";
  }
  if (totalTiers === 3) {
    if (tierLevel === 1) return "Bottom Tier";
    if (tierLevel === 2) return "Middle Tier";
    return "Top Tier";
  }
  if (totalTiers === 4) {
    if (tierLevel === 1) return "Bottom Tier";
    if (tierLevel === 2) return "Lower Middle";
    if (tierLevel === 3) return "Upper Middle";
    return "Top Tier";
  }
  return `Tier ${tierLevel}`;
}

// ============= LEGACY EXPORTS FOR COMPATIBILITY =============
export const dietaryUpgrades = dietaryOptions;
export const outerFinishes = coatingOptions.map((c) => ({
  id: c.id,
  name: c.name,
  description: "",
  flatFee: c.flatFee,
}));

export function calculateTiers(guests: number): number {
  return getRecommendedStructure(guests).tierCount;
}

export function calculateEstimate(guests: number): number {
  const structure = getRecommendedStructure(guests);
  return structure.basePrice;
}
