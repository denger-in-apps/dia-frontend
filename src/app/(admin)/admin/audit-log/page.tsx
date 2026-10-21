import { History, ShieldCheck, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminAuditLogPage() {
  const logs = [
    { id: "LOG-992", aksi: "Pembaruan Jadwal Jaga Psikolog", pelaku: "Admin Utama", waktu: "21 Okt 2026 10:12 WIB", level: "INFO" },
    { id: "LOG-991", aksi: "Persetujuan Proposal Circle 'Pejuang Skripsi'", pelaku: "Admin Kemahasiswaan", waktu: "21 Okt 2026 09:40 WIB", level: "INFO" },
    { id: "LOG-990", aksi: "Penghapusan Mandiri Data Akun Mahasiswa", pelaku: "Sistem Otomatis (GDPR Right)", waktu: "21 Okt 2026 08:15 WIB", level: "SECURITY" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-serif font-black text-brand dark:text-text">
          Audit Log Keamanan & Kepatuhan Privasi (PBI-21)
        </h1>
        <p className="text-xs text-text-muted">
          Catatan aktivitas administratif sistem yang tidak dapat diubah (immutable log).
        </p>
      </div>

      <Card className="p-0 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-black/5 dark:bg-white/5 border-b border-black/5 dark:border-white/10 font-bold">
            <tr>
              <th className="p-4">ID Log</th>
              <th className="p-4">Aktivitas</th>
              <th className="p-4">Pelaku / Aktor</th>
              <th className="p-4">Waktu</th>
              <th className="p-4">Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5">
            {logs.map((l) => (
              <tr key={l.id} className="hover:bg-black/5 dark:hover:bg-white/5">
                <td className="p-4 font-mono font-bold">{l.id}</td>
                <td className="p-4 font-medium text-brand dark:text-text">{l.aksi}</td>
                <td className="p-4 text-text-muted">{l.pelaku}</td>
                <td className="p-4 text-text-muted">{l.waktu}</td>
                <td className="p-4">
                  <Badge variant={l.level === "SECURITY" ? "danger" : "mint"}>{l.level}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
