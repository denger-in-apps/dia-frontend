"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AlertCircle, Wifi, WifiOff, Shield, Bell, Calendar, MessageSquare, Users, BookOpen } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export default function PsikologLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSocketConnected, setIsSocketConnected] = useState(true);

  const links = [
    { href: "/psikolog", label: "Dashboard", icon: Shield },
    { href: "/psikolog/sos", label: "Antrean SOS Darurat", icon: AlertCircle, badge: "Prioritas" },
    { href: "/psikolog/sesi", label: "Jadwal & Riwayat Sesi", icon: Calendar },
    { href: "/psikolog/curhat", label: "Curhat Anonim", icon: MessageSquare },
    { href: "/psikolog/circle", label: "Pendampingan Circle", icon: Users },
    { href: "/psikolog/sumber-daya", label: "Direktori Rujukan", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-bg text-text">
      {/* Realtime Disconnect Banner (Section 4 requirement) */}
      {!isSocketConnected && (
        <div className="fixed top-0 inset-x-0 z-50 bg-danger text-white px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4 animate-pulse" />
          <span>PERINGATAN: Realtime terputus! Segera segarkan halaman untuk memastikan antrean SOS tidak tertinggal.</span>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-surface border-r border-black/5 dark:border-white/10 p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Link href="/psikolog" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-bold text-sm">
                P
              </div>
              <div>
                <div className="font-serif font-bold text-sm">Portal Psikolog</div>
                <div className="text-[10px] text-text-muted">Denger.in Jaga</div>
              </div>
            </Link>
            <ThemeToggle />
          </div>

          {/* Realtime status badge */}
          <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-semibold">Socket SOS Terhubung</span>
          </div>

          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-brand text-white font-semibold"
                      : "text-text-muted hover:text-text hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-danger text-white">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-black/5 dark:border-white/10 text-xs text-text-muted">
          <p>Login sebagai:</p>
          <p className="font-bold text-brand dark:text-text">Dr. Sarah Wijaya, M.Psi.</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
