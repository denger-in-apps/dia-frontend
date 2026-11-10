
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowUpRight, GraduationCap, HeartHandshake, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { GentaFab } from "@/components/genta/GentaFab";

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
  const { user, isLoading } = useAuth();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!user) return;

    const destination = {
      MAHASISWA: "/beranda",
      PSIKOLOG: "/psikolog",
      DOSEN_ADMIN: "/admin",
    }[user.role];

    router.replace(destination);
  }, [user, router]);

  function handleStudentLogin() {
    if (redirecting) return;

    setRedirecting(true);
    router.push("/sso/login");
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
    <>
    <main className="login-screen flex min-h-screen items-center justify-center p-4 sm:p-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] bg-surface shadow-2xl lg:grid-cols-[0.9fr_1.1fr]">
        <section className="login-card flex flex-col justify-center p-7 sm:p-10 lg:p-12">
          <div className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-brand/10 bg-white/50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-brand">
            <HeartHandshake className="h-4 w-4" /> Ruang aman untuk bertumbuh
          </div>
          <LoginIllustration />
          <div className="mt-4">
            <div className="mb-2 font-serif text-xl font-semibold">Denger.in</div>
            <h1 className="font-serif text-3xl leading-tight sm:text-4xl">
              Di sini, kamu <em>didengar</em> sebelum semuanya terasa berat.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed opacity-80">
              Pilih jenis akun untuk masuk ke layanan yang sesuai dengan peranmu.
            </p>
          </div>
        </section>

        <section className="p-6 sm:p-9 lg:p-10" aria-labelledby="login-title">
          {isLoading || user ? (
            <div className="flex min-h-80 items-center justify-center text-sm text-text-muted" role="status">
              {user ? "Membuka halaman sesuai peran..." : "Memeriksa sesi..."}
            </div>
          ) : (
            <>
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand/70">Selamat datang</p>
            <h2 id="login-title" className="mt-1 font-serif text-2xl font-bold text-brand sm:text-3xl">
              Masuk ke Denger.in
            </h2>
            <p className="mt-2 text-sm text-text-muted">Pilih peran akun yang akan kamu gunakan.</p>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="mb-5 flex items-center gap-2 rounded-2xl border border-danger/30 bg-danger/10 p-3 text-left text-sm text-danger"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="space-y-3">
            <article className="rounded-2xl border border-brand/15 bg-bg/60 p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-lime text-brand">
                  <GraduationCap className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-brand">Mahasiswa</h3>
                  <p className="mt-1 text-xs leading-relaxed text-text-muted">
                    Gunakan akun SSO kampus untuk mengakses konseling dan dukungan mahasiswa.
                  </p>
                  <Button
                    type="button"
                    onClick={handleStudentLogin}
                    disabled={redirecting}
                    variant="primary"
                    className="mt-4 w-full justify-between"
                  >
                    {redirecting ? "Menyiapkan SSO..." : "Masuk dengan SSO Kampus"}
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </article>

            <article className="rounded-2xl border border-black/10 p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-mint text-brand">
                  <HeartHandshake className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-brand">Psikolog</h3>
                  <p className="mt-1 text-xs leading-relaxed text-text-muted">
                    Masuk ke portal untuk menangani SOS, sesi, dan pendampingan mahasiswa.
                  </p>
                  <Button
                    type="button"
                    variant="primary"
                    className="mt-4 w-full justify-between"
                    onClick={() => router.push("/staf/masuk?role=PSIKOLOG")}
                  >
                    Masuk sebagai Psikolog
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </article>

            <article className="rounded-2xl border border-black/10 p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-lavender text-brand">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-brand">Dosen Admin</h3>
                  <p className="mt-1 text-xs leading-relaxed text-text-muted">
                    Masuk ke portal administrasi untuk mengelola layanan dan konfigurasi kampus.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4 w-full justify-between"
                    onClick={() => router.push("/staf/masuk?role=DOSEN_ADMIN")}
                  >
                    Masuk sebagai Dosen Admin
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </article>
          </div>

          <p className="mt-6 text-center text-xs text-text-muted">
            Denger.in — Ruang Aman Mahasiswa
          </p>
            </>
          )}
        </section>
      </div>
    </main>
    <GentaFab />
    </>
  );
}
