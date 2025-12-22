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
    const color = searchParams.get("color");

    if (team) {
      const validColor = (color && color in colorThemes) ? color as ColorTheme : "green";
      setCustomBranding(team, validColor);
    }
  }, [searchParams, setCustomBranding]);

  return (
    <>
      <DynamicTheme />
      {children}
    </>
  );
}
