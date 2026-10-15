export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const TOKEN_STORAGE_KEY = "@renvest:token";
export const USER_STORAGE_KEY = "@renvest:user";

// Disparado quando uma requisição autenticada recebe 401, para o AuthContext encerrar a sessão
export const UNAUTHORIZED_EVENT = "renvest:unauthorized";

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

interface ApiRequestOptions extends Omit<RequestInit, "body" | "headers"> {
  body?: unknown;
  auth?: boolean;
  fallbackError: string;
}

export async function apiRequest<T>(
  path: string,
  { body, auth = false, fallbackError, ...init }: ApiRequestOptions
): Promise<T> {
  const headers: Record<string, string> = {};
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const token = auth ? getStoredToken() : null;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    if (res.status === 401 && token) {
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    }
    const errorData = await res.json().catch(() => ({}));
    // Erros de validação (422) chegam como lista; nesses casos usamos a mensagem padrão
    throw new Error(typeof errorData.detail === "string" ? errorData.detail : fallbackError);
  }

  return res.json() as Promise<T>;
}
