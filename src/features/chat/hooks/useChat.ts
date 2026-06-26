"use client";

import { useState, useCallback, useRef } from "react";
import type { ChatMessage, ChatState } from "@/features/chat/types/chat";
import { generateId } from "@/shared/lib/utils";
import { validateMessage, sanitizeInput } from "@/shared/lib/validation";

interface UseChatReturn {
  messages: ChatMessage[];
  isStreaming: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
}

const INITIAL_STATE: ChatState = {
  messages: [],
  isStreaming: false,
  error: null,
};

export function useChat(): UseChatReturn {
  const [state, setState] = useState<ChatState>(INITIAL_STATE);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    const sanitized = sanitizeInput(content);
    if (!validateMessage(sanitized)) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      role: "user",
      content: sanitized,
      timestamp: Date.now(),
    };

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isStreaming: true,
      error: null,
    }));

    const assistantId = generateId();
    const assistantMessage: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
      timestamp: Date.now(),
    };

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, assistantMessage],
    }));

    try {
      abortRef.current = new AbortController();

      const history = state.messages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: sanitized, history }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        if (response.status === 429) throw new Error("Terlalu banyak permintaan. Coba lagi nanti.");
        throw new Error("Gagal mendapatkan respons dari AI");
      }

      const data = await response.json();

      if (data.error) throw new Error(data.error);

      setState((prev) => ({
        ...prev,
        messages: prev.messages.map((m) =>
          m.id === assistantId
            ? { ...m, content: data.message || "Maaf, tidak ada respons." }
            : m
        ),
        isStreaming: false,
      }));
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan";
      setState((prev) => ({
        ...prev,
        messages: prev.messages.map((m) =>
          m.id === assistantId
            ? { ...m, content: `❌ ${errorMessage}` }
            : m
        ),
        isStreaming: false,
        error: errorMessage,
      }));
    }
  }, [state.messages]);

  const clearChat = useCallback(() => {
    abortRef.current?.abort();
    setState(INITIAL_STATE);
  }, []);

  return {
    messages: state.messages,
    isStreaming: state.isStreaming,
    error: state.error,
    sendMessage,
    clearChat,
  };
}
