"use client";

import { use, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, AlertTriangle, Calendar, CheckCircle2, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSesiKonseling } from "../SesiKonselingContext";

export default function KonselingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { sessions, reschedule, cancel } = useSesiKonseling();
  const [showReschedule, setShowReschedule] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [scheduleError, setScheduleError] = useState("");
  const session = sessions.find((item) => item.id === resolvedParams.id);
  const [tanggal, setTanggal] = useState(session?.tanggal ?? "2026-10-24");
  const [slot, setSlot] = useState(session?.slot ?? "14:00 - 15:00");
  const today = new Date().toLocaleDateString("en-CA");

  const handleBatal = () => {
    cancel(resolvedParams.id);
    setShowCancelDialog(false);
  };

  function handleReschedule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!tanggal || tanggal < today) {
      setScheduleError("Pilih tanggal hari ini atau setelahnya.");
      return;
    }
    if (slot === "14:00 - 15:00") {
      setScheduleError("Slot ini tidak tersedia. Silakan pilih waktu alternatif.");
      return;
    }
    reschedule(resolvedParams.id, tanggal, slot);
    setScheduleError("");
    setShowReschedule(false);
  }

  if (!session) {
    return (
      <div className="max-w-2xl mx-auto py-6 space-y-6">
        <Link href="/konseling" className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-brand">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Konseling
        </Link>
        <Card><p className="text-sm text-text-muted">Sesi tidak ditemukan. Silakan kembali ke daftar konseling.</p></Card>
      </div>
    );
  }

  const isCanceled = session.status === "DIBATALKAN";
  const canManage = session.status === "TERKONFIRMASI";

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6">
      <Link href="/konseling" className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-brand">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Konseling
      </Link>

      <Card className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <Badge variant={isCanceled ? "danger" : session.status === "TERKONFIRMASI" ? "mint" : "outline"}>
            {isCanceled ? "Dibatalkan" : session.status === "SELESAI" ? "Selesai" : "Terkonfirmasi"}
          </Badge>
          <span className="text-xs text-text-muted">ID Sesi: {resolvedParams.id}</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-serif font-black text-brand dark:text-text">
            Detail Sesi Konseling
          </h1>
          <p className="text-sm text-text-muted">
            Bersama: <strong>{session.psikolog}</strong>
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-black/10 dark:border-white/10 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-text-muted">Jadwal:</span>
            <span className="font-bold">{session.jadwal}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-muted">Metode:</span>
            <span className="font-bold">{session.tipe} (Terenkripsi)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-muted">Status Kehadiran:</span>
            <span>Menunggu Waktu Sesi Dimulai</span>
          </div>
        </div>

        {canManage && (
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-black/5 dark:border-white/10">
            <Link href={`/konseling/${resolvedParams.id}/ruang`} className="flex-1">
              <Button variant="primary" size="md" className="w-full flex items-center justify-center gap-1.5">
                <MessageSquare className="w-4 h-4" /> Masuk ke Ruang Sesi
              </Button>
            </Link>
            <Button onClick={() => { setTanggal(session.tanggal); setSlot(session.slot); setShowReschedule(true); }} variant="outline" size="md">
              Ubah jadwal
            </Button>
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

        {isCanceled && (
          <div className="flex items-start gap-2 rounded-2xl bg-danger/10 border border-danger/20 p-4 text-xs text-text-muted">
            <CheckCircle2 className="w-4 h-4 text-danger shrink-0" /> Sesi ini sudah dibatalkan dan tidak dapat dimasuki.
          </div>
        )}

        {showReschedule && (
          <form onSubmit={handleReschedule} className="p-4 rounded-2xl bg-surface border border-black/10 dark:border-white/10 space-y-4" aria-label="Ubah jadwal sesi">
            <div className="flex items-center gap-2 text-brand dark:text-text font-bold text-sm">
              <Calendar className="w-4 h-4" /> Pilih jadwal baru
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="space-y-1 text-xs font-semibold text-text-muted">
                Tanggal
                <input type="date" min={today} required value={tanggal} onChange={(event) => setTanggal(event.target.value)} className="w-full p-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-surface text-text" />
              </label>
              <label className="space-y-1 text-xs font-semibold text-text-muted">
                Slot waktu
                <select value={slot} onChange={(event) => setSlot(event.target.value)} className="w-full p-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-surface text-text">
                  <option value="09:00 - 10:00">09:00 - 10:00 WIB</option>
                  <option value="10:00 - 11:00">10:00 - 11:00 WIB</option>
                  <option value="14:00 - 15:00">14:00 - 15:00 WIB (simulasi tidak tersedia)</option>
                  <option value="15:30 - 16:30">15:30 - 16:30 WIB</option>
                </select>
              </label>
            </div>
            {scheduleError && <p role="alert" className="text-xs text-danger">{scheduleError}</p>}
            <div className="flex justify-end gap-2">
              <Button type="button" onClick={() => { setShowReschedule(false); setScheduleError(""); }} variant="outline" size="sm">Kembali</Button>
              <Button type="submit" size="sm">Simpan jadwal</Button>
            </div>
          </form>
        )}

        {showCancelDialog && (
          <div className="p-4 rounded-2xl bg-danger/10 border border-danger/30 space-y-3 text-left">
            <div className="flex items-center gap-2 text-danger font-bold text-xs">
              <AlertTriangle className="w-4 h-4" /> Konfirmasi Pembatalan
            </div>
            <p className="text-xs text-text-muted">
              Apakah kamu yakin ingin membatalkan sesi ini? Aksi ini akan mengubah status sesi pada tampilan saat ini.
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
