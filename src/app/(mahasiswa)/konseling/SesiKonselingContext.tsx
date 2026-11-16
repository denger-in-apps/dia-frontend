"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type SesiKonseling = {
  id: string;
  psikolog: string;
  jadwal: string;
  tanggal: string;
  slot: string;
  tipe: string;
  status: "TERKONFIRMASI" | "SELESAI" | "DIBATALKAN";
  ruangTersedia: boolean;
};

const initialSessions: SesiKonseling[] = [
  {
    id: "sesi-101",
    psikolog: "Dr. Sarah Wijaya, M.Psi.",
    jadwal: "Kamis, 3 Desember 2026 • 14:00 WIB",
    tanggal: "2026-12-03",
    slot: "14:00 - 15:00",
    tipe: "Chat E2EE",
    status: "TERKONFIRMASI",
    ruangTersedia: true,
  },
  {
    id: "sesi-98",
    psikolog: "Budi Santoso, M.Psi., Psikolog",
    jadwal: "12 Oktober 2026 • 10:00 WIB",
    tanggal: "2026-10-12",
    slot: "10:00 - 11:00",
    tipe: "Tatap Muka",
    status: "SELESAI",
    ruangTersedia: false,
  },
];

type SesiContextValue = {
  sessions: SesiKonseling[];
  reschedule: (id: string, tanggal: string, slot: string) => void;
  cancel: (id: string) => void;
};

const SesiContext = createContext<SesiContextValue | null>(null);

export function SesiKonselingProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState(initialSessions);

  function reschedule(id: string, tanggal: string, slot: string) {
    const date = new Date(`${tanggal}T00:00:00`);
    const dateLabel = new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
    setSessions((current) => current.map((session) => session.id === id
      ? { ...session, tanggal, slot, jadwal: `${dateLabel} • ${slot} WIB` }
      : session));
  }

  function cancel(id: string) {
    setSessions((current) => current.map((session) => session.id === id
      ? { ...session, status: "DIBATALKAN", ruangTersedia: false }
      : session));
  }

  return <SesiContext.Provider value={{ sessions, reschedule, cancel }}>{children}</SesiContext.Provider>;
}

export function useSesiKonseling() {
  const context = useContext(SesiContext);
  if (!context) throw new Error("useSesiKonseling harus digunakan di dalam SesiKonselingProvider");
  return context;
}
