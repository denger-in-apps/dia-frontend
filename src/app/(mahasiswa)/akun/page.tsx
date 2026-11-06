
"use client";

import { useEffect, useState } from "react";
import {
  ArrowDownToLine,
  Check,
  ChevronRight,
  CircleHelp,
  LockKeyhole,
  Pencil,
  ShieldCheck,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { KontakDaruratSection } from "@/components/akun/KontakDaruratSection";
import { clearAccessToken } from "@/lib/api/client";
import {
  getProfilMahasiswa,
  updateProfilMahasiswa,
  exportDataMahasiswa,
  deleteAkunMahasiswa,
} from "@/lib/api/akun";
import type { ProfilMahasiswa } from "@/lib/api/types";

export default function AkunPage() {
  const { user, isLoading: authLoading } = useAuth();

  const [profil, setProfil] = useState<ProfilMahasiswa | null>(null);
  const [namaTampilan, setNamaTampilan] = useState("");
  const [loadingProfil, setLoadingProfil] = useState(true);
  const [savingProfil, setSavingProfil] = useState(false);
  const [exportingData, setExportingData] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [notice, setNotice] = useState("");

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const isMahasiswa = user?.role === "MAHASISWA";

  useEffect(() => {
    if (authLoading || !isMahasiswa) return;

    let active = true;

    async function loadProfil() {
      try {
        const data = await getProfilMahasiswa();

        if (!active) return;

        setProfil(data);
        setNamaTampilan(data.nama_tampilan ?? "");
        setNotice("");
      } catch (error) {
        if (!active) return;

        setNotice(
          error instanceof Error
            ? `Gagal memuat profil: ${error.message}`
            : "Gagal memuat profil mahasiswa."
        );
      } finally {
        if (active) setLoadingProfil(false);
      }
    }

    void loadProfil();

    return () => {
      active = false;
    };
  }, [authLoading, isMahasiswa]);

  async function saveProfil() {
    if (!profil || savingProfil || !isMahasiswa) return;

    const value = namaTampilan.trim();

    if (value.length > 60) {
      setNotice("Nama tampilan maksimal 60 karakter.");
      return;
    }

    setSavingProfil(true);
    setNotice("");

    try {
      const updated = await updateProfilMahasiswa({
        nama_tampilan: value.length > 0 ? value : null,
      });

      setProfil(updated);
      setNamaTampilan(updated.nama_tampilan ?? "");
      setIsEditing(false);
      setNotice("Nama tampilan berhasil disimpan.");
    } catch (error) {
      setNotice(
        error instanceof Error
          ? `Gagal menyimpan profil: ${error.message}`
          : "Gagal menyimpan perubahan profil."
      );
    } finally {
      setSavingProfil(false);
    }
  }

  function cancelEditing() {
    setNamaTampilan(profil?.nama_tampilan ?? "");
    setIsEditing(false);
    setNotice("");
  }

  async function handleExportData() {
    if (!isMahasiswa || exportingData || !profil) return;

    setExportingData(true);
    setNotice("");

    try {
      const blob = await exportDataMahasiswa();
      const url = URL.createObjectURL(blob);

      try {
        const link = document.createElement("a");
        link.href = url;
        link.download = "dengerin-data-mahasiswa.json";

        document.body.appendChild(link);
        link.click();
        link.remove();

        setNotice("Ekspor data berhasil diproses.");
      } finally {
        window.setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 1000);
      }
    } catch (error) {
      setNotice(
        error instanceof Error
          ? `Gagal mengekspor data: ${error.message}`
          : "Gagal mengekspor data mahasiswa."
      );
    } finally {
      setExportingData(false);
    }
  }

  function openDeleteDialog() {
    if (!isMahasiswa || !profil) return;

    setDeleteConfirmation("");
    setDeleteError("");
    setShowDeleteConfirm(true);
  }

  function closeDeleteDialog() {
    if (deletingAccount) return;

    setShowDeleteConfirm(false);
    setDeleteConfirmation("");
    setDeleteError("");
  }

  async function handleDeleteAccount() {
    if (
      !isMahasiswa ||
      !profil ||
      deletingAccount ||
      deleteConfirmation !== "HAPUS"
    ) {
      return;
    }

    setDeletingAccount(true);
    setDeleteError("");

    try {
      await deleteAkunMahasiswa();

      // Backend telah menyatakan penghapusan berhasil.
      // Hapus access token di memori frontend.
      clearAccessToken();

      // Navigasi penuh agar state autentikasi lama
      // tidak tertinggal di aplikasi.
      window.location.replace("/masuk");
    } catch (error) {
      setDeleteError(
        error instanceof Error
          ? error.message
          : "Gagal menghapus akun mahasiswa."
      );
      setDeletingAccount(false);
    }
  }

  const namaYangDitampilkan =
    profil?.nama_tampilan || profil?.nama || "Belum tersedia";

  const isProfileLoading =
    authLoading || (isMahasiswa && loadingProfil);

  return (
    <div className="mx-auto max-w-5xl space-y-7 py-4 sm:py-8">
      {/* Header */}
      <section className="relative overflow-hidden rounded-[2rem] bg-brand px-6 py-8 text-white shadow-lg sm:px-10 sm:py-10">
        <div className="pointer-events-none absolute -right-14 -top-20 h-64 w-64 rounded-full border-[32px] border-white/5" />
        <div className="pointer-events-none absolute bottom-[-5rem] right-28 h-40 w-40 rounded-full bg-accent-lime/15 blur-2xl" />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
              <ShieldCheck className="h-3.5 w-3.5" />
              Ruang pribadi kamu
            </span>

            <h1 className="font-serif text-3xl font-black leading-tight sm:text-4xl">
              Akun & privasi
            </h1>

            <p className="max-w-lg text-sm leading-relaxed text-white/75 sm:text-base">
              Lihat informasi akunmu dan atur data pribadi
              dengan nyaman. Informasi ini hanya untuk
              kebutuhan layananmu.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start rounded-2xl border border-white/15 bg-white/10 px-4 py-3 sm:self-auto">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-lime text-brand">
              <UserRound className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-bold">
                {isProfileLoading
                  ? "Memuat..."
                  : namaYangDitampilkan}
              </p>
              <p className="text-xs text-white/65">
                Mahasiswa
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Notification */}
      {notice && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-start gap-3 rounded-2xl border border-brand/15 bg-brand/5 px-4 py-3 text-sm text-text"
        >
          <CircleHelp className="mt-0.5 h-4 w-4 shrink-0 text-brand dark:text-text" />

          <p className="flex-1">{notice}</p>

          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Tutup pemberitahuan"
            className="rounded-full p-1 text-text-muted hover:bg-black/5"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {!authLoading && !isMahasiswa && (
        <div
          role="alert"
          className="rounded-2xl border border-danger/20 bg-danger/5 p-4 text-sm text-danger"
        >
          Profil hanya dapat diakses menggunakan sesi
          mahasiswa yang valid.
        </div>
      )}

      {/* Grid profil dan sidebar */}
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Profil mahasiswa */}
        <Card className="space-y-6 p-5 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-text-muted">
                Informasi akun
              </p>

              <h2 className="mt-1 text-xl font-bold text-brand dark:text-text">
                Profil mahasiswa
              </h2>

              <p className="mt-1 text-sm text-text-muted">
                Informasi identitas berasal dari SSO kampus.
              </p>
            </div>

            {!isEditing ? (
              <Button
                variant="outline"
                size="sm"
                disabled={
                  isProfileLoading ||
                  !profil ||
                  !isMahasiswa
                }
                onClick={() => {
                  setNotice("");
                  setIsEditing(true);
                }}
                className="gap-2"
              >
                <Pencil className="h-3.5 w-3.5" />
                Ubah profil
              </Button>
            ) : (
              <span className="rounded-full bg-accent-mint px-3 py-1 text-xs font-semibold text-brand">
                Mode ubah
              </span>
            )}
          </div>

          {isProfileLoading ? (
            <p className="text-sm text-text-muted">
              Memuat informasi profil...
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Nama lengkap"
                hint="Berasal dari SSO kampus dan tidak dapat diubah."
              >
                <div className={`${valueClass} justify-between gap-2`}>
                  <span>
                    {profil?.nama ?? "Belum tersedia"}
                  </span>
                  <LockKeyhole className="h-4 w-4 shrink-0 text-text-muted" />
                </div>
              </Field>

              <Field
                label="Nomor induk mahasiswa"
                hint="Terhubung dengan akun kampus."
              >
                <div className={`${valueClass} justify-between gap-2`}>
                  <span>
                    {profil?.nim ?? "Belum tersedia"}
                  </span>
                  <LockKeyhole className="h-4 w-4 shrink-0 text-text-muted" />
                </div>
              </Field>

              <Field
                label="Nama tampilan"
                hint="Nama yang ditampilkan di layanan Denger.in."
              >
                {isEditing ? (
                  <input
                    id="nama-tampilan"
                    value={namaTampilan}
                    maxLength={60}
                    onChange={(e) =>
                      setNamaTampilan(e.target.value)
                    }
                    placeholder="Kosongkan untuk memakai nama lengkap"
                    className={inputClass}
                  />
                ) : (
                  <p className={valueClass}>
                    {profil
                      ? profil.nama_tampilan || profil.nama
                      : "Belum tersedia"}
                  </p>
                )}
              </Field>

              <Field
                label="Email kampus"
                hint="Berasal dari SSO kampus dan tidak dapat diubah."
              >
                <div className={`${valueClass} justify-between gap-2`}>
                  <span className="break-all">
                    {profil?.email ?? "Belum tersedia"}
                  </span>
                  <LockKeyhole className="h-4 w-4 shrink-0 text-text-muted" />
                </div>
              </Field>
            </div>
          )}

          {isEditing && (
            <div className="flex flex-col-reverse gap-2 border-t border-black/5 pt-5 dark:border-white/10 sm:flex-row sm:justify-end">
              <Button
                variant="ghost"
                onClick={cancelEditing}
                disabled={savingProfil}
              >
                Batal
              </Button>

              <Button
                onClick={saveProfil}
                disabled={savingProfil || !profil}
                className="gap-2"
              >
                <Check className="h-4 w-4" />
                {savingProfil
                  ? "Menyimpan..."
                  : "Simpan perubahan"}
              </Button>
            </div>
          )}
        </Card>

        {/* Sidebar */}
        <aside className="space-y-4">
          <Card className="space-y-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-mint text-brand">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-bold text-brand dark:text-text">
                Privasi tetap terjaga
              </h2>

              <p className="mt-1 text-sm leading-relaxed text-text-muted">
                NIM, nama lengkap, dan email berasal dari
                SSO kampus dan tidak dapat diubah melalui
                halaman ini.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setNotice(
                  "Identitas kampus hanya dapat diperbarui melalui sistem SSO kampus."
                )
              }
              className="flex w-full items-center justify-between border-t border-black/5 pt-3 text-left text-xs font-semibold text-brand dark:border-white/10 dark:text-text"
            >
              Pelajari tentang data kamu
              <ChevronRight className="h-4 w-4" />
            </button>
          </Card>

          {/* Ekspor data */}
          <Card className="space-y-4 p-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-text-muted">
                Salinan data
              </p>

              <h2 className="mt-1 font-bold text-brand dark:text-text">
                Bawa data kamu
              </h2>

              <p className="mt-1 text-sm leading-relaxed text-text-muted">
                Minta salinan informasi akun dan aktivitasmu
                dalam format yang mudah dibaca.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportData}
              disabled={
                authLoading ||
                !isMahasiswa ||
                !profil ||
                exportingData
              }
              className="w-full gap-2"
            >
              <ArrowDownToLine className="h-4 w-4" />
              {exportingData
                ? "Mengekspor..."
                : "Ekspor data saya"}
            </Button>
          </Card>

          {/* Hapus akun */}
          <Card className="space-y-3 border-danger/20 p-5">
            <div className="flex items-center gap-2 text-danger">
              <Trash2 className="h-4 w-4" />
              <h2 className="text-sm font-bold">
                Hapus data
              </h2>
            </div>

            <p className="text-xs leading-relaxed text-text-muted">
              Penghapusan akun akan memengaruhi akses
              layanan dan data pribadi. Tindakan ini
              tidak dapat dibatalkan melalui halaman ini.
            </p>

            <button
              type="button"
              onClick={openDeleteDialog}
              disabled={!isMahasiswa || !profil}
              className="text-xs font-semibold text-danger underline decoration-danger/30 underline-offset-4 hover:decoration-danger disabled:cursor-not-allowed disabled:opacity-50"
            >
              Lihat opsi penghapusan
            </button>
          </Card>
        </aside>
      </div>

      {/* Kontak darurat */}
      <KontakDaruratSection />

      {/* Dialog penghapusan akun */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeDeleteDialog();
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            aria-describedby="delete-description"
            className="w-full max-w-md space-y-5 rounded-t-3xl bg-surface p-6 shadow-2xl sm:rounded-3xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-danger/10 text-danger">
                <Trash2 className="h-5 w-5" />
              </div>

              <button
                type="button"
                onClick={closeDeleteDialog}
                disabled={deletingAccount}
                aria-label="Tutup dialog"
                className="rounded-lg p-2 text-text-muted hover:bg-black/5 disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div>
              <h2
                id="delete-title"
                className="text-xl font-bold text-text"
              >
                Hapus akun mahasiswa?
              </h2>

              <p
                id="delete-description"
                className="mt-2 text-sm leading-relaxed text-text-muted"
              >
                Permintaan ini akan dikirim ke sistem
                Denger.in. Jika berhasil, akun akan
                dinonaktifkan, data terkait akan diproses
                sesuai kebijakan backend, dan sesi
                login akan dicabut.
              </p>

              <p className="mt-3 text-sm font-semibold text-danger">
                Pastikan kamu memahami konsekuensinya
                sebelum melanjutkan.
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="delete-confirmation"
                className="block text-sm font-semibold text-text"
              >
                Ketik HAPUS untuk konfirmasi
              </label>

              <input
                id="delete-confirmation"
                type="text"
                value={deleteConfirmation}
                onChange={(event) => {
                  setDeleteConfirmation(event.target.value);
                  setDeleteError("");
                }}
                disabled={deletingAccount}
                placeholder="HAPUS"
                autoComplete="off"
                className={inputClass}
              />

              <p className="text-xs text-text-muted">
                Huruf harus sama persis: HAPUS
              </p>
            </div>

            {deleteError && (
              <div
                role="alert"
                className="rounded-xl border border-danger/20 bg-danger/5 p-3 text-sm text-danger"
              >
                {deleteError}
              </div>
            )}

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                variant="ghost"
                onClick={closeDeleteDialog}
                disabled={deletingAccount}
              >
                Batal
              </Button>

              <Button
                variant="danger"
                onClick={handleDeleteAccount}
                disabled={
                  deletingAccount ||
                  deleteConfirmation !== "HAPUS" ||
                  !isMahasiswa ||
                  !profil
                }
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                {deletingAccount
                  ? "Menghapus akun..."
                  : "Hapus akun permanen"}
              </Button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-black/10 bg-bg px-3.5 py-3 text-sm text-text outline-none transition focus:border-focus focus:ring-2 focus:ring-focus/20 dark:border-white/10";

const valueClass =
  "flex min-h-11 items-center rounded-xl border border-black/5 bg-bg/70 px-3.5 py-3 text-sm font-medium text-text dark:border-white/10";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-sm font-semibold text-text">
        {label}
      </p>
      {children}
      <p className="text-xs text-text-muted">
        {hint}
      </p>
    </div>
  );
}
