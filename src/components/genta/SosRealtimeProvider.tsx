"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { WifiOff } from "lucide-react";
import { getSosSocket } from "@/lib/socket/client";
import { SosAlertToast } from "./SosAlertToast";

const NEW_SOS_EVENT = process.env.NEXT_PUBLIC_SOS_NEW_EVENT || "sos:new";

export interface SosRealtimeCase {
  id: string;
  waktu: string;
  kategori: string;
  eskalasiDetik: number;
  status: "BARU" | "DIAMBIL" | "TERHUBUNG";
  lokasi?: { lat: number; lng: number };
  catatan?: string;
}

interface SosAlert {
  id: string;
  pesan: string;
  kategori: string;
}

interface SosRealtimeContextValue {
  connectionState: "connecting" | "connected" | "disconnected";
  incomingCases: SosRealtimeCase[];
}

const SosRealtimeContext = createContext<SosRealtimeContextValue | null>(null);

function toSosCase(payload: unknown): SosRealtimeCase | null {
  if (!payload || typeof payload !== "object") return null;

  const record = payload as Record<string, unknown>;
  const wrappedPayload = record.case ?? record.data;
  const nestedCase = wrappedPayload && typeof wrappedPayload === "object"
    ? (wrappedPayload as Record<string, unknown>)
    : record;
  const id = nestedCase.id ?? nestedCase.sosId;
  if (typeof id !== "string" || !id.trim()) return null;

  const location = nestedCase.lokasi && typeof nestedCase.lokasi === "object"
    ? (nestedCase.lokasi as Record<string, unknown>)
    : null;
  const lat = location?.lat ?? location?.latitude;
  const lng = location?.lng ?? location?.longitude;
  const latitude = typeof lat === "number" && Number.isFinite(lat) ? lat : undefined;
  const longitude = typeof lng === "number" && Number.isFinite(lng) ? lng : undefined;
  const hasLocation = latitude !== undefined && longitude !== undefined;

  return {
    id,
    waktu:
      typeof nestedCase.waktu === "string"
        ? nestedCase.waktu
        : typeof nestedCase.createdAt === "string"
          ? nestedCase.createdAt
          : new Date().toISOString(),
    kategori: typeof nestedCase.kategori === "string" ? nestedCase.kategori : "Darurat",
    eskalasiDetik: typeof nestedCase.eskalasiDetik === "number" ? nestedCase.eskalasiDetik : 0,
    status: nestedCase.status === "DIAMBIL" || nestedCase.status === "TERHUBUNG" ? nestedCase.status : "BARU",
    lokasi: hasLocation ? { lat: latitude, lng: longitude } : undefined,
    catatan:
      typeof nestedCase.catatan === "string"
        ? nestedCase.catatan
        : typeof nestedCase.message === "string"
          ? nestedCase.message
          : undefined,
  };
}

export function SosRealtimeProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [connectionState, setConnectionState] = useState<SosRealtimeContextValue["connectionState"]>("connecting");
  const [incomingCases, setIncomingCases] = useState<SosRealtimeCase[]>([]);
  const [activeAlert, setActiveAlert] = useState<SosAlert | null>(null);
  const seenCaseIds = useRef(new Set<string>());

  useEffect(() => {
    const socket = getSosSocket();
    const handleConnect = () => setConnectionState("connected");
    const handleDisconnect = () => setConnectionState("disconnected");
    const handleConnectError = () => setConnectionState("disconnected");
    const handleNewSos = (payload: unknown) => {
      const newCase = toSosCase(payload);
      if (!newCase) return;
      if (seenCaseIds.current.has(newCase.id)) return;
      seenCaseIds.current.add(newCase.id);

      setIncomingCases((current) => [newCase, ...current]);
      const createdAt = new Date(newCase.waktu);
      const waktuNotifikasi = Number.isNaN(createdAt.getTime())
        ? newCase.waktu
        : createdAt.toLocaleString("id-ID");
      setActiveAlert({
        id: newCase.id,
        kategori: newCase.kategori,
        pesan: newCase.catatan || `Sinyal darurat baru diterima pada ${waktuNotifikasi}.`,
      });
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on(NEW_SOS_EVENT, handleNewSos);
    socket.connect();

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off(NEW_SOS_EVENT, handleNewSos);
      socket.disconnect();
    };
  }, []);

  const dismissAlert = useCallback(() => setActiveAlert(null), []);
  const contextValue = useMemo(
    () => ({ connectionState, incomingCases }),
    [connectionState, incomingCases]
  );

  return (
    <SosRealtimeContext.Provider value={contextValue}>
      {children}
      {activeAlert && (
        <SosAlertToast
          key={activeAlert.id}
          {...activeAlert}
          onDismiss={dismissAlert}
          onOpenCase={() => router.push(`/psikolog/sos?id=${encodeURIComponent(activeAlert.id)}`)}
        />
      )}
    </SosRealtimeContext.Provider>
  );
}

export function useSosRealtime() {
  const context = useContext(SosRealtimeContext);
  if (!context) {
    throw new Error("useSosRealtime harus digunakan di dalam SosRealtimeProvider.");
  }
  return context;
}

export function SosRealtimeBanner() {
  const { connectionState } = useSosRealtime();
  if (connectionState !== "disconnected") return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[60] flex items-center justify-center gap-2 bg-danger px-4 py-2 text-center text-xs font-bold text-white" role="status">
      <WifiOff className="h-4 w-4 shrink-0" />
      <span>Koneksi SOS terputus. Notifikasi real-time mungkin terlambat.</span>
    </div>
  );
}

export function SosRealtimeStatus() {
  const { connectionState } = useSosRealtime();
  const isConnected = connectionState === "connected";
  const label = isConnected
    ? "Socket SOS Terhubung"
    : connectionState === "connecting"
      ? "Menghubungkan Socket SOS..."
      : "Socket SOS Terputus";

  return (
    <div
      className={`rounded-2xl border p-2.5 text-xs flex items-center gap-2 ${
        isConnected
          ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 text-emerald-800 dark:text-emerald-300"
          : "bg-amber-50 dark:bg-amber-950/30 border-amber-200 text-amber-800 dark:text-amber-200"
      }`}
      role="status"
      aria-live="polite"
    >
      <span className={`h-2 w-2 rounded-full ${isConnected ? "bg-emerald-500" : "bg-amber-500"}`} />
      <span className="font-semibold">{label}</span>
    </div>
  );
}
