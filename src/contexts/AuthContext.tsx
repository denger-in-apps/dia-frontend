
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
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
  loginDemoPsychologist: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const DEMO_PSYCHOLOGIST_SESSION_KEY = "dia_demo_psychologist_session";

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
  const sessionRevision = useRef(0);

  const loadSession = useCallback(
    async (isActive: () => boolean) => {
      const revision = sessionRevision.current;
      try {
        await refreshOnce();

        if (!isActive() || sessionRevision.current !== revision) return;

        const profile = await getAuthProfile();

        if (!isActive() || sessionRevision.current !== revision) return;

        setUser(profile);
      } catch {
        if (!isActive() || sessionRevision.current !== revision) return;

        clearAccessToken();
        setUser(null);
      } finally {
        if (isActive() && sessionRevision.current === revision) {
          setIsLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    let cancelled = false;

    const initializeSession = async () => {
      await Promise.resolve();

      if (cancelled) return;

      if (process.env.NODE_ENV !== "production") {
        try {
          if (window.sessionStorage.getItem(DEMO_PSYCHOLOGIST_SESSION_KEY) === "1") {
            setUser({
              id: "demo-psychologist",
              role: "PSIKOLOG",
              nama: "Psikolog Demo",
              email: "psikolog.demo@denger.in",
            });
            setIsLoading(false);
            return;
          }
        } catch {
          // Jika sessionStorage tidak tersedia, lanjutkan pemeriksaan sesi backend.
        }
      }

      await loadSession(() => !cancelled);
    };

    void initializeSession();

    return () => {
      cancelled = true;
    };
  }, [loadSession]);

  const login = useCallback(async (payload: StaffLoginRequest) => {
    sessionRevision.current += 1;
    setIsLoading(true);

    try {
      window.sessionStorage.removeItem(DEMO_PSYCHOLOGIST_SESSION_KEY);
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

  const loginDemoPsychologist = useCallback(async () => {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Login demo hanya tersedia di mode development.");
    }

    sessionRevision.current += 1;
    window.sessionStorage.setItem(DEMO_PSYCHOLOGIST_SESSION_KEY, "1");
    clearAccessToken();
    setUser({
      id: "demo-psychologist",
      role: "PSIKOLOG",
      nama: "Psikolog Demo",
      email: "psikolog.demo@denger.in",
    });
    setIsLoading(false);
  }, []);

  const signOut = useCallback(async () => {
    sessionRevision.current += 1;
    setIsLoading(true);

    if (
      process.env.NODE_ENV !== "production" &&
      window.sessionStorage.getItem(DEMO_PSYCHOLOGIST_SESSION_KEY) === "1"
    ) {
      window.sessionStorage.removeItem(DEMO_PSYCHOLOGIST_SESSION_KEY);
      clearAccessToken();
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      await logout();
    } finally {
      clearAccessToken();
      window.sessionStorage.removeItem(DEMO_PSYCHOLOGIST_SESSION_KEY);
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
        loginDemoPsychologist,
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
