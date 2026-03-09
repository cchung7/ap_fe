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

type MeState = {
  data: Me | null;
  loading: boolean;
  error: Error | null;

  lastFetchedAt: number;
  lastResultWasNull: boolean;
};

type ApiResponse<T> = {
  statusCode?: number;
  success?: boolean;
  message?: string;
  data?: T;
};

const DEDUPE_MS = 800;
const LOGGED_OUT_COOLDOWN_MS = 30_000;

let state: MeState = {
  data: null,
  loading: true,
  error: null,
  lastFetchedAt: 0,
  lastResultWasNull: false,
};

const listeners = new Set<() => void>();
let inflightPromise: Promise<Me | null> | null = null;
let didInit = false;

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

async function refreshInternal(opts?: { force?: boolean }) {
  const now = Date.now();
  const force = Boolean(opts?.force);

  if (inflightPromise) {
    await inflightPromise.catch(() => undefined);
    return;
  }

  if (!force && state.lastResultWasNull) {
    const age = now - state.lastFetchedAt;
    if (age < LOGGED_OUT_COOLDOWN_MS) return;
  }

  if (!force && now - state.lastFetchedAt < DEDUPE_MS) return;

  setState({
    loading: true,
    error: null,
    lastFetchedAt: now,
  });

  inflightPromise = fetchMe();

  try {
    const me = await inflightPromise;

    setState({
      data: me,
      loading: false,
      error: null,
      lastResultWasNull: me === null,
    });
  } catch (err: unknown) {
    setState({
      loading: false,
      error: err instanceof Error ? err : new Error("Auth fetch failed"),
      // keep prior data if fetch fails, rather than forcing null immediately
      data: state.data,
      lastResultWasNull: state.data === null,
    });
  } finally {
    inflightPromise = null;
  }
}

export function useMe() {
  const snap = React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  React.useEffect(() => {
    if (!didInit) {
      didInit = true;
      void refreshInternal({ force: true });
    }
  }, []);

  React.useEffect(() => {
    const onFocus = () => {
      void refreshInternal();
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
    refresh: async (force = true) => {
      await refreshInternal({ force });
    },
  };
}