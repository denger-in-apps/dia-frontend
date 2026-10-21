"use client";

import { useState } from "react";
import { AlertTriangle, Clock, MapPin, CheckCircle2, UserCheck, RefreshCw, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SosCase {
  id: string;
  waktu: string;
  kategori: string;
  eskalasiDetik: number;
  status: "BARU" | "DIAMBIL" | "TERHUBUNG";
  lokasi?: { lat: number; lng: number };
  catatan?: string;
}

export default function PsikologSosDashboardPage() {
  const [cases, setCases] = useState<SosCase[]>([
    {
      id: "SOS-20261021-01",
      waktu: "10:31 WIB (2 menit lalu)",
      kategori: "Panik / Cemas berat",
      eskalasiDetik: 180,
      status: "BARU",
      lokasi: { lat: -6.914744, lng: 107.60981 },
      catatan: "Napas sesak, sedang di koridor lantai 3 gedung kuliah.",
    },
    {
      id: "SOS-20261021-02",
      waktu: "10:15 WIB (18 menit lalu)",
      kategori: "Butuh teman bicara darurat",
      eskalasiDetik: 0,
      status: "DIAMBIL",
    },
  ]);

  const [conflictMsg, setConflictMsg] = useState<string | null>(null);

  const handleAmbilKasus = (id: string) => {
    setConflictMsg(null);
    // Simulate race condition / 409 conflict test
    if (id === "SOS-CONFLICT") {
      setConflictMsg("Kasus ini baru saja diambil oleh Psikolog lain. Daftar telah diperbarui.");
      return;
    }

    setCases(cases.map((c) => (c.id === id ? { ...c, status: "DIAMBIL" } : c)));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6" aria-live="assertive">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-black text-brand dark:text-text flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-danger" />
            Dashboard Tanggap Darurat SOS (Genta)
          </h1>
          <p className="text-xs text-text-muted">
            Antrean sinyal darurat mahasiswa berdasarkan urutan prioritas krisis dan waktu masuk.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={() => setConflictMsg(null)} className="flex items-center gap-1.5">
          <RefreshCw className="w-3.5 h-3.5" /> Segarkan Antrean
        </Button>
      </div>

      {conflictMsg && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 text-amber-800 dark:text-amber-200 rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{conflictMsg}</span>
        </div>
      )}

      {/* Cases List */}
      <div className="space-y-4">
        {cases.map((item) => (
          <Card
            key={item.id}
            className={`p-6 border-2 transition-all ${
              item.status === "BARU"
                ? "border-danger/40 bg-danger/5 shadow-md"
                : "border-black/5 dark:border-white/10 opacity-80"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/5 dark:border-white/10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={item.status === "BARU" ? "danger" : "mint"}>
                    {item.status === "BARU" ? "KASUS BARU (MENUNGGU RESPON)" : "SEDANG DITANGANI"}
                  </Badge>
                  <span className="text-xs font-mono font-semibold text-text-muted">{item.id}</span>
                </div>
                <div className="text-base font-bold text-brand dark:text-text">{item.kategori}</div>
              </div>

              {item.status === "BARU" && (
                <div className="p-2.5 rounded-2xl bg-surface border border-danger/20 text-xs text-danger font-semibold flex items-center gap-1.5">
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>Hitung Mundur Eskalasi SMS: {item.eskalasiDetik} detik</span>
                </div>
              )}
            </div>

            <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <div>
                  <span className="text-text-muted">Waktu Sinyal: </span>
                  <span className="font-semibold">{item.waktu}</span>
                </div>
                {item.catatan && (
                  <div>
                    <span className="text-text-muted">Catatan Singkat: </span>
                    <span className="italic font-medium text-text">&ldquo;{item.catatan}&rdquo;</span>
                  </div>
                )}
              </div>

              <div>
                <span className="text-text-muted block mb-1">Informasi Lokasi Fisik:</span>
                {item.lokasi ? (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-danger shrink-0" />
                    <span className="font-mono text-[11px]">
                      Lat: {item.lokasi.lat}, Lng: {item.lokasi.lng}
                    </span>
                    <a
                      href={`https://www.google.com/maps?q=${item.lokasi.lat},${item.lokasi.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-surface border border-black/10 dark:border-white/10 text-brand rounded-full font-bold hover:underline"
                    >
                      Buka di Peta
                    </a>
                  </div>
                ) : (
                  <span className="text-text-muted italic">Mahasiswa memilih tidak membagikan lokasi fisik.</span>
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              {item.status === "BARU" ? (
                <Button
                  onClick={() => handleAmbilKasus(item.id)}
                  variant="danger"
                  size="md"
                  className="w-full sm:w-auto font-bold flex items-center justify-center gap-1.5"
                >
                  <UserCheck className="w-4 h-4" /> Ambil & Tangani Kasus Ini
                </Button>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Dalam Pendampingan
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
