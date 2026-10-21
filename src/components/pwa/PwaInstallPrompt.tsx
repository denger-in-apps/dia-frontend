"use client";

import { useEffect, useState } from "react";
import { Download, X, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  if (!showPrompt) return null;

  return (
    <div className="p-4 rounded-3xl bg-accent-lime text-brand border border-black/10 shadow-md flex items-center justify-between gap-4 animate-in fade-in duration-300">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center shrink-0">
          <Smartphone className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold">Pasang Denger.in di Layar Utama</h4>
          <p className="text-xs opacity-85">Akses cepat tombol darurat Genta & materi bantuan bahkan tanpa koneksi internet.</p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button onClick={handleInstall} variant="primary" size="sm" className="flex items-center gap-1.5 shadow">
          <Download className="w-3.5 h-3.5" /> Pasang
        </Button>
        <button
          onClick={() => setShowPrompt(false)}
          className="p-1 rounded-full hover:bg-black/10"
          aria-label="Tutup saran pemasangan PWA"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
