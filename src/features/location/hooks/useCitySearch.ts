"use client";

import { useQuery } from "@tanstack/react-query";
import { searchCities } from "@/features/location/services/location";
import type { CitySearchResult } from "../types/location";

export function useCitySearch(query: string) {
  return useQuery<CitySearchResult[]>({
    queryKey: ["citySearch", query],
    queryFn: () => searchCities(query),
    enabled: query.length >= 2,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
