import { NextResponse } from "next/server";

export const runtime = "edge";

const OWM_BASE_URL = "https://api.openweathermap.org/data/2.5";
const OWM_API_KEY = process.env.NEXT_PUBLIC_OWM_API_KEY;

interface WeatherRequestParams {
  city?: string;
  lat?: string;
  lon?: string;
}

function getParamsFromUrl(url: URL): WeatherRequestParams {
  return {
    city: url.searchParams.get("city") ?? undefined,
    lat: url.searchParams.get("lat") ?? undefined,
    lon: url.searchParams.get("lon") ?? undefined,
  };
}

export async function GET(request: Request) {
  if (!OWM_API_KEY) {
    return NextResponse.json(
      { error: "OpenWeatherMap API key tidak dikonfigurasi" },
      { status: 500 }
    );
  }

  const params = getParamsFromUrl(new URL(request.url));

  if (!params.city && (!params.lat || !params.lon)) {
    return NextResponse.json(
      { error: "Parameter city atau lat/lon diperlukan" },
      { status: 400 }
    );
  }

  const cityRegex = /^[a-zA-Z\s\-]{2,50}$/;
  if (params.city && !cityRegex.test(params.city)) {
    return NextResponse.json(
      { error: "Nama kota tidak valid" },
      { status: 400 }
    );
  }

  try {
    const coordParam = params.city
      ? `q=${encodeURIComponent(params.city)}`
      : `lat=${params.lat}&lon=${params.lon}`;

    const [currentRes, forecastRes] = await Promise.all([
      fetch(`${OWM_BASE_URL}/weather?${coordParam}&appid=${OWM_API_KEY}&units=metric&lang=id`, {
        signal: AbortSignal.timeout(10000),
      }),
      fetch(`${OWM_BASE_URL}/forecast?${coordParam}&appid=${OWM_API_KEY}&units=metric&lang=id`, {
        signal: AbortSignal.timeout(10000),
      }),
    ]);

    if (!currentRes.ok) {
      if (currentRes.status === 404) {
        return NextResponse.json(
          { error: "Kota tidak ditemukan" },
          { status: 404 }
        );
      }
      if (currentRes.status === 429) {
        return NextResponse.json(
          { error: "Terlalu banyak permintaan" },
          { status: 429 }
        );
      }
      return NextResponse.json(
        { error: "Gagal mengambil data cuaca" },
        { status: 502 }
      );
    }

    const currentData = await currentRes.json();
    const forecastData = forecastRes.ok ? await forecastRes.json() : { list: [] };

    return NextResponse.json({
      current: currentData,
      forecast: forecastData,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "TimeoutError") {
      return NextResponse.json(
        { error: "Permintaan habis waktu" },
        { status: 504 }
      );
    }
    return NextResponse.json(
      { error: "Tidak dapat terhubung ke layanan cuaca" },
      { status: 503 }
    );
  }
}
