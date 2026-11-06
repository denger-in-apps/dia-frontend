import {
  API_BASE_URL,
  apiRequest,
  clearAccessToken,
  setAccessToken,
} from "./client";

import type {
  AuthProfile,
  AuthSession,
  StaffLoginRequest,
} from "./types";

// Memulai login mahasiswa melalui redirect browser ke backend SSO.
export function startStudentSSO(): void {
  if (typeof window === "undefined") return;

  // Redirect eksternal untuk memulai autentikasi SSO kampus.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.assign(`${API_BASE_URL}/auth/sso/login`);
}

// Login psikolog atau dosen admin.
export async function loginStaff(
  payload: StaffLoginRequest
): Promise<AuthSession> {
  const response = await apiRequest("/auth/staff/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Login gagal. Periksa email, password, dan OTP.");
  }

  const session = (await response.json()) as AuthSession;
  setAccessToken(session.accessToken);

  return session;
}

// Memperbarui access token menggunakan refresh cookie.
export async function refreshSession(): Promise<AuthSession> {
  const response = await apiRequest("/auth/refresh", {
    method: "POST",
  });

  if (!response.ok) {
    clearAccessToken();
    throw new Error("Sesi tidak valid atau sudah kedaluwarsa.");
  }

  const session = (await response.json()) as AuthSession;
  setAccessToken(session.accessToken);

  return session;
}

// Mengambil profil dasar pengguna yang sedang login.
export async function getAuthProfile(): Promise<AuthProfile> {
  const response = await apiRequest("/auth/me");

  if (!response.ok) {
    throw new Error("Gagal mengambil profil pengguna.");
  }

  return (await response.json()) as AuthProfile;
}

// Logout dan menghapus access token dari memori.
export async function logout(): Promise<void> {
  try {
    const response = await apiRequest("/auth/logout", {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Gagal mengakhiri sesi di server.");
    }
  } finally {
    clearAccessToken();
  }
}