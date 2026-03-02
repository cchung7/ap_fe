/* eslint-disable @typescript-eslint/no-explicit-any */

interface ApiOptions extends RequestInit {
  headers?: Record<string, string>;
}

/**
 * Client-side helper to call *frontend* route handlers (/api/**).
 * Example:
 *   apiRequest("/events", { method: "GET" }, true)
 * → calls /api/events on the FE, which proxies to the BE.
 */
export const apiRequest = async <T = any>(
  endpoint: string,
  options: ApiOptions = {},
  requireAuth = false
): Promise<T> => {
  const config: RequestInit = {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  };

  if (requireAuth) config.credentials = "include";

  const response = await fetch(`/api${endpoint}`, config);

  if (response.status === 204) return {} as T;

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error((data as any)?.message || "Request failed");
  }

  return data as T;
};