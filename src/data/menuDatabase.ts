export const appConfig = {
  leadTimeDays: 30,
  pricingBase: {
    currency: "CAD",
    basePricePerGuest: 12.0,
    tierComplexityFee: 50.0,
  },
};

export interface DietaryCategory {
  id: string;
  label: string;
  description: string;
  allowedFlavors: string[];
  allowedFillings: string[];
}

export interface FlavorDetail {
  id: string;
  name: string;
  description: string;
}

export interface FillingDetail {
  id: string;
  name: string;
  description: string;
}

export const dietaryCategories: DietaryCategory[] = [
  {
    id: "classic",
    label: "Signature Classics",
    description: "Our timeless gourmet selection.",
    allowedFlavors: ["vanilla_rum", "choco_classic", "red_velvet", "moka_lover"],
    allowedFillings: ["buttercream_vanilla", "ganache_choco", "cream_cheese"],
  },
  {
    id: "vegan",
    label: "Vegan (Plant-Based)",
    description: "100% Plant-based, 100% Delicious.",
    allowedFlavors: ["vegan_vanilla", "vegan_choco", "vegan_red_velvet"],
    allowedFillings: ["vegan_ganache", "coconut_cream", "vegan_buttercream"],
  },
  {
    id: "gluten_free",
    label: "Gluten-Free",
    description: "Wheat-free without compromising fluffiness.",
    allowedFlavors: ["gf_almond_vanilla", "gf_choco", "gf_lemon"],
    allowedFillings: ["buttercream_vanilla", "ganache_choco", "fruit_compote"],
  },
];

export const flavorDetails: Record<string, FlavorDetail> = {
  vanilla_rum: {
    id: "vanilla_rum",
    name: "Vanilla Rum Classic",
    description: "Venezuelan Rum Infusion",
  },
  choco_classic: {
    id: "choco_classic",
    name: "Chocolate Classic",
    description: "Rich & Moist Belgian Chocolate",
  },
  red_velvet: {
    id: "red_velvet",
    name: "Red Velvet",
    description: "Signature cream cheese frosting",
  },
  moka_lover: {
    id: "moka_lover",
    name: "Mocha Lover",
    description: "Espresso-infused layers",
  },
  vegan_vanilla: {
    id: "vegan_vanilla",
    name: "Vegan Vanilla",
    description: "Almond Milk Base",
  },
  vegan_choco: {
    id: "vegan_choco",
    name: "Vegan Chocolate",
    description: "Dark cacao with coconut cream",
  },
  vegan_red_velvet: {
    id: "vegan_red_velvet",
    name: "Vegan Red Velvet",
    description: "Beet-infused with cashew frosting",
  },
  gf_almond_vanilla: {
    id: "gf_almond_vanilla",
    name: "Almond Flour Vanilla",
    description: "Light & nutty undertones",
  },
  gf_choco: {
    id: "gf_choco",
    name: "GF Chocolate",
    description: "Flourless chocolate decadence",
  },
  gf_lemon: {
    id: "gf_lemon",
    name: "GF Lemon",
    description: "Bright citrus notes",
  },
};

export const fillingDetails: Record<string, FillingDetail> = {
  buttercream_vanilla: {
    id: "buttercream_vanilla",
    name: "Vanilla Buttercream",
    description: "Classic Swiss meringue",
  },
  ganache_choco: {
    id: "ganache_choco",
    name: "Chocolate Ganache",
    description: "Silky Belgian chocolate",
  },
  cream_cheese: {
    id: "cream_cheese",
    name: "Cream Cheese",
    description: "Tangy & smooth",
  },
  vegan_ganache: {
    id: "vegan_ganache",
    name: "Vegan Ganache",
    description: "Coconut-based dark chocolate",
  },
  coconut_cream: {
    id: "coconut_cream",
    name: "Coconut Cream",
    description: "Light & tropical",
  },
  vegan_buttercream: {
    id: "vegan_buttercream",
    name: "Vegan Buttercream",
    description: "Aquafaba-based Swiss",
  },
  fruit_compote: {
    id: "fruit_compote",
    name: "Seasonal Fruit Compote",
    description: "Fresh berry reduction",
  },
};

export const eventTypes = [
  "Wedding",
  "Corporate Event",
  "Birthday Celebration",
  "Anniversary",
  "Baby Shower",
  "Social Gathering",
];

export function calculateTiers(guests: number): number {
  if (guests <= 30) return 1;
  if (guests <= 75) return 2;
  if (guests <= 120) return 3;
  return 4;
}

export function calculateEstimate(guests: number, tiers: number): number {
  const basePrice = guests * appConfig.pricingBase.basePricePerGuest;
  const tierFee = tiers * appConfig.pricingBase.tierComplexityFee;
  return basePrice + tierFee;
}

export function getMinEventDate(): Date {
  const date = new Date();
  date.setDate(date.getDate() + appConfig.leadTimeDays);
  return date;
}
