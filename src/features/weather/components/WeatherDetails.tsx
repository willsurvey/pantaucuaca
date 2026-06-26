"use client";

import {
  Droplets,
  Wind,
  Eye,
  Gauge,
  Thermometer,
} from "lucide-react";
import type { CurrentWeather } from "@/features/weather/types/weather";
import { formatWindSpeed, formatPressure, formatVisibility, formatTemperature, cn } from "@/shared/lib/utils";

interface WeatherDetailsProps {
  weather: CurrentWeather;
  className?: string;
}

const details = [
  { key: "feels_like", label: "Terasa Seperti", icon: Thermometer, format: (v: number) => formatTemperature(v) },
  { key: "humidity", label: "Kelembapan", icon: Droplets, format: (v: number) => `${v}%` },
  { key: "wind_speed", label: "Kecepatan Angin", icon: Wind, format: (v: number) => formatWindSpeed(v) },
  { key: "pressure", label: "Tekanan Udara", icon: Gauge, format: (v: number) => formatPressure(v) },
  { key: "visibility", label: "Jarak Pandang", icon: Eye, format: (v: number) => formatVisibility(v) },
] as const;

export function WeatherDetails({ weather, className }: WeatherDetailsProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5", className)}>
      {details.map(({ key, label, icon: Icon, format }) => {
        const value = weather[key as keyof CurrentWeather] as number;
        return (
          <div
            key={key}
            className="flex flex-col items-center gap-2 rounded-xl border border-border/50 bg-card p-4 shadow-card transition-colors hover:bg-muted/50"
          >
            <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="text-sm font-semibold text-foreground">{format(value)}</span>
          </div>
        );
      })}
    </div>
  );
}
