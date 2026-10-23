import type { ChatMessage, ChatSource } from "../types/types";

export function messageSources(msg: ChatMessage): ChatSource[] {
  return msg.sources ?? (msg.source ? [msg.source] : []);
}
