"use client";

import { useMemo } from "react";
import { useIsDarkMode } from "@/shared/hooks/useMediaQuery";
import { getBackgroundGradient, isDayTime, getTimeOfDay } from "@/features/weather/utils/formatters";

export function useWeatherBackground(weatherMain: string, weatherIcon: string) {
  const systemDarkMode = useIsDarkMode();
  const timeOfDay = getTimeOfDay();

  const gradient = useMemo(() => {
    if (systemDarkMode) return "from-slate-900 via-blue-950 to-slate-900";
    if (timeOfDay === "night") return "from-slate-900 via-blue-900 to-slate-900";
    const isDay = isDayTime(weatherIcon);
    return getBackgroundGradient(weatherMain, isDay);
  }, [weatherMain, weatherIcon, systemDarkMode, timeOfDay]);

  const textColor = useMemo(() => {
    if (gradient.includes("slate-900") || gradient.includes("slate-800")) {
      return "text-white";
    }
    return "text-foreground";
  }, [gradient]);

  return { gradient, textColor };
}
