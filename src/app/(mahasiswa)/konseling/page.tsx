"use client";

import Link from "next/link";
import { Plus, Clock, MessageSquare, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSesiKonseling } from "./SesiKonselingContext";

export default function KonselingListPage() {
  const { sessions } = useSesiKonseling();

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
                <Badge variant={sesi.status === "TERKONFIRMASI" ? "mint" : sesi.status === "DIBATALKAN" ? "danger" : "outline"}>
                  {sesi.status === "DIBATALKAN" ? "Dibatalkan" : sesi.status}
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
              {sesi.ruangTersedia && sesi.status === "TERKONFIRMASI" && (
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
