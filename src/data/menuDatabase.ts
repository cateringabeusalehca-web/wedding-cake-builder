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
  } as Record<string, number>,
  acrylicSeparatorPrices: {
    6: 15,
    7: 18,
    8: 22,
    10: 28,
    12: 35,
    14: 45,
  } as Record<number, number>,
};

// ============= CAKE SHAPE & SERVINGS =============
export type CakeShape = "round" | "square";

// Standard portion size for wedding cakes
export const PORTION_WEIGHT_GRAMS = 110; // ~110g per portion (industry standard)
export const PORTION_SIZE_DESCRIPTION = "1\"×2\"×4\" (2.5×5×10 cm)"; // Standard wedding cake portion

// Servings per size based on shape (re-evaluated for round cakes - industry standard portions)
// Round cakes yield fewer portions due to geometry
export const servingsPerSize: Record<CakeShape, Record<number, number>> = {
  round: {
    6: 8,    // Reduced from 11 - realistic for round
    7: 12,   // Reduced from 17
    8: 20,   // Reduced from 24
    10: 30,  // Reduced from 38
    12: 44,  // Reduced from 56
    14: 63,  // Reduced from 78
  },
  square: {
    6: 18,
    7: 24,
    8: 32,
    10: 50,
    12: 72,
    14: 98,
  },
};

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

// Enhanced tier configuration with shape, separator, and custom size
export interface TierConfiguration {
  spongeId: string;
  dietaryId: string;
  fillingId: string;
  shape: CakeShape;
  hasSeparatorAbove: boolean; // Acrylic separator above this tier
  customSizeInches?: number; // Optional custom size (allows same-size tiers)
}

// Available tier sizes
export const availableTierSizes = [6, 7, 8, 10, 12, 14] as const;
export type TierSize = typeof availableTierSizes[number];

// Helper to get servings for a tier based on shape
export function getServingsForTier(sizeInches: number, shape: CakeShape): number {
  return servingsPerSize[shape][sizeInches] || servingsPerSize.round[sizeInches] || 0;
}

// Helper to get separator price
export function getSeparatorPrice(sizeInches: number): number {
  return appConfig.acrylicSeparatorPrices[sizeInches] || 25;
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
      { tierLevel: 2, sizeInches: 7, servings: 12, height: 55 },
    ],
    totalServings: 42,
    basePrice: 252, // 42 * $6.00
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
    name: "Classic Vanilla Sponge",
    description: "Fluffy vanilla sponge soaked in light simple syrup.",
    category: "Standard",
    priceExtra: 0,
    dietary: ["GF", "SF", "K"],
    allowedFillings: ["all"],
    structureSafeVegan: false,
  },
  {
    id: "sp_van_rum",
    name: "Vanilla Rum Sponge",
    description: "Vanilla sponge lightly soaked in aged Venezuelan rum.",
    category: "Standard",
    priceExtra: 0,
    dietary: ["GF", "SF", "K"],
    allowedFillings: ["fil_mousseline", "fil_van_bc", "fil_dulce", "fil_coconut_bc", "fil_nutella"],
    structureSafeVegan: false,
  },
  {
    id: "sp_van_oreo",
    name: "Cookies & Cream Sponge",
    description: "Vanilla sponge baked with Oreo cookie pieces.",
    category: "Standard",
    priceExtra: 0,
    dietary: [],
    allowedFillings: ["fil_van_bc", "fil_choc_ganache", "fil_cream_cheese"],
    structureSafeVegan: false,
  },
  {
    id: "sp_choc_classic",
    name: "Classic Chocolate Sponge",
    description: "Intense, moist chocolate sponge.",
    category: "Standard",
    priceExtra: 0,
    dietary: ["GF", "SF", "V", "K", "DF"],
    allowedFillings: [
      "fil_choc_ganache", "fil_cocoa_bc", "fil_mint", "fil_salt_caramel",
      "fil_van_bc", "fil_berry", "fil_coffee", "fil_nutella", "fil_orange", "fil_cream_cheese"
    ],
    structureSafeVegan: true,
  },
  {
    id: "sp_choc_coffee",
    name: "Moka Sponge (Coffee Infused)",
    description: "Chocolate cake enriched with Colombian coffee.",
    category: "Standard",
    priceExtra: 0,
    dietary: ["GF", "SF", "K"],
    allowedFillings: ["fil_cocoa_bc", "fil_coffee", "fil_choc_ganache", "fil_salt_caramel", "fil_van_bc"],
    structureSafeVegan: false,
  },
  {
    id: "sp_red_velvet",
    name: "Red Velvet Sponge",
    description: "Soft red velvet cake with a subtle hint of cocoa.",
    category: "Standard",
    priceExtra: 0,
    dietary: ["GF", "SF", "K"],
    allowedFillings: ["fil_cream_cheese", "fil_van_bc", "fil_wht_choc"],
    structureSafeVegan: false,
  },
  {
    id: "sp_lemon_lime",
    name: "Lemon & Lime Sponge",
    description: "Zesty citrus infused sponge.",
    category: "Premium",
    priceExtra: 1.0,
    dietary: ["GF", "SF", "V", "K", "DF"],
    allowedFillings: ["fil_wht_choc", "fil_lemon_curd", "fil_berry", "fil_van_bc"],
    structureSafeVegan: true,
  },
  {
    id: "sp_almond",
    name: "Almond & Amaretto Sponge",
    description: "Almond flour cake with a touch of Amaretto.",
    category: "Premium",
    priceExtra: 1.5,
    dietary: ["GF", "SF", "V", "K", "DF"],
    allowedFillings: ["fil_almond", "fil_wht_choc", "fil_van_bc", "fil_apricot"],
    structureSafeVegan: true,
  },
  {
    id: "sp_carrot",
    name: "Spiced Carrot Sponge",
    description: "Moist carrot cake with warm spices.",
    category: "Premium",
    priceExtra: 1.0,
    dietary: ["GF", "SF"],
    allowedFillings: ["fil_cream_cheese", "fil_van_bc", "fil_salt_caramel"],
    structureSafeVegan: false,
  },
  {
    id: "sp_coconut",
    name: "Coconut Sponge",
    description: "Tropical fluffy coconut cake.",
    category: "Premium",
    priceExtra: 1.0,
    dietary: ["GF", "SF", "K"],
    allowedFillings: ["fil_coconut_bc", "fil_pineapple", "fil_choc_ganache", "fil_dulce", "fil_van_bc", "fil_lime"],
    structureSafeVegan: false,
  },
  {
    id: "sp_pumpkin",
    name: "Pumpkin Spice Sponge",
    description: "Moist pumpkin cake with autumn spices.",
    category: "Premium",
    priceExtra: 1.0,
    dietary: ["GF", "SF"],
    allowedFillings: ["fil_cream_cheese", "fil_choc_ganache", "fil_salt_caramel", "fil_van_bc"],
    structureSafeVegan: false,
  },
  {
    id: "sp_orange",
    name: "Orange Sponge",
    description: "Fluffy cake infused with orange zest and juice.",
    category: "Premium",
    priceExtra: 1.0,
    dietary: ["GF", "SF"],
    allowedFillings: ["fil_orange", "fil_choc_ganache", "fil_van_bc"],
    structureSafeVegan: false,
  },
];

// ============= FILLING OPTIONS =============
export interface FillingOption {
  id: string;
  name: string;
  dietary: string[];
  priceExtra: number;
}

export const fillingOptions: FillingOption[] = [
  { id: "fil_van_bc", name: "Vanilla Buttercream", dietary: ["GF", "SF", "K"], priceExtra: 0 },
  { id: "fil_choc_ganache", name: "Dark Chocolate Ganache", dietary: ["GF", "SF", "V", "K", "DF"], priceExtra: 0 },
  { id: "fil_wht_choc", name: "White Chocolate Cream", dietary: ["GF", "SF", "K"], priceExtra: 0 },
  { id: "fil_cream_cheese", name: "Cream Cheese Frosting", dietary: ["GF", "SF", "K"], priceExtra: 0 },
  { id: "fil_mousseline", name: "Classic Mousseline", dietary: ["GF", "SF", "K"], priceExtra: 0 },
  { id: "fil_cocoa_bc", name: "Cocoa Buttercream", dietary: ["GF", "SF", "K"], priceExtra: 0 },
  { id: "fil_mint", name: "Mint Buttercream", dietary: ["GF", "SF", "K"], priceExtra: 0 },
  { id: "fil_salt_caramel", name: "Salted Caramel Buttercream", dietary: ["GF"], priceExtra: 0 },
  { id: "fil_coffee", name: "Coffee Buttercream", dietary: ["GF", "SF", "K"], priceExtra: 0 },
  { id: "fil_berry", name: "Mixed Berry Infusion", dietary: ["GF", "SF", "K"], priceExtra: 0 },
  { id: "fil_lemon_curd", name: "Lemon Mousseline/Curd", dietary: ["GF", "SF"], priceExtra: 0 },
  { id: "fil_pineapple", name: "Pineapple Cream", dietary: ["GF", "SF"], priceExtra: 0 },
  { id: "fil_coconut_bc", name: "Coconut Buttercream", dietary: ["GF", "SF", "K"], priceExtra: 0 },
  { id: "fil_almond", name: "Almond Cream", dietary: ["GF", "SF", "V", "K", "DF"], priceExtra: 0 },
  { id: "fil_nutella", name: "Hazelnut Chocolate (Nutella)", dietary: ["GF"], priceExtra: 1.5 },
  { id: "fil_dulce", name: "Dulce de Leche", dietary: ["GF"], priceExtra: 0 },
  { id: "fil_orange", name: "Orange Cream", dietary: ["GF", "SF"], priceExtra: 0 },
  { id: "fil_lime", name: "Lime Cream", dietary: ["GF", "SF"], priceExtra: 0 },
  { id: "fil_apricot", name: "Apricot Preserve", dietary: ["GF", "SF", "V", "DF"], priceExtra: 0 },
];

// ============= FROSTING / COATING OPTIONS =============
export interface CoatingOption {
  id: string;
  name: string;
  dietary: string[];
  flatFee: number;
}

export const coatingOptions: CoatingOption[] = [
  { id: "coat_van_bc", name: "Smooth Vanilla Buttercream", dietary: ["GF", "SF", "K"], flatFee: 0 },
  { id: "coat_rustic", name: "Rustic / Semi-Naked (Buttercream)", dietary: ["GF", "SF", "K"], flatFee: 0 },
  { id: "coat_choc_ganache", name: "Dark Chocolate Ganache", dietary: ["GF", "SF", "V", "K", "DF"], flatFee: 45 },
  { id: "coat_wht_choc", name: "White Chocolate Ganache", dietary: ["GF", "SF", "K"], flatFee: 45 },
  { id: "coat_cream_cheese", name: "Cream Cheese Finish", dietary: ["GF", "SF", "K"], flatFee: 0 },
  { id: "coat_texture_line", name: "Textured Lines Buttercream", dietary: ["GF", "SF", "K"], flatFee: 0 },
];

// ============= DECORATION OPTIONS =============
export interface DecorationOption {
  id: string;
  name: string;
  description: string;
  flatFee: number;
  hasPaletteInput?: boolean;
}

export const decorationOptions: DecorationOption[] = [
  { id: "minimal", name: "Clean & Minimalist", description: "No flowers, pure elegance", flatFee: 0 },
  { id: "fresh_floral", name: "Fresh Floral Cascade", description: "Chef's selection of seasonal flowers", flatFee: 85, hasPaletteInput: true },
  { id: "fondant_accents", name: "Fondant Accents", description: "Handcrafted pearls, bows, geometric", flatFee: 65 },
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
  { id: "GF", label: "Gluten-Free", description: "Wheat-free perfection", surcharge: 0.5 },
  { id: "SF", label: "Sugar-Free", description: "Natural sweeteners", surcharge: 0.5 },
  { id: "K", label: "Keto", description: "GF + Sugar-Free", surcharge: 1.0 },
  { id: "V", label: "Vegan", description: "Dairy-free & Egg-free", surcharge: 0.75 },
  { id: "DF", label: "Dairy-Free", description: "No dairy products", surcharge: 0.5 },
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
export function getAllowedFillings(spongeId: string): FillingOption[] {
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
export function getFillingsForDietary(dietaryId: string): FillingOption[] {
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
      const actualServings = getServingsForTier(effectiveSize, config.shape);
      const tierPrice = calculateTierPrice(
        actualServings,
        config.spongeId,
        config.dietaryId,
        config.fillingId
      );
      total += tierPrice.total;
      
      // Add separator cost if enabled
      if (config.hasSeparatorAbove) {
        total += getSeparatorPrice(effectiveSize);
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
    return total + getServingsForTier(size, shape);
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
