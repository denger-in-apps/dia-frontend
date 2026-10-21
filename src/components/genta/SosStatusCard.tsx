"use client";

import { useState } from "react";
import { Phone, CheckCircle2, Clock, ShieldCheck, HeartHandshake, AlertTriangle, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface SosStatusCardProps {
  id: string;
  status: "BARU" | "DIAMBIL" | "TERHUBUNG" | "SELESAI";
  waktuBuat: string;
  kategori?: string;
  psikologNama?: string | null;
  onBatal?: () => void;
}

export function SosStatusCard({
  id,
  status,
  waktuBuat,
  kategori = "Umum",
  psikologNama,
  onBatal,
}: SosStatusCardProps) {
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);

  return (
    <Card className="text-center p-6 sm:p-8 space-y-6 border-2 border-danger/30 shadow-2xl bg-surface">
      <div className="w-16 h-16 rounded-full bg-danger/10 text-danger flex items-center justify-center mx-auto animate-pulse">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-danger/10 text-danger text-xs font-bold uppercase tracking-wider">
          Sinyal SOS Aktif • ID: {id}
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-black text-brand dark:text-text">
          Bantuan Sedang Menujumu
        </h2>
        <p className="text-xs sm:text-sm text-text-muted max-w-md mx-auto">
          Tarik napas perlahan. Kamu tidak sendirian. Sinyal krisis kamu telah diterima oleh tim psikolog jaga kampus.
        </p>
      </div>

      {/* Real-time Status Timeline */}
      <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-left space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-text-muted">Kategori Masalah:</span>
          <Badge variant="danger">{kategori}</Badge>
        </div>

        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-text-muted">Status Penanganan:</span>
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-bold ${
              status === "BARU"
                ? "bg-amber-100 text-amber-800"
                : status === "DIAMBIL"
                ? "bg-blue-100 text-blue-800"
                : "bg-emerald-100 text-emerald-800"
            }`}
          >
            {status === "BARU" && "Menunggu Psikolog Jaga..."}
            {status === "DIAMBIL" && "Kasus Diambil oleh Psikolog"}
            {status === "TERHUBUNG" && "Terhubung Secara Langsung"}
            {status === "SELESAI" && "Kasus Ditutup / Selesai"}
          </span>
        </div>

        {psikologNama && (
          <div className="flex items-center gap-2 p-2 bg-brand/5 dark:bg-white/5 rounded-xl text-xs">
            <HeartHandshake className="w-4 h-4 text-brand shrink-0" />
            <span>Psikolog Pendamping: <strong className="text-brand dark:text-text">{psikologNama}</strong></span>
          </div>
        )}

        <div className="text-[11px] text-text-muted flex items-center justify-between pt-1 border-t border-black/5 dark:border-white/5">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Dikirim: {waktuBuat}
          </span>
          <span className="text-emerald-600 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Terproteksi
          </span>
        </div>
      </div>

      {/* Mandatory Emergency Hotline Section (§4) */}
      <div className="p-5 rounded-3xl bg-danger/10 border border-danger/30 text-left space-y-3">
        <div className="flex items-center gap-2 text-danger font-bold text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>Perlu Bantuan Detik Ini Juga?</span>
        </div>
        <p className="text-xs text-text-muted">
          Jika kamu merasa dalam bahaya langsung atau butuh bicara detik ini juga, segera hubungi Hotline Darurat Nasional Kemenkes RI (bebas pulsa 24 jam).
        </p>
        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <a
            href="tel:119,8"
            className="flex-1 py-3 px-4 bg-danger text-white rounded-full font-bold text-xs flex items-center justify-center gap-2 shadow hover:opacity-90 transition-opacity"
          >
            <Phone className="w-4 h-4" /> Hubungi Bebas Pulsa: 119 Ext. 8
          </a>
          <a
            href="https://healing119.id"
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-4 bg-surface border border-danger/30 text-danger rounded-full font-semibold text-xs text-center hover:bg-danger/5 transition-colors"
          >
            Buka Healing119.id
          </a>
        </div>
      </div>

      {/* Cancel Action if false alarm */}
      {status !== "SELESAI" && (
        <div className="pt-2">
          {!showConfirmCancel ? (
            <button
              onClick={() => setShowConfirmCancel(true)}
              className="text-xs text-text-muted hover:text-danger underline transition-colors"
            >
              Salah menekan? Batalkan sinyal darurat ini
            </button>
          ) : (
            <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 text-xs space-y-2">
              <p className="font-semibold text-text">Apakah kamu yakin ingin membatalkan sinyal darurat ini?</p>
              <div className="flex justify-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowConfirmCancel(false)}>
                  Tetap Aktifkan
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    setShowConfirmCancel(false);
                    onBatal?.();
                  }}
                >
                  Ya, Batalkan Sinyal
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
