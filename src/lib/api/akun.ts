
import { apiRequest } from "./client";
import type {
  ProfilMahasiswa,
  UpdateProfilRequest,
  KontakDarurat,
  CreateKontakDaruratRequest,
  UpdateKontakDaruratRequest,
} from "./types";

// Mengambil pesan error dari backend.
async function getErrorMessage(response: Response): Promise<string> {
  try {
    const data = await response.json();

    if (typeof data.message === "string") {
      return data.message;
    }

    if (Array.isArray(data.message)) {
      return data.message.join(", ");
    }
  } catch {
    // Respons backend tidak berbentuk JSON.
  }

  return `Permintaan gagal (HTTP ${response.status})`;
}

// ========================================
// PROFIL MAHASISWA
// ========================================

// GET /api/v1/me
// Mengambil profil mahasiswa dari backend.
export async function getProfilMahasiswa(): Promise<ProfilMahasiswa> {
  const response = await apiRequest("/me", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return (await response.json()) as ProfilMahasiswa;
}

// PATCH /api/v1/me
// Memperbarui nama tampilan mahasiswa.
export async function updateProfilMahasiswa(
  payload: UpdateProfilRequest
): Promise<ProfilMahasiswa> {
  const response = await apiRequest("/me", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return (await response.json()) as ProfilMahasiswa;
}

// ========================================
// KONTAK DARURAT
// ========================================

// GET /api/v1/me/kontak-darurat
// Mengambil semua kontak darurat milik mahasiswa.
export async function getKontakDarurat(): Promise<KontakDarurat[]> {
  const response = await apiRequest("/me/kontak-darurat", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return (await response.json()) as KontakDarurat[];
}

// POST /api/v1/me/kontak-darurat
// Menambahkan kontak darurat baru.
export async function createKontakDarurat(
  payload: CreateKontakDaruratRequest
): Promise<KontakDarurat> {
  const response = await apiRequest("/me/kontak-darurat", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return (await response.json()) as KontakDarurat;
}

// PATCH /api/v1/me/kontak-darurat/:id
// Mengubah kontak darurat milik mahasiswa.
export async function updateKontakDarurat(
  id: string,
  payload: UpdateKontakDaruratRequest
): Promise<KontakDarurat> {
  const response = await apiRequest(
    `/me/kontak-darurat/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return (await response.json()) as KontakDarurat;
}

// DELETE /api/v1/me/kontak-darurat/:id
// Menghapus kontak darurat milik mahasiswa.
export async function deleteKontakDarurat(
  id: string
): Promise<void> {
  const response = await apiRequest(
    `/me/kontak-darurat/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
}


// GET /api/v1/me/export
// Mengunduh data milik mahasiswa sebagai file JSON.
export async function exportDataMahasiswa(): Promise<Blob> {
  const response = await apiRequest("/me/export", {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return await response.blob();
}


/**
 * DELETE /api/v1/me
 *
 * Mengajukan penghapusan akun mahasiswa.
 * Backend melakukan validasi konfirmasi,
 * pemeriksaan SOS aktif, dan pencabutan sesi.
 *
 * PENTING: Operasi ini bersifat destruktif.
 */
export async function deleteAkunMahasiswa(): Promise<void> {
  const response = await apiRequest("/me", {
    method: "DELETE",
    body: JSON.stringify({
      konfirmasi: "HAPUS",
    }),
  });

  if (!response.ok) {
    if (response.status === 409) {
      throw new Error(
        "Akun tidak dapat dihapus karena masih memiliki SOS aktif."
      );
    }

    throw new Error(await getErrorMessage(response));
  }
}
