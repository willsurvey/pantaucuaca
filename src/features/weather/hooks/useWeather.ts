"use client";

import { useQuery } from "@tanstack/react-query";
import { getWeatherByCity, getWeatherByCoords } from "@/features/weather/services/openweathermap";
import { WEATHER_STALE_TIME, WEATHER_CACHE_TIME, WEATHER_RETRY_COUNT } from "@/shared/lib/constants";

export function useWeather(city: string | null) {
  return useQuery({
    queryKey: ["weather", city],
    queryFn: () => {
      if (!city) throw new Error("Kota belum dipilih");
      return getWeatherByCity(city);
    },
    enabled: !!city,
    staleTime: WEATHER_STALE_TIME,
    gcTime: WEATHER_CACHE_TIME,
    refetchOnWindowFocus: false,
    retry: WEATHER_RETRY_COUNT,
  });
}

export function useWeatherByCoords(lat: number | null, lon: number | null) {
  return useQuery({
    queryKey: ["weather", "coords", lat, lon],
    queryFn: () => {
      if (lat === null || lon === null) throw new Error("Koordinat tidak tersedia");
      return getWeatherByCoords(lat, lon);
    },
    enabled: lat !== null && lon !== null,
    staleTime: WEATHER_STALE_TIME,
    gcTime: WEATHER_CACHE_TIME,
    refetchOnWindowFocus: false,
    retry: WEATHER_RETRY_COUNT,
  });
}
