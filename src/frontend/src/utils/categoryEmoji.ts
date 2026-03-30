export const CATEGORY_EMOJIS: Record<string, string> = {
  Grains: "🌾",
  Spices: "🧂",
  Dairy: "🥛",
  Snacks: "🍪",
  Beverages: "☕",
  Vegetables: "🥦",
  Fruits: "🍎",
  "Personal Care": "🧼",
};

export function getCategoryEmoji(category: string): string {
  return CATEGORY_EMOJIS[category] ?? "🛒";
}

export const CATEGORIES = [
  { id: "All", label: "All", hindi: "सभी", emoji: "🛒" },
  { id: "Grains", label: "Grains", hindi: "अनाज", emoji: "🌾" },
  { id: "Spices", label: "Spices", hindi: "मसाले", emoji: "🧂" },
  { id: "Dairy", label: "Dairy", hindi: "डेयरी", emoji: "🥛" },
  { id: "Snacks", label: "Snacks", hindi: "स्नैक्स", emoji: "🍪" },
  { id: "Beverages", label: "Beverages", hindi: "पेय", emoji: "☕" },
  { id: "Vegetables", label: "Vegetables", hindi: "सब्जियां", emoji: "🥦" },
  { id: "Fruits", label: "Fruits", hindi: "फल", emoji: "🍎" },
  { id: "Personal Care", label: "Personal Care", hindi: "देखभाल", emoji: "🧼" },
];
