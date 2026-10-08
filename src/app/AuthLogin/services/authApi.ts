const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  picture?: string;
  auth_provider: "google" | "local";
  created_at?: string;
}

export interface AuthResponseData {
  user: ApiUser;
  access_token: string;
  token_type: string;
}

export async function apiRegister(name: string, email: string, password: string): Promise<AuthResponseData> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Erro ao realizar cadastro.");
  }
  return res.json();
}

export async function apiLogin(email: string, password: string): Promise<AuthResponseData> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Erro ao realizar login.");
  }
  return res.json();
}

export async function apiGoogleAuth(accessToken: string): Promise<AuthResponseData> {
  const res = await fetch(`${API_URL}/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ access_token: accessToken }),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Erro na autenticação com Google.");
  }
  return res.json();
}

export async function apiGetMe(token: string): Promise<ApiUser> {
  const res = await fetch(`${API_URL}/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error("Sessão expirada ou inválida.");
  }
  return res.json();
}