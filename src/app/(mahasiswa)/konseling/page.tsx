"use client";

import Link from "next/link";
import { CalendarHeart, Plus, Clock, MessageSquare, Video, ArrowRight, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function KonselingListPage() {
  const sessions = [
    {
      id: "sesi-101",
      psikolog: "Dr. Sarah Wijaya, M.Psi.",
      jadwal: "Kamis, 24 Oktober 2026 • 14:00 WIB",
      tipe: "Chat E2EE",
      status: "TERKONFIRMASI",
      ruangTersedia: true,
    },
    {
      id: "sesi-98",
      psikolog: "Budi Santoso, M.Psi., Psikolog",
      jadwal: "12 Oktober 2026 • 10:00 WIB",
      tipe: "Tatap Muka",
      status: "SELESAI",
      ruangTersedia: false,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-black text-brand dark:text-text">
            Sesi Konseling Privat
          </h1>
          <p className="text-sm text-text-muted">
            Konsultasi 1-on-1 dengan psikolog profesional bersertifikat. Terenkripsi dan terjaga kerahasiaannya.
          </p>
        </div>
        <Link href="/konseling/pesan">
          <Button variant="primary" size="md" className="flex items-center gap-1.5 shrink-0">
            <Plus className="w-4 h-4" /> Pesan Sesi Baru
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {sessions.map((sesi) => (
          <Card key={sesi.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant={sesi.status === "TERKONFIRMASI" ? "mint" : "outline"}>
                  {sesi.status}
                </Badge>
                <span className="text-xs text-text-muted flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {sesi.jadwal}
                </span>
              </div>
              <h2 className="text-lg font-bold text-brand dark:text-text">
                {sesi.psikolog}
              </h2>
              <div className="text-xs text-text-muted flex items-center gap-2">
                <span>Metode: <strong>{sesi.tipe}</strong></span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-600">
                  <ShieldCheck className="w-3.5 h-3.5" /> Enkripsi End-to-End
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 sm:pt-0">
              <Link href={`/konseling/${sesi.id}`}>
                <Button variant="outline" size="sm">
                  Detail / Jadwal
                </Button>
              </Link>
              {sesi.ruangTersedia && (
                <Link href={`/konseling/${sesi.id}/ruang`}>
                  <Button variant="primary" size="sm" className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" /> Masuk Ruang Sesi
                  </Button>
                </Link>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
