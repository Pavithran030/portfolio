export type ThemeMode = "cyber-emerald" | "hyperion-amber" | "cosmic-violet";

export interface ThemeConfig {
  id: ThemeMode;
  name: string;
  label: string;
  accentHex: string;
  dotColorHex: number;
  bgHex: number;
  previewGradient: string;
}

export const THEMES: Record<ThemeMode, ThemeConfig> = {
  "cyber-emerald": {
    id: "cyber-emerald",
    name: "Cyber Emerald",
    label: "Emerald & Cyan",
    accentHex: "#10b981",
    dotColorHex: 0x10b981,
    bgHex: 0x090d16,
    previewGradient: "linear-gradient(135deg, #10b981, #06b6d4)",
  },
  "hyperion-amber": {
    id: "hyperion-amber",
    name: "Hyperion Amber",
    label: "Solar Amber",
    accentHex: "#f59e0b",
    dotColorHex: 0xf59e0b,
    bgHex: 0x120e0b,
    previewGradient: "linear-gradient(135deg, #f59e0b, #f97316)",
  },
  "cosmic-violet": {
    id: "cosmic-violet",
    name: "Cosmic Violet",
    label: "Neon Violet",
    accentHex: "#8b5cf6",
    dotColorHex: 0x8b5cf6,
    bgHex: 0x0b0a14,
    previewGradient: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
  },
};
