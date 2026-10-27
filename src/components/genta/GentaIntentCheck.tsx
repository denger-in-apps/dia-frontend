"use client";

import { useState } from "react";
import { CheckCircle2, Phone, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

type Intent = "needs-help" | "accidental" | null;

export function GentaIntentCheck({ onCancelSignal }: { onCancelSignal: () => void }) {
  const [intent, setIntent] = useState<Intent>(null);
  const [confirmCancel, setConfirmCancel] = useState(false);

  if (intent === "needs-help") {
    return (
      <section className="mt-5 rounded-2xl border border-emerald-600/30 bg-emerald-600/10 p-4" aria-live="polite">
        <div className="flex items-center gap-2 font-semibold text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="h-5 w-5" />
          <span>Terima kasih sudah mengonfirmasi</span>
        </div>
        <p className="mt-1 text-sm text-text-muted">Sinyal bantuanmu tetap aktif. Psikolog jaga akan menindaklanjuti.</p>
      </section>
    );
  }

  if (intent === "accidental") {
    return (
      <section className="mt-5 rounded-2xl border border-amber-600/30 bg-amber-500/10 p-4" aria-live="polite">
        <div className="flex items-center gap-2 font-semibold text-amber-900 dark:text-amber-200">
          <ShieldAlert className="h-5 w-5" />
          <span>Sinyal terkirim tidak sengaja?</span>
        </div>
        <p className="mt-1 text-sm text-text-muted">Sinyal masih aktif sampai pembatalan dikonfirmasi. Jika kamu tetap butuh bantuan, biarkan sinyal aktif atau hubungi hotline.</p>
        {!confirmCancel ? (
          <Button className="mt-3" variant="outline" size="sm" onClick={() => setConfirmCancel(true)}>
            Lanjutkan pembatalan sinyal
          </Button>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setConfirmCancel(false)}>Sinyal tetap aktif</Button>
            <Button variant="danger" size="sm" onClick={onCancelSignal}>Ya, batalkan sinyal</Button>
          </div>
        )}
        <a href="tel:119,8" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-danger underline">
          <Phone className="h-4 w-4" /> Hotline 119 Ext. 8
        </a>
      </section>
    );
  }

  return (
    <section className="mt-5 rounded-2xl border border-brand/20 bg-brand/5 p-4" aria-labelledby="genta-intent-title">
      <h3 id="genta-intent-title" className="font-semibold text-brand dark:text-text">Apakah kamu memang membutuhkan bantuan sekarang?</h3>
      <p className="mt-1 text-sm text-text-muted">Konfirmasi ini membantu tim memahami situasimu. Jika belum menjawab, sinyal tetap aktif agar bantuan tidak tertunda.</p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <Button size="sm" onClick={() => setIntent("needs-help")}>Ya, saya butuh bantuan</Button>
        <Button size="sm" variant="outline" onClick={() => setIntent("accidental")}>Tidak sengaja menekan</Button>
      </div>
    </section>
  );
}
