"use client";

import { useState } from "react";
import { BookOpen, Phone, ExternalLink, Search, Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ResourceItem {
  id: string;
  nama: string;
  kategori: string;
  deskripsi: string;
  telepon?: string;
  tautan?: string;
}

export default function SumberDayaPage() {
  const [filter, setFilter] = useState("Semua");
  const [query, setQuery] = useState("");

  const resources: ResourceItem[] = [
    {
      id: "1",
      nama: "Hotline Krisis Kemenkes RI (119 Ext. 8)",
      kategori: "Krisis Darurat",
      deskripsi: "Layanan pencegahan bunuh diri dan penanganan krisis mental gratis 24 jam.",
      telepon: "119,8",
      tautan: "https://healing119.id",
    },
    {
      id: "2",
      nama: "Pusat Bantuan Konseling Mahasiswa Kampus",
      kategori: "Layanan Kampus",
      deskripsi: "Kantor Bimbingan Konseling dan Pendampingan Psikologis Mahasiswa.",
      telepon: "081234567890",
    },
    {
      id: "3",
      nama: "Yayasan Pulih (Trauma Recovery)",
      kategori: "Eksternal / LSM",
      deskripsi: "Konseling pemulihan trauma psikologis dan kekerasan berbasis gender.",
      telepon: "02178842580",
      tautan: "https://yayasanpulih.org",
    },
    {
      id: "4",
      nama: "Buku Panduan Pertolongan Pertama Emosional",
      kategori: "Edukasi & Mandiri",
      deskripsi: "Panduan praktis latihan pernapasan (box breathing) dan grounding 5-4-3-2-1 saat serangan panik.",
      tautan: "#",
    },
  ];

  const categories = ["Semua", "Krisis Darurat", "Layanan Kampus", "Eksternal / LSM", "Edukasi & Mandiri"];

  const filtered = resources.filter((item) => {
    const matchCategory = filter === "Semua" || item.kategori === filter;
    const matchQuery = item.nama.toLowerCase().includes(query.toLowerCase()) ||
                       item.deskripsi.toLowerCase().includes(query.toLowerCase());
    return matchCategory && matchQuery;
  });

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-serif font-black text-brand dark:text-text">
          Direktori Bantuan & Sumber Daya
        </h1>
        <p className="text-sm text-text-muted">
          Daftar kontak krisis, organisasi dukungan mental, dan materi edukasi yang dapat diakses kapan saja (termasuk saat offline).
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari sumber daya, kontak darurat, atau topik..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-black/10 dark:border-white/10 bg-surface text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-focus"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {categories.map((kat) => (
            <button
              key={kat}
              onClick={() => setFilter(kat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                filter === kat
                  ? "bg-brand text-white"
                  : "bg-surface border border-black/10 dark:border-white/10 text-text-muted hover:text-text"
              }`}
            >
              {kat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <Card key={item.id} className="p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <Badge variant="mint">{item.kategori}</Badge>
              <h2 className="text-lg font-bold text-brand dark:text-text">{item.nama}</h2>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                {item.deskripsi}
              </p>
            </div>

            <div className="pt-2 flex items-center gap-2 border-t border-black/5 dark:border-white/10">
              {item.telepon && (
                <a
                  href={`tel:${item.telepon}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand text-white rounded-full text-xs font-bold hover:opacity-90 transition-opacity"
                >
                  <Phone className="w-3.5 h-3.5" /> Telepon ({item.telepon})
                </a>
              )}
              {item.tautan && (
                <a
                  href={item.tautan}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-black/10 dark:border-white/10 text-text rounded-full text-xs font-semibold hover:bg-black/5"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Buka Tautan
                </a>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
