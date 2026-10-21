"use client";

import { Users, Shield, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PsikologCirclePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-serif font-black text-brand dark:text-text">
          Pendampingan & Moderasi Circle
        </h1>
        <p className="text-xs text-text-muted">
          Pantau aktivitas Circle mahasiswa yang Anda bimbing agar ruang tetap nyaman dan bebas perundungan.
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="lavender">Akademik</Badge>
          <span className="text-xs text-text-muted">8/10 Anggota</span>
        </div>
        <h2 className="text-lg font-bold text-brand dark:text-text">Circle Pejuang Skripsi Akhir</h2>
        <p className="text-xs text-text-muted">
          Peran: Psikolog Pendamping. Diskusi terkini: tips manajemen jadwal dan mengatasi prokrastinasi.
        </p>
        <div className="pt-2 flex gap-2">
          <Button variant="primary" size="sm" className="flex items-center gap-1.5">
            <MessageCircle className="w-4 h-4" /> Masuk Moderasi
          </Button>
        </div>
      </Card>
    </div>
  );
}
