"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GentaFab } from "@/components/genta/GentaFab";

export default function SsoLoginPage() {
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoggingIn) return;

    setIsLoggingIn(true);
    router.push("/beranda");
  }

  return (
    <>
    <main className="login-screen flex min-h-screen items-center justify-center p-4 sm:p-6">
      <section className="w-full max-w-lg rounded-3xl bg-surface p-6 shadow-2xl sm:p-9">
        <Link
          href="/masuk"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-text-muted hover:text-brand"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke pilihan login
        </Link>

        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-lime text-brand">
          <GraduationCap className="h-8 w-8" />
        </div>

        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand/70">Login Mahasiswa</p>
          <h1 className="mt-2 font-serif text-3xl font-black text-brand dark:text-text">
            Masuk dengan SSO Kampus
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-text-muted">
            Masuk menggunakan akun SSO kampus untuk melanjutkan ke Denger.in.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="sso-username" className="text-sm font-semibold text-text">
              Username SSO
            </label>
            <input
              id="sso-username"
              name="sso-username"
              type="text"
              required
              autoComplete="off"
              placeholder="Masukkan username kampus"
              className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm text-[#1c1740] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            />
          </div>

          <div>
            <label htmlFor="sso-password" className="text-sm font-semibold text-text">
              Password
            </label>
            <input
              id="sso-password"
              name="sso-password"
              type="password"
              required
              autoComplete="new-password"
              placeholder="Masukkan password kampus"
              className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm text-[#1c1740] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            />
          </div>

          <Button type="submit" disabled={isLoggingIn} className="w-full" size="lg">
            {isLoggingIn ? "Membuka Denger.in..." : "Masuk"}
          </Button>
        </form>
      </section>
    </main>
    <GentaFab />
    </>
  );
}
