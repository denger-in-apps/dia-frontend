"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LogIn, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function MasukContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleSsoLogin = () => {
    window.location.href = "/api/auth/sso/login";
  };

  return (
    <Card className="max-w-md w-full text-center space-y-6 p-8 shadow-xl">
      <div className="w-14 h-14 rounded-full bg-brand text-white flex items-center justify-center font-serif text-2xl font-black mx-auto">
        D
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-serif font-black text-brand dark:text-text">
          Masuk ke Denger.in
        </h1>
        <p className="text-xs text-text-muted">
          Gunakan Akun SSO Kampus (Single Sign-On) resmi Anda untuk mengakses seluruh layanan konseling dan dukungan mental.
        </p>
      </div>

      {error === "sso_gangguan" && (
        <div className="p-3 bg-danger/10 border border-danger/30 rounded-2xl flex items-center gap-2 text-danger text-xs text-left">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Layanan SSO sedang gangguan. Silakan coba beberapa saat lagi atau hubungi helpdesk IT kampus.</span>
        </div>
      )}

      <Button
        onClick={handleSsoLogin}
        variant="primary"
        size="lg"
        className="w-full flex items-center justify-center gap-2"
      >
        <LogIn className="w-4 h-4" />
        <span>Masuk dengan SSO Kampus</span>
      </Button>

      <div className="pt-4 border-t border-black/5 dark:border-white/10">
        <a
          href="/staf/masuk"
          className="text-xs text-text-muted hover:text-brand underline"
        >
          Masuk sebagai Tenaga Ahli / Psikolog / Administrator
        </a>
      </div>
    </Card>
  );
}

export default function MasukPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-bg">
      <Suspense fallback={<div className="text-xs text-text-muted">Memuat portal login...</div>}>
        <MasukContent />
      </Suspense>
    </div>
  );
}
