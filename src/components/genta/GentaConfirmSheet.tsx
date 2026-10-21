"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, MapPin, Send, X, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GentaConfirmSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GentaConfirmSheet({ isOpen, onClose }: GentaConfirmSheetProps) {
  const router = useRouter();
  const [selectedKategori, setSelectedKategori] = useState<string>("Umum");
  const [shareLocation, setShareLocation] = useState<boolean>(false);
  const [catatan, setCatatan] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSendSignal() {
    setIsSubmitting(true);
    setErrorMsg(null);

    let locationData: { latitude: number; longitude: number } | undefined = undefined;

    if (shareLocation && "geolocation" in navigator) {
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 5000,
            maximumAge: 60000,
            enableHighAccuracy: false,
          });
        });
        locationData = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
      } catch (e) {
        // Fallback: continue sending without location if rejected or timed out
        console.warn("Lokasi tidak didapatkan atau ditolak. Melanjutkan kirim SOS tanpa lokasi.", e);
      }
    }

    try {
      // In real scenario this calls POST /genta/sos
      // For now we mock the API response and navigate to status page
      const payload = {
        kategori: selectedKategori,
        catatan: catatan.trim() || undefined,
        lokasi: locationData,
      };

      // Simulating slight latency
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Navigate directly to status page
      router.push(`/genta/status?id=${Date.now()}`);
      onClose();
    } catch (err) {
      setErrorMsg("Gagal mengirim sinyal. Segera hubungi hotline darurat di bawah ini.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="genta-title"
    >
      <div className="bg-surface text-text w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-danger/30 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/10">
          <div className="flex items-center gap-2 text-danger font-bold text-lg" id="genta-title">
            <AlertTriangle className="w-6 h-6" />
            <span>Sinyal Darurat Genta</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
            aria-label="Tutup lembar konfirmasi"
          >
            <X className="w-5 h-5 text-text-muted" />
          </button>
        </div>

        <p className="mt-3 text-sm text-text-muted">
          Kamu aman di sini. Tim tanggap darurat dan psikolog jaga siap membantumu secepatnya.
        </p>

        {errorMsg && (
          <div className="mt-3 p-3 bg-danger/10 border border-danger rounded-xl text-danger text-sm" role="alert">
            {errorMsg}
          </div>
        )}

        <div className="mt-4 space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-text-muted block">
            Situasi yang dialami (opsional):
          </label>
          <div className="flex flex-wrap gap-2">
            {["Panik / Cemas berat", "Pikiran menyakiti diri", "Butuh teman bicara darurat"].map((kat) => (
              <button
                key={kat}
                type="button"
                onClick={() => setSelectedKategori(kat)}
                className={`px-3 py-1.5 text-xs rounded-full font-medium transition-colors ${
                  selectedKategori === kat
                    ? "bg-brand text-white font-semibold"
                    : "bg-black/5 dark:bg-white/10 text-text hover:bg-black/10"
                }`}
              >
                {kat}
              </button>
            ))}
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={shareLocation}
                onChange={(e) => setShareLocation(e.target.checked)}
                className="rounded border-black/20 text-danger focus:ring-danger w-4 h-4"
              />
              <span className="flex items-center gap-1 text-xs sm:text-sm">
                <MapPin className="w-4 h-4 text-brand" /> Bagikan lokasiku untuk mempercepat evakuasi/bantuan
              </span>
            </label>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {/* Main 2-tap Action Button */}
          <Button
            onClick={handleSendSignal}
            disabled={isSubmitting}
            variant="danger"
            size="lg"
            className="w-full text-base font-bold shadow-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Mengirim sinyal...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" /> Kirim Sinyal Bantuan Sekarang
              </>
            )}
          </Button>

          {/* Hotline Emergency info */}
          <div className="p-3 rounded-2xl bg-accent-mint/30 border border-accent-mint flex items-center justify-between">
            <div className="text-xs">
              <div className="font-bold text-brand">Hotline Darurat Nasional (24 Jam)</div>
              <div className="text-text-muted">Kemenkes 119 ext. 8 • Healing119.id</div>
            </div>
            <a
              href="tel:119,8"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-brand text-white text-xs font-bold rounded-full shadow hover:opacity-90"
            >
              <Phone className="w-3.5 h-3.5" /> Panggil 119
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
