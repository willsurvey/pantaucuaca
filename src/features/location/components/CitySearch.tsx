"use client";

import { useCallback, useRef, useState } from "react";
import { Search, MapPin, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCitySearch } from "@/features/location/hooks/useCitySearch";
import { validateCity } from "@/shared/lib/validation";
import { cn } from "@/shared/lib/utils";
import type { CitySearchResult } from "@/features/location/types/location";

interface CitySearchProps {
  onSelect: (result: CitySearchResult) => void;
  className?: string;
}

export function CitySearch({ onSelect, className }: CitySearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: results, isLoading } = useCitySearch(query);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
      if (e.key === "Enter" && query.trim() && validateCity(query.trim())) {
        onSelect({
          name: query.trim(),
          country: "ID",
          state: "",
          lat: 0,
          lon: 0,
        });
        setQuery("");
        setIsOpen(false);
      }
    },
    [query, onSelect]
  );

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Cari kota di Indonesia..."
          className={cn(
            "w-full rounded-lg border border-border/50 bg-card py-2.5 pl-10 pr-10",
            "text-sm text-foreground placeholder:text-muted-foreground",
            "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          )}
          aria-label="Cari kota"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          role="combobox"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setIsOpen(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Hapus"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && query.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute z-50 mt-1 w-full rounded-xl border border-border/50 bg-card shadow-elevated"
            role="listbox"
          >
            {isLoading && (
              <div className="p-3 text-sm text-muted-foreground">Mencari...</div>
            )}
            {!isLoading && results?.length === 0 && (
              <div className="p-3 text-sm text-muted-foreground">Kota tidak ditemukan.</div>
            )}
            {results?.map((result, i) => (
              <button
                key={`${result.name}-${result.lat}-${i}`}
                onClick={() => {
                  onSelect(result);
                  setQuery("");
                  setIsOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted/50 first:rounded-t-xl last:rounded-b-xl"
                role="option"
              >
                <MapPin className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span className="font-medium">{result.name}</span>
                <span className="text-muted-foreground">
                  {result.state ? `${result.state}, ` : ""}{result.country}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
