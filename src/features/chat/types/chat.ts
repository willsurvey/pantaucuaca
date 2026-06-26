export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface ChatState {
  messages: ChatMessage[];
  isStreaming: boolean;
  error: string | null;
}

export interface ChatRequestBody {
  message: string;
  history: Array<{ role: "user" | "assistant"; content: string }>;
}

export interface ChatApiResponse {
  message: string;
  error?: string;
}

export interface FunctionCallResult {
  name: string;
  response: Record<string, unknown>;
}
