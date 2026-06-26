"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getWeatherByCity } from "@/features/weather/services/openweathermap";
import { formatTemperature, getWeatherIconUrl, cn } from "@/shared/lib/utils";
import { WEATHER_STALE_TIME } from "@/shared/lib/constants";

interface CityComparisonProps {
  cities: string[];
  onRemoveCity: (city: string) => void;
  className?: string;
}

export function CityComparison({ cities, onRemoveCity, className }: CityComparisonProps) {
  return (
    <section className={cn("space-y-3", className)} aria-label="Perbandingan cuaca kota">
      <h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-foreground">
        Perbandingan Cuaca
      </h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cities.map((city) => (
          <ComparisonCard key={city} city={city} onRemove={onRemoveCity} />
        ))}
      </div>
    </section>
  );
}

function ComparisonCard({
  city,
  onRemove,
}: {
  city: string;
  onRemove: (city: string) => void;
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["weather", city],
    queryFn: () => getWeatherByCity(city),
    staleTime: WEATHER_STALE_TIME,
    retry: 1,
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-xl border border-border/50 bg-card p-4 shadow-card"
    >
      <div className="mb-3 flex items-center justify-between">
        <h4 className="font-[family-name:var(--font-heading)] text-base font-semibold text-foreground">{city}</h4>
        <button
          onClick={() => onRemove(city)}
          className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          aria-label={`Hapus ${city} dari perbandingan`}
        >
          ✕
        </button>
      </div>
      {isLoading && <div className="animate-pulse space-y-2"><div className="h-6 w-20 rounded bg-muted" /><div className="h-4 w-32 rounded bg-muted" /></div>}
      {error && <p className="text-sm text-destructive">Gagal memuat data</p>}
      {data && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <img src={getWeatherIconUrl(data.current.icon)} alt={data.current.description} width={40} height={40} />
            <span className="text-2xl font-bold">{formatTemperature(data.current.temp)}</span>
          </div>
          <p className="text-sm capitalize text-muted-foreground">{data.current.description}</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <span>💧 {data.current.humidity}%</span>
            <span>💨 {data.current.wind_speed} km/jam</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
