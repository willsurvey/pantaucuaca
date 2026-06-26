"use client";

import { useState, useCallback } from "react";
import type { ChatMessage } from "@/features/chat/types/chat";

interface UseStreamingReturn {
  streamingContent: string;
  isStreaming: boolean;
  startStreaming: (message: string) => void;
  appendContent: (chunk: string) => void;
  finishStreaming: () => void;
  reset: () => void;
}

export function useStreaming(): UseStreamingReturn {
  const [streamingContent, setStreamingContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const startStreaming = useCallback((message: string) => {
    setStreamingContent(message);
    setIsStreaming(true);
  }, []);

  const appendContent = useCallback((chunk: string) => {
    setStreamingContent((prev) => prev + chunk);
  }, []);

  const finishStreaming = useCallback(() => {
    setIsStreaming(false);
  }, []);

  const reset = useCallback(() => {
    setStreamingContent("");
    setIsStreaming(false);
  }, []);

  return {
    streamingContent,
    isStreaming,
    startStreaming,
    appendContent,
    finishStreaming,
    reset,
  };
}
