// Advanced Decoration Options with Pricing
// For the customization panel after reference photo upload

export interface DecorationCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  options: DecorationItem[];
}

export interface DecorationItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  priceType: "flat" | "per_tier";
  category: string;
  colorOptions?: string[];
  hasCustomInput?: boolean;
  customInputLabel?: string;
}

// Fresh Floral Options
export const floralOptions: DecorationItem[] = [
  {
    id: "floral_cascade",
    name: "Cascading Floral Arrangement",
    description: "Elegant flowers flowing down tiers",
    price: 120,
    priceType: "flat",
    category: "florals",
  },
  {
    id: "floral_crown",
    name: "Floral Crown Topper",
    description: "Fresh flower crown on top tier",
    price: 65,
    priceType: "flat",
    category: "florals",
  },
  {
    id: "floral_scattered",
    name: "Scattered Petals & Blooms",
    description: "Delicate flowers placed around tiers",
    price: 85,
    priceType: "flat",
    category: "florals",
  },
  {
    id: "floral_ring",
    name: "Floral Ring Base",
    description: "Fresh flowers surrounding the base",
    price: 95,
    priceType: "flat",
    category: "florals",
  },
];

// Fondant & Sugar Art
export const fondantOptions: DecorationItem[] = [
  {
    id: "fondant_pearls",
    name: "Fondant Pearl Strings",
    description: "Elegant pearl borders on each tier",
    price: 45,
    priceType: "flat",
    category: "fondant",
  },
  {
    id: "fondant_bows",
    name: "Handcrafted Sugar Bows",
    description: "Decorative bows per tier",
    price: 35,
    priceType: "per_tier",
    category: "fondant",
  },
  {
    id: "fondant_lace",
    name: "Lace Pattern Overlay",
    description: "Intricate lace design on tiers",
    price: 75,
    priceType: "flat",
    category: "fondant",
  },
  {
    id: "fondant_geometric",
    name: "Geometric Shapes",
    description: "Modern hexagons, triangles patterns",
    price: 55,
    priceType: "flat",
    category: "fondant",
  },
  {
    id: "fondant_ruffles",
    name: "Fondant Ruffles",
    description: "Romantic ruffle texture",
    price: 65,
    priceType: "flat",
    category: "fondant",
  },
];

// Gold/Metallic Details
export const metallicOptions: DecorationItem[] = [
  {
    id: "gold_leaf",
    name: "24K Gold Leaf Accents",
    description: "Genuine edible gold leaf",
    price: 80,
    priceType: "flat",
    category: "metallic",
  },
  {
    id: "gold_paint",
    name: "Hand-Painted Gold Details",
    description: "Custom metallic paint work",
    price: 65,
    priceType: "flat",
    category: "metallic",
  },
  {
    id: "silver_leaf",
    name: "Silver Leaf Accents",
    description: "Edible silver leaf decoration",
    price: 70,
    priceType: "flat",
    category: "metallic",
  },
  {
    id: "metallic_drip",
    name: "Metallic Drip Effect",
    description: "Gold or silver dripping chocolate",
    price: 55,
    priceType: "flat",
    category: "metallic",
  },
  {
    id: "rose_gold",
    name: "Rose Gold Finish",
    description: "Elegant rose gold accents",
    price: 75,
    priceType: "flat",
    category: "metallic",
  },
];

// 3D Printed Toppers
export const topperOptions3D: DecorationItem[] = [
  {
    id: "topper_initials",
    name: "Custom Initials",
    description: "Two letters in elegant font",
    price: 28,
    priceType: "flat",
    category: "toppers",
    hasCustomInput: true,
    customInputLabel: "Enter initials (e.g., J & M)",
  },
  {
    id: "topper_names",
    name: "Full Names Topper",
    description: "Both names beautifully styled",
    price: 38,
    priceType: "flat",
    category: "toppers",
    hasCustomInput: true,
    customInputLabel: "Enter names (e.g., Jennifer & Matthew)",
  },
  {
    id: "topper_date",
    name: "Wedding Date Topper",
    description: "Your special date",
    price: 25,
    priceType: "flat",
    category: "toppers",
    hasCustomInput: true,
    customInputLabel: "Enter date (e.g., 06.15.2025)",
  },
  {
    id: "topper_silhouette",
    name: "Couple Silhouette",
    description: "Elegant couple design",
    price: 45,
    priceType: "flat",
    category: "toppers",
  },
  {
    id: "topper_mr_mrs",
    name: "Mr & Mrs Banner",
    description: "Classic wedding topper",
    price: 32,
    priceType: "flat",
    category: "toppers",
  },
];

// Color Customization
export const colorPalettes = [
  { id: "white_classic", name: "Classic White", colors: ["#FFFFFF", "#F5F5F5", "#E8E8E8"] },
  { id: "ivory_gold", name: "Ivory & Gold", colors: ["#FFFFF0", "#D4AF37", "#F5DEB3"] },
  { id: "blush_pink", name: "Blush Pink", colors: ["#FFB6C1", "#FFC0CB", "#FF69B4"] },
  { id: "dusty_rose", name: "Dusty Rose", colors: ["#C08081", "#D4A5A5", "#E6C7C2"] },
  { id: "sage_green", name: "Sage Green", colors: ["#9CAF88", "#B2C9AD", "#C5D5C5"] },
  { id: "navy_gold", name: "Navy & Gold", colors: ["#000080", "#D4AF37", "#1C1C5E"] },
  { id: "burgundy", name: "Burgundy Wine", colors: ["#800020", "#722F37", "#8B0000"] },
  { id: "lavender", name: "Lavender Dream", colors: ["#E6E6FA", "#D8BFD8", "#DDA0DD"] },
  { id: "rustic", name: "Rustic Earth", colors: ["#8B4513", "#A0522D", "#D2691E"] },
  { id: "tropical", name: "Tropical Sunset", colors: ["#FF6B6B", "#F9844A", "#FFE66D"] },
];

// All decoration categories
export const decorationCategories: DecorationCategory[] = [
  {
    id: "florals",
    name: "Fresh Florals",
    description: "Seasonal flowers and greenery",
    icon: "🌸",
    options: floralOptions,
  },
  {
    id: "fondant",
    name: "Fondant & Sugar Art",
    description: "Handcrafted decorative elements",
    icon: "🎀",
    options: fondantOptions,
  },
  {
    id: "metallic",
    name: "Gold & Metallic",
    description: "Luxurious metallic accents",
    icon: "✨",
    options: metallicOptions,
  },
  {
    id: "toppers",
    name: "3D Print Toppers",
    description: "Personalized cake toppers",
    icon: "👑",
    options: topperOptions3D,
  },
];

// Helper to calculate decoration total
export function calculateDecorationTotal(
  selectedDecorations: string[],
  customInputs: Record<string, string>,
  tierCount: number
): number {
  let total = 0;
  
  const allOptions = [
    ...floralOptions,
    ...fondantOptions,
    ...metallicOptions,
    ...topperOptions3D,
  ];
  
  selectedDecorations.forEach((decorationId) => {
    const option = allOptions.find((o) => o.id === decorationId);
    if (option) {
      if (option.priceType === "per_tier") {
        total += option.price * tierCount;
      } else {
        total += option.price;
      }
    }
  });
  
  return total;
}

// Get all selected decorations with details
export function getSelectedDecorationDetails(
  selectedDecorations: string[],
  customInputs: Record<string, string>
): Array<{ item: DecorationItem; customValue?: string }> {
  const allOptions = [
    ...floralOptions,
    ...fondantOptions,
    ...metallicOptions,
    ...topperOptions3D,
  ];
  
  const results: Array<{ item: DecorationItem; customValue?: string }> = [];
  
  for (const decorationId of selectedDecorations) {
    const item = allOptions.find((o) => o.id === decorationId);
    if (item) {
      results.push({
        item,
        customValue: item.hasCustomInput ? customInputs[decorationId] : undefined,
      });
    }
  }
  
  return results;
}
