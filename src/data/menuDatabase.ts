export const appConfig = {
  leadTimeDays: 28,
  pricingBase: {
    currency: "CAD",
    basePricePerServing: 8.5,
  },
};

// Cake structure options based on guest count
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
  servings: number;
  height: number; // visual height for SVG
}

export const cakeStructures: CakeStructure[] = [
  {
    id: "intimate",
    name: "The Intimate Wedding",
    description: "Perfect for small gatherings",
    tierCount: 2,
    tiers: [
      { tierLevel: 1, sizeInches: 8, servings: 24, height: 55 },
      { tierLevel: 2, sizeInches: 6, servings: 11, height: 50 },
    ],
    totalServings: 35,
    basePrice: 295,
  },
  {
    id: "classic",
    name: "The Classic Reception",
    description: "Elegant two-tier design",
    tierCount: 2,
    tiers: [
      { tierLevel: 1, sizeInches: 10, servings: 38, height: 60 },
      { tierLevel: 2, sizeInches: 7, servings: 17, height: 55 },
    ],
    totalServings: 55,
    basePrice: 465,
  },
  {
    id: "grand",
    name: "The Grand Celebration",
    description: "Statement three-tier masterpiece",
    tierCount: 3,
    tiers: [
      { tierLevel: 1, sizeInches: 10, servings: 38, height: 55 },
      { tierLevel: 2, sizeInches: 8, servings: 24, height: 50 },
      { tierLevel: 3, sizeInches: 6, servings: 11, height: 45 },
    ],
    totalServings: 75,
    basePrice: 635,
  },
  {
    id: "gala",
    name: "The Gala Event",
    description: "Luxurious four-tier showpiece",
    tierCount: 4,
    tiers: [
      { tierLevel: 1, sizeInches: 12, servings: 56, height: 55 },
      { tierLevel: 2, sizeInches: 10, servings: 38, height: 50 },
      { tierLevel: 3, sizeInches: 8, servings: 24, height: 45 },
      { tierLevel: 4, sizeInches: 6, servings: 11, height: 40 },
    ],
    totalServings: 129,
    basePrice: 850,
  },
];

// Sponge flavors with optional premium pricing
export interface SpongeOption {
  id: string;
  name: string;
  description: string;
  pricePerServing: number; // 0 = included, > 0 = premium
}

export const spongeOptions: SpongeOption[] = [
  { id: "vanilla", name: "Signature Vanilla", description: "Classic & timeless", pricePerServing: 0 },
  { id: "chocolate", name: "Rich Chocolate", description: "Belgian cocoa perfection", pricePerServing: 0 },
  { id: "red_velvet", name: "Red Velvet", description: "Southern classic", pricePerServing: 0 },
  { id: "almond", name: "Almond Sponge", description: "Delicate & nutty", pricePerServing: 1.0 },
  { id: "coconut", name: "Coconut Sponge", description: "Tropical bliss", pricePerServing: 1.0 },
  { id: "carrot", name: "Carrot Spice", description: "Warmly spiced", pricePerServing: 1.0 },
];

// Dietary upgrades with per-serving pricing
export interface DietaryUpgrade {
  id: string;
  label: string;
  description: string;
  pricePerServing: number;
}

export const dietaryUpgrades: DietaryUpgrade[] = [
  { id: "none", label: "Classic", description: "Traditional recipe", pricePerServing: 0 },
  { id: "gluten_free", label: "Gluten-Free", description: "Wheat-free perfection", pricePerServing: 2.0 },
  { id: "sugar_free", label: "Sugar-Free", description: "Natural sweeteners", pricePerServing: 2.0 },
  { id: "keto", label: "Keto", description: "GF + Sugar-Free", pricePerServing: 3.5 },
  { id: "vegan", label: "Vegan", description: "Dairy-free & Egg-free", pricePerServing: 3.5 },
];

// Filling options
export interface FillingOption {
  id: string;
  name: string;
  description: string;
  pricePerServing: number;
}

export const fillingOptions: FillingOption[] = [
  { id: "vanilla_mousseline", name: "Vanilla Bean Mousseline", description: "Light & silky", pricePerServing: 0 },
  { id: "dark_ganache", name: "Dark Chocolate Ganache", description: "Rich & decadent", pricePerServing: 0 },
  { id: "dulce_de_leche", name: "Dulce de Leche", description: "Caramel heaven", pricePerServing: 0 },
  { id: "cream_cheese", name: "Cream Cheese Frosting", description: "Tangy & smooth", pricePerServing: 0 },
  { id: "fruit_buttercream", name: "Fruit Infused Buttercream", description: "Seasonal berries", pricePerServing: 0 },
  { id: "nutella", name: "Nutella / Ferrero", description: "Hazelnut indulgence", pricePerServing: 1.5 },
];

// Global outer finish options
export interface OuterFinish {
  id: string;
  name: string;
  description: string;
  flatFee: number;
}

export const outerFinishes: OuterFinish[] = [
  { id: "vanilla_buttercream", name: "Silky Vanilla Buttercream", description: "Classic smooth finish", flatFee: 0 },
  { id: "white_ganache", name: "White Chocolate Ganache", description: "More stability & sheen", flatFee: 45 },
  { id: "dark_ganache", name: "Dark Chocolate Ganache", description: "Premium finish", flatFee: 45 },
  { id: "semi_naked", name: "Semi-Naked Finish", description: "Rustic elegance", flatFee: 0 },
];

// Decoration options
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

// Topper options
export interface TopperOption {
  id: string;
  name: string;
  description: string;
  price: number;
}

export const topperOptions: TopperOption[] = [
  { id: "none", name: "No Topper", description: "", price: 0 },
  { id: "custom_names", name: "Custom 3D Print Names", description: "Two names included", price: 28 },
];

export const eventTypes = [
  "Wedding",
  "Corporate Event",
  "Birthday Celebration",
  "Anniversary",
  "Baby Shower",
  "Social Gathering",
];

// Get structure based on guest count
export function getRecommendedStructure(guests: number): CakeStructure {
  if (guests <= 35) return cakeStructures[0]; // intimate
  if (guests <= 55) return cakeStructures[1]; // classic
  if (guests <= 85) return cakeStructures[2]; // grand
  return cakeStructures[3]; // gala
}

// Calculate tier price based on configuration
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
  const dietary = dietaryUpgrades.find((d) => d.id === dietaryId);
  const filling = fillingOptions.find((f) => f.id === fillingId);

  const basePrice = servings * appConfig.pricingBase.basePricePerServing;
  const spongeUpgrade = servings * (sponge?.pricePerServing || 0);
  const dietaryUpgrade = servings * (dietary?.pricePerServing || 0);
  const fillingUpgrade = servings * (filling?.pricePerServing || 0);

  return {
    basePrice,
    spongeUpgrade,
    dietaryUpgrade,
    fillingUpgrade,
    total: basePrice + spongeUpgrade + dietaryUpgrade + fillingUpgrade,
  };
}

// Calculate total cake price
export function calculateTotalPrice(
  structure: CakeStructure,
  tierConfigs: TierConfiguration[],
  finishId: string,
  decorationId: string,
  topperId: string
): number {
  let total = 0;

  // Calculate each tier
  structure.tiers.forEach((tier, index) => {
    const config = tierConfigs[index];
    if (config) {
      const tierPrice = calculateTierPrice(
        tier.servings,
        config.spongeId,
        config.dietaryId,
        config.fillingId
      );
      total += tierPrice.total;
    }
  });

  // Add finish fee
  const finish = outerFinishes.find((f) => f.id === finishId);
  total += finish?.flatFee || 0;

  // Add decoration fee
  const decoration = decorationOptions.find((d) => d.id === decorationId);
  total += decoration?.flatFee || 0;

  // Add topper fee
  const topper = topperOptions.find((t) => t.id === topperId);
  total += topper?.price || 0;

  return total;
}

export interface TierConfiguration {
  spongeId: string;
  dietaryId: string;
  fillingId: string;
}

export function getMinEventDate(): Date {
  const date = new Date();
  date.setDate(date.getDate() + appConfig.leadTimeDays);
  return date;
}

// Get tier label by position
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

// Legacy exports for compatibility
export const dietaryCategories = [
  {
    id: "classic",
    label: "Signature Classics",
    description: "Our timeless gourmet selection.",
    allowedFlavors: ["vanilla", "chocolate", "red_velvet"],
    allowedFillings: ["vanilla_mousseline", "dark_ganache", "cream_cheese"],
  },
];

export const flavorDetails: Record<string, { id: string; name: string; description: string }> = {
  vanilla: { id: "vanilla", name: "Signature Vanilla", description: "Classic & timeless" },
  chocolate: { id: "chocolate", name: "Rich Chocolate", description: "Belgian cocoa" },
  red_velvet: { id: "red_velvet", name: "Red Velvet", description: "Southern classic" },
};

export const fillingDetails: Record<string, { id: string; name: string; description: string }> = {
  vanilla_mousseline: { id: "vanilla_mousseline", name: "Vanilla Bean Mousseline", description: "Light & silky" },
  dark_ganache: { id: "dark_ganache", name: "Dark Chocolate Ganache", description: "Rich & decadent" },
  cream_cheese: { id: "cream_cheese", name: "Cream Cheese Frosting", description: "Tangy & smooth" },
};

// Legacy function
export function calculateTiers(guests: number): number {
  return getRecommendedStructure(guests).tierCount;
}

export function calculateEstimate(guests: number, tiers: number): number {
  const structure = getRecommendedStructure(guests);
  return structure.basePrice;
}
