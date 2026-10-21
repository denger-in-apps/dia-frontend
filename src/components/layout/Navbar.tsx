"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { HeartHandshake, User, BookOpen, Users, HelpCircle } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/cek-mandiri", label: "Cek Mandiri" },
    { href: "/curhat", label: "Curhat Anonim" },
    { href: "/circle", label: "Circle" },
    { href: "/konseling", label: "Konseling" },
    { href: "/sumber-daya", label: "Direktori Bantuan" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-surface/80 border-b border-black/5 dark:border-white/10">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-full bg-brand text-white flex items-center justify-center font-serif font-black text-xl group-hover:scale-105 transition-transform">
            D
          </div>
          <span className="font-serif text-xl font-bold tracking-tight text-brand dark:text-text">
            Denger.in
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  isActive
                    ? "bg-brand text-white"
                    : "text-text-muted hover:text-text hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/akun"
            className="p-2 rounded-full border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            aria-label="Akun saya"
          >
            <User className="w-5 h-5 text-brand dark:text-text" />
          </Link>
        </div>
      </div>
    </header>
  );
}
