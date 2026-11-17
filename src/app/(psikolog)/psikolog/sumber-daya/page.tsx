"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Phone, Search, LifeBuoy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSumberDaya } from "@/lib/sumber-daya";

export default function PsikologSumberDayaPage() {
  const { items } = useSumberDaya();
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => items.filter((item) =>
    `${item.nama} ${item.kategori} ${item.deskripsi} ${item.telepon ?? ""}`.toLowerCase().includes(query.toLowerCase()),
  ), [items, query]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-serif font-black text-brand dark:text-text">Direktori Rujukan & Layanan Bantuan</h1>
        <p className="text-sm text-text-muted">Kontak layanan kampus dan eksternal untuk membantu proses pendampingan serta rujukan mahasiswa.</p>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 dark:bg-amber-950/20 p-4 text-xs">
        <LifeBuoy className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
        <p className="text-text-muted"><strong className="text-text">Situasi darurat:</strong> gunakan protokol kampus dan hubungi layanan darurat yang sesuai dengan kondisi. Pastikan informasi kontak masih berlaku sebelum melakukan rujukan.</p>
      </div>

      <label className="relative block max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari layanan, kategori, atau nomor" className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-surface py-2.5 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-focus" />
      </label>

      <p className="text-xs text-text-muted" aria-live="polite">{filtered.length} layanan tersedia</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <Card key={item.id} className="flex flex-col justify-between gap-4 p-5 sm:p-6">
            <div className="space-y-3">
              <Badge variant={item.kategori === "Krisis Darurat" ? "danger" : "lavender"}>{item.kategori}</Badge>
              <h2 className="text-base font-bold text-brand dark:text-text">{item.nama}</h2>
              <p className="text-sm leading-relaxed text-text-muted">{item.deskripsi}</p>
            </div>
            <div className="flex flex-wrap gap-2 border-t border-black/5 dark:border-white/10 pt-3">
              {item.telepon && <a href={`tel:${item.telepon}`} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold ${item.kategori === "Krisis Darurat" ? "bg-danger text-white" : "bg-brand text-white"}`}><Phone className="h-3.5 w-3.5" />Telepon {item.telepon}</a>}
              {item.tautan && <a href={item.tautan} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-black/10 dark:border-white/10 px-3 py-2 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5"><ExternalLink className="h-3.5 w-3.5" />Buka situs</a>}
              {!item.telepon && !item.tautan && <span className="text-xs text-text-muted">Kontak belum tersedia</span>}
            </div>
          </Card>
        ))}
        {filtered.length === 0 && <Card className="md:col-span-2 p-8 text-center text-sm text-text-muted">Tidak ada layanan yang cocok dengan pencarian.</Card>}
      </div>
      <p className="text-[11px] text-text-muted">Daftar dibagikan dengan direktori mahasiswa. Perubahan admin pada browser ini muncul setelah halaman dimuat ulang.</p>
    </div>
  );
}
