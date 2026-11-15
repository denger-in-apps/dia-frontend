import { apiRequest } from "./client";

export interface Notifikasi {
  id: string;
  jenis: string;
  payload: Record<string, unknown>;
  dibaca_at: string | null;
  created_at: string;
}

async function expectOk(response: Response, fallback: string): Promise<void> {
  if (response.ok) return;

  try {
    const body = await response.json();
    const message = typeof body?.pesan === "string"
      ? body.pesan
      : typeof body?.message === "string"
        ? body.message
        : fallback;
    throw new Error(message);
  } catch (error) {
    if (error instanceof Error && error.message !== "Unexpected end of JSON input") throw error;
    throw new Error(fallback);
  }
}

/** Membaca notifikasi milik sesi aktif (`GET /api/v1/notifikasi`). */
export async function getNotifikasiBelumDibaca(limit = 50): Promise<Notifikasi[]> {
  const response = await apiRequest(`/notifikasi?belum_dibaca=true&limit=${limit}`);
  await expectOk(response, "Notifikasi tidak dapat dimuat.");
  const rows: unknown = await response.json();
  if (!Array.isArray(rows)) throw new Error("Format daftar notifikasi tidak valid.");
  return rows as Notifikasi[];
}

/** Menandai notifikasi milik sesi aktif sudah dibaca (`POST /api/v1/notifikasi/:id/dibaca`). */
export async function tandaiNotifikasiDibaca(id: string): Promise<void> {
  const response = await apiRequest(`/notifikasi/${encodeURIComponent(id)}/dibaca`, { method: "POST" });
  await expectOk(response, "Notifikasi tidak dapat ditandai sudah dibaca.");
}
