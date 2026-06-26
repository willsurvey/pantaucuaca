export interface FavoriteCity {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export interface RecentSearch {
  name: string;
  country: string;
  queriedAt: number;
}

export interface GeolocationPosition {
  latitude: number;
  longitude: number;
}

export interface CitySearchResult {
  name: string;
  country: string;
  state: string;
  lat: number;
  lon: number;
}

export interface OWMGeoDirectResponse {
  name: string;
  local_names: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state: string;
}
