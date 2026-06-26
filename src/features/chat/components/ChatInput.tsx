"use client";

import { useState, useCallback, type FormEvent } from "react";
import { Send } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const trimmed = value.trim();
      if (!trimmed || disabled) return;
      onSend(trimmed);
      setValue("");
    },
    [value, disabled, onSend]
  );

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={disabled ? "Menunggu respons..." : "Tanya soal cuaca..."}
        disabled={disabled}
        className={cn(
          "flex-1 rounded-lg border border-border/50 bg-background px-3 py-2 text-sm",
          "text-foreground placeholder:text-muted-foreground",
          "transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
        aria-label="Ketik pesan"
        maxLength={1000}
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg",
          "bg-primary text-primary-foreground",
          "transition-colors hover:bg-primary/90",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        )}
        aria-label="Kirim pesan"
      >
        <Send className="h-4 w-4" aria-hidden="true" />
      </button>
    </form>
  );
}
