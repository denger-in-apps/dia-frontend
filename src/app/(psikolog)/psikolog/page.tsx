"use client";

import Link from "next/link";
import {
  ArrowRight,
  AlertTriangle,
  CalendarDays,
  MessageSquareText,
  UsersRound,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useSosRealtime } from "@/components/genta/SosRealtimeProvider";

const overviewCards = [
  {
    href: "/psikolog/sesi",
    label: "Sesi terjadwal",
    value: "3 sesi",
    detail: "Sesi berikutnya pukul 14.00 WIB",
    icon: CalendarDays,
    iconStyle: "bg-accent-mint text-brand",
  },
  {
    href: "/psikolog/curhat",
    label: "Curhat anonim",
    value: "5 utas",
    detail: "2 utas menunggu balasan",
    icon: MessageSquareText,
    iconStyle: "bg-accent-lavender text-brand",
  },
  {
    href: "/psikolog/circle",
    label: "Circle dampingan",
    value: "2 Circle",
    detail: "Lihat aktivitas kelompok",
    icon: UsersRound,
    iconStyle: "bg-accent-lime text-brand",
  },
];

export default function PsikologDashboardPage() {
  const { user } = useAuth();
  const { incomingCases, connectionState } = useSosRealtime();
  const newCasesCount = incomingCases.filter((item) => item.status === "BARU").length;
  const isConnected = connectionState === "connected";
  const connectionLabel = isConnected
    ? "Realtime SOS terhubung"
    : connectionState === "disconnected"
      ? "Realtime SOS terputus"
      : "Menghubungkan realtime SOS";
  const displayName = user?.nama?.split(" ")[0] || "Psikolog";

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand/70">Portal Psikolog</p>
          <h1 className="mt-1 font-serif text-3xl font-black tracking-tight text-brand dark:text-text sm:text-4xl">
            Selamat bertugas, {displayName}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-text-muted">
            Pantau antrean bantuan dan aktivitas pendampingan mahasiswa dari satu tempat.
          </p>
        </div>

        <div
          className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold ${
            isConnected
              ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300"
              : "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200"
          }`}
          role="status"
          aria-live="polite"
        >
          {isConnected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
          {connectionLabel}
        </div>
      </header>

      <section
        className={`overflow-hidden rounded-3xl border p-5 sm:p-7 ${
          newCasesCount > 0 ? "border-danger/30 bg-danger/5" : "border-brand/15 bg-surface"
        }`}
        aria-labelledby="sos-summary-title"
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                newCasesCount > 0 ? "bg-danger text-white" : "bg-accent-mint text-brand"
              }`}
            >
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-text-muted">Prioritas jaga</p>
              <h2 id="sos-summary-title" className="mt-1 text-lg font-bold text-brand dark:text-text sm:text-xl">
                {newCasesCount > 0
                  ? `${newCasesCount} kasus SOS baru menunggu respons`
                  : "Antrean SOS siap dipantau"}
              </h2>
              <p className="mt-1 text-sm text-text-muted">
                {newCasesCount > 0
                  ? "Buka antrean untuk melihat detail dan mengambil kasus."
                  : isConnected
                    ? "Notifikasi kasus baru akan muncul selama koneksi realtime aktif."
                    : "Notifikasi realtime belum tersambung. Periksa antrean secara berkala."}
              </p>
            </div>
          </div>

          <Link href="/psikolog/sos" className="shrink-0">
            <Button variant={newCasesCount > 0 ? "danger" : "primary"} className="w-full sm:w-auto">
              Buka antrean SOS <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <section aria-labelledby="overview-title" className="space-y-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="overview-title" className="font-serif text-2xl font-bold text-brand dark:text-text">
              Ringkasan aktivitas
            </h2>
            <p className="mt-1 text-sm text-text-muted">Pilih bagian untuk melanjutkan pekerjaanmu.</p>
          </div>
          <span className="text-xs text-text-muted">Ringkasan contoh</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {overviewCards.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
              >
                <Card className="flex h-full flex-col justify-between gap-6 border-transparent p-5 transition-all group-hover:-translate-y-1 group-hover:border-brand/15 group-hover:shadow-lg sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-text-muted">{item.label}</p>
                      <p className="mt-2 text-3xl font-black tracking-tight text-brand dark:text-text">
                        {item.value}
                      </p>
                    </div>
                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${item.iconStyle}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 border-t border-black/5 pt-4 text-xs dark:border-white/10">
                    <span className="text-text-muted">{item.detail}</span>
                    <span className="inline-flex shrink-0 items-center gap-1 font-bold text-brand dark:text-text">
                      Buka <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
