"use client";

import { useState } from "react";
import { Settings, Save, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function KonfigurasiSosPage() {
  const [eskalasiDetik, setEskalasiDetik] = useState(180);
  const [nomorSmsDarurat, setNomorSmsDarurat] = useState("+628112345678");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-serif font-black text-brand dark:text-text">
          Konfigurasi Sistem Darurat SOS (FR-ADM-05)
        </h1>
        <p className="text-xs text-text-muted">
          Atur parameter otomatisasi eskalasi krisis sinyal Genta.
        </p>
      </div>

      <Card className="p-6 space-y-5">
        {saved && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Konfigurasi SOS berhasil disimpan.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-text-muted">Batas Waktu Eskalasi Otomatis (Detik)</label>
            <input
              type="number"
              value={eskalasiDetik}
              onChange={(e) => setEskalasiDetik(Number(e.target.value))}
              className="w-full p-2.5 rounded-2xl border border-black/10 dark:border-white/10 bg-surface focus:ring-2 focus:ring-focus"
            />
            <p className="text-[11px] text-text-muted">
              Bila sinyal SOS belum diambil psikolog jaga dalam rentang detik ini, sistem akan otomatis mengirim SMS/Broadcast ke tim krisis kampus.
            </p>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-text-muted">Nomor Hotline / SMS Gateway Darurat</label>
            <input
              type="text"
              value={nomorSmsDarurat}
              onChange={(e) => setNomorSmsDarurat(e.target.value)}
              className="w-full p-2.5 rounded-2xl border border-black/10 dark:border-white/10 bg-surface focus:ring-2 focus:ring-focus"
            />
          </div>

          <Button type="submit" variant="primary" size="md">
            Simpan Konfigurasi
          </Button>
        </form>
      </Card>
    </div>
  );
}
