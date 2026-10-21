"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, Calendar, AlertTriangle, CheckCircle2, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function KonselingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [isCanceled, setIsCanceled] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const handleBatal = () => {
    setIsCanceled(true);
    setShowCancelDialog(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6">
      <Link href="/konseling" className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-brand">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Konseling
      </Link>

      <Card className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <Badge variant={isCanceled ? "danger" : "mint"}>
            {isCanceled ? "Dibatalkan" : "Terkonfirmasi"}
          </Badge>
          <span className="text-xs text-text-muted">ID Sesi: {resolvedParams.id}</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-serif font-black text-brand dark:text-text">
            Detail Sesi Konseling
          </h1>
          <p className="text-sm text-text-muted">
            Bersama: <strong>Dr. Sarah Wijaya, M.Psi.</strong>
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-black/10 dark:border-white/10 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-text-muted">Jadwal:</span>
            <span className="font-bold">Kamis, 24 Oktober 2026 • 14:00 WIB</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-muted">Metode:</span>
            <span className="font-bold">Chat E2EE (Terenkripsi)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-muted">Status Kehadiran:</span>
            <span>Menunggu Waktu Sesi Dimulai</span>
          </div>
        </div>

        {!isCanceled && (
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-black/5 dark:border-white/10">
            <Link href={`/konseling/${resolvedParams.id}/ruang`} className="flex-1">
              <Button variant="primary" size="md" className="w-full flex items-center justify-center gap-1.5">
                <MessageSquare className="w-4 h-4" /> Masuk ke Ruang Sesi
              </Button>
            </Link>
            <Button
              onClick={() => setShowCancelDialog(true)}
              variant="outline"
              size="md"
              className="text-danger border-danger/40 hover:bg-danger/10"
            >
              Batalkan Sesi
            </Button>
          </div>
        )}

        {showCancelDialog && (
          <div className="p-4 rounded-2xl bg-danger/10 border border-danger/30 space-y-3 text-left">
            <div className="flex items-center gap-2 text-danger font-bold text-xs">
              <AlertTriangle className="w-4 h-4" /> Konfirmasi Pembatalan
            </div>
            <p className="text-xs text-text-muted">
              Apakah kamu yakin ingin membatalkan sesi ini? Slot waktu akan dibuka kembali untuk mahasiswa lain yang membutuhkan.
            </p>
            <div className="flex gap-2 justify-end">
              <Button onClick={() => setShowCancelDialog(false)} variant="outline" size="sm">
                Kembali
              </Button>
              <Button onClick={handleBatal} variant="danger" size="sm">
                Ya, Batalkan
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
