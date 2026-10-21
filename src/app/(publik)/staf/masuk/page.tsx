"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, KeyRound, Mail, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function StafMasukPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email dan kata sandi wajib diisi");
      return;
    }
    // Simulation
    if (email.includes("admin")) {
      document.cookie = "dia_role=admin; path=/";
      document.cookie = "dia_session=admin-token; path=/";
      router.push("/admin");
    } else {
      document.cookie = "dia_role=psikolog; path=/";
      document.cookie = "dia_session=psikolog-token; path=/";
      router.push("/psikolog");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-bg">
      <Card className="max-w-md w-full space-y-6 p-8 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-serif font-black text-brand dark:text-text">
              Portal Staf & Tenaga Ahli
            </h1>
            <p className="text-xs text-text-muted">Psikolog Jaga, Konselor, & Admin</p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-danger/10 border border-danger/30 rounded-2xl flex items-center gap-2 text-danger text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-muted">Email Institusi</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-text-muted absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="psikolog@kampus.ac.id"
                className="w-full pl-9 pr-3 py-2 rounded-2xl border border-black/10 dark:border-white/10 bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-focus"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-muted">Kata Sandi</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-text-muted absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 rounded-2xl border border-black/10 dark:border-white/10 bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-focus"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full">
            Masuk ke Portal
          </Button>
        </form>
      </Card>
    </div>
  );
}
