"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, Send, ShieldCheck, PhoneOff, Mic, MicOff, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ChatMessage {
  id: string;
  pengirim: "saya" | "psikolog";
  teks: string;
  waktu: string;
}

export default function RuangSesiKonselingPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      pengirim: "psikolog",
      teks: "Halo, selamat datang di ruang konseling pribadi. Sesi ini terlindungi enkripsi end-to-end (E2EE) dan hanya kita berdua yang dapat membaca pesan ini. Bagaimana kabarmu hari ini?",
      waktu: "14:02",
    },
  ]);
  const [inputTeks, setInputTeks] = useState("");
  const [micActive, setMicActive] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputTeks.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      pengirim: "saya",
      teks: inputTeks.trim(),
      waktu: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages([...messages, newMsg]);
    setInputTeks("");
  };

  return (
    <div className="max-w-3xl mx-auto py-4 space-y-4 h-[calc(100vh-140px)] flex flex-col">
      {/* Sesi Top Bar */}
      <div className="p-3 bg-surface rounded-2xl border border-black/5 dark:border-white/10 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent-mint text-brand flex items-center justify-center font-bold">
            SW
          </div>
          <div>
            <h1 className="text-sm font-bold text-brand dark:text-text">Dr. Sarah Wijaya, M.Psi.</h1>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Terkoneksi • Terenkripsi End-to-End</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMicActive(!micActive)}
            className={`p-2 rounded-full border ${
              micActive ? "bg-brand text-white" : "border-black/10 dark:border-white/10"
            }`}
            aria-label="Toggle mikrofon"
          >
            {micActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4 text-text-muted" />}
          </button>
          <Link href="/konseling">
            <Button variant="danger" size="sm" className="flex items-center gap-1 text-xs">
              <PhoneOff className="w-3.5 h-3.5" /> Akhiri Sesi
            </Button>
          </Link>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 rounded-3xl bg-surface/50 border border-black/5 dark:border-white/5 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.pengirim === "saya" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[80%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                msg.pengirim === "saya"
                  ? "bg-brand text-white rounded-br-sm shadow"
                  : "bg-surface border border-black/10 dark:border-white/10 text-text rounded-bl-sm shadow-sm"
              }`}
            >
              {msg.teks}
            </div>
            <span className="text-[10px] text-text-muted mt-1 px-1">{msg.waktu}</span>
          </div>
        ))}
      </div>

      {/* Input Field */}
      <form onSubmit={handleSend} className="flex items-center gap-2 shrink-0">
        <input
          type="text"
          value={inputTeks}
          onChange={(e) => setInputTeks(e.target.value)}
          placeholder="Ketik pesan terenkripsi..."
          className="flex-1 p-3 rounded-full border border-black/10 dark:border-white/10 bg-surface text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-focus"
        />
        <Button type="submit" variant="primary" size="md" className="rounded-full px-5">
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
