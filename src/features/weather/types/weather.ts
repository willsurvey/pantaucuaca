export type WeatherCondition =
  | "Clear"
  | "Clouds"
  | "Rain"
  | "Drizzle"
  | "Thunderstorm"
  | "Snow"
  | "Mist"
  | "Fog"
  | "Haze"
  | "Dust"
  | "Tornado";

export interface CurrentWeather {
  temp: number;
  feels_like: number;
  humidity: number;
  description: string;
  icon: string;
  main: WeatherCondition;
  wind_speed: number;
  pressure: number;
  visibility: number;
  dt: number;
  city_name: string;
  country: string;
  lat: number;
  lon: number;
}

export interface HourlyData {
  dt: number;
  temp: number;
  icon: string;
  description: string;
  pop: number;
  humidity: number;
  wind_speed: number;
}

export interface DailyData {
  dt: number;
  temp_min: number;
  temp_max: number;
  icon: string;
  description: string;
  main: WeatherCondition;
  humidity: number;
  wind_speed: number;
  pop: number;
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyData[];
  daily: DailyData[];
}

export interface OWMCurrentResponse {
  coord: { lon: number; lat: number };
  weather: Array<{ id: number; main: string; description: string; icon: string }>;
  main: {
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: { speed: number };
  dt: number;
  name: string;
  sys: { country: string };
}

export interface OWMForecastItem {
  dt: number;
  main: { temp: number; humidity: number; pressure: number };
  weather: Array<{ id: number; main: string; description: string; icon: string }>;
  pop: number;
  wind: { speed: number };
}

export interface OWMForecastResponse {
  list: OWMForecastItem[];
  city: {
    name: string;
    country: string;
    coord: { lon: number; lat: number };
  };
}
