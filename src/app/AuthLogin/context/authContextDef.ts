import { createContext } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
  authProvider: "google" | "local";
  createdAt?: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (username: string, email: string, password: string) => Promise<AuthResult>;
  loginWithGoogle: (authData: string | { access_token?: string; sub?: string; name?: string; email?: string; picture?: string }) => Promise<AuthResult>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);