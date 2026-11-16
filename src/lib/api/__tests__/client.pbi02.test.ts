import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  AUTH_BLOCKED_EVENT,
  SessionError,
  apiRequest,
  authBlockReasonOf,
  getAccessToken,
  refreshAccessToken,
  setAccessToken,
} from "../client";

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

describe("client.ts — penanganan penolakan sesi PBI-02", () => {
  const fetchMock = vi.fn();
  const blocked: string[] = [];
  const onBlocked = (event: Event) => blocked.push((event as CustomEvent<string>).detail);

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockReset();
    blocked.length = 0;
    window.addEventListener(AUTH_BLOCKED_EVENT, onBlocked);
    setAccessToken(null);
  });
  afterEach(() => {
    window.removeEventListener(AUTH_BLOCKED_EVENT, onBlocked);
    vi.unstubAllGlobals();
  });

  describe("authBlockReasonOf", () => {
    it.each([
      [403, { message: "AKUN_TIDAK_AKTIF" }, "akun_tidak_aktif"],
      [503, { message: "Status akademik belum dapat diverifikasi" }, "akademik_gangguan"],
      [403, { message: "Login mahasiswa tanpa SSO sedang nonaktif" }, undefined],
      [403, { message: "Forbidden resource" }, undefined],
      [503, { message: "Integrasi lain gagal" }, undefined],
      [401, { message: "AKUN_TIDAK_AKTIF" }, undefined],
    ])("status %i %j → %s", async (status, body, expected) => {
      expect(await authBlockReasonOf(json(status, body))).toBe(expected);
    });

    it("tidak gagal pada body non-JSON dan tidak mengonsumsi response asli", async () => {
      const response = new Response("bukan json", { status: 503 });
      expect(await authBlockReasonOf(response)).toBeUndefined();
      expect(await response.text()).toBe("bukan json");
    });
  });

  describe("apiRequest dengan sesi aktif", () => {
    it("403 AKUN_TIDAK_AKTIF: menghapus access token dan mengirim event akun_tidak_aktif", async () => {
      setAccessToken("access");
      fetchMock.mockResolvedValueOnce(json(403, { message: "AKUN_TIDAK_AKTIF" }));

      const response = await apiRequest("/me");

      expect(response.status).toBe(403);
      expect(blocked).toEqual(["akun_tidak_aktif"]);
      expect(getAccessToken()).toBeNull();
    });

    it("503 layanan akademik: menghapus access token dan mengirim event akademik_gangguan", async () => {
      setAccessToken("access");
      fetchMock.mockResolvedValueOnce(json(503, { message: "Status akademik belum dapat diverifikasi" }));

      await apiRequest("/me");

      expect(blocked).toEqual(["akademik_gangguan"]);
      expect(getAccessToken()).toBeNull();
    });

    it("403 lain (mis. role) tidak memutus sesi", async () => {
      setAccessToken("access");
      fetchMock.mockResolvedValueOnce(json(403, { message: "Forbidden resource" }));

      await apiRequest("/admin/sesuatu");

      expect(blocked).toEqual([]);
      expect(getAccessToken()).toBe("access");
    });

    it("401 lalu refresh ditolak AKUN_TIDAK_AKTIF: event dikirim sekali dan token dihapus", async () => {
      setAccessToken("expired");
      fetchMock
        .mockResolvedValueOnce(json(401, { message: "Unauthorized" }))
        .mockResolvedValueOnce(json(403, { message: "AKUN_TIDAK_AKTIF" }));

      const response = await apiRequest("/me");

      expect(response.status).toBe(401);
      expect(blocked).toEqual(["akun_tidak_aktif"]);
      expect(getAccessToken()).toBeNull();
    });
  });

  it("request tanpa access token (form login) tidak dianggap pemutusan sesi", async () => {
    fetchMock.mockResolvedValueOnce(json(403, { message: "AKUN_TIDAK_AKTIF" }));

    const response = await apiRequest("/auth/student/test-login", { method: "POST", body: "{}" });

    expect(response.status).toBe(403);
    expect(blocked).toEqual([]);
  });

  describe("refreshAccessToken", () => {
    it.each([
      [403, { message: "AKUN_TIDAK_AKTIF" }, "akun_tidak_aktif"],
      [503, { message: "Status akademik belum dapat diverifikasi" }, "akademik_gangguan"],
    ])("status %i → SessionError dengan reason %s", async (status, body, reason) => {
      fetchMock.mockResolvedValueOnce(json(status, body));

      const error = await refreshAccessToken().catch((e: unknown) => e);

      expect(error).toBeInstanceOf(SessionError);
      expect((error as SessionError).status).toBe(status);
      expect((error as SessionError).reason).toBe(reason);
      expect(blocked).toEqual([reason]);
    });

    it("401 biasa → SessionError tanpa reason dan tanpa event", async () => {
      fetchMock.mockResolvedValueOnce(json(401, { message: "Sesi tidak valid atau kedaluwarsa" }));

      const error = (await refreshAccessToken().catch((e: unknown) => e)) as SessionError;

      expect(error.status).toBe(401);
      expect(error.reason).toBeUndefined();
      expect(blocked).toEqual([]);
    });

    it("sukses tetap menyimpan access token baru", async () => {
      fetchMock.mockResolvedValueOnce(json(200, { accessToken: "baru", user: { role: "MAHASISWA" } }));

      await refreshAccessToken();

      expect(getAccessToken()).toBe("baru");
    });
  });
});
