import { create } from "zustand";
import { persist } from "zustand/middleware";

export const colorThemes = {
  green: { primary: "#15803d", light: "#f0fdf4", name: "Green" },
  blue: { primary: "#1e40af", light: "#eff6ff", name: "Blue" },
  purple: { primary: "#7e22ce", light: "#faf5ff", name: "Purple" },
  orange: { primary: "#c2410c", light: "#fff7ed", name: "Orange" },
  red: { primary: "#b91c1c", light: "#fef2f2", name: "Red" },
  teal: { primary: "#0f766e", light: "#f0fdfa", name: "Teal" },
  pink: { primary: "#db2777", light: "#fdf2f8", name: "Pink" },
  indigo: { primary: "#4338ca", light: "#eef2ff", name: "Indigo" },
  cyan: { primary: "#0891b2", light: "#ecfeff", name: "Cyan" },
  amber: { primary: "#d97706", light: "#fffbeb", name: "Amber" },
  emerald: { primary: "#059669", light: "#ecfdf5", name: "Emerald" },
  violet: { primary: "#7c3aed", light: "#f5f3ff", name: "Violet" },
} as const;

export type ColorTheme = keyof typeof colorThemes;

interface BrandingState {
  teamName: string;
  lightColorTheme: ColorTheme;
  darkColorTheme: ColorTheme;
  isCustomBranding: boolean;
  setTeamName: (name: string) => void;
  setLightColorTheme: (theme: ColorTheme) => void;
  setDarkColorTheme: (theme: ColorTheme) => void;
  setCustomBranding: (teamName: string, lightColorTheme: ColorTheme, darkColorTheme: ColorTheme) => void;
  resetBranding: () => void;
}

export const useBrandingStore = create<BrandingState>()(
  persist(
    (set) => ({
      teamName: "ELIVATE NETWORK",
      lightColorTheme: "green",
      darkColorTheme: "green",
      isCustomBranding: false,
      setTeamName: (name) => set({ teamName: name, isCustomBranding: true }),
      setLightColorTheme: (theme) => set({ lightColorTheme: theme, isCustomBranding: true }),
      setDarkColorTheme: (theme) => set({ darkColorTheme: theme, isCustomBranding: true }),
      setCustomBranding: (teamName, lightColorTheme, darkColorTheme) =>
        set({ teamName, lightColorTheme, darkColorTheme, isCustomBranding: true }),
      resetBranding: () =>
        set({ teamName: "ELIVATE NETWORK", lightColorTheme: "green", darkColorTheme: "green", isCustomBranding: false }),
    }),
    {
      name: "branding-storage",
    }
  )
);
