"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { clearAuthStorage } from "@/lib/api";

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function readIsAuthenticatedCookie(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie
    .split(";")
    .some((c) => c.trim().startsWith("is_authenticated=true"));
}

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Lê o cookie de UI (não-httpOnly) para determinar estado inicial
    setIsAuthenticated(readIsAuthenticatedCookie());
  }, []);

  useEffect(() => {
    const handleAuthExpired = (event: Event) => {
      const message = (event as CustomEvent<{ message: string }>).detail?.message;
      clearAuthStorage();
      if (message) sessionStorage.setItem("auth_expired_message", message);
      setIsAuthenticated(false);
      router.replace("/login");
    };

    window.addEventListener("auth:expired", handleAuthExpired);
    return () => window.removeEventListener("auth:expired", handleAuthExpired);
  }, [router]);

  const login = () => {
    // O token já foi armazenado em cookie httpOnly pelo servidor.
    // Aqui apenas atualizamos o estado de UI.
    setIsAuthenticated(true);
  };

  const logout = () => {
    clearAuthStorage();
    setIsAuthenticated(false);
    router.replace("/login");
  };

  const value = useMemo(
    () => ({ isAuthenticated, login, logout }),
    [isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
