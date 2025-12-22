"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useBrandingStore, ColorTheme, colorThemes } from "@/store/brandingStore";
import { DynamicTheme } from "./DynamicTheme";

export function BrandingProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const { setCustomBranding } = useBrandingStore();

  useEffect(() => {
    const team = searchParams.get("team");
    const lightColor = searchParams.get("lightColor");
    const darkColor = searchParams.get("darkColor");

    if (team) {
      const validLightColor = (lightColor && lightColor in colorThemes) ? lightColor as ColorTheme : "green";
      const validDarkColor = (darkColor && darkColor in colorThemes) ? darkColor as ColorTheme : "green";
      setCustomBranding(team, validLightColor, validDarkColor);
    }
  }, [searchParams, setCustomBranding]);

  return (
    <>
      <DynamicTheme />
      {children}
    </>
  );
}
