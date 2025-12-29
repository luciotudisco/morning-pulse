"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiClient } from "@/lib/api-client";
import type { User } from "@/lib/schemas";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = "session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Failed to load user from storage:", error);
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    };

    loadUserFromStorage();
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await apiClient.getCurrentUser();
      setUser(currentUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
    } catch (error) {
      setUser(null);
      localStorage.removeItem(USER_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const currentUser = await apiClient.getCurrentUser();
      setUser(currentUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
    } catch (error) {
      setUser(null);
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  };

  const login = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
    window.location.href = `${apiUrl}/login`;
  };

  const logout = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    window.location.href = `${apiUrl}/logout`;
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

