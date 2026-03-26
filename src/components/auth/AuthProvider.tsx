// D:\ap_fe\src\components\auth\AuthProvider.tsx
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

type AuthContextValue = {
  me: Me | null;
  loading: boolean;
  error: Error | null;
  isAuthed: boolean;
  isAdmin: boolean;
  refresh: (options?: { silent?: boolean }) => Promise<Me | null>;
  clearAuth: () => void;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

async function fetchMe(): Promise<Me | null> {
  const res = await fetch("/api/auth/me", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (res.status === 401 || res.status === 403) return null;

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Failed to fetch /api/auth/me (${res.status})`);
  }

  const json = (await res.json()) as any;

  const candidate =
    json?.me ??
    json?.user ??
    json?.data?.me ??
    json?.data?.user ??
    null;

  if (!candidate || typeof candidate !== "object") return null;
  return candidate as Me;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const mountedRef = React.useRef(false);

  const [me, setMe] = React.useState<Me | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const refresh = React.useCallback(
    async (options?: { silent?: boolean }) => {
      const silent = options?.silent ?? false;

      if (!silent) {
        setLoading(true);
      }

      setError(null);

      try {
        const nextMe = await fetchMe();

        if (!mountedRef.current) return null;

        setMe(nextMe);
        setError(null);
        setLoading(false);

        return nextMe;
      } catch (err: unknown) {
        if (!mountedRef.current) return null;

        setMe(null);
        setError(err instanceof Error ? err : new Error("Auth fetch failed"));
        setLoading(false);

        return null;
      }
    },
    []
  );

  const clearAuth = React.useCallback(() => {
    setMe(null);
    setLoading(false);
    setError(null);
  }, []);

  React.useEffect(() => {
    mountedRef.current = true;
    void refresh();

    return () => {
      mountedRef.current = false;
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