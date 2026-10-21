"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock, Calendar, MessageSquare, Phone, Users, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PesanKonselingPage() {
  const router = useRouter();
  const [psikolog, setPsikolog] = useState("1");
  const [tanggal, setTanggal] = useState("2026-10-25");
  const [slot, setSlot] = useState("10:00 - 11:00");
  const [tipe, setTipe] = useState<"chat" | "suara" | "tatap-muka">("chat");
  const [keluhan, setKeluhan] = useState("");
  const [errorConflict, setErrorConflict] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const psikologList = [
    { id: "1", nama: "Dr. Sarah Wijaya, M.Psi.", spesialisasi: "Kecemasan, Manajemen Stres Mahasiswa" },
    { id: "2", nama: "Budi Santoso, M.Psi., Psikolog", spesialisasi: "Burnout Akademik, Hubungan Interpersonal" },
  ];

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keluhan.trim()) return;

    // Simulation of slot conflict (e.g. if 10:00)
    if (slot === "14:00 - 15:00") {
      setErrorConflict(true);
      return;
    }

    setIsSuccess(true);
  };

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6">
      <Link href="/konseling" className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-brand">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Konseling
      </Link>

      <Card className="p-8 space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-serif font-black text-brand dark:text-text">
            Pesan Sesi Konseling Privat
          </h1>
          <p className="text-xs text-text-muted">
            Pilih tenaga profesional dan waktu yang paling sesuai dengan ritme belajarmu.
          </p>
        </div>

        {isSuccess ? (
          <div className="p-6 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h2 className="text-xl font-bold text-brand">Sesi Berhasil Dijadwalkan!</h2>
            <p className="text-xs text-text-muted">
              Konfirmasi sesi dan tautan enkripsi telah dikirimkan ke email kampusmu. Kamu dapat masuk ke ruang sesi tepat pada waktu yang dipilih.
            </p>
            <Button onClick={() => router.push("/konseling")} variant="primary" size="md">
              Lihat Riwayat Sesi
            </Button>
          </div>
        ) : (
          <form onSubmit={handleBooking} className="space-y-5">
            {errorConflict && (
              <div className="p-4 rounded-2xl bg-danger/10 border border-danger/30 space-y-2 text-danger text-xs">
                <div className="flex items-center gap-2 font-bold">
                  <AlertCircle className="w-4 h-4" /> Slot waktu ini baru saja diambil pengguna lain.
                </div>
                <p>Silakan pilih alternatif jadwal lain di bawah ini:</p>
                <div className="flex gap-2">
                  {["11:00 - 12:00", "15:30 - 16:30"].map((alt) => (
                    <button
                      type="button"
                      key={alt}
                      onClick={() => {
                        setSlot(alt);
                        setErrorConflict(false);
                      }}
                      className="px-3 py-1 bg-surface border border-danger/40 rounded-full font-semibold hover:bg-danger/5"
                    >
                      {alt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Pilih Psikolog */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-muted">Pilih Psikolog</label>
              <div className="grid grid-cols-1 gap-2">
                {psikologList.map((p) => (
                  <label
                    key={p.id}
                    className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between text-xs transition-all ${
                      psikolog === p.id
                        ? "border-focus bg-focus/5 font-semibold text-brand dark:text-text"
                        : "border-black/10 dark:border-white/10"
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold">{p.nama}</div>
                      <div className="text-text-muted">{p.spesialisasi}</div>
                    </div>
                    <input
                      type="radio"
                      name="psikolog"
                      checked={psikolog === p.id}
                      onChange={() => setPsikolog(p.id)}
                      className="text-brand focus:ring-focus"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Tanggal & Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-muted">Tanggal</label>
                <input
                  type="date"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="w-full p-2.5 rounded-2xl border border-black/10 dark:border-white/10 bg-surface text-xs focus:ring-2 focus:ring-focus"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-muted">Slot Waktu</label>
                <select
                  value={slot}
                  onChange={(e) => setSlot(e.target.value)}
                  className="w-full p-2.5 rounded-2xl border border-black/10 dark:border-white/10 bg-surface text-xs focus:ring-2 focus:ring-focus"
                >
                  <option value="09:00 - 10:00">09:00 - 10:00 WIB</option>
                  <option value="10:00 - 11:00">10:00 - 11:00 WIB</option>
                  <option value="14:00 - 15:00">14:00 - 15:00 WIB</option>
                  <option value="15:30 - 16:30">15:30 - 16:30 WIB</option>
                </select>
              </div>
            </div>

            {/* Tipe Konseling */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-muted">Metode Konseling</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "chat", label: "Chat E2EE", icon: MessageSquare },
                  { id: "suara", label: "Panggilan Suara", icon: Phone },
                  { id: "tatap-muka", label: "Tatap Muka", icon: Users },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setTipe(item.id as "chat" | "suara" | "tatap-muka")}
                      className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                        tipe === item.id
                          ? "border-brand bg-brand text-white font-semibold"
                          : "border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-text text-xs"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[11px]">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Keluhan Awal */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-muted">Keluhan Awal / Hal yang Ingin Dibahas</label>
              <textarea
                required
                rows={3}
                value={keluhan}
                onChange={(e) => setKeluhan(e.target.value)}
                placeholder="Ceritakan secara singkat hal yang membuatmu merasa kurang nyaman..."
                className="w-full p-3 rounded-2xl border border-black/10 dark:border-white/10 bg-surface text-xs focus:ring-2 focus:ring-focus resize-none"
              />
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full">
              Konfirmasi Pemesanan Sesi
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
