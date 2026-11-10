
"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import type { StaffLoginRequest } from "@/lib/api/types";

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

function StafMasukContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, loginDemoPsychologist, user, isLoading } = useAuth();

  const [role, setRole] =
    useState<StaffLoginRequest["role"]>("PSIKOLOG");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const isPsychologist = role === "PSIKOLOG";

  useEffect(() => {
    const requestedRole = searchParams.get("role");
    if (requestedRole === "PSIKOLOG" || requestedRole === "DOSEN_ADMIN") {
      setRole(requestedRole);
    }
  }, [searchParams]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setError("");
    setSubmitting(true);

    try {
      if (role === "PSIKOLOG" && process.env.NODE_ENV !== "production") {
        await loginDemoPsychologist();
      } else {
        await login({
          role,
          email: email.trim(),
          password,
          ...(otp.trim() ? { otp: otp.trim() } : {}),
        });
      }

      router.replace(
        role === "PSIKOLOG" ? "/psikolog" : "/admin"
      );
    } catch {
      setError(
        isPsychologist
          ? "Login gagal. Periksa username dan password."
          : "Login gagal. Periksa email, password, dan OTP."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const inputStyle =
    "mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm text-[#1c1740] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

  return (
    <main className="login-screen flex min-h-screen items-center justify-center p-4 sm:p-6">
      <Card className="login-card w-full max-w-[520px] space-y-4 border-0 p-5 shadow-xl sm:p-8">
        <LoginIllustration />

        <div className="text-center">
          <div className="mb-2 font-serif text-xl font-semibold">
            Denger.in
          </div>

          <h1 className="font-serif text-3xl leading-tight sm:text-4xl">
            Selamat datang <em>kembali!</em>
          </h1>

          <p className="mt-3 text-sm opacity-80">
            {isPsychologist
              ? "Masuk ke portal psikolog menggunakan akun yang terdaftar."
              : "Portal staf layanan konseling dan pendampingan mahasiswa."}
          </p>
        </div>

        {isLoading && !(isPsychologist && process.env.NODE_ENV !== "production") ? (
          <p className="py-4 text-center text-sm">
            Memeriksa sesi...
          </p>
        ) : user?.role === "PSIKOLOG" ||
          user?.role === "DOSEN_ADMIN" ? (
          <div className="space-y-3 text-center">
            <p className="text-sm">
              Anda sudah masuk sebagai {user.nama}.
            </p>

            <Button
              className="w-full"
              onClick={() =>
                router.replace(
                  user.role === "PSIKOLOG"
                    ? "/psikolog"
                    : "/admin"
                )
              }
            >
              Ke Dashboard
            </Button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            {!isPsychologist && <div>
              <label
                htmlFor="role"
                className="text-sm font-medium"
              >
                Masuk sebagai
              </label>

              <select
                id="role"
                value={role}
                onChange={(e) =>
                  setRole(
                    e.target.value as StaffLoginRequest["role"]
                  )
                }
                className={inputStyle}
              >
                <option value="PSIKOLOG">Psikolog</option>
                <option value="DOSEN_ADMIN">Dosen Admin</option>
              </select>
            </div>}

            <div>
              <label
                htmlFor="staff-username"
                className="text-sm font-medium"
              >
                {isPsychologist ? "Username" : "Email"}
              </label>

              <input
                id="staff-username"
                type={isPsychologist ? "text" : "email"}
                required
                autoComplete="username"
                placeholder={isPsychologist ? "Username psikolog" : "email@kampus.ac.id"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputStyle}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-sm font-medium"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputStyle}
              />
            </div>

            {!isPsychologist && <div>
              <label
                htmlFor="otp"
                className="text-sm font-medium"
              >
                OTP (opsional)
              </label>

              <input
                id="otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="6 digit jika diperlukan"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className={inputStyle}
              />
            </div>}

            {error && (
              <p role="alert" className="text-sm text-danger">
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              disabled={submitting}
              className="w-full"
            >
              <LogIn className="mr-2 h-4 w-4" />
              {submitting ? "Memproses..." : "Masuk"}
            </Button>
          </form>
        )}

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => router.push("/masuk")}
        >
          Kembali
        </Button>

        <p className="text-center text-xs opacity-70">
          Denger.in — Ruang Aman Mahasiswa
        </p>
      </Card>
    </main>
  );
}

export default function StafMasukPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-sm text-text-muted">Memuat tampilan login...</div>}>
      <StafMasukContent />
    </Suspense>
  );
}
