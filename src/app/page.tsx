"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useAppStore } from "@/shared/lib/store";
import { useWeather, useWeatherByCoords } from "@/features/weather/hooks/useWeather";
import { useGeolocation } from "@/features/location/hooks/useGeolocation";
import { useFavoriteCities, usePrefetchFavorites } from "@/features/weather/hooks/useForecast";
import { useWeatherBackground } from "@/features/weather/hooks/useWeatherBackground";
import { WeatherCard } from "@/features/weather/components/WeatherCard";
import { HourlyForecast } from "@/features/weather/components/HourlyForecast";
import { DailyForecast } from "@/features/weather/components/DailyForecast";
import { WeatherBackground } from "@/features/weather/components/WeatherBackground";
import { WeatherDetails } from "@/features/weather/components/WeatherDetails";
import { SmartRecommendations } from "@/features/weather/components/SmartRecommendations";
import { CitySelector } from "@/features/location/components/CitySelector";
import { FavoriteCities } from "@/features/location/components/FavoriteCities";
import { Header } from "@/shared/components/Header";
import { Footer } from "@/shared/components/Footer";
import {
  WeatherCardSkeleton,
  HourlyForecastSkeleton,
  DailyForecastSkeleton,
} from "@/shared/components/LoadingSpinner";
import { WeatherErrorFallback } from "@/shared/components/ErrorBoundary";
import { DEFAULT_CITIES } from "@/shared/lib/constants";
import { MapPin, Loader2 } from "lucide-react";

const ChatWindow = dynamic(
  () => import("@/features/chat/components/ChatWindow").then((mod) => mod.ChatWindow),
  { ssr: false, loading: () => null }
);

const CityComparison = dynamic(
  () => import("@/features/location/components/CityComparison").then((mod) => mod.CityComparison),
  { ssr: false }
);

export default function HomePage() {
  const { selectedCity, setSelectedCity, comparisonCities, removeComparisonCity } = useAppStore();
  const { favorites, addFavorite, removeFavorite } = useFavoriteCities();
  usePrefetchFavorites();

  const { latitude, longitude, error: geoError, loading: geoLoading, requestLocation } = useGeolocation();
  const [showComparison, setShowComparison] = useState(false);

  const cityWeather = useWeather(selectedCity);
  const coordsWeather = useWeatherByCoords(latitude, longitude);

  const weather = latitude !== null && longitude !== null ? coordsWeather.data : cityWeather.data;
  const isLoading = latitude !== null && longitude !== null ? coordsWeather.isLoading : cityWeather.isLoading;
  const error = latitude !== null && longitude !== null ? coordsWeather.error : cityWeather.error;
  const activeRefetch = latitude !== null && longitude !== null
    ? () => coordsWeather.refetch()
    : () => cityWeather.refetch();

  const { gradient } = useWeatherBackground(
    weather?.current.main || "Clear",
    weather?.current.icon || "01d"
  );

  useEffect(() => {
    if (!selectedCity && latitude !== null && longitude !== null) {
      setSelectedCity("Jakarta");
    }
  }, [selectedCity, latitude, longitude, setSelectedCity]);

  const handleCitySelect = useCallback(
    (city: string) => {
      setSelectedCity(city);
    },
    [setSelectedCity]
  );

  const handleAddToFavorites = useCallback(() => {
    if (!weather) return;
    addFavorite({
      name: weather.current.city_name,
      country: weather.current.country,
      lat: weather.current.lat,
      lon: weather.current.lon,
    });
  }, [weather, addFavorite]);

  const handleDetectLocation = useCallback(() => {
    requestLocation();
  }, [requestLocation]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section with Weather Background */}
        <section className="relative overflow-hidden" id="weather">
          <WeatherBackground gradient={gradient}>
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
              {/* City Selector Bar */}
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <CitySelector
                  onSelectCity={handleCitySelect}
                  currentCity={selectedCity}
                  className="w-full sm:max-w-sm"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDetectLocation}
                    disabled={geoLoading}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border/50 bg-card px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/50 disabled:opacity-50"
                    aria-label="Deteksi lokasi otomatis"
                  >
                    {geoLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                    )}
                    Lokasi Saya
                  </button>
                  {weather && (
                    <button
                      onClick={handleAddToFavorites}
                      disabled={favorites.length >= 5}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border/50 bg-card px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/50 disabled:opacity-50"
                      aria-label="Tambahkan ke favorit"
                    >
                      ❤️ Favorit
                    </button>
                  )}
                  <button
                    onClick={() => setShowComparison((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border/50 bg-card px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/50"
                    aria-label="Bandingkan cuaca"
                  >
                    🔄 Bandingkan
                  </button>
                </div>
              </div>

              {geoError && (
                <div className="mb-4 rounded-lg bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400" role="alert">
                  {geoError}
                </div>
              )}

              {/* Favorite Cities */}
              {favorites.length > 0 && (
                <div className="mb-4">
                  <FavoriteCities
                    favorites={favorites}
                    onRemove={removeFavorite}
                    onSelect={handleCitySelect}
                  />
                </div>
              )}

              {/* Welcome / Empty State */}
              {!selectedCity && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <MapPin className="mb-4 h-12 w-12 text-primary/40" aria-hidden="true" />
                  <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-foreground">
                    Pilih kota untuk melihat cuaca
                  </h2>
                  <p className="mt-2 text-muted-foreground">
                    Cari kota atau gunakan lokasi saat ini
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {DEFAULT_CITIES.map((city) => (
                      <button
                        key={city}
                        onClick={() => handleCitySelect(city)}
                        className="rounded-full border border-border/50 bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/50"
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Weather Content */}
              {selectedCity && isLoading && (
                <div className="space-y-6">
                  <WeatherCardSkeleton />
                  <HourlyForecastSkeleton />
                  <DailyForecastSkeleton />
                </div>
              )}

              {selectedCity && error && (
                <WeatherErrorFallback error={error} reset={activeRefetch} />
              )}

              {weather && (
                <div className="space-y-6">
                  <WeatherCard weather={weather.current} />
                  <WeatherDetails weather={weather.current} />
                </div>
              )}
            </div>
          </WeatherBackground>
        </section>

        {/* Forecast Section */}
        {weather && (
          <section className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
            <HourlyForecast data={weather.hourly} />
            <DailyForecast data={weather.daily} />

            {/* Smart Recommendations */}
            <SmartRecommendations weather={weather.current} />

            {/* City Comparison */}
            {showComparison && comparisonCities.length > 0 && (
              <CityComparison
                cities={comparisonCities}
                onRemoveCity={removeComparisonCity}
              />
            )}
            {showComparison && (
              <div className="flex items-center gap-2">
                <CitySelector
                  onSelectCity={(city) => useAppStore.getState().addComparisonCity(city)}
                  currentCity={null}
                  className="w-full sm:max-w-xs"
                />
                <span className="text-xs text-muted-foreground">
                  {comparisonCities.length}/3 kota
                </span>
              </div>
            )}
          </section>
        )}
      </main>

      <Footer />

      {/* AI Chat (Floating) */}
      <ChatWindow />
    </div>
  );
}
