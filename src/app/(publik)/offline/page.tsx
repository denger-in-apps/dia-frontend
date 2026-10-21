import { Phone, WifiOff, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-bg">
      <Card className="max-w-lg w-full text-center space-y-6 p-8 shadow-xl">
        <div className="w-16 h-16 rounded-full bg-accent-lime text-brand flex items-center justify-center mx-auto">
          <WifiOff className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-serif font-black text-brand dark:text-text">
            Koneksi Internet Terputus
          </h1>
          <p className="text-xs sm:text-sm text-text-muted">
            Kamu sedang berada dalam mode offline. Namun jangan khawatir, jika kamu berada dalam kondisi darurat atau krisis, kontak hotline di bawah ini selalu dapat dihubungi melalui telepon selulermu.
          </p>
        </div>

        <div className="space-y-3 text-left">
          <div className="p-4 rounded-2xl bg-danger/10 border border-danger/30 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-danger flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Hotline Darurat Kemenkes RI
              </div>
              <div className="text-xs text-text-muted">Bebas pulsa 24 Jam • Pencegahan Bunuh Diri & Krisis Jiwa</div>
            </div>
            <a
              href="tel:119,8"
              className="px-4 py-2 bg-danger text-white text-xs font-bold rounded-full shadow inline-flex items-center gap-1.5"
            >
              <Phone className="w-4 h-4" /> 119 Ext 8
            </a>
          </div>

          <div className="p-4 rounded-2xl bg-surface border border-black/10 dark:border-white/10 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-brand dark:text-text">Pusat Krisis Kampus</div>
              <div className="text-xs text-text-muted">Layanan Darurat Konseling & Keamanan Kampus</div>
            </div>
            <a
              href="tel:08112345678"
              className="px-4 py-2 bg-brand text-white text-xs font-bold rounded-full shadow inline-flex items-center gap-1.5"
            >
              <Phone className="w-4 h-4" /> Hubungi
            </a>
          </div>
        </div>

        <p className="text-xs text-text-muted">
          Data direktori bantuan offline disimpan secara lokal di perangkatmu dan tidak mengirimkan data sensitif saat offline.
        </p>
      </Card>
    </div>
  );
}
