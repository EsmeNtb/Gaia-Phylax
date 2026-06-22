// Shared theme tokens for Gaia Phylax — eco + fun.
export const colors = {
  primary: "#22C55E",
  primaryDark: "#16A34A",
  primarySoft: "#DCFCE7",
  secondary: "#FBBF24",
  accent: "#38BDF8",
  terracotta: "#EA580C",
  background: "#F0FDF4",
  surface: "#FFFFFF",
  card: "#FFFFFF",
  text: "#1C1917",
  textMuted: "#57534E",
  textFaint: "#A8A29E",
  border: "#E7E5E4",
  danger: "#EF4444",
  urgency: {
    low: "#4ADE80",
    medium: "#FACC15",
    high: "#FB923C",
    critical: "#EF4444",
  },
};

export const categories: Record<string, { label: string; icon: string; color: string; emoji: string }> = {
  pollution: { label: "Pollution", icon: "trash-2", color: "#A855F7", emoji: "🗑️" },
  fire: { label: "Fire / Smoke", icon: "flame", color: "#EF4444", emoji: "🔥" },
  deforestation: { label: "Deforestation", icon: "tree-pine", color: "#92400E", emoji: "🌲" },
  habitat_damage: { label: "Habitat Damage", icon: "alert-triangle", color: "#F97316", emoji: "🏚️" },
  injured_animal: { label: "Injured Animal", icon: "heart", color: "#EC4899", emoji: "🩹" },
  endangered_species: { label: "Endangered Species", icon: "shield", color: "#0EA5E9", emoji: "🦋" },
  illegal_hunting_fishing: { label: "Illegal Hunt/Fish", icon: "x-octagon", color: "#7C2D12", emoji: "🚫" },
  other: { label: "Other", icon: "more-horizontal", color: "#57534E", emoji: "📍" },
};

export const urgencyMeta: Record<string, { label: string; color: string }> = {
  low: { label: "Low", color: colors.urgency.low },
  medium: { label: "Medium", color: colors.urgency.medium },
  high: { label: "High", color: colors.urgency.high },
  critical: { label: "Critical", color: colors.urgency.critical },
};

export const radius = { sm: 12, md: 16, lg: 20, xl: 28, pill: 999 };
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

export const shadow = {
  card: {
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  float: {
    shadowColor: "#16A34A",
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
};
