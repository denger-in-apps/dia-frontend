import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";

/** Socket palsu (unit test saja): cukup on/off/emit lokal + connect/disconnect. */
const fake = vi.hoisted(() => {
  const handlers = new Map<string, Set<(...args: unknown[]) => void>>();
  const socket = {
    connected: false,
    active: false,
    on: (event: string, fn: (...args: unknown[]) => void) => {
      if (!handlers.has(event)) handlers.set(event, new Set());
      handlers.get(event)!.add(fn);
      return socket;
    },
    off: (event: string, fn: (...args: unknown[]) => void) => { handlers.get(event)?.delete(fn); return socket; },
    connect: vi.fn(),
    disconnect: vi.fn(),
    fire: (event: string, ...args: unknown[]) => { handlers.get(event)?.forEach((fn) => fn(...args)); },
    reset: () => { handlers.clear(); socket.connected = false; socket.active = false; },
  };
  return socket;
});
/** Isi antrean di "backend" (respons GET /psikolog/sos). */
const db = vi.hoisted(() => ({ kasus: [] as unknown[] }));
const api = vi.hoisted(() => ({
  apiRequest: vi.fn(), refreshAccessToken: vi.fn(), getNotifikasiBelumDibaca: vi.fn(), tandaiNotifikasiDibaca: vi.fn(),
}));

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock("@/lib/socket/client", () => ({ getSosSocket: () => fake }));
vi.mock("@/lib/api/client", () => ({
  apiRequest: api.apiRequest,
  refreshAccessToken: api.refreshAccessToken,
  WAJIB_GANTI_PASSWORD: "PASSWORD_WAJIB_DIGANTI",
  WAJIB_GANTI_PASSWORD_EVENT: "dia:wajib-ganti-password",
  AUTH_BLOCKED_EVENT: "dia:auth-blocked",
}));
vi.mock("@/lib/api/notifikasi", () => ({
  getNotifikasiBelumDibaca: api.getNotifikasiBelumDibaca,
  tandaiNotifikasiDibaca: api.tandaiNotifikasiDibaca,
}));

import { SosRealtimeProvider, useSosRealtime } from "@/components/genta/SosRealtimeProvider";

const SOS_A = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const sosBaru = (id: string, idNotifikasi: string | null) => ({
  id_sos: id, prioritas: "KRITIS", situasi: "DALAM_BAHAYA", situasi_label: "Saya dalam bahaya",
  waktu_kejadian: "2026-11-13T10:00:00.000Z", lokasi_tersedia: false, perlu_verifikasi: false,
  tanpa_jaga: false, id_notifikasi: idNotifikasi,
});
const notif = (id: string, idSos: string) => ({
  id, jenis: "SOS_BARU", payload: sosBaru(idSos, null), dibaca_at: null, created_at: "2026-11-13T10:00:01.000Z",
});

function Antrean() {
  const { incomingCases, connectionState } = useSosRealtime();
  return <div data-testid="antrean" data-state={connectionState}>{incomingCases.map((c) => c.id).join(",")}</div>;
}
const renderProvider = () => render(<SosRealtimeProvider><Antrean /></SosRealtimeProvider>);
const flush = () => act(async () => { await new Promise((r) => setTimeout(r, 0)); });

describe("PBI-07 SosRealtimeProvider", () => {
  beforeEach(() => {
    fake.reset();
    vi.clearAllMocks();
    db.kasus = [{ id_sos: SOS_A, status_penanganan: "BARU", prioritas: "KRITIS", situasi_label: "Saya dalam bahaya", waktu_kejadian: "2026-11-13T10:00:00.000Z" }];
    api.apiRequest.mockImplementation(async () => new Response(JSON.stringify(db.kasus), { status: 200 }));
    api.getNotifikasiBelumDibaca.mockResolvedValue([]);
    api.tandaiNotifikasiDibaca.mockResolvedValue(undefined);
    api.refreshAccessToken.mockResolvedValue(undefined);
  });
  afterEach(() => vi.useRealTimers());

  it("memulihkan notifikasi tersimpan saat login (psikolog sebelumnya offline) dan menandainya dibaca", async () => {
    api.getNotifikasiBelumDibaca.mockResolvedValue([notif("n-1", SOS_A)]);
    renderProvider();
    await waitFor(() => expect(screen.getByRole("alert").textContent).toMatch(/diterima saat Anda tidak terhubung/i));
    expect(screen.getByTestId("antrean").textContent).toContain(SOS_A);
    expect(api.tandaiNotifikasiDibaca).toHaveBeenCalledWith("n-1");
  });

  it("memulihkan notifikasi yang terlewat setiap kali socket tersambung kembali", async () => {
    renderProvider();
    await flush();
    const awal = api.getNotifikasiBelumDibaca.mock.calls.length;
    fake.connected = true;
    act(() => fake.fire("connect"));
    await waitFor(() => expect(api.getNotifikasiBelumDibaca.mock.calls.length).toBe(awal + 1));
    act(() => fake.fire("disconnect", "transport close"));
    act(() => fake.fire("connect"));
    await waitFor(() => expect(api.getNotifikasiBelumDibaca.mock.calls.length).toBe(awal + 2));
  });

  it("event realtime dengan id_notifikasi langsung di-ack → tidak muncul lagi dari REST (tanpa duplikasi)", async () => {
    renderProvider();
    await flush();
    act(() => fake.fire("sos:baru", sosBaru(SOS_A, "n-9")));
    await waitFor(() => expect(api.tandaiNotifikasiDibaca).toHaveBeenCalledWith("n-9"));
    expect(screen.getAllByRole("alert")).toHaveLength(1);

    // Reconnect: REST masih mengembalikan notifikasi yang sama (mis. ack belum sampai) → diabaikan.
    api.getNotifikasiBelumDibaca.mockResolvedValue([notif("n-9", SOS_A)]);
    act(() => fake.fire("connect"));
    await flush();
    expect(api.tandaiNotifikasiDibaca).toHaveBeenCalledTimes(1);
    expect(screen.getAllByRole("alert")).toHaveLength(1);
    expect(screen.getByRole("alert").textContent).not.toMatch(/tidak terhubung/i);
    expect(screen.getByTestId("antrean").textContent).toBe(SOS_A);
  });

  it("race: REST memulihkan SOS lebih dulu, event realtime yang menyusul tidak menggandakan kasus/toast", async () => {
    api.getNotifikasiBelumDibaca.mockResolvedValue([notif("n-2", SOS_A)]);
    renderProvider();
    await waitFor(() => expect(screen.getByRole("alert")).toBeDefined());
    act(() => fake.fire("sos:baru", sosBaru(SOS_A, "n-2")));
    await flush();
    expect(screen.getByTestId("antrean").textContent).toBe(SOS_A);
    expect(screen.getAllByRole("alert")).toHaveLength(1);
    expect(api.tandaiNotifikasiDibaca).toHaveBeenCalledTimes(1);
  });

  it("event tanpa id_notifikasi (penyimpanan backend gagal) tetap ditampilkan tanpa ack", async () => {
    renderProvider();
    await flush();
    act(() => fake.fire("sos:baru", sosBaru(SOS_A, null)));
    await waitFor(() => expect(screen.getByRole("alert")).toBeDefined());
    expect(api.tandaiNotifikasiDibaca).not.toHaveBeenCalled();
  });

  it("sos:diperbarui memuat ulang antrean dari backend", async () => {
    renderProvider();
    await flush();
    const awal = api.apiRequest.mock.calls.filter(([p]) => String(p).startsWith("/psikolog/sos")).length;
    act(() => fake.fire("sos:diperbarui", { id_sos: SOS_A, status_penanganan: "DIAMBIL", id_psikolog: "x" }));
    await waitFor(() => expect(api.apiRequest.mock.calls.filter(([p]) => String(p).startsWith("/psikolog/sos")).length).toBe(awal + 1));
  });

  it("sos:eskalasi memperbarui antrean dan menampilkan peringatan prioritas", async () => {
    renderProvider();
    await flush();
    const awal = api.apiRequest.mock.calls.length;
    act(() => fake.fire("sos:eskalasi", {
      id_sos: SOS_A, prioritas: "KRITIS", situasi: "DALAM_BAHAYA",
      waktu_kejadian: "2026-11-13T10:00:00.000Z", waktu_eskalasi: "2026-11-13T10:05:00.000Z",
      lokasi_tersedia: false, perlu_verifikasi: false, sumber: "BATAS_WAKTU",
    }));
    await waitFor(() => expect(api.apiRequest.mock.calls.length).toBeGreaterThan(awal));
    expect(screen.getByRole("alert").textContent).toMatch(/dieskalasikan/i);
  });

  it("sos:lokasi memuat ulang antrean tanpa menerima koordinat melalui event", async () => {
    renderProvider();
    await flush();
    const awal = api.apiRequest.mock.calls.length;
    act(() => fake.fire("sos:lokasi", { id_sos: SOS_A, lokasi_tersedia: true, lokasi_diperbarui_at: "2026-11-13T10:05:00.000Z" }));
    await waitFor(() => expect(api.apiRequest.mock.calls.length).toBeGreaterThan(awal));
  });

  it("memulihkan notifikasi eskalasi saat psikolog offline", async () => {
    api.getNotifikasiBelumDibaca.mockResolvedValue([{
      id: "n-eskalasi", jenis: "SOS_ESKALASI",
      payload: { id_sos: SOS_A, prioritas: "KRITIS", situasi: "DALAM_BAHAYA", waktu_kejadian: "2026-11-13T10:00:00.000Z" },
      dibaca_at: null, created_at: "2026-11-13T10:05:00.000Z",
    }]);
    renderProvider();
    await waitFor(() => expect(screen.getByRole("alert").textContent).toMatch(/dieskalasikan/i));
    expect(api.tandaiNotifikasiDibaca).toHaveBeenCalledWith("n-eskalasi");
  });

  it("token kedaluwarsa (sesi:kedaluwarsa / server disconnect): refresh token lalu sambung ulang", async () => {
    vi.useFakeTimers();
    renderProvider();
    await act(async () => { await vi.advanceTimersByTimeAsync(0); });
    fake.connect.mockClear();
    act(() => fake.fire("sesi:kedaluwarsa", { kode: "TOKEN_KEDALUWARSA" }));
    act(() => fake.fire("disconnect", "io server disconnect"));
    await act(async () => { await vi.advanceTimersByTimeAsync(1100); });
    expect(api.refreshAccessToken).toHaveBeenCalledTimes(1);
    expect(fake.connect).toHaveBeenCalledTimes(1);
  });

  it("SCRUM-237: password di-reset admin (kode WAJIB_GANTI_PASSWORD) → tidak menyambung ulang, minta ganti password", async () => {
    vi.useFakeTimers();
    const listener = vi.fn();
    window.addEventListener("dia:wajib-ganti-password", listener);
    renderProvider();
    await act(async () => { await vi.advanceTimersByTimeAsync(0); });
    fake.connect.mockClear();
    api.refreshAccessToken.mockClear();
    act(() => fake.fire("sesi:kedaluwarsa", { kode: "WAJIB_GANTI_PASSWORD" }));
    await act(async () => { await vi.advanceTimersByTimeAsync(1100); });
    expect(listener).toHaveBeenCalledTimes(1);
    expect(api.refreshAccessToken).not.toHaveBeenCalled();
    expect(fake.connect).not.toHaveBeenCalled();
    window.removeEventListener("dia:wajib-ganti-password", listener);
  });

  it("kode backend PASSWORD_WAJIB_DIGANTI juga meminta ganti password tanpa reconnect", async () => {
    vi.useFakeTimers();
    const listener = vi.fn();
    window.addEventListener("dia:wajib-ganti-password", listener);
    renderProvider();
    await act(async () => { await vi.advanceTimersByTimeAsync(0); });
    fake.connect.mockClear();
    api.refreshAccessToken.mockClear();
    act(() => fake.fire("sesi:kedaluwarsa", { kode: "PASSWORD_WAJIB_DIGANTI" }));
    await act(async () => { await vi.advanceTimersByTimeAsync(1100); });
    expect(listener).toHaveBeenCalledTimes(1);
    expect(api.refreshAccessToken).not.toHaveBeenCalled();
    expect(fake.connect).not.toHaveBeenCalled();
    window.removeEventListener("dia:wajib-ganti-password", listener);
  });

  it("akun dinonaktifkan admin (kode AKUN_TIDAK_AKTIF) → sesi diakhiri, tidak menyambung ulang", async () => {
    vi.useFakeTimers();
    const listener = vi.fn();
    window.addEventListener("dia:auth-blocked", listener);
    renderProvider();
    await act(async () => { await vi.advanceTimersByTimeAsync(0); });
    fake.connect.mockClear();
    api.refreshAccessToken.mockClear();
    act(() => fake.fire("sesi:kedaluwarsa", { kode: "AKUN_TIDAK_AKTIF" }));
    act(() => fake.fire("disconnect", "io server disconnect"));
    await act(async () => { await vi.advanceTimersByTimeAsync(5000); });
    expect(listener).toHaveBeenCalledTimes(1);
    expect((listener.mock.calls[0][0] as CustomEvent).detail).toBe("akun_tidak_aktif");
    expect(api.refreshAccessToken).not.toHaveBeenCalled();
    expect(fake.connect).not.toHaveBeenCalled();
    window.removeEventListener("dia:auth-blocked", listener);
  });

  it("jaringan perangkat putus: status langsung terputus; online kembali → sambung ulang", async () => {
    renderProvider();
    await flush();
    fake.connected = true;
    act(() => fake.fire("connect"));
    await waitFor(() => expect(screen.getByTestId("antrean").dataset.state).toBe("connected"));
    fake.disconnect.mockClear();
    fake.connect.mockClear();
    act(() => { window.dispatchEvent(new Event("offline")); });
    expect(screen.getByTestId("antrean").dataset.state).toBe("disconnected");
    expect(fake.disconnect).toHaveBeenCalledTimes(1);
    fake.connected = false;
    act(() => { window.dispatchEvent(new Event("online")); });
    expect(fake.connect).toHaveBeenCalledTimes(1);
  });

  it("backend be693de1: event realtime tanpa id_notifikasi di-ack lewat pemulihan REST tertunda, tanpa toast ganda", async () => {
    vi.useFakeTimers();
    renderProvider();
    await act(async () => { await vi.advanceTimersByTimeAsync(0); });
    act(() => fake.fire("sos:baru", sosBaru(SOS_A, null)));
    await act(async () => { await vi.advanceTimersByTimeAsync(0); });
    expect(screen.getAllByRole("alert")).toHaveLength(1);
    // Backend menyimpan notifikasi SETELAH emit; REST kini mengembalikannya.
    api.getNotifikasiBelumDibaca.mockResolvedValue([notif("n-tunda", SOS_A)]);
    await act(async () => { await vi.advanceTimersByTimeAsync(1600); });
    expect(api.tandaiNotifikasiDibaca).toHaveBeenCalledWith("n-tunda");
    expect(screen.getAllByRole("alert")).toHaveLength(1);
    expect(screen.getByRole("alert").textContent).not.toMatch(/tidak terhubung/i);
  });

  it("backend be693de1 (tanpa id_notifikasi): notifikasi lama untuk SOS yang sudah diambil tidak di-toast ulang", async () => {
    // Kasus sudah diambil psikolog lain → tidak lagi menunggu di antrean.
    db.kasus = [{ id_sos: SOS_A, status_penanganan: "DIAMBIL", milik_saya: false, prioritas: "KRITIS", waktu_kejadian: "2026-11-13T10:00:00.000Z" }];
    api.getNotifikasiBelumDibaca.mockResolvedValue([notif("n-lama", SOS_A)]);
    renderProvider();
    await waitFor(() => expect(api.tandaiNotifikasiDibaca).toHaveBeenCalledWith("n-lama"));
    await flush();
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("eskalasi yang sudah diterima realtime tidak di-toast ulang saat pemulihan notifikasi", async () => {
    db.kasus = [{ id_sos: SOS_A, status_penanganan: "ESKALASI", prioritas: "KRITIS", waktu_kejadian: "2026-11-13T10:00:00.000Z" }];
    renderProvider();
    await flush();
    act(() => fake.fire("sos:eskalasi", { id_sos: SOS_A, prioritas: "KRITIS", situasi: "DALAM_BAHAYA", waktu_kejadian: "2026-11-13T10:00:00.000Z" }));
    await waitFor(() => expect(screen.getByRole("alert").textContent).toMatch(/dieskalasikan/i));
    act(() => screen.getByRole("alert").querySelector("button")?.click());
    api.getNotifikasiBelumDibaca.mockResolvedValue([{
      id: "n-esk", jenis: "SOS_ESKALASI",
      payload: { id_sos: SOS_A, prioritas: "KRITIS", situasi: "DALAM_BAHAYA", waktu_kejadian: "2026-11-13T10:00:00.000Z" },
      dibaca_at: null, created_at: "2026-11-13T10:05:00.000Z",
    }]);
    act(() => fake.fire("connect"));
    await waitFor(() => expect(api.tandaiNotifikasiDibaca).toHaveBeenCalledWith("n-esk"));
    await flush();
    expect(screen.queryByRole("alert")).toBeNull();
  });
});
