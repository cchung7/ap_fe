/* eslint-disable @typescript-eslint/no-explicit-any */
const NEXT_PUBLIC_API_URL = "https://api.jayportfolio.me";

interface ApiOptions extends RequestInit {
  headers?: Record<string, string>;
}

/**
 * Helper function to make API requests to the backend.
 * Automatically handles JSON content-type and error parsing.
 *
 * @param endpoint - The path (e.g., "/api/products")
 * @param options - Fetch options (method, body, etc.)
 * @param requireAuth - If true, includes credentials: 'include' to send cookies
 */
export const apiRequest = async <T = any>(
  endpoint: string,
  options: ApiOptions = {},
  requireAuth = false
): Promise<T> => {
  const config: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  if (requireAuth) {
    config.credentials = "include";
  }

  const response = await fetch(`${NEXT_PUBLIC_API_URL}${endpoint}`, config);

  // Handle 204 No Content or empty responses
  if (response.status === 204) {
    return {} as T;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};
