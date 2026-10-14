import { apiRequest } from "@/lib/api";
import type { ChatApiResponse, ChatHistoryItem, SuggestionsApiResponse } from "../types/types";

export interface SendChatMessageParams {
  message: string;
  module?: string;
  history?: ChatHistoryItem[];
}

export function sendChatMessage({
  message,
  module = "modulo_1",
  history = [],
}: SendChatMessageParams): Promise<ChatApiResponse> {
  return apiRequest("/chat", {
    method: "POST",
    auth: true,
    body: { message, module, history },
    fallbackError: "Não foi possível obter resposta do Rev. Tente novamente em instantes.",
  });
}

export async function getChatSuggestions(module: string = "modulo_1"): Promise<string[]> {
  try {
    const data = await apiRequest<SuggestionsApiResponse>(
      `/chat/suggestions?module=${encodeURIComponent(module)}`,
      { method: "GET", fallbackError: "" }
    );
    return data.suggestions || [];
  } catch {
    return [];
  }
}
