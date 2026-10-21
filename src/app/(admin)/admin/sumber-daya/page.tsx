"use client";

import { useState } from "react";
import { Plus, Trash2, Edit, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminSumberDayaPage() {
  const [items] = useState([
    { id: "1", nama: "Hotline Krisis Kemenkes RI (119 Ext. 8)", kategori: "Krisis Darurat", kontak: "119,8" },
    { id: "2", nama: "Pusat Bantuan Konseling Kampus", kategori: "Layanan Kampus", kontak: "081234567890" },
  ]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-black text-brand dark:text-text">
            Manajemen Sumber Daya & Kontak Rujukan (FR-ADM-03)
          </h1>
          <p className="text-xs text-text-muted">Kelola nomor darurat, hotline, dan materi pertolongan pertama.</p>
        </div>
        <Button variant="primary" size="sm" className="flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Tambah Sumber Daya
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-black/5 dark:bg-white/5 border-b border-black/5 dark:border-white/10 font-bold">
            <tr>
              <th className="p-4">Nama Instansi / Materi</th>
              <th className="p-4">Kategori</th>
              <th className="p-4">Kontak / Tautan</th>
              <th className="p-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5">
            {items.map((it) => (
              <tr key={it.id} className="hover:bg-black/5 dark:hover:bg-white/5">
                <td className="p-4 font-bold text-brand dark:text-text">{it.nama}</td>
                <td className="p-4"><Badge variant="mint">{it.kategori}</Badge></td>
                <td className="p-4 font-mono">{it.kontak}</td>
                <td className="p-4 text-right space-x-2">
                  <button className="p-1 text-text-muted hover:text-brand" aria-label="Ubah">
                    <Edit className="w-4 h-4 inline" />
                  </button>
                  <button className="p-1 text-text-muted hover:text-danger" aria-label="Hapus">
                    <Trash2 className="w-4 h-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
