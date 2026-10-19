import { useState, useEffect, useCallback, type ReactNode } from "react";
import { AuthContext, type User, type AuthResult } from "./authContextDef";
import {
  apiRegister,
  apiLogin,
  apiGoogleAuth,
  apiGetMe,
  type ApiUser,
  type AuthResponseData,
} from "../services/authApi";
import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY, UNAUTHORIZED_EVENT, getStoredToken } from "@/lib/api";
import { clearChatHistory } from "@/lib/chatHistory";
import { clearTrailData } from "@/app/Trail/hooks/useTrail";

export type { User, AuthResult } from "./authContextDef";

function toUser(apiUser: ApiUser): User {
  return {
    id: apiUser.id,
    name: apiUser.name,
    email: apiUser.email,
    picture: apiUser.picture,
    authProvider: apiUser.auth_provider,
    createdAt: apiUser.created_at,
  };
}

function getStoredUser(): User | null {
  try {
    const savedUser = localStorage.getItem(USER_STORAGE_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    return null;
  }
}

function clearStoredSession() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getStoredUser);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = useCallback(() => {
    clearStoredSession();
    clearChatHistory();
    clearTrailData();
    setUser(null);
  }, []);

  // Valida a sessão com o backend ao inicializar
  useEffect(() => {
    async function validateSession() {
      if (!getStoredToken()) {
        setIsLoading(false);
        return;
      }

      try {
        const validatedUser = toUser(await apiGetMe());
        setUser(validatedUser);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(validatedUser));
      } catch {
        logout();
      } finally {
        setIsLoading(false);
      }
    }

    validateSession();
  }, [logout]);

  // Encerra a sessão quando qualquer requisição autenticada retorna 401 (token expirado)
  useEffect(() => {
    window.addEventListener(UNAUTHORIZED_EVENT, logout);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, logout);
  }, [logout]);

  const authenticate = async (
    request: () => Promise<AuthResponseData>,
    fallbackError: string
  ): Promise<AuthResult> => {
    try {
      const response = await request();
      const authenticatedUser = toUser(response.user);
      localStorage.setItem(TOKEN_STORAGE_KEY, response.access_token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authenticatedUser));
      setUser(authenticatedUser);
      return { success: true, user: authenticatedUser };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : fallbackError };
    }
  };

  const register = (username: string, email: string, password: string) =>
    authenticate(() => apiRegister(username, email, password), "Erro ao cadastrar usuário.");

  const login = (email: string, password: string) =>
    authenticate(() => apiLogin(email, password), "Erro ao efetuar login.");

  const loginWithGoogle = (accessToken: string) =>
    authenticate(() => apiGoogleAuth(accessToken), "Erro ao efetuar login com Google.");

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
