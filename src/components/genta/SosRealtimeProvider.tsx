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
import {
  apiRequest,
  AUTH_BLOCKED_EVENT,
  refreshAccessToken,
  WAJIB_GANTI_PASSWORD,
  WAJIB_GANTI_PASSWORD_EVENT,
  type AuthBlockReason,
} from "@/lib/api/client";
import { getNotifikasiBelumDibaca, tandaiNotifikasiDibaca } from "@/lib/api/notifikasi";
import { SosAlertToast } from "./SosAlertToast";

const NEW_SOS_EVENT = process.env.NEXT_PUBLIC_SOS_NEW_EVENT || "sos:baru";

export interface SosRealtimeCase {
  id: string;
  waktu: string;
  kategori: string;
  eskalasiDetik: number;
  status: "BARU" | "DIAMBIL" | "DITANGANI" | "ESKALASI" | "SELESAI";
  lokasi?: { lat: number; lng: number };
  catatan?: string;
  prioritas?: string;
  lokasiTersedia?: boolean;
  perluVerifikasi?: boolean;
  milikSaya?: boolean;
  namaMahasiswa?: string | null;
}

interface SosAlert {
  id: string;
  pesan: string;
  kategori: string;
}

interface SosRealtimeContextValue {
  connectionState: "connecting" | "connected" | "disconnected";
  incomingCases: SosRealtimeCase[];
  loading: boolean;
  error: string | null;
  refreshCases: () => Promise<void>;
}

const SosRealtimeContext = createContext<SosRealtimeContextValue | null>(null);

/** Normalisasi baris `GET /psikolog/sos` / payload realtime menjadi kasus dashboard (dipakai juga per cakupan). */
export function toSosCase(payload: unknown): SosRealtimeCase | null {
  if (!payload || typeof payload !== "object") return null;

  const record = payload as Record<string, unknown>;
  const wrappedPayload = record.case ?? record.data;
  const nestedCase = wrappedPayload && typeof wrappedPayload === "object"
    ? (wrappedPayload as Record<string, unknown>)
    : record;
  const id = nestedCase.id ?? nestedCase.sosId ?? nestedCase.id_sos;
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
        : typeof nestedCase.waktu_kejadian === "string"
          ? nestedCase.waktu_kejadian
        : typeof nestedCase.createdAt === "string"
          ? nestedCase.createdAt
          : new Date().toISOString(),
    kategori: typeof nestedCase.kategori === "string" ? nestedCase.kategori
      : typeof nestedCase.situasi_label === "string" ? nestedCase.situasi_label
      : typeof nestedCase.situasi === "string" ? nestedCase.situasi.replaceAll("_", " ") : "Darurat",
    eskalasiDetik: typeof nestedCase.eskalasiDetik === "number" ? nestedCase.eskalasiDetik : 0,
    status: ["BARU", "DIAMBIL", "DITANGANI", "ESKALASI", "SELESAI"].includes(String(nestedCase.status ?? nestedCase.status_penanganan))
      ? String(nestedCase.status ?? nestedCase.status_penanganan) as SosRealtimeCase["status"] : "BARU",
    lokasi: hasLocation ? { lat: latitude, lng: longitude } : undefined,
    prioritas: typeof nestedCase.prioritas === "string" ? nestedCase.prioritas : undefined,
    lokasiTersedia: typeof nestedCase.lokasi_tersedia === "boolean" ? nestedCase.lokasi_tersedia : undefined,
    perluVerifikasi: typeof nestedCase.perlu_verifikasi === "boolean" ? nestedCase.perlu_verifikasi : undefined,
    milikSaya: typeof nestedCase.milik_saya === "boolean" ? nestedCase.milik_saya : undefined,
    namaMahasiswa: typeof nestedCase.nama_mahasiswa === "string" ? nestedCase.nama_mahasiswa : null,
    catatan:
      typeof nestedCase.catatan === "string"
        ? nestedCase.catatan
        : typeof nestedCase.situasi_label === "string"
          ? nestedCase.situasi_label
        : typeof nestedCase.message === "string"
          ? nestedCase.message
          : undefined,
  };
}

export function SosRealtimeProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [connectionState, setConnectionState] = useState<SosRealtimeContextValue["connectionState"]>("connecting");
  const [incomingCases, setIncomingCases] = useState<SosRealtimeCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeAlert, setActiveAlert] = useState<SosAlert | null>(null);
  const seenCaseIds = useRef(new Set<string>());
  const seenEscalationIds = useRef(new Set<string>());
  const seenNotificationIds = useRef(new Set<string>());

  /** Memuat antrean aktif; mengembalikan daftar (null bila gagal) untuk pemulihan notifikasi. */
  const refreshCases = useCallback(async (): Promise<SosRealtimeCase[] | null> => {
    try {
      const response = await apiRequest("/psikolog/sos?cakupan=aktif&limit=50");
      if (!response.ok) throw new Error(`Gagal memuat antrean SOS (HTTP ${response.status}). Pastikan login sebagai psikolog aktif.`);
      const data = await response.json();
      const rows = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
      const cases = rows.map(toSosCase).filter((item: SosRealtimeCase | null): item is SosRealtimeCase => Boolean(item));
      setIncomingCases(cases);
      setError(null);
      return cases;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Gagal memuat antrean SOS.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshNotifications = useCallback(async () => {
    try {
      const notifications = await getNotifikasiBelumDibaca(50);
      const baru = notifications.filter((notification) => !seenNotificationIds.current.has(notification.id));
      if (baru.length === 0) return;
      // Backend mengirim event realtime sebelum notifikasi disimpan (tanpa id_notifikasi), jadi
      // notifikasi lama bisa saja sudah ditangani. Toast hanya untuk SOS yang MASIH menunggu
      // di antrean aktif (BARU/ESKALASI); sisanya cukup ditandai dibaca tanpa mengganggu.
      const antrean = await refreshCases();
      const menunggu = (id: string) =>
        antrean === null || antrean.some((item) => item.id === id && (item.status === "BARU" || item.status === "ESKALASI"));
      for (const notification of baru) {
        seenNotificationIds.current.add(notification.id);

        if (notification.jenis === "SOS_BARU") {
          const newCase = toSosCase(notification.payload);
          if (newCase && !seenCaseIds.current.has(newCase.id)) {
            seenCaseIds.current.add(newCase.id);
            if (menunggu(newCase.id)) {
              if (antrean === null) {
                setIncomingCases((current) => [newCase, ...current.filter((item) => item.id !== newCase.id)]);
              }
              setActiveAlert({
                id: newCase.id,
                kategori: newCase.kategori,
                pesan: "Ada sinyal Genta baru yang diterima saat Anda tidak terhubung.",
              });
            }
          }
        } else if (notification.jenis === "SOS_ESKALASI") {
          const escalatedCase = toSosCase(notification.payload);
          if (escalatedCase && !seenEscalationIds.current.has(escalatedCase.id)) {
            seenEscalationIds.current.add(escalatedCase.id);
            if (menunggu(escalatedCase.id)) {
              setActiveAlert({
                id: escalatedCase.id,
                kategori: escalatedCase.kategori,
                pesan: "SOS belum ditangani dan telah dieskalasikan. Segera periksa antrean.",
              });
            }
          }
        }

        // Notifikasi sudah diproses ke antrean/toast; acknowledge agar tidak berulang.
        void tandaiNotifikasiDibaca(notification.id).catch(() => {
          seenNotificationIds.current.delete(notification.id);
        });
      }
    } catch {
      // Antrean SOS tetap dimuat dari REST; notifikasi hanya jalur pemulihan tambahan.
    }
  }, [refreshCases]);

  useEffect(() => {
    const socket = getSosSocket();
    const handleConnect = () => {
      retryDelay = 1000;
      setConnectionState("connected");
      void refreshCases();
      // Pulihkan notifikasi yang masuk selama socket terputus (termasuk putus singkat yang
      // tidak sempat tertangkap polling). Duplikasi dicegah lewat id notifikasi & id SOS.
      void refreshNotifications();
    };
    // Backend memutus socket saat access token habis (`sesi:kedaluwarsa`) atau menolak
    // handshake (`TIDAK_TERAUTENTIKASI`). Pada kedua kasus socket.io tidak menyambung
    // ulang sendiri, jadi token diperbarui dulu lalu socket disambungkan kembali.
    let disposed = false;
    let retryTimer: number | undefined;
    let retryDelay = 1000;
    const reconnectWithFreshToken = () => {
      if (disposed || retryTimer !== undefined) return;
      retryTimer = window.setTimeout(async () => {
        retryTimer = undefined;
        if (disposed) return;
        try {
          await refreshAccessToken();
        } catch {
          // Refresh gagal (sesi habis): tetap coba lagi dengan jeda lebih panjang.
        }
        if (disposed || socket.connected) return;
        retryDelay = Math.min(retryDelay * 2, 30_000);
        socket.connect();
      }, retryDelay);
    };
    const handleDisconnect = (reason: string) => {
      setConnectionState("disconnected");
      if (reason === "io server disconnect") reconnectWithFreshToken();
    };
    const handleConnectError = () => {
      setConnectionState("disconnected");
      if (!socket.active) reconnectWithFreshToken();
    };
    const handleSessionExpired = (payload?: { kode?: unknown }) => {
      // Password di-reset admin: jangan menyambung ulang; layout mengarahkan ke ganti password.
      if (payload?.kode === WAJIB_GANTI_PASSWORD || payload?.kode === "WAJIB_GANTI_PASSWORD") {
        window.dispatchEvent(new CustomEvent(WAJIB_GANTI_PASSWORD_EVENT));
        return;
      }
      // Akun dinonaktifkan admin: akhiri sesi lokal (AuthContext → halaman masuk), jangan menyambung ulang.
      if (payload?.kode === "AKUN_TIDAK_AKTIF") {
        disposed = true;
        window.dispatchEvent(new CustomEvent<AuthBlockReason>(AUTH_BLOCKED_EVENT, { detail: "akun_tidak_aktif" }));
        return;
      }
      reconnectWithFreshToken();
    };
    // Backend be693de1 mengirim event realtime LEBIH DULU lalu menyimpan notifikasi (tanpa
    // id_notifikasi). Setelah jeda singkat, pemulihan REST menandai notifikasi itu dibaca;
    // karena SOS-nya sudah tercatat (seenCaseIds/seenEscalationIds), tidak ada toast ganda.
    let ackTimer: number | undefined;
    const jadwalkanAckNotifikasi = () => {
      if (disposed || ackTimer !== undefined) return;
      ackTimer = window.setTimeout(() => {
        ackTimer = undefined;
        if (!disposed) void refreshNotifications();
      }, 1500);
    };
    const handleNewSos = (payload: unknown) => {
      const newCase = toSosCase(payload);
      if (!newCase) return;
      // Bila backend menyertakan id-nya (notifikasi disimpan sebelum event), langsung tandai dibaca
      // agar pemulihan REST berikutnya (reconnect / login ulang) tidak menampilkannya lagi.
      const idNotifikasi = (payload as { id_notifikasi?: unknown }).id_notifikasi;
      if (typeof idNotifikasi === "string" && !seenNotificationIds.current.has(idNotifikasi)) {
        seenNotificationIds.current.add(idNotifikasi);
        void tandaiNotifikasiDibaca(idNotifikasi).catch(() => {
          seenNotificationIds.current.delete(idNotifikasi);
        });
      } else if (typeof idNotifikasi !== "string") {
        jadwalkanAckNotifikasi();
      }
      if (seenCaseIds.current.has(newCase.id)) return;
      seenCaseIds.current.add(newCase.id);

      void refreshCases();
      setIncomingCases((current) => [newCase, ...current.filter((item) => item.id !== newCase.id)]);
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
    const handleUpdate = () => { void refreshCases(); };
    const handleEscalation = (payload: unknown) => {
      const escalatedCase = toSosCase(payload);
      void refreshCases();
      if (!escalatedCase) return;
      // Dicatat agar pemulihan notifikasi (SOS_ESKALASI) tidak menampilkan toast yang sama lagi.
      seenEscalationIds.current.add(escalatedCase.id);
      jadwalkanAckNotifikasi();
      setActiveAlert({
        id: escalatedCase.id,
        kategori: escalatedCase.kategori,
        pesan: "SOS belum ditangani dan telah dieskalasikan. Segera periksa antrean.",
      });
    };
    const handleLocationUpdate = () => { void refreshCases(); };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on(NEW_SOS_EVENT, handleNewSos);
    socket.on("sos:diperbarui", handleUpdate);
    socket.on("sos:eskalasi", handleEscalation);
    socket.on("sos:lokasi", handleLocationUpdate);
    socket.on("sesi:kedaluwarsa", handleSessionExpired);
    // Jaringan perangkat putus: tandai terputus SEKARANG (tanpa menunggu ping timeout Socket.IO
    // ~45 detik) agar psikolog tahu antrean tidak realtime. Saat online kembali, sambung ulang;
    // handleConnect memulihkan notifikasi SOS yang terlewat dari REST.
    const handleOffline = () => {
      setConnectionState("disconnected");
      socket.disconnect();
    };
    const handleOnline = () => {
      if (disposed || socket.connected) return;
      setConnectionState("connecting");
      socket.connect();
    };
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    // Muat antrean awal lewat REST (tidak menunggu socket) agar dashboard tetap terisi
    // walaupun koneksi realtime gagal.
    const initialLoad = window.setTimeout(() => {
      void refreshCases();
      void refreshNotifications();
    }, 0);
    socket.connect();
    const poll = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void refreshCases();
        if (!socket.connected) void refreshNotifications();
      }
    }, 3000);

    return () => {
      disposed = true;
      window.clearTimeout(initialLoad);
      if (retryTimer !== undefined) window.clearTimeout(retryTimer);
      if (ackTimer !== undefined) window.clearTimeout(ackTimer);
      window.clearInterval(poll);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
      socket.off("sesi:kedaluwarsa", handleSessionExpired);
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off(NEW_SOS_EVENT, handleNewSos);
      socket.off("sos:diperbarui", handleUpdate);
      socket.off("sos:eskalasi", handleEscalation);
      socket.off("sos:lokasi", handleLocationUpdate);
      socket.disconnect();
    };
  }, [refreshCases, refreshNotifications]);

  const dismissAlert = useCallback(() => setActiveAlert(null), []);
  // Kontrak publik tetap `Promise<void>`; daftar hasil refresh hanya dipakai internal.
  const refreshCasesPublic = useCallback(async () => { await refreshCases(); }, [refreshCases]);
  const contextValue = useMemo(
    () => ({ connectionState, incomingCases, loading, error, refreshCases: refreshCasesPublic }),
    [connectionState, incomingCases, loading, error, refreshCasesPublic]
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
