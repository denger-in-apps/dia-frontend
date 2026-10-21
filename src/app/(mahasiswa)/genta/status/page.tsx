"use client";

import { useState, useEffect } from "react";
import { Phone, CheckCircle2, Clock, ShieldCheck, HeartHandshake, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function GentaStatusPage() {
  const [status, setStatus] = useState<"BARU" | "DIAMBIL" | "TERHUBUNG">("BARU");
  const [psikologNama, setPsikologNama] = useState<string | null>(null);

  useEffect(() => {
    // Simulate real-time progress update from socket
    const timer1 = setTimeout(() => {
      setStatus("DIAMBIL");
      setPsikologNama("Dr. Sarah Wijaya, M.Psi.");
    }, 4000);

    const timer2 = setTimeout(() => {
      setStatus("TERHUBUNG");
    }, 8000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="max-w-xl mx-auto py-8 space-y-6">
      <Card className="text-center p-8 space-y-6 border-2 border-danger/20 shadow-xl">
        <div className="w-16 h-16 rounded-full bg-danger/10 text-danger flex items-center justify-center mx-auto animate-pulse">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-danger/10 text-danger text-xs font-bold uppercase tracking-wider">
            Sinyal Darurat Aktif
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-brand dark:text-text">
            Bantuan Sedang Menujumu
          </h1>
          <p className="text-xs sm:text-sm text-text-muted">
            Tarik napas perlahan. Kamu tidak sendirian. Sinyalmu telah diterima oleh sistem darurat kampus.
          </p>
        </div>

        {/* Real-time Status Card */}
        <div className="p-4 rounded-2xl bg-surface border border-black/10 dark:border-white/10 text-left space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-text-muted">Status Kasus:</span>
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
              {status === "DIAMBIL" && "Ditangani oleh Psikolog"}
              {status === "TERHUBUNG" && "Terhubung Langsung"}
            </span>
          </div>

          {psikologNama && (
            <div className="flex items-center gap-2 p-2 bg-brand/5 dark:bg-white/5 rounded-xl text-xs">
              <HeartHandshake className="w-4 h-4 text-brand" />
              <span>Psikolog Jaga: <strong className="text-brand dark:text-text">{psikologNama}</strong></span>
            </div>
          )}

          <div className="text-[11px] text-text-muted flex items-center gap-1.5 pt-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Respon waktu rata-rata: &lt; 3 menit</span>
          </div>
        </div>

        {/* Mandatory Emergency Hotline Section */}
        <div className="p-5 rounded-3xl bg-danger/5 border border-danger/30 text-left space-y-3">
          <div className="flex items-center gap-2 text-danger font-bold text-sm">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>Perlu Bicara Detik Ini Juga?</span>
          </div>
          <p className="text-xs text-text-muted">
            Layanan tanggap krisis gratis 24 jam Kemenkes RI selalu siap mendengarkan tanpa menghakimi.
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
              Kunjungi Healing119.id
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}
