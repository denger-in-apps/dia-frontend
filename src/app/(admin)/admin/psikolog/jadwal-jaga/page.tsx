"use client";

import { useState } from "react";
import { Plus, Clock, UserCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function JadwalJagaAdminPage() {
  const [schedules] = useState([
    { id: "1", nama: "Dr. Sarah Wijaya, M.Psi.", hari: "Senin - Rabu", jam: "08:00 - 16:00", status: "Aktif" },
    { id: "2", nama: "Budi Santoso, M.Psi., Psikolog", hari: "Kamis - Jumat", jam: "08:00 - 16:00", status: "Aktif" },
  ]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-black text-brand dark:text-text">
            Jadwal Jaga Psikolog (PBI-09)
          </h1>
          <p className="text-xs text-text-muted">Kelola rotasi giliran jaga penanganan krisis darurat dan konseling.</p>
        </div>
        <Button variant="primary" size="sm" className="flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Tambah Jadwal
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-black/5 dark:bg-white/5 border-b border-black/5 dark:border-white/10 font-bold">
            <tr>
              <th className="p-4">Nama Psikolog</th>
              <th className="p-4">Hari Jaga</th>
              <th className="p-4">Jam Operasional</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5">
            {schedules.map((s) => (
              <tr key={s.id} className="hover:bg-black/5 dark:hover:bg-white/5">
                <td className="p-4 font-bold text-brand dark:text-text">{s.nama}</td>
                <td className="p-4">{s.hari}</td>
                <td className="p-4">{s.jam}</td>
                <td className="p-4">
                  <Badge variant="mint">{s.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
