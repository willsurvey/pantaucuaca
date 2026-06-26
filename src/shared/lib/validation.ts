import {
  MAX_CITY_NAME_LENGTH,
  MIN_CITY_NAME_LENGTH,
  MAX_CHAT_MESSAGE_LENGTH,
} from "./constants";

const CITY_REGEX = /^[a-zA-Z\s\-]{2,50}$/;

export function validateCity(city: string): boolean {
  if (!city || city.length < MIN_CITY_NAME_LENGTH || city.length > MAX_CITY_NAME_LENGTH) {
    return false;
  }
  return CITY_REGEX.test(city);
}

export function validateMessage(message: string): boolean {
  return message.length > 0 && message.length <= MAX_CHAT_MESSAGE_LENGTH;
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/ignore previous instructions/gi, "")
    .replace(/system prompt/gi, "")
    .replace(/you are now/gi, "")
    .replace(/<\/?script[^>]*>/gi, "")
    .slice(0, MAX_CHAT_MESSAGE_LENGTH);
}

export function validateOutput(output: string): boolean {
  const sensitivePatterns: RegExp[] = [
    /api[_-]?key/i,
    /password/i,
    /secret/i,
    /token/i,
  ];
  return !sensitivePatterns.some((pattern) => pattern.test(output));
}
