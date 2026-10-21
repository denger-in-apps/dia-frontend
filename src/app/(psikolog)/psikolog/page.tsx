import Link from "next/link";
import { AlertTriangle, Calendar, MessageSquare, Users, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PsikologDashboardPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-serif font-black text-brand dark:text-text">
          Dashboard Jaga Psikolog
        </h1>
        <p className="text-xs text-text-muted">
          Pantau kasus darurat aktif, jadwal konsultasi hari ini, dan pesan curhat mahasiswa.
        </p>
      </div>

      {/* SOS Alert Card */}
      <div className="p-5 rounded-3xl bg-danger/10 border-2 border-danger/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-danger text-white flex items-center justify-center animate-bounce">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-danger">1 Kasus Sinyal Darurat Baru Menunggu Penanganan</h2>
            <p className="text-xs text-text-muted">Mahasiswa mengirim sinyal SOS 2 menit yang lalu • Perlu respons segera.</p>
          </div>
        </div>
        <Link href="/psikolog/sos">
          <Button variant="danger" size="md">
            Buka Dashboard SOS
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 space-y-2">
          <div className="text-xs text-text-muted flex items-center justify-between">
            <span>Sesi Terjadwal Hari Ini</span>
            <Calendar className="w-4 h-4 text-brand" />
          </div>
          <div className="text-2xl font-bold text-brand dark:text-text">3 Sesi</div>
          <p className="text-[11px] text-text-muted">Sesi berikutnya pukul 14:00 WIB</p>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="text-xs text-text-muted flex items-center justify-between">
            <span>Curhat Anonim Masuk</span>
            <MessageSquare className="w-4 h-4 text-brand" />
          </div>
          <div className="text-2xl font-bold text-brand dark:text-text">5 Utas</div>
          <p className="text-[11px] text-text-muted">2 membutuhkan balasan tanggap</p>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="text-xs text-text-muted flex items-center justify-between">
            <span>Circle yang Didampingi</span>
            <Users className="w-4 h-4 text-brand" />
          </div>
          <div className="text-2xl font-bold text-brand dark:text-text">2 Circle</div>
          <p className="text-[11px] text-text-muted">Aktivitas mingguan berjalan baik</p>
        </Card>
      </div>
    </div>
  );
}
