import { createContext } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
  authProvider: "google" | "local";
}

export interface AuthResult {
  success: boolean;
  error?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (username: string, email: string, password: string) => Promise<AuthResult>;
  loginWithGoogle: (profile: { sub: string; name: string; email: string; picture?: string }) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
