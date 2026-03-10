// Auth Provider layer owns shared current-user UI state
// Same auth state for navbar/footer/profile/login
"use client";

import * as React from "react";

type Me = {
  role?: "ADMIN" | "MEMBER" | string;
  subRole?: string;
  email?: string;
  name?: string;
  status?: "ACTIVE" | "PENDING" | "SUSPENDED" | string;
  [key: string]: unknown;
};

type ApiResponse<T> = {
  statusCode?: number;
  success?: boolean;
  message?: string;
  data?: T;
};

type AuthContextValue = {
  me: Me | null;
  loading: boolean;
  error: Error | null;
  isAuthed: boolean;
  isAdmin: boolean;
  refresh: () => Promise<Me | null>;
  clearAuth: () => void;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

async function fetchMe(): Promise<Me | null> {
  const res = await fetch("/api/auth/me", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Failed to fetch /api/auth/me (${res.status})`);
  }

  const json = (await res.json()) as unknown;

  if (json && typeof json === "object" && "me" in json) {
    return ((json as { me?: Me | null }).me ?? null) as Me | null;
  }

  const wrapped = json as ApiResponse<{ me: Me | null }>;
  return wrapped?.data?.me ?? null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const mountedRef = React.useRef(false);

  const [me, setMe] = React.useState<Me | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const refresh = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const nextMe = await fetchMe();

      if (!mountedRef.current) return null;

      setMe(nextMe);
      setLoading(false);
      setError(null);

      return nextMe;
    } catch (err: unknown) {
      if (!mountedRef.current) return null;

      setMe(null);
      setLoading(false);
      setError(err instanceof Error ? err : new Error("Auth fetch failed"));

      return null;
    }
  }, []);

  const clearAuth = React.useCallback(() => {
    setMe(null);
    setLoading(false);
    setError(null);
  }, []);

  React.useEffect(() => {
    mountedRef.current = true;

    void refresh();

    const onFocus = () => {
      void refresh();
    };

    window.addEventListener("focus", onFocus);

    return () => {
      mountedRef.current = false;
      window.removeEventListener("focus", onFocus);
    };
  }, [refresh]);

  const value = React.useMemo<AuthContextValue>(
    () => ({
      me,
      loading,
      error,
      isAuthed: Boolean(me),
      isAdmin: me?.role === "ADMIN",
      refresh,
      clearAuth,
    }),
    [me, loading, error, refresh, clearAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = React.useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }

  return ctx;
}