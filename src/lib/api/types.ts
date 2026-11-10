
export type UserRole = "MAHASISWA" | "PSIKOLOG" | "DOSEN_ADMIN";

export interface AuthenticatedUser {
  id: string;
  role: UserRole;
}

export interface AuthProfile extends AuthenticatedUser {
  nama: string;
  email: string;
}

export interface AuthSession {
  accessToken: string;
  expiresIn: number;
  user: AuthenticatedUser;
}

export interface StaffLoginRequest {
  role: "PSIKOLOG" | "DOSEN_ADMIN";
  email: string;
  password: string;
  otp?: string;
}

export interface ProfilMahasiswa {
  id: string;
  nim: string;
  nama: string;
  nama_tampilan: string | null;
  email: string;
  status_aktif: boolean;
  terakhir_verifikasi_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface KontakDarurat {
  id: string;
  nama_kontak: string;
  no_telepon: string;
  hubungan: string | null;
  created_at: string;
}

export interface CreateKontakDaruratRequest {
  nama_kontak: string;
  no_telepon: string;
  hubungan?: string;
}

export interface UpdateKontakDaruratRequest {
  nama_kontak?: string;
  no_telepon?: string;
  hubungan?: string | null;
}

export interface UpdateProfilRequest {
  nama_tampilan?: string | null;
}

export interface DeleteAccountRequest {
  konfirmasi: "HAPUS";
}
