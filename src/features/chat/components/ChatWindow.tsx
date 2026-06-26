"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Trash2 } from "lucide-react";
import { useChat } from "@/features/chat/hooks/useChat";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { SuggestedPrompts } from "./SuggestedPrompts";
import { TypingIndicator } from "./TypingIndicator";
import { cn } from "@/shared/lib/utils";
import { SUGGESTED_PROMPTS } from "@/shared/lib/constants";

interface ChatWindowProps {
  className?: string;
}

export function ChatWindow({ className }: ChatWindowProps) {
  const { messages, isStreaming, sendMessage, clearChat } = useChat();
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSuggestedPrompt = useCallback(
    (prompt: string) => {
      sendMessage(prompt);
    },
    [sendMessage]
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center",
          "rounded-full bg-primary text-primary-foreground shadow-elevated",
          "transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
          isOpen && "scale-0"
        )}
        aria-label="Buka chat AI"
      >
        <MessageSquare className="h-6 w-6" aria-hidden="true" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "fixed bottom-6 right-6 z-50 flex h-[500px] w-[380px] flex-col",
              "rounded-2xl border border-border/50 bg-card shadow-elevated",
              "sm:bottom-8 sm:right-8 sm:h-[550px] sm:w-[420px]",
              className
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" aria-hidden="true" />
                <h3 className="font-[family-name:var(--font-heading)] text-sm font-semibold text-foreground">
                  PantauCuaca AI
                </h3>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    onClick={clearChat}
                    className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    aria-label="Hapus riwayat chat"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label="Tutup chat"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-3 scrollbar-hide"
              role="log"
              aria-label="Riwayat chat"
              aria-live="polite"
            >
              {messages.length === 0 && (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <MessageSquare className="h-10 w-10 text-primary/40" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Tanya soal cuaca!</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Saya bisa bantu info cuaca, rekomendasi outfit, dan tips aktivitas.
                    </p>
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}

              {isStreaming && <TypingIndicator />}
            </div>

            {/* Suggested Prompts */}
            {messages.length === 0 && (
              <div className="border-t border-border/50 px-4 py-2">
                <SuggestedPrompts
                  prompts={SUGGESTED_PROMPTS}
                  onSelect={handleSuggestedPrompt}
                />
              </div>
            )}

            {/* Input */}
            <div className="border-t border-border/50 px-4 py-3">
              <ChatInput onSend={sendMessage} disabled={isStreaming} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
