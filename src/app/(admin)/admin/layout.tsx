"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Clock, Settings, Users, BookOpen, Database, BarChart3, History } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Dashboard", icon: Shield },
    { href: "/admin/psikolog/jadwal-jaga", label: "Jadwal Jaga Psikolog", icon: Clock },
    { href: "/admin/konfigurasi-sos", label: "Konfigurasi SOS", icon: Settings },
    { href: "/admin/circle", label: "Persetujuan Circle", icon: Users },
    { href: "/admin/sumber-daya", label: "Kelola Sumber Daya", icon: BookOpen },
    { href: "/admin/master-data", label: "Master Data", icon: Database },
    { href: "/admin/laporan", label: "Laporan Agregat", icon: BarChart3 },
    { href: "/admin/audit-log", label: "Audit Log Keamanan", icon: History },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-bg text-text">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-surface border-r border-black/5 dark:border-white/10 p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-bold text-sm">
                A
              </div>
              <div>
                <div className="font-serif font-bold text-sm">Portal Admin</div>
                <div className="text-[10px] text-text-muted">Sistem Denger.in</div>
              </div>
            </Link>
            <ThemeToggle />
          </div>

          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-brand text-white font-semibold"
                      : "text-text-muted hover:text-text hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-black/5 dark:border-white/10 text-xs text-text-muted">
          <p>Login sebagai Administrator</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
