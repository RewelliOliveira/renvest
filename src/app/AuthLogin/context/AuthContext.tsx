import { useState, useEffect, type ReactNode } from "react";
import { AuthContext, type User, type AuthResult } from "./authContextDef";
import { apiRegister, apiLogin, apiGoogleAuth, apiGetMe } from "../services/authApi";

export type { User, AuthResult } from "./authContextDef";

const USER_STORAGE_KEY = "@renvest:user";
const TOKEN_STORAGE_KEY = "@renvest:token";

function getStoredUser(): User | null {
  try {
    const savedUser = localStorage.getItem(USER_STORAGE_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getStoredUser);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Valida a sessão com o backend ao inicializar
  useEffect(() => {
    async function validateSession() {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const profile = await apiGetMe(token);
        const validatedUser: User = {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          picture: profile.picture,
          authProvider: profile.auth_provider,
          createdAt: profile.created_at,
        };
        setUser(validatedUser);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(validatedUser));
      } catch {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    validateSession();
  }, []);

  const register = async (username: string, email: string, password: string): Promise<AuthResult> => {
    try {
      const response = await apiRegister(username, email, password);
      const newUser: User = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        picture: response.user.picture,
        authProvider: response.user.auth_provider,
        createdAt: response.user.created_at,
      };

      localStorage.setItem(TOKEN_STORAGE_KEY, response.access_token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      setUser(newUser);

      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao cadastrar usuário.";
      return { success: false, error: message };
    }
  };

  const login = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const response = await apiLogin(email, password);
      const loggedUser: User = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        picture: response.user.picture,
        authProvider: response.user.auth_provider,
        createdAt: response.user.created_at,
      };

      localStorage.setItem(TOKEN_STORAGE_KEY, response.access_token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedUser));
      setUser(loggedUser);

      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao efetuar login.";
      return { success: false, error: message };
    }
  };

  const loginWithGoogle = async (
    authData: string | { access_token?: string; sub?: string; name?: string; email?: string; picture?: string }
  ): Promise<AuthResult> => {
    try {
      const token = typeof authData === "string" ? authData : authData.access_token;
      if (!token) {
        return { success: false, error: "Token de acesso do Google não fornecido." };
      }

      const response = await apiGoogleAuth(token);
      const googleUser: User = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        picture: response.user.picture,
        authProvider: response.user.auth_provider,
        createdAt: response.user.created_at,
      };

      localStorage.setItem(TOKEN_STORAGE_KEY, response.access_token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(googleUser));
      setUser(googleUser);

      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao efetuar login com Google.";
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  };

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