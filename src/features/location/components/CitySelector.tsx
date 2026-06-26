"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Search, MapPin, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCitySearch } from "@/features/location/hooks/useCitySearch";
import { validateCity } from "@/shared/lib/validation";
import { cn, generateId } from "@/shared/lib/utils";
import type { CitySearchResult } from "@/features/location/types/location";

interface CitySelectorProps {
  onSelectCity: (city: string) => void;
  currentCity: string | null;
  className?: string;
}

export function CitySelector({ onSelectCity, currentCity, className }: CitySelectorProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: results, isLoading } = useCitySearch(query);

  const handleSelect = useCallback(
    (result: CitySearchResult) => {
      // Use lat/lon query for OWM to avoid "City not found" errors
      // OWM weather API accepts city names like "Bandung" but Geo API returns
      // qualified names like "Bandung City" which OWM weather doesn't recognize
      const cityName = result.name.replace(/ (City|Regency|Kabupaten|Kota)$/i, "");
      onSelectCity(cityName);
      setQuery("");
      setIsOpen(false);
    },
    [onSelectCity]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
      if (e.key === "Enter" && query.trim() && validateCity(query.trim())) {
        onSelectCity(query.trim());
        setQuery("");
        setIsOpen(false);
      }
    },
    [query, onSelectCity]
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={currentCity ? `Saat ini: ${currentCity}` : "Cari kota..."}
            className={cn(
              "w-full rounded-lg border border-border/50 bg-card py-2.5 pl-10 pr-10",
              "text-sm text-foreground placeholder:text-muted-foreground",
              "transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            )}
            aria-label="Cari kota"
            aria-expanded={isOpen}
            aria-autocomplete="list"
            role="combobox"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setIsOpen(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Hapus pencarian"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (query.length >= 2 || isLoading) && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-1 w-full rounded-xl border border-border/50 bg-card shadow-elevated"
            role="listbox"
          >
            {isLoading && (
              <div className="flex items-center gap-2 p-3 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Mencari kota...
              </div>
            )}
            {!isLoading && results && results.length === 0 && query.length >= 2 && (
              <div className="p-3 text-sm text-muted-foreground">
                Kota tidak ditemukan. Coba nama lain.
              </div>
            )}
            {!isLoading &&
              results?.map((result) => (
                <button
                  key={generateId()}
                  onClick={() => handleSelect(result)}
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm",
                    "transition-colors hover:bg-muted/50 focus:bg-muted/50",
                    "first:rounded-t-xl last:rounded-b-xl"
                  )}
                  role="option"
                  aria-selected={false}
                >
                  <MapPin className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <span className="font-medium text-foreground">{result.name}</span>
                  <span className="text-muted-foreground">
                    {result.state && `${result.state}, `}{result.country}
                  </span>
                </button>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
