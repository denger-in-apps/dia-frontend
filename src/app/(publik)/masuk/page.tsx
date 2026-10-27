"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LoginScreen } from "@/components/auth/LoginScreen";

function MasukContent() {
  const searchParams = useSearchParams();
  return <LoginScreen error={searchParams.get("error")} />;
}

export default function MasukPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-sm text-text-muted">Memuat tampilan login...</div>}>
      <MasukContent />
    </Suspense>
  );
}
