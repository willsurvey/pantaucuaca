import { OWM_GEO_URL } from "@/shared/lib/constants";
import type { CitySearchResult, OWMGeoDirectResponse } from "../types/location";

function getApiKey(): string {
  const key = process.env.NEXT_PUBLIC_OWM_API_KEY;
  if (!key) throw new Error("OpenWeatherMap API key tidak tersedia");
  return key;
}

export async function searchCities(query: string): Promise<CitySearchResult[]> {
  if (!query || query.length < 2) return [];
  const apiKey = getApiKey();
  const url = `${OWM_GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${apiKey}`;

  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) return [];
    const data = (await response.json()) as OWMGeoDirectResponse[];
    return data.map((item) => ({
      name: item.name,
      country: item.country,
      state: item.state || "",
      lat: item.lat,
      lon: item.lon,
    }));
  } catch {
    return [];
  }
}

export async function reverseGeocode(lat: number, lon: number): Promise<string | null> {
  const apiKey = getApiKey();
  const url = `${OWM_GEO_URL}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;

  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) return null;
    const data = (await response.json()) as OWMGeoDirectResponse[];
    if (data.length === 0) return null;
    return data[0].name;
  } catch {
    return null;
  }
}
