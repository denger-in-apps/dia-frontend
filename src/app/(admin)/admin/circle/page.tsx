"use client";

import { useState } from "react";
import { Check, X, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminCircleApprovalPage() {
  const [pendingCircles, setPendingCircles] = useState([
    {
      id: "C-REQ-01",
      nama: "Circle Diskusi Skripsi Akhir",
      pengaju: "Muhammad Josfi (102062400003)",
      kategori: "Akademik",
      deskripsi: "Ruang berbagi motivasi untuk menyelesaikan bab 4 dan 5.",
      tanggal: "21 Oktober 2026",
    },
  ]);

  const handleApprove = (id: string) => {
    setPendingCircles(pendingCircles.filter((c) => c.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-serif font-black text-brand dark:text-text">
          Persetujuan Circle Komunitas (FR-ADM-07)
        </h1>
        <p className="text-xs text-text-muted">
          Tinjau proposal Circle baru yang diajukan mahasiswa sebelum dipublikasikan ke publik.
        </p>
      </div>

      {pendingCircles.length === 0 ? (
        <Card className="p-8 text-center text-xs text-text-muted">
          Tidak ada pengajuan Circle baru yang menunggu persetujuan.
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingCircles.map((req) => (
            <Card key={req.id} className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="lavender">{req.kategori}</Badge>
                <span className="text-xs text-text-muted">{req.tanggal}</span>
              </div>
              <h2 className="text-lg font-bold text-brand dark:text-text">{req.nama}</h2>
              <div className="text-xs text-text-muted">Diajukan oleh: <strong>{req.pengaju}</strong></div>
              <p className="text-xs text-text leading-relaxed">{req.deskripsi}</p>
              <div className="pt-2 flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => handleApprove(req.id)} className="text-danger border-danger/30">
                  <X className="w-4 h-4 mr-1" /> Tolak
                </Button>
                <Button variant="primary" size="sm" onClick={() => handleApprove(req.id)}>
                  <Check className="w-4 h-4 mr-1" /> Setujui & Terbitkan
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
