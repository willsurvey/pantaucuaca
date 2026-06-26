"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useCallback } from "react";
import { getWeatherByCity } from "@/features/weather/services/openweathermap";
import type { FavoriteCity } from "@/features/location/types/location";
import { useLocalStorage } from "@/shared/hooks/useLocalStorage";

export function useForecast() {
  const queryClient = useQueryClient();

  const prefetchForecast = useCallback(
    (city: string) => {
      queryClient.prefetchQuery({
        queryKey: ["weather", city],
        queryFn: () => getWeatherByCity(city),
        staleTime: 10 * 60 * 1000,
      });
    },
    [queryClient]
  );

  return { prefetchForecast };
}

export function useFavoriteCities() {
  const [favorites, setFavorites] = useLocalStorage<FavoriteCity[]>(
    "pantaucuaca_favorites",
    []
  );

  const addFavorite = useCallback(
    (city: FavoriteCity) => {
      setFavorites((prev) => {
        if (prev.length >= 5) return prev;
        if (prev.some((f) => f.name === city.name)) return prev;
        return [...prev, city];
      });
    },
    [setFavorites]
  );

  const removeFavorite = useCallback(
    (cityName: string) => {
      setFavorites((prev) => prev.filter((f) => f.name !== cityName));
    },
    [setFavorites]
  );

  const isFavorite = useCallback(
    (cityName: string) => {
      return favorites.some((f) => f.name === cityName);
    },
    [favorites]
  );

  return { favorites, addFavorite, removeFavorite, isFavorite };
}

export function usePrefetchFavorites() {
  const { prefetchForecast } = useForecast();
  const [favorites] = useLocalStorage<FavoriteCity[]>("pantaucuaca_favorites", []);

  useEffect(() => {
    favorites.forEach((city) => {
      prefetchForecast(city.name);
    });
  }, [favorites, prefetchForecast]);
}
