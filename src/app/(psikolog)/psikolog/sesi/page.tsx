"use client";

import { useState } from "react";
import { Lock, Unlock, Calendar, CheckCircle2, FileText, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PsikologSesiPage() {
  const [hasConsent, setHasConsent] = useState(false);
  const [ringkasan, setRingkasan] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-serif font-black text-brand dark:text-text">
          Jadwal & Catatan Sesi Konseling
        </h1>
        <p className="text-xs text-text-muted">
          PBI-11/13: Akses catatan sesi tunduk pada persetujuan eksplisit (consent) mahasiswa.
        </p>
      </div>

      <Card className="p-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/10">
          <div>
            <div className="text-base font-bold text-brand dark:text-text">Sesi Konseling: MHS-102062</div>
            <div className="text-xs text-text-muted">Kamis, 24 Oktober 2026 • 14:00 - 15:00 WIB (Selesai)</div>
          </div>
          <Badge variant="mint">Selesai</Badge>
        </div>

        {/* Consent Section (NFR-02 / PBI-13 requirement) */}
        <div className={`p-4 rounded-2xl border ${hasConsent ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300" : "bg-amber-50 dark:bg-amber-950/20 border-amber-300"} space-y-2 text-xs`}>
          <div className="flex items-center justify-between">
            <span className="font-bold flex items-center gap-1.5">
              {hasConsent ? <Unlock className="w-4 h-4 text-emerald-600" /> : <Lock className="w-4 h-4 text-amber-600" />}
              Status Persetujuan Mahasiswa (Consent)
            </span>
            <Button
              variant={hasConsent ? "outline" : "secondary"}
              size="sm"
              onClick={() => setHasConsent(!hasConsent)}
            >
              {hasConsent ? "Cabut Simulasi Consent" : "Simulasikan Mahasiswa Menyetujui Consent"}
            </Button>
          </div>
          <p className="text-text-muted">
            {hasConsent
              ? "Mahasiswa telah memberikan izin ringkasan sesi dicatat untuk rekam perkembangan."
              : "Form ringkasan psikolog TERKUNCI sampai mahasiswa menekan tombol setuju pada aplikasi mereka."}
          </p>
        </div>

        {/* Form Ringkasan Psikolog */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-text-muted flex items-center gap-1.5">
            <FileText className="w-4 h-4" /> Catatan Perkembangan & Ringkasan Psikolog
          </label>
          <textarea
            disabled={!hasConsent}
            value={ringkasan}
            onChange={(e) => setRingkasan(e.target.value)}
            rows={5}
            placeholder={
              hasConsent
                ? "Tuliskan poin observasi klinis dan saran tindakan untuk mahasiswa..."
                : "Form ini terkunci hingga mahasiswa memberikan persetujuan (consent)."
            }
            className={`w-full p-3.5 rounded-2xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-focus resize-none ${
              hasConsent
                ? "border-black/10 dark:border-white/10 bg-surface"
                : "border-black/5 bg-black/5 dark:bg-white/5 cursor-not-allowed opacity-60"
            }`}
          />

          <Button
            disabled={!hasConsent || !ringkasan.trim()}
            onClick={() => setIsSaved(true)}
            variant="primary"
            size="md"
          >
            Simpan Ringkasan Sesi
          </Button>

          {isSaved && (
            <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Catatan sesi berhasil disimpan terenkripsi.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
