"use client";

import { useState } from "react";
import { AlertCircle, ShieldAlert } from "lucide-react";
import { GentaConfirmSheet } from "./GentaConfirmSheet";

export function GentaFab() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 safe-bottom">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center gap-2 min-w-[56px] min-h-[56px] px-5 py-3 rounded-full bg-danger text-white font-bold shadow-2xl hover:scale-105 active:scale-95 transition-all focus-visible:ring-4 focus-visible:ring-danger/50"
          aria-label="Tombol darurat Genta"
        >
          <AlertCircle className="w-6 h-6 animate-pulse" />
          <span className="text-sm tracking-wider uppercase font-extrabold">SOS Genta</span>
        </button>
      </div>

      <GentaConfirmSheet isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
