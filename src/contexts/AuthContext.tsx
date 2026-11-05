"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  loginStaff,
  logout,
  refreshSession,
  getAuthProfile,
} from "@/lib/api/auth";

import { clearAccessToken } from "@/lib/api/client";

import type {
  AuthProfile,
  StaffLoginRequest,
} from "@/lib/api/types";

interface AuthContextValue {
  user: AuthProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: StaffLoginRequest) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Menghindari request refresh bersamaan dalam satu instance aplikasi.
let refreshPromise: ReturnType<typeof refreshSession> | null = null;

function refreshOnce() {
  if (!refreshPromise) {
    refreshPromise = refreshSession().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadSession = useCallback(async () => {
    try {
      await refreshOnce();

      const profile = await getAuthProfile();
      setUser(profile);
    } catch {
      clearAccessToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSession();
  }, [loadSession]);

  const login = useCallback(async (payload: StaffLoginRequest) => {
    setIsLoading(true);

    try {
      await loginStaff(payload);

      const profile = await getAuthProfile();
      setUser(profile);
    } catch (error) {
      clearAccessToken();
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setIsLoading(true);

    try {
      await logout();
    } finally {
      clearAccessToken();
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isLoading,
        login,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }

  return context;
}