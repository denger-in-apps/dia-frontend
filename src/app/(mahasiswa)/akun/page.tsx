"use client";

import { useState } from "react";
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

export default function AkunPage() {
  const [nama, setNama] = useState("Muhammad Josfi");
  const [nim] = useState("102062400003");
  const [kontakDarurat, setKontakDarurat] = useState("081298765432");
  const [hubungan, setHubungan] = useState("Ibu");
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [notice, setNotice] = useState("");

  function savePreview() {
    setIsEditing(false);
    setNotice("Perubahan ditampilkan di halaman ini. Penyimpanan ke akun belum tersedia.");
  }

  function exportPreview() {
    setNotice("Ekspor data belum tersedia karena halaman ini belum terhubung ke layanan akun.");
  }

  return (
    <div className="mx-auto max-w-5xl space-y-7 py-4 sm:py-8">
      <section className="relative overflow-hidden rounded-[2rem] bg-brand px-6 py-8 text-white shadow-lg sm:px-10 sm:py-10">
        <div className="pointer-events-none absolute -right-14 -top-20 h-64 w-64 rounded-full border-[32px] border-white/5" />
        <div className="pointer-events-none absolute bottom-[-5rem] right-28 h-40 w-40 rounded-full bg-accent-lime/15 blur-2xl" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
              <ShieldCheck className="h-3.5 w-3.5" /> Ruang pribadi kamu
            </span>
            <h1 className="font-serif text-3xl font-black leading-tight sm:text-4xl">Akun & privasi</h1>
            <p className="max-w-lg text-sm leading-relaxed text-white/75 sm:text-base">
              Lihat informasi akunmu dan atur data pribadi dengan nyaman. Informasi ini hanya untuk kebutuhan layananmu.
            </p>
          </div>
          <div className="flex items-center gap-3 self-start rounded-2xl border border-white/15 bg-white/10 px-4 py-3 sm:self-auto">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-lime text-brand">
              <UserRound className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold">{nama}</p>
              <p className="text-xs text-white/65">Mahasiswa</p>
            </div>
          </div>
        </div>
      </section>

      {notice && (
        <div role="status" aria-live="polite" className="flex items-start gap-3 rounded-2xl border border-brand/15 bg-brand/5 px-4 py-3 text-sm text-text">
          <CircleHelp className="mt-0.5 h-4 w-4 shrink-0 text-brand dark:text-text" />
          <p className="flex-1">{notice}</p>
          <button onClick={() => setNotice("")} aria-label="Tutup pemberitahuan" className="rounded-full p-1 text-text-muted hover:bg-black/5">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <Card className="space-y-6 p-5 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-text-muted">Informasi akun</p>
              <h2 className="mt-1 text-xl font-bold text-brand dark:text-text">Profil mahasiswa</h2>
              <p className="mt-1 text-sm text-text-muted">Pastikan informasi kontakmu tetap mudah dihubungi.</p>
            </div>
            {!isEditing ? (
              <Button variant="outline" size="sm" onClick={() => { setNotice(""); setIsEditing(true); }} className="gap-2">
                <Pencil className="h-3.5 w-3.5" /> Ubah profil
              </Button>
            ) : (
              <span className="rounded-full bg-accent-mint px-3 py-1 text-xs font-semibold text-brand">Mode ubah</span>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nama lengkap" hint="Nama yang tampil di akunmu">
              {isEditing ? <input id="nama" value={nama} onChange={(e) => setNama(e.target.value)} autoComplete="name" className={inputClass} /> : <p className={valueClass}>{nama}</p>}
            </Field>
            <Field label="Nomor induk mahasiswa" hint="Terhubung dengan akun kampus">
              <div className={`${valueClass} flex items-center justify-between gap-2`}>
                <span>{nim}</span><LockKeyhole className="h-4 w-4 text-text-muted" />
              </div>
            </Field>
            <Field label="Nomor kontak darurat" hint="Digunakan hanya jika diperlukan">
              {isEditing ? <input id="kontak" type="tel" value={kontakDarurat} onChange={(e) => setKontakDarurat(e.target.value)} autoComplete="tel" className={inputClass} /> : <p className={valueClass}>{kontakDarurat}</p>}
            </Field>
            <Field label="Hubungan kontak" hint="Contoh: orang tua, saudara, teman">
              {isEditing ? <input id="hubungan" value={hubungan} onChange={(e) => setHubungan(e.target.value)} className={inputClass} /> : <p className={valueClass}>{hubungan}</p>}
            </Field>
          </div>

          {isEditing && (
            <div className="flex flex-col-reverse gap-2 border-t border-black/5 pt-5 dark:border-white/10 sm:flex-row sm:justify-end">
              <Button variant="ghost" onClick={() => { setNama("Muhammad Josfi"); setKontakDarurat("081298765432"); setHubungan("Ibu"); setIsEditing(false); }}>
                Batal
              </Button>
              <Button onClick={savePreview} className="gap-2"><Check className="h-4 w-4" /> Simpan perubahan</Button>
            </div>
          )}
        </Card>

        <aside className="space-y-4">
          <Card className="space-y-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-mint text-brand">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-brand dark:text-text">Privasi tetap terjaga</h2>
              <p className="mt-1 text-sm leading-relaxed text-text-muted">NIM terhubung ke akun kampus dan tidak dapat diubah dari halaman ini.</p>
            </div>
            <button onClick={() => setNotice("Detail penggunaan data akun akan tersedia setelah halaman terhubung ke layanan akun.")} className="flex w-full items-center justify-between border-t border-black/5 pt-3 text-left text-xs font-semibold text-brand dark:border-white/10 dark:text-text">
              Pelajari tentang data kamu <ChevronRight className="h-4 w-4" />
            </button>
          </Card>

          <Card className="space-y-4 p-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-text-muted">Salinan data</p>
              <h2 className="mt-1 font-bold text-brand dark:text-text">Bawa data kamu</h2>
              <p className="mt-1 text-sm leading-relaxed text-text-muted">Minta salinan informasi akun dan aktivitasmu dalam format yang mudah dibaca.</p>
            </div>
            <Button variant="outline" size="sm" onClick={exportPreview} className="w-full gap-2">
              <ArrowDownToLine className="h-4 w-4" /> Ekspor data saya
            </Button>
          </Card>

          <Card className="space-y-3 border-danger/20 p-5">
            <div className="flex items-center gap-2 text-danger">
              <Trash2 className="h-4 w-4" />
              <h2 className="text-sm font-bold">Hapus data</h2>
            </div>
            <p className="text-xs leading-relaxed text-text-muted">Penghapusan data bisa berdampak pada akses layanan dan riwayatmu.</p>
            <button onClick={() => setShowDeleteConfirm(true)} className="text-xs font-semibold text-danger underline decoration-danger/30 underline-offset-4 hover:decoration-danger">
              Lihat opsi penghapusan
            </button>
          </Card>
        </aside>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setShowDeleteConfirm(false); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="delete-title" className="w-full max-w-md space-y-4 rounded-t-3xl bg-surface p-6 shadow-2xl sm:rounded-3xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-danger/10 text-danger"><Trash2 className="h-5 w-5" /></div>
            <div>
              <h2 id="delete-title" className="text-xl font-bold text-text">Penghapusan data</h2>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">Permintaan penghapusan belum dapat diproses dari prototipe ini. Saat fitur tersedia, kamu akan melihat data yang terdampak sebelum mengonfirmasi.</p>
            </div>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>Kembali</Button>
              <Button variant="danger" onClick={() => { setShowDeleteConfirm(false); setNotice("Penghapusan data belum tersedia. Tidak ada data yang dihapus."); }}>Mengerti</Button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

const inputClass = "w-full rounded-xl border border-black/10 bg-bg px-3.5 py-3 text-sm text-text outline-none transition focus:border-focus focus:ring-2 focus:ring-focus/20 dark:border-white/10";
const valueClass = "flex min-h-11 items-center rounded-xl border border-black/5 bg-bg/70 px-3.5 py-3 text-sm font-medium text-text dark:border-white/10";

function Field({ label, hint, children }: { label: string; hint: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <p className="text-sm font-semibold text-text">{label}</p>
      {children}
      <p className="text-xs text-text-muted">{hint}</p>
    </div>
  );
}
