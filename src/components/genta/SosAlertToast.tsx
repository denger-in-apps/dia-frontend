"use client";

import { useEffect } from "react";
import { AlertCircle, Phone, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface SosAlertToastProps {
  id: string;
  pesan: string;
  kategori?: string;
  onOpenCase?: () => void;
  onDismiss: () => void;
}

export function SosAlertToast({
  id,
  pesan,
  kategori = "Darurat",
  onOpenCase,
  onDismiss,
}: SosAlertToastProps) {
  useEffect(() => {
    // Attempt gentle vibration pattern if supported (Section 4)
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate([200, 100, 200]);
      } catch (e) {
        // Ignore vibration errors if blocked
      }
    }
  }, []);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed top-6 right-6 z-50 max-w-md w-full bg-surface border-2 border-danger rounded-3xl p-5 shadow-2xl animate-in slide-in-from-top-4 duration-300 text-text"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-danger text-white flex items-center justify-center shrink-0 animate-bounce">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-danger/10 text-danger text-[10px] font-bold uppercase tracking-wider">
              {kategori} • {id}
            </div>
            <h4 className="text-sm font-bold text-brand dark:text-text mt-0.5">Sinyal Krisis Masuk!</h4>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-text-muted"
          aria-label="Tutup pemberitahuan sinyal darurat"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="mt-2 text-xs text-text-muted leading-relaxed">
        {pesan}
      </p>

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-black/5 dark:border-white/10 pt-3">
        <a
          href="tel:119,8"
          className="inline-flex items-center gap-1 text-[11px] font-bold text-danger hover:underline"
        >
          <Phone className="w-3.5 h-3.5" /> Hotline 119 Ext. 8
        </a>

        {onOpenCase && (
          <Button
            onClick={onOpenCase}
            variant="danger"
            size="sm"
            className="flex items-center gap-1 font-bold text-xs"
          >
            <span>Buka Kasus</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
