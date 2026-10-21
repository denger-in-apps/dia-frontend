"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Users, Shield, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function CircleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      <Link href="/circle" className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-brand">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Circle
      </Link>

      <Card className="p-8 space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="lavender">Akademik</Badge>
            <span className="text-xs text-text-muted flex items-center gap-1">
              <Users className="w-4 h-4" /> 8/10 Anggota
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-black text-brand dark:text-text">
            Circle Pejuang Skripsi Akhir
          </h1>
          <p className="text-sm text-text-muted leading-relaxed">
            Ruang berbagi keluh kesah, motivasi, dan tips mengatasi prokrastinasi skripsi. Komunitas ini didampingi oleh psikolog pembina untuk menjamin diskusi tetap suportif.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-black/5 dark:border-white/10 flex items-center gap-3 text-xs">
          <Shield className="w-5 h-5 text-brand shrink-0" />
          <div>
            <div className="font-bold text-brand dark:text-text">Didampingi Psikolog Jaga: Dr. Sarah Wijaya</div>
            <div className="text-text-muted">Moderasi aktif untuk memastikan kenyamanan semua anggota.</div>
          </div>
        </div>

        <div className="border-t border-black/5 dark:border-white/10 pt-4 flex items-center justify-between">
          <span className="text-xs text-text-muted">Status: Kamu telah tergabung</span>
          <Button variant="primary" size="md" className="flex items-center gap-1.5">
            <MessageCircle className="w-4 h-4" /> Masuk ke Ruang Diskusi
          </Button>
        </div>
      </Card>
    </div>
  );
}
