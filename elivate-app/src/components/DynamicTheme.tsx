"use client";

import { useEffect, useState } from "react";
import { useBrandingStore, colorThemes } from "@/store/brandingStore";

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
}

export function DynamicTheme() {
  const { lightColorTheme, darkColorTheme } = useBrandingStore();
  const [isDark, setIsDark] = useState(false);

  // Detect theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const checkTheme = () => {
      const htmlElement = document.documentElement;
      const hasDarkClass = htmlElement.classList.contains("dark");
      setIsDark(hasDarkClass);
    };

    // Initial check
    checkTheme();

    // Watch for class changes on html element
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Also listen to media query changes
    mediaQuery.addEventListener("change", checkTheme);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", checkTheme);
    };
  }, []);

  // Apply colors based on theme
  useEffect(() => {
    const colorTheme = isDark ? darkColorTheme : lightColorTheme;
    const brandColor = colorThemes[colorTheme];
    const root = document.documentElement;
    const { r, g, b } = hexToRgb(brandColor.primary);

    // Set the main brand color
    root.style.setProperty("--brand", brandColor.primary);

    // Generate darker variant for strong/hover states (darken by ~25%)
    const darkerR = Math.max(0, Math.round(r * 0.75));
    const darkerG = Math.max(0, Math.round(g * 0.75));
    const darkerB = Math.max(0, Math.round(b * 0.75));
    const brandStrong = rgbToHex(darkerR, darkerG, darkerB);
    root.style.setProperty("--brand-strong", brandStrong);

    // Generate lighter variant for soft states (lighten by ~25%)
    const lighterR = Math.min(255, Math.round(r + (255 - r) * 0.25));
    const lighterG = Math.min(255, Math.round(g + (255 - g) * 0.25));
    const lighterB = Math.min(255, Math.round(b + (255 - b) * 0.25));
    const brandSoft = rgbToHex(lighterR, lighterG, lighterB);
    root.style.setProperty("--brand-soft", brandSoft);

    // Set the light background color
    root.style.setProperty("--cream", brandColor.light);

    console.log("Dynamic theme applied:", {
      mode: isDark ? "dark" : "light",
      colorTheme,
      primary: brandColor.primary,
      strong: brandStrong,
      soft: brandSoft,
      light: brandColor.light,
    });

  }, [isDark, lightColorTheme, darkColorTheme]);

  return null; // This component only manages CSS variables
}
