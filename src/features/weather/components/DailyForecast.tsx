"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Droplets, Wind } from "lucide-react";
import type { DailyData } from "@/features/weather/types/weather";
import { formatTemperature, formatDayName, formatDate, getWeatherIconUrl, cn } from "@/shared/lib/utils";
import { getWeatherLabel } from "@/features/weather/utils/formatters";

interface DailyForecastProps {
  data: DailyData[];
  className?: string;
}

export function DailyForecast({ data, className }: DailyForecastProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className={cn("space-y-3", className)}
      aria-label="Prakiraan 7 hari"
    >
      <h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-foreground">
        Prakiraan 7 Hari
      </h3>
      <div className="space-y-2">
        {data.slice(0, 7).map((day, index) => (
          <DailyItem key={day.dt} day={day} index={index} />
        ))}
      </div>
    </motion.section>
  );
}

function DailyItem({ day, index }: { day: DailyData; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className={cn(
          "flex w-full items-center gap-3 rounded-xl border border-border/50 bg-card p-3 shadow-card",
          "transition-colors hover:bg-muted/50",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        )}
        aria-expanded={expanded}
        aria-label={`${formatDayName(day.dt)} ${formatDate(day.dt)}, ${getWeatherLabel(day.main)}, minimum ${formatTemperature(day.temp_min)}, maksimum ${formatTemperature(day.temp_max)}`}
      >
        <span className="w-10 text-center text-sm font-medium text-foreground">
          {index === 0 ? "Hari ini" : formatDayName(day.dt)}
        </span>
        <img
          src={getWeatherIconUrl(day.icon)}
          alt={day.description}
          width={36}
          height={36}
        />
        <span className="flex-1 text-left text-sm text-muted-foreground">
          {getWeatherLabel(day.main)}
        </span>
        <span className="text-sm font-semibold text-foreground">
          {formatTemperature(day.temp_max)}{" "}
          <span className="font-normal text-muted-foreground">
            / {formatTemperature(day.temp_min)}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200",
            expanded && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex gap-4 rounded-b-xl border border-t-0 border-border/50 bg-muted/30 px-4 py-3">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Droplets className="h-4 w-4" aria-hidden="true" />
                <span>Kelembapan: {day.humidity}%</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Wind className="h-4 w-4" aria-hidden="true" />
                <span>Angin: {day.wind_speed.toFixed(1)} km/jam</span>
              </div>
              <div className="text-sm text-sky-600 dark:text-sky-400">
                💧 Hujan: {Math.round(day.pop * 100)}%
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
