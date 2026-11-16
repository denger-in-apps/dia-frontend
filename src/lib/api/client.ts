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

/**
 * Alasan backend menolak sesi yang sebenarnya sah (PBI-02):
 * - akun_tidak_aktif: 403 AKUN_TIDAK_AKTIF (status akademik/akun nonaktif)
 * - akademik_gangguan: 503 karena status akademik belum dapat diverifikasi
 */
export type AuthBlockReason = "akun_tidak_aktif" | "akademik_gangguan";

export const AUTH_BLOCKED_EVENT = "dia:auth-blocked";
/** Backend menolak request karena staf masih memakai password sementara (403 WAJIB_GANTI_PASSWORD). */
export const WAJIB_GANTI_PASSWORD_EVENT = "dia:wajib-ganti-password";
// Backend integrasi mengirim kode `PASSWORD_WAJIB_DIGANTI` di properti `kode`.
// Terima juga format lama agar deployment yang belum diperbarui tetap kompatibel.
export const WAJIB_GANTI_PASSWORD = "PASSWORD_WAJIB_DIGANTI";

/** `true` bila respons adalah 403 WAJIB_GANTI_PASSWORD (tanpa mengonsumsi body asli). */
export async function isWajibGantiPassword(response: Response): Promise<boolean> {
  if (response.status !== 403) return false;
  try {
    const body = (await response.clone().json()) as { kode?: unknown; message?: unknown };
    return body.kode === WAJIB_GANTI_PASSWORD ||
      body.message === WAJIB_GANTI_PASSWORD ||
      body.kode === "WAJIB_GANTI_PASSWORD" ||
      body.message === "WAJIB_GANTI_PASSWORD";
  } catch {
    return false;
  }
}
const ACADEMIC_UNAVAILABLE_MESSAGE = "Status akademik belum dapat diverifikasi";

export class SessionError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly reason?: AuthBlockReason,
  ) {
    super(message);
    this.name = "SessionError";
  }
}

/** Membaca alasan penolakan dari body error backend tanpa mengonsumsi response asli. */
export async function authBlockReasonOf(response: Response): Promise<AuthBlockReason | undefined> {
  if (response.status !== 403 && response.status !== 503) return undefined;
  try {
    const body = (await response.clone().json()) as { message?: unknown };
    if (response.status === 403 && body.message === "AKUN_TIDAK_AKTIF") return "akun_tidak_aktif";
    if (response.status === 503 && body.message === ACADEMIC_UNAVAILABLE_MESSAGE) return "akademik_gangguan";
  } catch {
    // Body bukan JSON: bukan penolakan sesi yang dikenali.
  }
  return undefined;
}

/** Menghapus sesi lokal dan memberi tahu AuthContext alasan sesi ditolak. */
function notifyAuthBlocked(reason: AuthBlockReason): void {
  clearAccessToken();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent<AuthBlockReason>(AUTH_BLOCKED_EVENT, { detail: reason }));
  }
}

// Satu refresh untuk seluruh aplikasi: refresh token dirotasi oleh backend, sehingga
// dua refresh bersamaan dapat dianggap penggunaan ulang token dan memutus sesi.
let refreshInFlight: Promise<{ accessToken: string } & Record<string, unknown>> | null = null;

export function refreshAccessToken(): Promise<{ accessToken: string } & Record<string, unknown>> {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      });
      if (!response.ok) {
        const reason = await authBlockReasonOf(response);
        clearAccessToken();
        if (reason) notifyAuthBlocked(reason);
        throw new SessionError("Sesi tidak valid atau sudah kedaluwarsa.", response.status, reason);
      }
      const session = await response.json();
      if (typeof session?.accessToken !== "string") {
        clearAccessToken();
        throw new Error("Respons refresh sesi tidak valid.");
      }
      setAccessToken(session.accessToken);
      return session;
    })().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

function send(path: string, options: RequestInit): Promise<Response> {
  const headers = new Headers(options.headers);

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  if (options.body && !(options.body instanceof FormData)) {
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
  }

  return fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
    cache: "no-store",
  });
}

/**
 * Request yang membawa access token lalu ditolak karena akun nonaktif / layanan akademik
 * gagal berarti sesi tidak dapat dipakai lagi: hapus sesi lokal dan beri tahu AuthContext.
 * Request tanpa token (mis. form login) tidak dianggap pemutusan sesi.
 */
async function detectBlockedSession(response: Response, sentWithToken: boolean): Promise<void> {
  if (!sentWithToken) return;
  const reason = await authBlockReasonOf(response);
  if (reason) notifyAuthBlocked(reason);
  // Password di-reset admin saat sesi berjalan: arahkan ke halaman ganti password (sesi tetap).
  if (typeof window !== "undefined" && (await isWajibGantiPassword(response))) {
    window.dispatchEvent(new CustomEvent(WAJIB_GANTI_PASSWORD_EVENT));
  }
}

// Mengirim request ke backend menggunakan access token. Bila access token kedaluwarsa
// (401), sesi diperbarui sekali lewat refresh cookie lalu request diulang.
export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const sentWithToken = accessToken !== null;
  const response = await send(path, options);
  await detectBlockedSession(response, sentWithToken);

  if (response.status !== 401 || !accessToken || path.startsWith("/auth/")) {
    return response;
  }

  try {
    await refreshAccessToken();
  } catch {
    return response;
  }
  const retried = await send(path, options);
  await detectBlockedSession(retried, true);
  return retried;
}
