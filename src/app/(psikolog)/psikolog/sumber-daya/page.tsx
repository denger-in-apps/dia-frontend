import { BookOpen, ExternalLink, Phone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PsikologSumberDayaPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-serif font-black text-brand dark:text-text">
          Direktori Rujukan & Protokol Krisis
        </h1>
        <p className="text-xs text-text-muted">
          Daftar kontak fasilitas kesehatan rujukan rumah sakit, psikiater darurat, dan SOP penanganan eskalasi.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 space-y-3">
          <Badge variant="danger">Protokol Eskalasi 1</Badge>
          <h2 className="text-base font-bold text-brand dark:text-text">IGD Jiwa & Rumah Sakit Rujukan Kampus</h2>
          <p className="text-xs text-text-muted">
            Hubungi hotline darurat bila mahasiswa terindikasi risiko tinggi yang mengancam keselamatan jiwa.
          </p>
          <div className="pt-2">
            <a
              href="tel:119,8"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-danger text-white rounded-full text-xs font-bold"
            >
              <Phone className="w-3.5 h-3.5" /> 119 Ext. 8
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}
