import { useState, type ReactNode } from "react";
import { AuthContext, type User, type AuthResult } from "./authContextDef";

export type { User, AuthResult } from "./authContextDef";

interface StoredAccount {
  id: string;
  username: string;
  email: string;
  password: string;
}

const USER_STORAGE_KEY = "@renvest:user";
const ACCOUNTS_STORAGE_KEY = "@renvest:registered_users";

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

  const getStoredAccounts = (): StoredAccount[] => {
    try {
      const data = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  const register = async (username: string, email: string, password: string): Promise<AuthResult> => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedUsername = username.trim();

    if (!trimmedUsername || !trimmedEmail || !password) {
      return { success: false, error: "Preencha todos os campos obrigatórios." };
    }

    const accounts = getStoredAccounts();
    const existing = accounts.find((acc) => acc.email.toLowerCase() === trimmedEmail);
    if (existing) {
      return { success: false, error: "Este e-mail já está cadastrado no sistema." };
    }

    const newAccount: StoredAccount = {
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      username: trimmedUsername,
      email: trimmedEmail,
      password,
    };

    accounts.push(newAccount);
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));

    const loggedUser: User = {
      id: newAccount.id,
      name: newAccount.username,
      email: newAccount.email,
      authProvider: "local",
    };

    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedUser));
    setUser(loggedUser);

    return { success: true };
  };

  const login = async (email: string, password: string): Promise<AuthResult> => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !password) {
      return { success: false, error: "Informe seu e-mail e sua senha." };
    }

    const accounts = getStoredAccounts();
    const account = accounts.find(
      (acc) => acc.email.toLowerCase() === trimmedEmail && acc.password === password
    );

    if (!account) {
      return { success: false, error: "E-mail ou senha incorretos." };
    }

    const loggedUser: User = {
      id: account.id,
      name: account.username,
      email: account.email,
      authProvider: "local",
    };

    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedUser));
    setUser(loggedUser);

    return { success: true };
  };

  const loginWithGoogle = (profile: { sub: string; name: string; email: string; picture?: string }) => {
    const loggedUser: User = {
      id: profile.sub,
      name: profile.name,
      email: profile.email,
      picture: profile.picture,
      authProvider: "google",
    };

    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedUser));
    setUser(loggedUser);
  };

  const logout = () => {
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
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
