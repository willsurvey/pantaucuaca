import { OWM_BASE_URL, WEATHER_STALE_TIME, WEATHER_CACHE_TIME, WEATHER_RETRY_COUNT } from "@/shared/lib/constants";
import type {
  WeatherData,
  OWMCurrentResponse,
  OWMForecastResponse,
  HourlyData,
  DailyData,
} from "@/features/weather/types/weather";
import { groupForecastByDay } from "@/features/weather/utils/formatters";

function getApiKey(): string {
  const key = process.env.NEXT_PUBLIC_OWM_API_KEY;
  if (!key) throw new Error("OpenWeatherMap API key tidak tersedia");
  return key;
}

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timer);
  }
}

function transformCurrentWeather(
  data: OWMCurrentResponse
): WeatherData["current"] {
  return {
    temp: data.main.temp,
    feels_like: data.main.feels_like,
    humidity: data.main.humidity,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    main: data.weather[0].main as WeatherData["current"]["main"],
    wind_speed: data.wind.speed,
    pressure: data.main.pressure,
    visibility: data.visibility,
    dt: data.dt,
    city_name: data.name,
    country: data.sys.country,
    lat: data.coord.lat,
    lon: data.coord.lon,
  };
}

function transformForecast(data: OWMForecastResponse): {
  hourly: HourlyData[];
  daily: DailyData[];
} {
  const hourly: HourlyData[] = data.list.slice(0, 8).map((item) => ({
    dt: item.dt,
    temp: item.main.temp,
    icon: item.weather[0].icon,
    description: item.weather[0].description,
    pop: item.pop,
    humidity: item.main.humidity,
    wind_speed: item.wind.speed,
  }));

  const grouped = groupForecastByDay(
    data.list.map((item) => ({
      dt: item.dt,
      temp: item.main.temp,
      icon: item.weather[0].icon,
      description: item.weather[0].description,
      pop: item.pop,
      humidity: item.main.humidity,
      wind_speed: item.wind.speed,
    }))
  );

  const daily: DailyData[] = grouped.map((day) => ({
    dt: day.dt,
    temp_min: day.temp_min,
    temp_max: day.temp_max,
    icon: day.icon,
    description: day.description,
    main: day.main as DailyData["main"],
    humidity: day.humidity,
    wind_speed: day.wind_speed,
    pop: day.pop,
  }));

  return { hourly, daily };
}

async function fetchWithRetry(url: string, retries: number): Promise<Response> {
  let lastError: Error | null = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, 10000);
      if (response.ok) return response;
      if (response.status === 404) {
        throw new Error("Kota tidak ditemukan");
      }
      if (response.status === 429) {
        throw new Error("Terlalu banyak permintaan. Coba lagi nanti.");
      }
      throw new Error("Gagal mengambil data cuaca");
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Kesalahan jaringan");
      if (
        lastError.message === "Kota tidak ditemukan" ||
        lastError.message === "Terlalu banyak permintaan. Coba lagi nanti."
      ) {
        throw lastError;
      }
    }
  }
  throw lastError || new Error("Gagal mengambil data cuaca");
}

export async function getWeatherByCity(city: string): Promise<WeatherData> {
  const apiKey = getApiKey();
  const encodedCity = encodeURIComponent(city);

  const currentUrl = `${OWM_BASE_URL}/weather?q=${encodedCity}&appid=${apiKey}&units=metric&lang=id`;
  const forecastUrl = `${OWM_BASE_URL}/forecast?q=${encodedCity}&appid=${apiKey}&units=metric&lang=id`;

  const [currentRes, forecastRes] = await Promise.all([
    fetchWithRetry(currentUrl, WEATHER_RETRY_COUNT),
    fetchWithRetry(forecastUrl, WEATHER_RETRY_COUNT),
  ]);

  const currentData = (await currentRes.json()) as OWMCurrentResponse;
  const forecastData = (await forecastRes.json()) as OWMForecastResponse;

  const { hourly, daily } = transformForecast(forecastData);

  return {
    current: transformCurrentWeather(currentData),
    hourly,
    daily,
  };
}

export async function getWeatherByCoords(
  lat: number,
  lon: number
): Promise<WeatherData> {
  const apiKey = getApiKey();

  const currentUrl = `${OWM_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=id`;
  const forecastUrl = `${OWM_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=id`;

  const [currentRes, forecastRes] = await Promise.all([
    fetchWithRetry(currentUrl, WEATHER_RETRY_COUNT),
    fetchWithRetry(forecastUrl, WEATHER_RETRY_COUNT),
  ]);

  const currentData = (await currentRes.json()) as OWMCurrentResponse;
  const forecastData = (await forecastRes.json()) as OWMForecastResponse;

  const { hourly, daily } = transformForecast(forecastData);

  return {
    current: transformCurrentWeather(currentData),
    hourly,
    daily,
  };
}

export async function getCurrentWeatherForChat(
  city: string
): Promise<Record<string, unknown>> {
  try {
    const apiKey = getApiKey();
    const url = `${OWM_BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=id`;
    const res = await fetchWithRetry(url, 1);
    const data = (await res.json()) as OWMCurrentResponse;
    return {
      city: data.name,
      country: data.sys.country,
      temp: data.main.temp,
      feels_like: data.main.feels_like,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      description: data.weather[0].description,
      wind_speed: data.wind.speed,
      visibility: data.visibility,
    };
  } catch {
    return { error: "Tidak bisa mendapatkan data cuaca untuk kota tersebut." };
  }
}
