"use client";

import { motion } from "framer-motion";
import { Droplets, Wind, Eye, Gauge, Thermometer, Sun } from "lucide-react";
import type { CurrentWeather } from "@/features/weather/types/weather";
import { formatTemperature, formatWindSpeed, formatPressure, formatVisibility, getWeatherIconUrl, cn } from "@/shared/lib/utils";
import { getWeatherLabel, getGreeting } from "@/features/weather/utils/formatters";

interface WeatherCardProps {
  weather: CurrentWeather;
  className?: string;
}

export function WeatherCard({ weather, className }: WeatherCardProps) {
  const greeting = getGreeting();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "rounded-xl border border-border/50 bg-card p-6 shadow-card",
        className
      )}
    >
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{greeting}</p>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-foreground">
            {weather.city_name}, {weather.country}
          </h2>
        </div>
        <img
          src={getWeatherIconUrl(weather.icon)}
          alt={weather.description}
          width={64}
          height={64}
          className="drop-shadow-lg"
        />
      </div>

      <div className="mb-4">
        <p className="font-[family-name:var(--font-heading)] text-6xl font-bold tracking-tight text-foreground">
          {formatTemperature(weather.temp)}
        </p>
        <p className="mt-1 text-lg capitalize text-muted-foreground">
          {weather.description}
        </p>
        <p className="text-sm text-muted-foreground">
          Terasa seperti {formatTemperature(weather.feels_like)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <DetailItem
          icon={Droplets}
          label="Kelembapan"
          value={`${weather.humidity}%`}
        />
        <DetailItem
          icon={Wind}
          label="Angin"
          value={formatWindSpeed(weather.wind_speed)}
        />
        <DetailItem
          icon={Gauge}
          label="Tekanan"
          value={formatPressure(weather.pressure)}
        />
        <DetailItem
          icon={Eye}
          label="Jarak Pandang"
          value={formatVisibility(weather.visibility)}
        />
        <DetailItem
          icon={Thermometer}
          label="Terasa Seperti"
          value={formatTemperature(weather.feels_like)}
        />
      </div>

      <div className="mt-4 rounded-lg bg-primary/5 p-3">
        <p className="text-sm text-primary">
          <Sun className="mr-1.5 inline h-4 w-4" aria-hidden="true" />
          Kondisi: <span className="font-medium">{getWeatherLabel(weather.main)}</span>
        </p>
      </div>
    </motion.div>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-lg bg-muted/50 p-3 text-center">
      <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}
