"use client";

import { useState } from "react";
import { MessageSquareHeart, Send, ShieldAlert, Heart, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CurhatThread {
  id: string;
  penulis: string;
  waktu: string;
  isi: string;
  balasanPsikolog?: {
    nama: string;
    isi: string;
    waktu: string;
  };
}

export default function CurhatPage() {
  const [threads, setThreads] = useState<CurhatThread[]>([
    {
      id: "1",
      penulis: "Anonim-7201",
      waktu: "3 jam yang lalu",
      isi: "Sering merasa tertinggal dibanding teman seangkatan yang sudah mulai magang dan skripsi. Rasanya capek banget mau mulai tugas akhir.",
      balasanPsikolog: {
        nama: "Dr. Sarah Wijaya, M.Psi.",
        isi: "Halo Anonim-7201, wajar sekali merasa kewalahan saat membandingkan diri dengan ritme orang lain. Ingat bahwa setiap orang punya garis waktu masing-masing. Coba ambil waktu jeda sejenak hari ini ya.",
        waktu: "1 jam yang lalu",
      },
    },
  ]);

  const [inputIsi, setInputIsi] = useState("");

  const handleKirim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputIsi.trim()) return;

    const newThread: CurhatThread = {
      id: Date.now().toString(),
      penulis: `Anonim-${Math.floor(1000 + Math.random() * 9000)}`,
      waktu: "Baru saja",
      isi: inputIsi.trim(),
    };

    setThreads([newThread, ...threads]);
    setInputIsi("");
  };

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-serif font-black text-brand dark:text-text">
          Curhat Anonim
        </h1>
        <p className="text-sm text-text-muted">
          Tumpahkan apa yang mengganjal di pikiranmu. Bebas dari identitas, aman dari stigma, dan dibalas penuh kehangatan oleh psikolog kampus.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-surface border border-black/5 dark:border-white/10 flex items-start gap-3 text-xs text-text-muted">
        <ShieldAlert className="w-5 h-5 text-brand shrink-0 mt-0.5" />
        <div>
          <strong className="text-brand dark:text-text block mb-0.5">Komitmen Anonimitas Transparan:</strong>
          Nama dan identitas akun kampusmu tidak ditampilkan atau direkam di utas ini. Psikolog membaca tulisanmu sebagai kode unik.
        </div>
      </div>

      {/* Input Box */}
      <Card className="p-5 space-y-3">
        <form onSubmit={handleKirim} className="space-y-3">
          <textarea
            value={inputIsi}
            onChange={(e) => setInputIsi(e.target.value)}
            rows={4}
            placeholder="Apa yang sedang kamu rasakan hari ini? Ceritakan apa saja..."
            className="w-full p-4 rounded-2xl border border-black/10 dark:border-white/10 bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-focus resize-none"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted">Identitas: Ditampilkan sebagai Anonim-XXXX</span>
            <Button type="submit" variant="primary" size="md" className="flex items-center gap-1.5">
              <Send className="w-4 h-4" /> Kirim Curhat
            </Button>
          </div>
        </form>
      </Card>

      {/* Utas List */}
      <div className="space-y-4">
        {threads.map((item) => (
          <Card key={item.id} className="p-6 space-y-4">
            <div className="flex items-center justify-between text-xs text-text-muted">
              <span className="font-bold text-brand dark:text-text">{item.penulis}</span>
              <span>{item.waktu}</span>
            </div>
            <p className="text-sm text-text leading-relaxed whitespace-pre-wrap">{item.isi}</p>

            {item.balasanPsikolog ? (
              <div className="p-4 rounded-2xl bg-accent-mint/30 border border-accent-mint space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-brand">
                  <span>Balasan: {item.balasanPsikolog.nama}</span>
                  <span className="font-normal text-text-muted">{item.balasanPsikolog.waktu}</span>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                  {item.balasanPsikolog.isi}
                </p>
              </div>
            ) : (
              <div className="text-xs text-text-muted italic flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5" /> Menunggu tanggapan psikolog jaga...
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
