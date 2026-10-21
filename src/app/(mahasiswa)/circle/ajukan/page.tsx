"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AjukanCirclePage() {
  const router = useRouter();
  const [nama, setNama] = useState("");
  const [kategori, setKategori] = useState("Akademik");
  const [tujuan, setTujuan] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !tujuan) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-xl mx-auto py-6 space-y-6">
      <Link href="/circle" className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-brand">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Circle
      </Link>

      <Card className="p-8 space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-serif font-black text-brand dark:text-text">
            Ajukan Circle Komunitas Baru
          </h1>
          <p className="text-xs text-text-muted">
            Circle yang diajukan akan ditinjau oleh Administrator & Psikolog Kampus untuk memastikan topik aman dan saling mendukung.
          </p>
        </div>

        {submitted ? (
          <div className="p-6 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h2 className="text-lg font-bold text-brand">Pengajuan Circle Terkirim!</h2>
            <p className="text-xs text-text-muted">
              Tim admin akan meninjau pengajuanmu dalam 1-2 hari kerja. Pemberitahuan akan dikirimkan ke akunmu.
            </p>
            <Button onClick={() => router.push("/circle")} variant="primary" size="md">
              Kembali ke Circle
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-muted">Nama Circle</label>
              <input
                type="text"
                required
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: Teman Diskusi Burnout Skripsi"
                className="w-full p-3 rounded-2xl border border-black/10 dark:border-white/10 bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-focus"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-muted">Kategori</label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className="w-full p-3 rounded-2xl border border-black/10 dark:border-white/10 bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-focus"
              >
                <option value="Akademik">Akademik</option>
                <option value="Kesehatan Mental">Kesehatan Mental</option>
                <option value="Adaptasi">Adaptasi Kampus / Rantau</option>
                <option value="Pengembangan Diri">Pengembangan Diri</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-muted">Tujuan & Gambaran Diskusi</label>
              <textarea
                required
                rows={4}
                value={tujuan}
                onChange={(e) => setTujuan(e.target.value)}
                placeholder="Ceritakan mengapa Circle ini penting dan siapa saja yang diharapkan bergabung..."
                className="w-full p-3 rounded-2xl border border-black/10 dark:border-white/10 bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-focus resize-none"
              />
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full">
              Kirim Pengajuan untuk Ditinjau
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
