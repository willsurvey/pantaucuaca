import { NextResponse } from "next/server";
import { generateChatResponse } from "@/features/chat/services/gemini";
import { getCurrentWeatherForChat } from "@/features/weather/services/openweathermap";
import { sanitizeInput, validateMessage, validateOutput } from "@/shared/lib/validation";
import type { ChatRequestBody } from "@/features/chat/types/chat";

export const runtime = "edge";

const RATE_LIMIT_MAP = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_MAX = 20;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = RATE_LIMIT_MAP.get(ip);

  if (!entry || now > entry.resetTime) {
    RATE_LIMIT_MAP.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count += 1;
  return true;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Terlalu banyak permintaan. Coba lagi nanti." },
      {
        status: 429,
        headers: { "X-RateLimit-Limit": RATE_LIMIT_MAX.toString() },
      }
    );
  }

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "Gemini API key tidak dikonfigurasi" },
      { status: 500 }
    );
  }

  let body: ChatRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body tidak valid" },
      { status: 400 }
    );
  }

  const { message, history } = body;

  if (!message || typeof message !== "string") {
    return NextResponse.json(
      { error: "Pesan diperlukan" },
      { status: 400 }
    );
  }

  const sanitizedMessage = sanitizeInput(message);
  if (!validateMessage(sanitizedMessage)) {
    return NextResponse.json(
      { error: "Pesan tidak valid (maks 1000 karakter)" },
      { status: 400 }
    );
  }

  const safeHistory = Array.isArray(history)
    ? history
        .filter((m) => m.role === "user" || m.role === "assistant")
        .slice(-10)
        .map((m) => ({
          role: m.role as "user" | "assistant",
          content: sanitizeInput(m.content).slice(0, 500),
        }))
    : [];

  try {
    const stream = await generateChatResponse(
      sanitizedMessage,
      safeHistory,
      getCurrentWeatherForChat
    );

    const reader = stream.getReader();
    const chunks: string[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    const fullResponse = chunks.join("");

    if (!validateOutput(fullResponse)) {
      return NextResponse.json({
        message: "Maaf, saya tidak bisa memberikan respons tersebut.",
      });
    }

    return NextResponse.json({ message: fullResponse });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan";
    return NextResponse.json(
      { error: `Tidak dapat terhubung ke AI: ${errorMessage}` },
      { status: 503 }
    );
  }
}
