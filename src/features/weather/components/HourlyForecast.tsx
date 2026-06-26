"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import type { HourlyData } from "@/features/weather/types/weather";
import { formatTemperature, formatTime, getWeatherIconUrl, cn } from "@/shared/lib/utils";

interface HourlyForecastProps {
  data: HourlyData[];
  className?: string;
}

export function HourlyForecast({ data, className }: HourlyForecastProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className={cn("space-y-3", className)}
      aria-label="Prakiraan per jam"
    >
      <h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-foreground">
        Prakiraan Per Jam
      </h3>
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
        role="list"
        aria-label="Daftar prakiraan per jam"
      >
        {data.map((hour, index) => (
          <HourCard key={hour.dt} hour={hour} index={index} />
        ))}
      </div>
    </motion.section>
  );
}

function HourCard({ hour, index }: { hour: HourlyData; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="flex shrink-0 flex-col items-center gap-2 rounded-xl border border-border/50 bg-card p-3 shadow-card transition-colors hover:bg-muted/50"
      style={{ minWidth: "80px" }}
      role="listitem"
    >
      <span className="text-xs font-medium text-muted-foreground">
        {index === 0 ? "Sekarang" : formatTime(hour.dt)}
      </span>
      <img
        src={getWeatherIconUrl(hour.icon)}
        alt={hour.description}
        width={40}
        height={40}
      />
      <span className="text-sm font-bold text-foreground">
        {formatTemperature(hour.temp)}
      </span>
      {hour.pop > 0 && (
        <span className="text-xs text-sky-600 dark:text-sky-400">
          💧 {Math.round(hour.pop * 100)}%
        </span>
      )}
    </motion.div>
  );
}
