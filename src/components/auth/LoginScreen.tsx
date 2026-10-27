"use client";

import { useState } from "react";
import { AlertCircle, LogIn } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface LoginScreenProps {
  error?: string | null;
}

function LoginIllustration() {
  return (
    <svg viewBox="0 0 220 190" className="mx-auto mb-3 w-40 sm:w-44" fill="none" aria-hidden="true">
      <circle cx="165" cy="55" r="40" fill="#d9f26a" />
      <rect x="12" y="30" width="146" height="76" rx="22" fill="#2a1f5c" />
      <path d="m50 104-6 28 32-26" fill="#2a1f5c" />
      <circle cx="52" cy="68" r="7" fill="#d9f26a" />
      <circle cx="85" cy="68" r="7" fill="#b9e8d6" />
      <circle cx="118" cy="68" r="7" fill="#e0d4f5" />
      <rect x="86" y="98" width="122" height="62" rx="20" fill="#b9e8d6" stroke="#2a1f5c" strokeWidth="3" />
      <path d="m170 158 12 24 4-24" fill="#b9e8d6" stroke="#2a1f5c" strokeWidth="3" />
      <path d="M147 144c-14-9-20-15-20-22a8 8 0 0 1 20-3 8 8 0 0 1 20 3c0 7-6 13-20 22Z" fill="#e03131" />
    </svg>
  );
}

export function LoginScreen({ error }: LoginScreenProps) {
  const [nim, setNim] = useState("1020624xxxx");
  const [simulateInactive, setSimulateInactive] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; isError?: boolean } | null>(null);

  function chooseRole(role: "mahasiswa" | "psikolog" | "dosen admin") {
    if (role === "mahasiswa" && simulateInactive) {
      setFeedback({ message: "Akses ditolak: status mahasiswa tidak aktif di sistem akademik.", isError: true });
      return;
    }
    setFeedback({ message: "Ini tampilan prototipe. Proses login belum dihubungkan.", isError: false });
  }

  return (
    <main className="login-screen flex min-h-screen items-center justify-center p-4 sm:p-6">
      <Card className="login-card w-full max-w-[520px] space-y-4 border-0 p-5 shadow-xl sm:p-8">
        <LoginIllustration />
        <div className="text-center">
          <div className="mb-2 font-serif text-xl font-semibold">Denger.in</div>
          <h1 className="font-serif text-3xl leading-tight sm:text-4xl">
            Di sini, kamu <em>didengar</em> sebelum semuanya terasa berat.
          </h1>
          <p className="mt-3 text-sm opacity-80">
            Prototipe layanan konseling dan pendampingan mahasiswa. Pilih peran untuk mencoba.
          </p>
        </div>

        {error === "sso_gangguan" && (
          <div className="flex items-center gap-2 rounded-2xl border border-danger/30 bg-danger/10 p-3 text-left text-sm text-danger" role="alert">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Layanan SSO sedang gangguan. Silakan coba beberapa saat lagi atau hubungi helpdesk IT kampus.</span>
          </div>
        )}

        <div>
          <label htmlFor="campus-account" className="text-sm font-medium">Akun SSO kampus</label>
          <input
            id="campus-account"
            type="text"
            value={nim}
            onChange={(event) => setNim(event.target.value)}
            autoComplete="username"
            placeholder="NIM atau akun kampus"
            className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm text-[#1c1740] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          />
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={simulateInactive}
            onChange={(event) => setSimulateInactive(event.target.checked)}
            className="h-4 w-4 accent-[#2a1f5c]"
          />
          <span>Simulasikan mahasiswa nonaktif</span>
        </label>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Button onClick={() => chooseRole("mahasiswa")} variant="primary" className="sm:flex-1">
            <LogIn className="mr-2 h-4 w-4" /> Masuk sebagai mahasiswa
          </Button>
          <Button onClick={() => chooseRole("psikolog")} variant="outline" className="sm:flex-1">
            Psikolog
          </Button>
          <Button onClick={() => chooseRole("dosen admin")} variant="outline" className="sm:flex-1">
            Dosen admin
          </Button>
        </div>

        {feedback && (
          <p className={`text-sm ${feedback.isError ? "text-danger" : "text-center opacity-75"}`} role="status" aria-live="polite">
            {feedback.message}
          </p>
        )}
        <p className="text-center text-xs opacity-70">Autentikasi SSO/JWT belum aktif pada prototipe ini.</p>
      </Card>
    </main>
  );
}
