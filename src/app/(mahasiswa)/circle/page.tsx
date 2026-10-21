"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, Plus, Search, Check, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CircleItem {
  id: string;
  nama: string;
  kategori: string;
  deskripsi: string;
  anggotaSekarang: number;
  kuotaMaksimal: number;
  isJoined?: boolean;
}

export default function CircleListPage() {
  const [circles, setCircles] = useState<CircleItem[]>([
    {
      id: "1",
      nama: "Circle Pejuang Skripsi Akhir",
      kategori: "Akademik",
      deskripsi: "Ruang berbagi keluh kesah, motivasi, dan tips mengatasi prokrastinasi skripsi.",
      anggotaSekarang: 8,
      kuotaMaksimal: 10,
      isJoined: true,
    },
    {
      id: "2",
      nama: "Anxiety & Overthinking Support",
      kategori: "Kesehatan Mental",
      deskripsi: "Saling mendengarkan pengalaman mengelola rasa cemas berlebih dalam lingkungan perkuliahan.",
      anggotaSekarang: 10,
      kuotaMaksimal: 10,
      isJoined: false,
    },
    {
      id: "3",
      nama: "Mahasiswa Rantau Baru",
      kategori: "Adaptasi",
      deskripsi: "Teman bicara sesama perantau yang sedang beradaptasi dengan kesendirian dan budaya baru.",
      anggotaSekarang: 6,
      kuotaMaksimal: 12,
      isJoined: false,
    },
  ]);

  const [filterKategori, setFilterKategori] = useState("Semua");

  const categories = ["Semua", "Akademik", "Kesehatan Mental", "Adaptasi"];

  const filtered = filterKategori === "Semua"
    ? circles
    : circles.filter((c) => c.kategori === filterKategori);

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-black text-brand dark:text-text">
            Circle Komunitas
          </h1>
          <p className="text-sm text-text-muted">
            Kelompok kecil sebaya yang didampingi psikolog kampus. Kuota dibatasi agar interaksi tetap akrab dan aman.
          </p>
        </div>
        <Link href="/circle/ajukan">
          <Button variant="secondary" size="md" className="flex items-center gap-1.5 shrink-0">
            <Plus className="w-4 h-4" /> Ajukan Circle Baru
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((kat) => (
          <button
            key={kat}
            onClick={() => setFilterKategori(kat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              filterKategori === kat
                ? "bg-brand text-white"
                : "bg-surface border border-black/10 dark:border-white/10 text-text-muted hover:text-text"
            }`}
          >
            {kat}
          </button>
        ))}
      </div>

      {/* Circle Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => {
          const isFull = item.anggotaSekarang >= item.kuotaMaksimal;
          return (
            <Card key={item.id} className="p-6 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="lavender">{item.kategori}</Badge>
                  <span className={`text-xs font-semibold ${isFull ? "text-danger" : "text-text-muted"}`}>
                    {item.anggotaSekarang}/{item.kuotaMaksimal} Anggota
                    {isFull && " (Penuh)"}
                  </span>
                </div>
                <h2 className="text-xl font-serif font-bold text-brand dark:text-text">
                  {item.nama}
                </h2>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                  {item.deskripsi}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-black/5 dark:border-white/10">
                <Link href={`/circle/${item.id}`} className="text-xs font-semibold text-brand dark:text-text underline">
                  Lihat Detail
                </Link>
                {item.isJoined ? (
                  <Button variant="outline" size="sm" className="text-emerald-600 border-emerald-600">
                    <Check className="w-3.5 h-3.5 mr-1" /> Tergabung
                  </Button>
                ) : isFull ? (
                  <Button variant="outline" size="sm" disabled>
                    <Lock className="w-3.5 h-3.5 mr-1" /> Kuota Penuh
                  </Button>
                ) : (
                  <Button variant="primary" size="sm">
                    Gabung Circle
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
