import { create } from "zustand";
import { persist } from "zustand/middleware";

export const colorThemes = {
  green: { primary: "#15803d", light: "#f0fdf4", name: "Green" },
  blue: { primary: "#1e40af", light: "#eff6ff", name: "Blue" },
  purple: { primary: "#7e22ce", light: "#faf5ff", name: "Purple" },
  orange: { primary: "#c2410c", light: "#fff7ed", name: "Orange" },
  red: { primary: "#b91c1c", light: "#fef2f2", name: "Red" },
  teal: { primary: "#0f766e", light: "#f0fdfa", name: "Teal" },
} as const;

export type ColorTheme = keyof typeof colorThemes;

interface BrandingState {
  teamName: string;
  colorTheme: ColorTheme;
  isCustomBranding: boolean;
  setTeamName: (name: string) => void;
  setColorTheme: (theme: ColorTheme) => void;
  setCustomBranding: (teamName: string, colorTheme: ColorTheme) => void;
  resetBranding: () => void;
}

export const useBrandingStore = create<BrandingState>()(
  persist(
    (set) => ({
      teamName: "ELIVATE NETWORK",
      colorTheme: "green",
      isCustomBranding: false,
      setTeamName: (name) => set({ teamName: name, isCustomBranding: true }),
      setColorTheme: (theme) => set({ colorTheme: theme, isCustomBranding: true }),
      setCustomBranding: (teamName, colorTheme) =>
        set({ teamName, colorTheme, isCustomBranding: true }),
      resetBranding: () =>
        set({ teamName: "ELIVATE NETWORK", colorTheme: "green", isCustomBranding: false }),
    }),
    {
      name: "branding-storage",
    }
  )
);
