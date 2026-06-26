import DOMPurify from "dompurify";
import type { ChatMessage } from "@/features/chat/types/chat";

export function formatMarkdownToHtml(text: string): string {
  let html = text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, "<code class='rounded bg-muted px-1 py-0.5 text-sm'>$1</code>")
    .replace(/\n/g, "<br />");
  return html;
}

export function sanitizeHtml(html: string): string {
  if (typeof window === "undefined") return html;
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["strong", "em", "br", "code", "p", "ul", "ol", "li", "span"],
    ALLOWED_ATTR: ["class"],
  });
}

export function transformHistoryForApi(
  messages: ChatMessage[]
): Array<{ role: "user" | "assistant"; content: string }> {
  return messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .slice(-10)
    .map((m) => ({
      role: m.role,
      content: m.content,
    }));
}
