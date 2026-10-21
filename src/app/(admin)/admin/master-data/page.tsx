"use client";

import { useState } from "react";
import { Database, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MasterDataPage() {
  const [categories] = useState(["Akademik", "Kesehatan Mental", "Adaptasi Kampus", "Pengembangan Diri"]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-serif font-black text-brand dark:text-text">
          Master Data & Template Kuesioner (PBI-20)
        </h1>
        <p className="text-xs text-text-muted">Kelola master kategori minat dan bobot pertanyaan kuesioner PHQ-9 & GAD-7.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-brand dark:text-text">Kategori Minat Circle</h2>
            <Button variant="outline" size="sm">
              <Plus className="w-3.5 h-3.5 mr-1" /> Tambah
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <span key={c} className="px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/10 text-xs font-semibold">
                {c}
              </span>
            ))}
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-base font-bold text-brand dark:text-text">Template Kuesioner Aktif</h2>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-2xl bg-surface border border-black/10 dark:border-white/10 flex justify-between items-center">
              <div>
                <div className="font-bold">PHQ-9 (Suasana Hati)</div>
                <div className="text-text-muted">9 Pertanyaan • Rentang Skor 0-27</div>
              </div>
              <span className="text-emerald-600 font-bold">Aktif</span>
            </div>

            <div className="p-3 rounded-2xl bg-surface border border-black/10 dark:border-white/10 flex justify-between items-center">
              <div>
                <div className="font-bold">GAD-7 (Kecemasan)</div>
                <div className="text-text-muted">7 Pertanyaan • Rentang Skor 0-21</div>
              </div>
              <span className="text-emerald-600 font-bold">Aktif</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
