"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Phone, MapPin, Send, X, AlertTriangle, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GentaConfirmSheetProps {
  isOpen: boolean;
  onClose: () => void;
  // Optional test hook injection for unit testing
  apiClientOverride?: (payload: unknown) => Promise<{ id: string }>;
}

export function GentaConfirmSheet({ isOpen, onClose, apiClientOverride }: GentaConfirmSheetProps) {
  const router = useRouter();
  const [selectedKategori, setSelectedKategori] = useState<string>("Umum");
  const [shareLocation, setShareLocation] = useState<boolean>(false);
  const [catatan, setCatatan] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Close on Escape key press for keyboard accessibility (WCAG AA)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  async function handleSendSignal() {
    setIsSubmitting(true);
    setErrorMsg(null);

    let locationData: { latitude: number; longitude: number; akurasi?: number } | undefined = undefined;

    // FR-MHS-04: Geolocation ONLY requested if toggle is checked
    if (shareLocation && typeof window !== "undefined" && "geolocation" in navigator) {
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 5000, // Strict 5-second timeout (Section 4)
            maximumAge: 60000,
            enableHighAccuracy: false,
          });
        });
        locationData = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          akurasi: pos.coords.accuracy,
        };
      } catch (e) {
        // Fallback: If permission is denied or times out (<= 5s), proceed immediately WITHOUT location
        console.warn("Izin lokasi ditolak atau timeout. Melanjutkan pengiriman SOS tanpa lokasi.", e);
      }
    }

    try {
      const payload = {
        kategori: selectedKategori,
        catatan: catatan.trim() || undefined,
        lokasi: locationData,
        waktu: new Date().toISOString(),
      };

      if (apiClientOverride) {
        const res = await apiClientOverride(payload);
        router.push(`/genta/status?id=${res.id}`);
      } else {
        // Simulated network call with fallback for bad network
        const isOffline = typeof window !== "undefined" && !navigator.onLine;
        if (isOffline) {
          throw new Error("Koneksi internet terputus. Jangan antre di latar belakang!");
        }

        // Slight simulated latency
        await new Promise((resolve) => setTimeout(resolve, 300));

        const generatedId = `SOS-${Date.now().toString().slice(-6)}`;
        router.push(`/genta/status?id=${generatedId}`);
      }

      onClose();
    } catch (err: unknown) {
      // Bad network handling (Section 4): Show clear error + phone hotline + retry
      const message =
        err instanceof Error
          ? err.message
          : "Gagal mengirim sinyal darurat melalui jaringan.";
      setErrorMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="genta-title"
    >
      <div className="bg-surface text-text w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-danger/30 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/10">
          <div className="flex items-center gap-2 text-danger font-bold text-lg" id="genta-title">
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <span>Sinyal Darurat Genta</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            aria-label="Tutup konfirmasi Genta"
          >
            <X className="w-5 h-5 text-text-muted" />
          </button>
        </div>

        <p className="mt-3 text-xs sm:text-sm text-text-muted">
          Kamu aman di sini. Tim tanggap darurat dan psikolog jaga siap membantumu secepatnya.
        </p>

        {/* Bad Network Error Notice (§4) */}
        {errorMsg && (
          <div className="mt-3 p-4 bg-danger/10 border border-danger rounded-2xl text-danger space-y-2" role="alert">
            <div className="flex items-center gap-2 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Gagal Terkirim: {errorMsg}</span>
            </div>
            <p className="text-[11px] text-text">
              Jaringan bermasalah. Jangan menunggu sinyal, segera tekan tombol telepon bebas pulsa di bawah ini untuk terhubung langsung:
            </p>
            <div className="flex gap-2 pt-1">
              <a
                href="tel:119,8"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-danger text-white rounded-full text-xs font-bold shadow"
              >
                <Phone className="w-3.5 h-3.5" /> Panggil 119 Ext. 8
              </a>
              <Button
                onClick={handleSendSignal}
                variant="outline"
                size="sm"
                className="text-xs flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Coba Lagi
              </Button>
            </div>
          </div>
        )}

        {/* Quick Situation Options */}
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

          {/* Optional Note */}
          <div className="pt-1">
            <input
              type="text"
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Catatan singkat situasi / lokasi ruangan (opsional)..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-black/10 dark:border-white/10 bg-surface focus:outline-none focus:ring-2 focus:ring-focus"
            />
          </div>

          {/* FR-MHS-04: Location Permission Toggle */}
          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm select-none">
              <input
                type="checkbox"
                checked={shareLocation}
                onChange={(e) => setShareLocation(e.target.checked)}
                className="rounded border-black/20 text-danger focus:ring-danger w-4 h-4 cursor-pointer"
              />
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand shrink-0" />
                <span>Bagikan lokasiku untuk mempercepat evakuasi / bantuan</span>
              </span>
            </label>
          </div>
        </div>

        {/* Actions (Max 2-tap guarantee) */}
        <div className="mt-6 flex flex-col gap-3">
          {/* Main 2-tap Action Button - Active immediately without selection! */}
          <Button
            onClick={handleSendSignal}
            disabled={isSubmitting}
            variant="danger"
            size="lg"
            className="w-full text-sm sm:text-base font-bold shadow-xl py-3.5 tracking-wide uppercase"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Mengirim Sinyal SOS...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" /> Kirim Sinyal Bantuan Sekarang
              </>
            )}
          </Button>

          {/* Emergency Hotline Info (§4) */}
          <div className="p-3 rounded-2xl bg-accent-mint/30 border border-accent-mint flex items-center justify-between">
            <div className="text-xs">
              <div className="font-bold text-brand">Hotline Darurat Nasional (24 Jam)</div>
              <div className="text-text-muted">Kemenkes 119 Ext. 8 • Healing119.id</div>
            </div>
            <a
              href="tel:119,8"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-brand text-white text-xs font-bold rounded-full shadow hover:opacity-90 transition-opacity"
            >
              <Phone className="w-3.5 h-3.5" /> Panggil 119
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
