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

const ACTIVITY_REFRESH_THROTTLE_MS = 5 * 60 * 1000;
const BACKGROUND_SESSION_CHECK_MS = 30 * 60 * 1000;

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
  const lastSilentRefreshAtRef = React.useRef(0);

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
    lastSilentRefreshAtRef.current = 0;
    setMe(null);
    setLoading(false);
    setError(null);
  }, []);

  const silentRefresh = React.useCallback(
    async (force = false) => {
      const now = Date.now();

      if (
        !force &&
        now - lastSilentRefreshAtRef.current < ACTIVITY_REFRESH_THROTTLE_MS
      ) {
        return null;
      }

      lastSilentRefreshAtRef.current = now;
      return refresh({ silent: true });
    },
    [refresh]
  );

  React.useEffect(() => {
    mountedRef.current = true;
    void refresh();

    return () => {
      mountedRef.current = false;
    };
  }, [refresh]);

  React.useEffect(() => {
    if (!me) return;

    const handleFocus = () => {
      void silentRefresh(true);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void silentRefresh(true);
      }
    };

    const handleActivity = () => {
      if (document.visibilityState === "hidden") return;
      void silentRefresh(false);
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pointerdown", handleActivity, { passive: true });
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("touchstart", handleActivity, { passive: true });

    const intervalId = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      void silentRefresh(true);
    }, BACKGROUND_SESSION_CHECK_MS);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pointerdown", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
      window.clearInterval(intervalId);
    };
  }, [me, silentRefresh]);

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