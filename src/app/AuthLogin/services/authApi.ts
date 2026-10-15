import { apiRequest } from "@/lib/api";

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

export function apiRegister(name: string, email: string, password: string): Promise<AuthResponseData> {
  return apiRequest("/auth/register", {
    method: "POST",
    body: { name, email, password },
    fallbackError: "Erro ao realizar cadastro.",
  });
}

export function apiLogin(email: string, password: string): Promise<AuthResponseData> {
  return apiRequest("/auth/login", {
    method: "POST",
    body: { email, password },
    fallbackError: "Erro ao realizar login.",
  });
}

export function apiGoogleAuth(accessToken: string): Promise<AuthResponseData> {
  return apiRequest("/auth/google", {
    method: "POST",
    body: { access_token: accessToken },
    fallbackError: "Erro na autenticação com Google.",
  });
}

export function apiGetMe(): Promise<ApiUser> {
  return apiRequest("/auth/me", {
    method: "GET",
    auth: true,
    fallbackError: "Sessão expirada ou inválida.",
  });
}
