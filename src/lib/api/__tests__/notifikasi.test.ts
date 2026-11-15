import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiRequest } from "../client";
import { getNotifikasiBelumDibaca, tandaiNotifikasiDibaca } from "../notifikasi";

vi.mock("../client", () => ({ apiRequest: vi.fn() }));

const request = vi.mocked(apiRequest);

describe("API notifikasi", () => {
  beforeEach(() => request.mockReset());

  it("meminta notifikasi belum dibaca dengan batas jumlah", async () => {
    const rows = [{ id: "notif-1", jenis: "SOS_BARU", payload: { id_sos: "sos-1" }, dibaca_at: null, created_at: "2026-11-12T00:00:00Z" }];
    request.mockResolvedValueOnce(new Response(JSON.stringify(rows), { status: 200 }));

    await expect(getNotifikasiBelumDibaca(25)).resolves.toEqual(rows);
    expect(request).toHaveBeenCalledWith("/notifikasi?belum_dibaca=true&limit=25");
  });

  it("menandai notifikasi dibaca melalui endpoint milik sesi", async () => {
    request.mockResolvedValueOnce(new Response(null, { status: 204 }));

    await expect(tandaiNotifikasiDibaca("notif/1")).resolves.toBeUndefined();
    expect(request).toHaveBeenCalledWith("/notifikasi/notif%2F1/dibaca", { method: "POST" });
  });

  it("meneruskan pesan kegagalan backend", async () => {
    request.mockResolvedValueOnce(new Response(JSON.stringify({ pesan: "Sesi berakhir" }), { status: 401 }));

    await expect(getNotifikasiBelumDibaca()).rejects.toThrow("Sesi berakhir");
  });
});
