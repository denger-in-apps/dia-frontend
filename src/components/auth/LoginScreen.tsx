
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, LogIn } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { startStudentSSO } from "@/lib/api/auth";

interface LoginScreenProps {
  error?: string | null;
}

function LoginIllustration() {
  return (
    <svg
      viewBox="0 0 220 190"
      className="mx-auto mb-3 w-40 sm:w-44"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="165" cy="55" r="40" fill="#d9f26a" />
      <rect
        x="12"
        y="30"
        width="146"
        height="76"
        rx="22"
        fill="#2a1f5c"
      />
      <path d="m50 104-6 28 32-26" fill="#2a1f5c" />
      <circle cx="52" cy="68" r="7" fill="#d9f26a" />
      <circle cx="85" cy="68" r="7" fill="#b9e8d6" />
      <circle cx="118" cy="68" r="7" fill="#e0d4f5" />
      <rect
        x="86"
        y="98"
        width="122"
        height="62"
        rx="20"
        fill="#b9e8d6"
        stroke="#2a1f5c"
        strokeWidth="3"
      />
      <path
        d="m170 158 12 24 4-24"
        fill="#b9e8d6"
        stroke="#2a1f5c"
        strokeWidth="3"
      />
      <path
        d="M147 144c-14-9-20-15-20-22a8 8 0 0 1 20-3 8 8 0 0 1 20 3c0 7-6 13-20 22Z"
        fill="#e03131"
      />
    </svg>
  );
}

export function LoginScreen({ error }: LoginScreenProps) {
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  function handleStudentLogin() {
    if (redirecting) return;

    setRedirecting(true);
    startStudentSSO();
  }

  const errorMessages: Record<string, string> = {
    sso_gangguan:
      "Layanan SSO sedang mengalami gangguan. Silakan hubungi helpdesk IT kampus.",
    sso_gagal:
      "Autentikasi SSO gagal. Silakan coba kembali.",
    kredensial:
      "Login SSO dibatalkan atau ditolak oleh penyedia identitas.",
    akun_tidak_aktif:
      "Akun mahasiswa tidak aktif. Silakan hubungi pihak kampus.",
  };

  const errorMessage = error
    ? errorMessages[error] || "Login SSO tidak berhasil."
    : null;

  return (
    <main className="login-screen flex min-h-screen items-center justify-center p-4 sm:p-6">
      <Card className="login-card w-full max-w-[520px] space-y-4 border-0 p-5 shadow-xl sm:p-8">
        <LoginIllustration />

        <div className="text-center">
          <div className="mb-2 font-serif text-xl font-semibold">
            Denger.in
          </div>

          <h1 className="font-serif text-3xl leading-tight sm:text-4xl">
            Di sini, kamu <em>didengar</em> sebelum semuanya
            terasa berat.
          </h1>

          <p className="mt-3 text-sm opacity-80">
            Masuk menggunakan akun SSO kampus untuk
            mengakses layanan Denger.in.
          </p>
        </div>

        {errorMessage && (
          <div
            role="alert"
            className="flex items-center gap-2 rounded-2xl border border-danger/30 bg-danger/10 p-3 text-left text-sm text-danger"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="space-y-2">
          <Button
            type="button"
            onClick={handleStudentLogin}
            disabled={redirecting}
            variant="primary"
            className="w-full"
          >
            <LogIn className="mr-2 h-4 w-4" />
            {redirecting
              ? "Menghubungkan ke SSO..."
              : "Masuk sebagai Mahasiswa"}
          </Button>

          <p className="text-center text-xs opacity-70">
            Kamu akan diarahkan ke halaman login SSO kampus.
          </p>
        </div>

        <div className="border-t border-black/10 pt-4">
          <p className="mb-3 text-center text-sm opacity-80">
            Masuk sebagai staf Denger.in
          </p>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => router.push("/staf/masuk")}
            >
              Psikolog
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => router.push("/staf/masuk")}
            >
              Dosen Admin
            </Button>
          </div>
        </div>

        <p className="text-center text-xs opacity-70">
          Denger.in — Ruang Aman Mahasiswa
        </p>
      </Card>
    </main>
  );
}
