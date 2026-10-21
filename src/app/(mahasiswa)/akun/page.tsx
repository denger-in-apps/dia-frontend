"use client";

import { useState } from "react";
import { User, Phone, Download, Trash2, ShieldAlert, Heart, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AkunPage() {
  const [nama, setNama] = useState("Muhammad Josfi");
  const [nim, setNim] = useState("102062400003");
  const [kontakDarurat, setKontakDarurat] = useState("081298765432 (Ibu)");
  const [doubleConfirmDelete, setDoubleConfirmDelete] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const handleExport = () => {
    const data = {
      nama,
      nim,
      kontakDarurat,
      tanggalEkspor: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `data-dengerin-${nim}.json`;
    a.click();
    setStatusMsg("Data berhasil diekspor.");
  };

  const handleDeleteData = () => {
    if (!doubleConfirmDelete) {
      setDoubleConfirmDelete(true);
      return;
    }
    // Delete simulation
    setStatusMsg("Seluruh data akunmu berhasil dihapus secara permanen.");
    setDoubleConfirmDelete(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-serif font-black text-brand dark:text-text">
          Pengaturan Akun & Privasi
        </h1>
        <p className="text-sm text-text-muted">
          Kelola data profil, kontak darurat saat krisis, dan hak privasimu.
        </p>
      </div>

      {statusMsg && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 text-emerald-800 dark:text-emerald-200 rounded-2xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Profile & Emergency Contact */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-bold text-brand dark:text-text">Profil Mahasiswa</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <label className="text-text-muted font-semibold">Nama Lengkap</label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full p-2.5 rounded-2xl border border-black/10 dark:border-white/10 bg-surface focus:ring-2 focus:ring-focus"
            />
          </div>
          <div className="space-y-1">
            <label className="text-text-muted font-semibold">NIM</label>
            <input
              type="text"
              disabled
              value={nim}
              className="w-full p-2.5 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 opacity-80 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="space-y-1 pt-2">
          <label className="text-xs font-semibold text-text-muted">Kontak Darurat (Hubungan & Nomor)</label>
          <input
            type="text"
            value={kontakDarurat}
            onChange={(e) => setKontakDarurat(e.target.value)}
            className="w-full p-2.5 rounded-2xl border border-black/10 dark:border-white/10 bg-surface text-xs focus:ring-2 focus:ring-focus"
          />
          <p className="text-[11px] text-text-muted">Hanya dihubungi dalam situasi krisis keselamatan fisik atas rekomendasi psikolog jaga.</p>
        </div>

        <Button variant="primary" size="sm">
          Simpan Perubahan
        </Button>
      </Card>

      {/* GDPR / Privacy Rights: Export & Delete */}
      <Card className="p-6 space-y-4 border border-danger/20">
        <h2 className="text-lg font-bold text-danger flex items-center gap-2">
          <ShieldAlert className="w-5 h-5" /> Kontrol Privasi & Data Pribadi
        </h2>
        <p className="text-xs text-text-muted leading-relaxed">
          Kamu memiliki kendali penuh atas datamu sesuai prinsip privasi. Kamu dapat mengunduh seluruh salinan data aktivitasmu atau menghapusnya kapan saja.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button onClick={handleExport} variant="outline" size="sm" className="flex items-center gap-1.5">
            <Download className="w-4 h-4" /> Ekspor Data Saya (JSON)
          </Button>

          <Button
            onClick={handleDeleteData}
            variant="danger"
            size="sm"
            className="flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            {doubleConfirmDelete ? "Klik Lagi untuk Hapus Permanen" : "Hapus Seluruh Data Saya"}
          </Button>
        </div>

        {doubleConfirmDelete && (
          <p className="text-xs text-danger font-medium animate-pulse">
            Peringatan: Tindakan ini tidak dapat dibatalkan. Riwayat konsultasi dan curhatmu akan dihapus permanen.
          </p>
        )}
      </Card>
    </div>
  );
}
