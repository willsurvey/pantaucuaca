"use client";

import { cn } from "@/shared/lib/utils";

interface SuggestedPromptsProps {
  prompts: readonly string[];
  onSelect: (prompt: string) => void;
}

export function SuggestedPrompts({ prompts, onSelect }: SuggestedPromptsProps) {
  return (
    <div className="flex flex-wrap gap-1.5" role="group" aria-label="Saran pertanyaan">
      {prompts.map((prompt) => (
        <button
          key={prompt}
          onClick={() => onSelect(prompt)}
          className={cn(
            "rounded-full border border-border/50 bg-card px-3 py-1",
            "text-xs text-muted-foreground",
            "transition-colors hover:bg-muted/50 hover:text-foreground",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          )}
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
