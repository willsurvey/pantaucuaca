import { WEATHER_CONDITION_LABELS } from "@/shared/lib/constants";
import type { WeatherCondition } from "@/features/weather/types/weather";

export function getWeatherLabel(main: string): string {
  return WEATHER_CONDITION_LABELS[main] || main;
}

export function getWeatherIconCode(icon: string): string {
  return icon.replace(/[dn]$/, "");
}

export function isDayTime(icon: string): boolean {
  return icon.endsWith("d");
}

export function getTimeOfDay(): "morning" | "afternoon" | "evening" | "night" {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 20) return "evening";
  return "night";
}

export function getBackgroundGradient(
  weatherMain: string,
  isDay: boolean
): string {
  if (!isDay) return "from-slate-900 via-blue-900 to-slate-900";
  const condition = weatherMain as WeatherCondition;
  switch (condition) {
    case "Clear":
      return "from-sky-400 via-blue-500 to-sky-600";
    case "Clouds":
      return "from-slate-400 via-gray-500 to-slate-600";
    case "Rain":
    case "Drizzle":
      return "from-slate-600 via-gray-700 to-slate-800";
    case "Thunderstorm":
      return "from-slate-800 via-purple-900 to-slate-900";
    default:
      return "from-sky-400 via-blue-500 to-sky-600";
  }
}

export function getGreeting(): string {
  const time = getTimeOfDay();
  switch (time) {
    case "morning":
      return "Selamat Pagi";
    case "afternoon":
      return "Selamat Siang";
    case "evening":
      return "Selamat Sore";
    case "night":
      return "Selamat Malam";
  }
}

export function groupForecastByDay(
  items: Array<{ dt: number; temp: number; icon: string; description: string; pop: number; humidity: number; wind_speed: number }>
): Array<{
  date: string;
  dt: number;
  temp_min: number;
  temp_max: number;
  icon: string;
  description: string;
  main: string;
  pop: number;
  humidity: number;
  wind_speed: number;
}> {
  const dayMap = new Map<
    string,
    {
      dt: number;
      temps: number[];
      icons: string[];
      descriptions: string[];
      pops: number[];
      humidities: number[];
      windSpeeds: number[];
    }
  >();

  for (const item of items) {
    const date = new Date(item.dt * 1000).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const existing = dayMap.get(date);
    if (existing) {
      existing.temps.push(item.temp);
      existing.icons.push(item.icon);
      existing.descriptions.push(item.description);
      existing.pops.push(item.pop);
      existing.humidities.push(item.humidity);
      existing.windSpeeds.push(item.wind_speed);
    } else {
      dayMap.set(date, {
        dt: item.dt,
        temps: [item.temp],
        icons: [item.icon],
        descriptions: [item.description],
        pops: [item.pop],
        humidities: [item.humidity],
        windSpeeds: [item.wind_speed],
      });
    }
  }

  return Array.from(dayMap.entries())
    .slice(0, 7)
    .map(([, data]) => ({
      date: "",
      dt: data.dt,
      temp_min: Math.min(...data.temps),
      temp_max: Math.max(...data.temps),
      icon: data.icons[Math.floor(data.icons.length / 2)],
      description: data.descriptions[Math.floor(data.descriptions.length / 2)],
      main: "",
      pop: Math.max(...data.pops),
      humidity: Math.round(
        data.humidities.reduce((a, b) => a + b, 0) / data.humidities.length
      ),
      wind_speed:
        Math.round(
          (data.windSpeeds.reduce((a, b) => a + b, 0) / data.windSpeeds.length) *
            10
        ) / 10,
    }));
}
