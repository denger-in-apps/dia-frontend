
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  AlertCircle,
  Shield,
  Calendar,
  MessageSquare,
  Users,
  BookOpen,
  LogOut,
} from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import {
  SosRealtimeBanner,
  SosRealtimeProvider,
  SosRealtimeStatus,
} from "@/components/genta/SosRealtimeProvider";

export default function PsikologLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, signOut } = useAuth();

  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  useEffect(() => {
    if (isLoading || loggingOut) return;

    // Belum login: kembali ke halaman login staf
    if (!user) {
      router.replace(
        `/staf/masuk?from=${encodeURIComponent(pathname)}`
      );
      return;
    }

    // Hanya PSIKOLOG yang boleh mengakses halaman Psikolog
    if (user.role !== "PSIKOLOG") {
      router.replace(
        user.role === "DOSEN_ADMIN" ? "/admin" : "/masuk"
      );
    }
  }, [user, isLoading, loggingOut, router, pathname]);

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);
    setLogoutError("");

    try {
      await signOut();
      router.replace("/staf/masuk");
      router.refresh();
    } catch (error) {
      console.error("Logout gagal:", error);
      setLogoutError(
        "Gagal mengakhiri sesi di server. Silakan coba lagi."
      );
    } finally {
      setLoggingOut(false);
    }
  }

  // Jangan tampilkan dashboard sebelum sesi dan role diverifikasi
  if (
    isLoading ||
    loggingOut ||
    !user ||
    user.role !== "PSIKOLOG"
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg text-text">
        <p className="text-sm">
          {loggingOut
            ? "Mengakhiri sesi..."
            : "Memeriksa sesi..."}
        </p>
      </div>
    );
  }

  const links = [
    {
      href: "/psikolog",
      label: "Dashboard",
      icon: Shield,
    },
    {
      href: "/psikolog/sos",
      label: "Antrean SOS Darurat",
      icon: AlertCircle,
      badge: "Prioritas",
    },
    {
      href: "/psikolog/sesi",
      label: "Jadwal & Riwayat Sesi",
      icon: Calendar,
    },
    {
      href: "/psikolog/curhat",
      label: "Curhat Anonim",
      icon: MessageSquare,
    },
    {
      href: "/psikolog/circle",
      label: "Pendampingan Circle",
      icon: Users,
    },
    {
      href: "/psikolog/sumber-daya",
      label: "Direktori Rujukan",
      icon: BookOpen,
    },
  ];

  return (
    <SosRealtimeProvider>
    <div className="min-h-screen flex flex-col md:flex-row bg-bg text-text">
      <SosRealtimeBanner />

      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-surface border-r border-black/5 dark:border-white/10 p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Link
              href="/psikolog"
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-bold text-sm">
                P
              </div>

              <div>
                <div className="font-serif font-bold text-sm">
                  Portal Psikolog
                </div>
                <div className="text-[10px] text-text-muted">
                  Denger.in Jaga
                </div>
              </div>
            </Link>

            <ThemeToggle />
          </div>

          <SosRealtimeStatus />

          {/* Navigation */}
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

                  {"badge" in link && link.badge && (
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-danger text-white">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User info and Logout */}
        <div className="pt-4 border-t border-black/5 dark:border-white/10 text-xs text-text-muted space-y-3">
          <div>
            <p>Login sebagai:</p>
            <p className="font-bold text-brand dark:text-text">
              {user.nama}
            </p>
          </div>

          {logoutError && (
            <p role="alert" className="text-xs text-red-600">
              {logoutError}
            </p>
          )}

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-950/30"
          >
            <LogOut className="h-4 w-4" />
            {loggingOut ? "Keluar..." : "Logout"}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
    </SosRealtimeProvider>
  );
}
