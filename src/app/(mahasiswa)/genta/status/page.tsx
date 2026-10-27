"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SosStatusCard } from "@/components/genta/SosStatusCard";
import { GentaIntentCheck } from "@/components/genta/GentaIntentCheck";

function GentaStatusContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const caseId = searchParams.get("id") || "SOS-AKTIF";

  const [status, setStatus] = useState<"BARU" | "DIAMBIL" | "TERHUBUNG" | "SELESAI">("BARU");
  const [psikologNama, setPsikologNama] = useState<string | null>(null);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setStatus("DIAMBIL");
      setPsikologNama("Dr. Sarah Wijaya, M.Psi.");
    }, 4000);

    const timer2 = setTimeout(() => {
      setStatus("TERHUBUNG");
    }, 8000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleBatal = () => {
    setStatus("SELESAI");
    router.push("/");
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <SosStatusCard
        id={caseId}
        status={status}
        waktuBuat="Baru saja"
        kategori="Panik / Butuh Pertolongan"
        psikologNama={psikologNama}
      />
      <GentaIntentCheck onCancelSignal={handleBatal} />
    </div>
  );
}

export default function GentaStatusPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-text-muted">Memuat status sinyal...</div>}>
      <GentaStatusContent />
    </Suspense>
  );
}
