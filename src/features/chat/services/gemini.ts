import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { SYSTEM_PROMPT } from "@/features/chat/utils/prompts";
import { sanitizeInput, validateOutput } from "@/shared/lib/validation";
import type { ChatMessage } from "@/features/chat/types/chat";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

function getGenAI(): GoogleGenerativeAI {
  if (!GEMINI_API_KEY) throw new Error("Gemini API key tidak tersedia");
  return new GoogleGenerativeAI(GEMINI_API_KEY);
}

// Create proper schema objects for the function declaration parameters
const cityStringSchema = {
  type: SchemaType.STRING,
  description: "City name (e.g., Jakarta, Bandung, Surabaya)"
} as unknown as import("@google/generative-ai").Schema;

const weatherParameters: {
  type: typeof SchemaType.OBJECT;
  properties: {
    [k: string]: import("@google/generative-ai").Schema;
  };
  required: string[];
  description?: string;
} = {
  type: SchemaType.OBJECT,
  properties: {
    city: cityStringSchema
  },
  required: ["city"]
};

const weatherFunctionDeclaration = {
  name: "get_current_weather",
  description: "Get current weather data for a specific city",
  parameters: weatherParameters
};

export async function generateChatResponse(
  message: string,
  history: Array<{ role: "user" | "assistant"; content: string }>,
  weatherDataFetcher: (city: string) => Promise<Record<string, unknown>>
): Promise<ReadableStream<string>> {
  const sanitizedMessage = sanitizeInput(message);

  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: SYSTEM_PROMPT,
    tools: [{ functionDeclarations: [weatherFunctionDeclaration] }],
  });

  const chat = model.startChat({
    history: history.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    })),
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream<string>({
    async start(controller) {
      try {
        const result = await chat.sendMessage(sanitizedMessage);
        const response = result.response;
        const functionCalls = response.functionCalls();

        if (functionCalls && functionCalls.length > 0) {
          for (const fc of functionCalls) {
            if (fc.name === "get_current_weather") {
              const cityArg = (fc.args as Record<string, string>).city;
              const weatherData = await weatherDataFetcher(cityArg);

              const functionResponse = await chat.sendMessage([
                {
                  functionResponse: {
                    name: "get_current_weather",
                    response: weatherData,
                  },
                },
              ]);

              const finalText = functionResponse.response.text();
              if (validateOutput(finalText)) {
                controller.enqueue(finalText);
              } else {
                controller.enqueue("Maaf, saya tidak bisa memberikan respons tersebut.");
              }
            }
          }
        } else {
          const text = response.text();
          if (validateOutput(text)) {
            controller.enqueue(text);
          } else {
            controller.enqueue("Maaf, saya tidak bisa memberikan respons tersebut.");
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan";
        controller.enqueue(
          `Maaf, terjadi kesalahan: ${errorMessage.includes("429") ? "Terlalu banyak permintaan. Coba lagi nanti." : "Tidak bisa terhubung ke AI saat ini."}`
        );
      } finally {
        controller.close();
      }
    },
  });

  return stream;
}

export async function generateChatResponseString(
  message: string,
  history: Array<{ role: "user" | "assistant"; content: string }>,
  weatherDataFetcher: (city: string) => Promise<Record<string, unknown>>
): Promise<string> {
  const stream = await generateChatResponse(message, history, weatherDataFetcher);
  const reader = stream.getReader();
  const chunks: string[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  return chunks.join("");
}