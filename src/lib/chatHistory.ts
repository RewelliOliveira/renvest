import type { ChatMessage } from "@/app/Chat/types/types";

const CHAT_STORAGE_PREFIX = "@renvest:chat:";
const MAX_STORED_MESSAGES = 50;

export function loadChatHistory(userId?: string): ChatMessage[] | null {
  if (!userId) return null;
  try {
    const saved = sessionStorage.getItem(CHAT_STORAGE_PREFIX + userId);
    return saved ? (JSON.parse(saved) as ChatMessage[]) : null;
  } catch {
    return null;
  }
}

export function saveChatHistory(userId: string, messages: ChatMessage[]): void {
  try {
    sessionStorage.setItem(CHAT_STORAGE_PREFIX + userId, JSON.stringify(messages.slice(-MAX_STORED_MESSAGES)));
  } catch {
    return;
  }
}

export function clearChatHistory(): void {
  try {
    Object.keys(sessionStorage)
      .filter((key) => key.startsWith(CHAT_STORAGE_PREFIX))
      .forEach((key) => sessionStorage.removeItem(key));
  } catch {
    return;
  }
}
