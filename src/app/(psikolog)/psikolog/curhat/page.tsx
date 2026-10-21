"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PsikologCurhatPage() {
  const [replyText, setReplyText] = useState("");
  const [replied, setReplied] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-serif font-black text-brand dark:text-text">
          Tanggapan Curhat Anonim Mahasiswa
        </h1>
        <p className="text-xs text-text-muted">
          Balas curhatan mahasiswa dengan bahasa yang ramah, tidak mendiagnosis, dan berikan dorongan positif.
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between text-xs text-text-muted">
          <span className="font-bold text-brand dark:text-text">Pengirim: Anonim-9042</span>
          <span>15 menit yang lalu</span>
        </div>

        <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 text-xs sm:text-sm leading-relaxed">
          &ldquo;Merasa sering panik tiba-tiba kalau mau presentasi di kelas besar. Tangan dingin dan detak jantung kencang sampai blank. Takut banget bikin malu diri sendiri di depan dosen.&rdquo;
        </div>

        {replied ? (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Balasanmu telah terkirim kepada Anonim-9042.</span>
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            <label className="text-xs font-semibold text-text-muted">Tulis Balasan Hangat:</label>
            <textarea
              rows={4}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Contoh: Halo Anonim-9042, reaksi tubuh seperti itu wajar sekali terjadi..."
              className="w-full p-3.5 rounded-2xl border border-black/10 dark:border-white/10 bg-surface text-xs focus:ring-2 focus:ring-focus resize-none"
            />
            <Button
              disabled={!replyText.trim()}
              onClick={() => setReplied(true)}
              variant="primary"
              size="md"
              className="flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" /> Kirim Balasan Konselor
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
