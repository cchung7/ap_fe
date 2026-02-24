"use client";

import * as React from "react";

type Me = {
  role?: "ADMIN" | "MEMBER" | string;
  subRole?: string;
  email?: string;
  name?: string;
  [key: string]: unknown;
};

type MeState = {
  data: Me | null;
  loading: boolean;
  error: Error | null;

  // Deduping/cooldown
  lastFetchedAt: number;
  lastResultWasNull: boolean;
};

const DEDUPE_MS = 800;

// IMPORTANT: while logged out, avoid spammy 401s
const LOGGED_OUT_COOLDOWN_MS = 30_000; // 30s (tweak to 60_000 if you want)

let state: MeState = {
  data: null,
  loading: true,
  error: null,
  lastFetchedAt: 0,
  lastResultWasNull: false,
};

const listeners = new Set<() => void>();

function setState(patch: Partial<MeState>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

async function fetchMe(): Promise<Me | null> {
  const res = await fetch("/api/auth/me", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (res.status === 401) return null;

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Failed to fetch /api/auth/me (${res.status})`);
  }

  return (await res.json()) as Me;
}

async function refreshInternal(opts?: { force?: boolean }) {
  const now = Date.now();
  const force = Boolean(opts?.force);

  // If we KNOW we're logged out, don't keep refetching /me (it will 401)
  if (!force && state.lastResultWasNull) {
    const age = now - state.lastFetchedAt;
    if (age < LOGGED_OUT_COOLDOWN_MS) return;
  }

  // Standard dedupe for rapid calls across components
  if (!force && now - state.lastFetchedAt < DEDUPE_MS) return;

  setState({ loading: true, error: null, lastFetchedAt: now });

  try {
    const me = await fetchMe();
    setState({
      data: me,
      loading: false,
      error: null,
      lastResultWasNull: me === null,
    });
  } catch (err: any) {
    // If anything weird happens, don't spin forever
    setState({
      data: null,
      loading: false,
      error: err instanceof Error ? err : new Error("Auth fetch failed"),
      lastResultWasNull: true,
    });
  }
}

let didInit = false;

export function useMe() {
  const snap = React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  React.useEffect(() => {
    if (!didInit) {
      didInit = true;
      refreshInternal({ force: true });
    }
  }, []);

  React.useEffect(() => {
    const onFocus = () => {
      // Revalidate on focus, but logged-out state is cooldown-throttled.
      refreshInternal();
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const isAuthed = Boolean(snap.data);
  const isAdmin = snap.data?.role === "ADMIN";

  return {
    me: snap.data,
    loading: snap.loading,
    error: snap.error,
    isAuthed,
    isAdmin,
    // `force=true` is what you want after login/logout
    refresh: async (force = true) => {
      await refreshInternal({ force });
    },
  };
}