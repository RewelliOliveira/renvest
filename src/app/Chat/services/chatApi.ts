import type { ChatApiResponse, ChatHistoryItem, SuggestionsApiResponse } from "../types/types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
const TOKEN_STORAGE_KEY = "@renvest:token";

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export interface SendChatMessageParams {
  message: string;
  module?: string;
  history?: ChatHistoryItem[];
}

export async function sendChatMessage({
  message,
  module = "modulo_1",
  history = [],
}: SendChatMessageParams): Promise<ChatApiResponse> {
  const res = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      message,
      module,
      history,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.detail || "Não foi possível obter resposta do Rev. Tente novamente em instantes."
    );
  }

  return res.json();
}

export async function getChatSuggestions(module: string = "modulo_1"): Promise<string[]> {
  try {
    const res = await fetch(`${API_URL}/chat/suggestions?module=${encodeURIComponent(module)}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      return [];
    }

    const data: SuggestionsApiResponse = await res.json();
    return data.suggestions || [];
  } catch {
    return [];
  }
}
