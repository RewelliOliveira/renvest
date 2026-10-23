import type { CSSProperties } from "react";

export type MascotVariant = "red" | "blue" | "green" | "purple" | "amber";

interface MascotPalette {
  dark: string;
  deep: string;
  base: string;
  light: string;
  highlightFrom: string;
  highlightTo: string;
}

export const MASCOT_PALETTES: Record<MascotVariant, MascotPalette> = {
  red: { dark: "#D91C26", deep: "#E91E27", base: "#FB4243", light: "#FE5251", highlightFrom: "#FF908F", highlightTo: "#FDC2C2" },
  blue: { dark: "#1D4ED8", deep: "#2563EB", base: "#3B82F6", light: "#60A5FA", highlightFrom: "#93C5FD", highlightTo: "#DBEAFE" },
  green: { dark: "#15803D", deep: "#16A34A", base: "#22C55E", light: "#4ADE80", highlightFrom: "#86EFAC", highlightTo: "#DCFCE7" },
  purple: { dark: "#6D28D9", deep: "#7C3AED", base: "#8B5CF6", light: "#A78BFA", highlightFrom: "#C4B5FD", highlightTo: "#EDE9FE" },
  amber: { dark: "#C2410C", deep: "#EA580C", base: "#F59E0B", light: "#FBBF24", highlightFrom: "#FCD34D", highlightTo: "#FEF3C7" },
};

// Dark, palette-tinted backdrop so the Rev stands out instead of blending into its own color.
export function mascotStageStyle(palette: MascotPalette, glowAt = "12% 100%"): CSSProperties {
  return {
    background: `radial-gradient(circle at ${glowAt}, ${palette.light}55, transparent 55%), color-mix(in srgb, ${palette.dark} 30%, #0b1220)`,
    border: `1px solid color-mix(in srgb, ${palette.light} 30%, transparent)`,
    boxShadow: `0 5px 0 color-mix(in srgb, ${palette.dark} 45%, #000815)`,
  };
}
