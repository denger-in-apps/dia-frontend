import { BarChart3, Download, TrendingUp, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminLaporanPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-black text-brand dark:text-text">
            Laporan Agregat & Analitik (FR-ADM-04)
          </h1>
          <p className="text-xs text-text-muted">
            Data statistik anonim dan agregat untuk evaluasi kebijakan kesehatan mental kampus.
          </p>
        </div>
        <Button variant="outline" size="sm" className="flex items-center gap-1.5">
          <Download className="w-4 h-4" /> Unduh Laporan PDF / CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 space-y-2">
          <div className="text-xs text-text-muted">Total Skrining Cek Mandiri</div>
          <div className="text-2xl font-bold text-brand dark:text-text">342 Kali</div>
          <div className="text-[11px] text-emerald-600 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +14% dari bulan lalu
          </div>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="text-xs text-text-muted">Total Sinyal SOS Terlayani</div>
          <div className="text-2xl font-bold text-danger">12 Kasus</div>
          <div className="text-[11px] text-text-muted">Rata-rata respons: 2.1 menit</div>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="text-xs text-text-muted">Tingkat Kepuasan Mahasiswa</div>
          <div className="text-2xl font-bold text-brand dark:text-text">4.8 / 5.0</div>
          <div className="text-[11px] text-text-muted">Berdasarkan ulasan anonim</div>
        </Card>
      </div>
    </div>
  );
}
