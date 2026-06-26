"use client";

import { Heart, X, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { FavoriteCity } from "@/features/location/types/location";
import { cn } from "@/shared/lib/utils";

interface FavoriteCitiesProps {
  favorites: FavoriteCity[];
  onRemove: (cityName: string) => void;
  onSelect: (cityName: string) => void;
  className?: string;
}

export function FavoriteCities({ favorites, onRemove, onSelect, className }: FavoriteCitiesProps) {
  if (favorites.length === 0) {
    return (
      <div className={cn("rounded-xl border border-dashed border-border/50 p-6 text-center", className)}>
        <Heart className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">
          Belum ada kota favorit. Tambahkan dengan klik ❤️
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)} aria-label="Kota favorit">
      <h4 className="text-sm font-medium text-muted-foreground">Kota Favorit</h4>
      <div className="flex flex-wrap gap-2">
        <AnimatePresence mode="popLayout">
          {favorites.map((city) => (
            <motion.div
              key={city.name}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="group flex items-center gap-1.5 rounded-full border border-border/50 bg-card px-3 py-1.5 shadow-card transition-colors hover:bg-muted/50"
            >
              <button
                onClick={() => onSelect(city.name)}
                className="flex items-center gap-1.5 text-sm font-medium text-foreground"
                aria-label={`Lihat cuaca ${city.name}`}
              >
                <MapPin className="h-3 w-3 text-primary" aria-hidden="true" />
                {city.name}
              </button>
              <button
                onClick={() => onRemove(city.name)}
                className="rounded-full p-0.5 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                aria-label={`Hapus ${city.name} dari favorit`}
              >
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
