export const MAX_FAVORITE_CITIES = 5;
export const MAX_RECENT_SEARCHES = 10;
export const MAX_CHAT_MESSAGE_LENGTH = 1000;
export const MAX_CITY_NAME_LENGTH = 50;
export const MIN_CITY_NAME_LENGTH = 2;

export const WEATHER_STALE_TIME = 10 * 60 * 1000;
export const WEATHER_CACHE_TIME = 30 * 60 * 1000;
export const WEATHER_RETRY_COUNT = 2;

export const OWM_BASE_URL = "https://api.openweathermap.org/data/2.5";
export const OWM_GEO_URL = "https://api.openweathermap.org/geo/1.0";

export const SUGGESTED_PROMPTS = [
  "Gimana cuaca Jakarta hari ini?",
  "Apakah perlu bawa payung?",
  "Rekomendasi outfit untuk cuaca sekarang?",
  "Kapan waktu terbaik untuk jogging?",
  "Bandingin cuaca Jakarta vs Bandung",
] as const;

export const WEATHER_CONDITION_LABELS: Record<string, string> = {
  Clear: "Cerah",
  Clouds: "Berawan",
  Rain: "Hujan",
  Drizzle: "Gerimis",
  Thunderstorm: "Badai Petir",
  Snow: "Salju",
  Mist: "Berkabut",
  Fog: "Kabut Tebal",
  Haze: "Berkabut",
  Dust: "Berdebu",
  Tornado: "Tornado",
};

export const DEFAULT_CITIES = [
  "Jakarta",
  "Bandung",
  "Surabaya",
  "Yogyakarta",
  "Bali",
] as const;
