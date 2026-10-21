import Link from "next/link";
import { Shield, Clock, Users, Database, BarChart3, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function AdminDashboardPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-serif font-black text-brand dark:text-text">
          Ringkasan Operasional Kampus
        </h1>
        <p className="text-xs text-text-muted">
          Pantau status layanan, jadwal psikolog aktif, dan persetujuan komunitas.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 space-y-1">
          <div className="text-xs text-text-muted">Psikolog Jaga Aktif</div>
          <div className="text-2xl font-bold text-brand dark:text-text">2 Orang</div>
        </Card>
        <Card className="p-4 space-y-1">
          <div className="text-xs text-text-muted">Circle Menunggu Review</div>
          <div className="text-2xl font-bold text-amber-600">1 Pengajuan</div>
        </Card>
        <Card className="p-4 space-y-1">
          <div className="text-xs text-text-muted">Total Sesi Bulan Ini</div>
          <div className="text-2xl font-bold text-brand dark:text-text">48 Sesi</div>
        </Card>
        <Card className="p-4 space-y-1">
          <div className="text-xs text-text-muted">Status SOS Realtime</div>
          <div className="text-2xl font-bold text-emerald-600">Siaga Normal</div>
        </Card>
      </div>
    </div>
  );
}
