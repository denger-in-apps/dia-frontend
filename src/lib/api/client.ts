import createClient from "openapi-fetch";
import type { paths } from "./schema";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://localhost/api/v1";

// Access token hanya disimpan di memori.
// Tidak menggunakan localStorage atau sessionStorage.
let accessToken: string | null = null;

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function clearAccessToken(): void {
  accessToken = null;
}

// Mempertahankan API client lama agar kompatibilitas tetap terjaga.
export const apiClient = createClient<paths>({
  baseUrl: API_BASE_URL,
  credentials: "include",
});

// Mengirim request ke backend menggunakan access token.
export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = new Headers(options.headers);

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  if (options.body && !(options.body instanceof FormData)) {
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
  }

  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  return fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
    cache: "no-store",
  });
}