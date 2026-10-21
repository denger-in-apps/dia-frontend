import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GentaFab } from "../GentaFab";
import { GentaConfirmSheet } from "../GentaConfirmSheet";
import { SosStatusCard } from "../SosStatusCard";
import { SosAlertToast } from "../SosAlertToast";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("SET-02: Komponen Tombol Genta & Alur Darurat (SCRUM-204)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("1. GentaFab (FR-MHS-03, NFR-01)", () => {
    it("renders FAB with accessible aria-label and SOS text", () => {
      render(<GentaFab />);
      const btn = screen.getByRole("button", { name: /tombol darurat genta/i });
      expect(btn).toBeDefined();
      expect(btn.textContent).toContain("SOS Genta");
    });

    it("has touch target size meeting or exceeding 56px", () => {
      render(<GentaFab />);
      const btn = screen.getByRole("button", { name: /tombol darurat genta/i });
      expect(btn.className).toContain("min-w-[56px]");
      expect(btn.className).toContain("min-h-[56px]");
    });

    it("opens GentaConfirmSheet on Ketukan 1", async () => {
      render(<GentaFab />);
      const btn = screen.getByRole("button", { name: /tombol darurat genta/i });

      // Before tap: confirm sheet dialog is not visible
      expect(screen.queryByRole("dialog")).toBeNull();

      // Ketukan 1
      await userEvent.click(btn);

      // Dialog opens
      expect(screen.getByRole("dialog")).toBeDefined();
      expect(screen.getByText(/sinyal darurat genta/i)).toBeDefined();
    });
  });

  describe("2. GentaConfirmSheet (Maksimal 2 Ketukan & FR-MHS-04)", () => {
    it("send button is enabled immediately upon opening (guarantees Ketukan 2 works without prerequisite)", () => {
      render(<GentaConfirmSheet isOpen={true} onClose={vi.fn()} />);

      const sendButton = screen.getByRole("button", { name: /kirim sinyal bantuan sekarang/i });
      expect(sendButton).toBeDefined();
      expect((sendButton as HTMLButtonElement).disabled).toBe(false);
    });

    it("submits SOS immediately on Ketukan 2 and navigates to status page", async () => {
      const mockApi = vi.fn().mockResolvedValue({ id: "SOS-TEST-99" });
      render(<GentaConfirmSheet isOpen={true} onClose={vi.fn()} apiClientOverride={mockApi} />);

      const sendButton = screen.getByRole("button", { name: /kirim sinyal bantuan sekarang/i });
      await userEvent.click(sendButton);

      await waitFor(() => {
        expect(mockApi).toHaveBeenCalledTimes(1);
        expect(mockPush).toHaveBeenCalledWith("/genta/status?id=SOS-TEST-99");
      });
    });

    it("does NOT request geolocation if 'Bagikan lokasiku' is unchecked", async () => {
      const mockGetCurrentPosition = vi.fn();
      Object.defineProperty(global.navigator, "geolocation", {
        value: { getCurrentPosition: mockGetCurrentPosition },
        writable: true,
      });

      const mockApi = vi.fn().mockResolvedValue({ id: "SOS-NO-LOC" });
      render(<GentaConfirmSheet isOpen={true} onClose={vi.fn()} apiClientOverride={mockApi} />);

      const sendButton = screen.getByRole("button", { name: /kirim sinyal bantuan sekarang/i });
      await userEvent.click(sendButton);

      await waitFor(() => {
        expect(mockGetCurrentPosition).not.toHaveBeenCalled();
        expect(mockApi).toHaveBeenCalledWith(
          expect.objectContaining({
            lokasi: undefined,
          })
        );
      });
    });

    it("falls back gracefully and sends SOS WITHOUT location if geolocation is denied or times out", async () => {
      const mockGetCurrentPosition = vi.fn().mockImplementation((_success, error) => {
        error(new Error("User denied Geolocation"));
      });
      Object.defineProperty(global.navigator, "geolocation", {
        value: { getCurrentPosition: mockGetCurrentPosition },
        writable: true,
      });

      const mockApi = vi.fn().mockResolvedValue({ id: "SOS-FALLBACK" });
      render(<GentaConfirmSheet isOpen={true} onClose={vi.fn()} apiClientOverride={mockApi} />);

      // Check the location toggle
      const checkbox = screen.getByRole("checkbox");
      await userEvent.click(checkbox);
      expect((checkbox as HTMLInputElement).checked).toBe(true);

      // Ketukan 2: Kirim Sinyal
      const sendButton = screen.getByRole("button", { name: /kirim sinyal bantuan sekarang/i });
      await userEvent.click(sendButton);

      await waitFor(() => {
        expect(mockGetCurrentPosition).toHaveBeenCalled();
        // Crucial: submission still succeeds with lokasi: undefined, NOT blocked!
        expect(mockApi).toHaveBeenCalledWith(
          expect.objectContaining({
            lokasi: undefined,
          })
        );
        expect(mockPush).toHaveBeenCalledWith("/genta/status?id=SOS-FALLBACK");
      });
    });

    it("always displays Kemenkes 119 Ext. 8 hotline link", () => {
      render(<GentaConfirmSheet isOpen={true} onClose={vi.fn()} />);
      const hotlineLink = screen.getByRole("link", { name: /panggil 119/i });
      expect(hotlineLink).toBeDefined();
      expect(hotlineLink.getAttribute("href")).toBe("tel:119,8");
    });
  });

  describe("3. SosStatusCard", () => {
    it("renders active case status and emergency hotline", () => {
      render(
        <SosStatusCard
          id="SOS-001"
          status="BARU"
          waktuBuat="10:00 WIB"
          kategori="Panik Berat"
        />
      );

      expect(screen.getByText(/SOS-001/i)).toBeDefined();
      expect(screen.getByText(/Menunggu Psikolog Jaga/i)).toBeDefined();
      const hotline = screen.getByRole("link", { name: /hubungi bebas pulsa: 119 ext. 8/i });
      expect(hotline.getAttribute("href")).toBe("tel:119,8");
    });

    it("allows false alarm cancellation", async () => {
      const mockBatal = vi.fn();
      render(
        <SosStatusCard
          id="SOS-002"
          status="DIAMBIL"
          waktuBuat="10:05 WIB"
          onBatal={mockBatal}
        />
      );

      const cancelTrigger = screen.getByText(/salah menekan\? batalkan sinyal darurat ini/i);
      await userEvent.click(cancelTrigger);

      const confirmButton = screen.getByRole("button", { name: /ya, batalkan sinyal/i });
      await userEvent.click(confirmButton);

      expect(mockBatal).toHaveBeenCalledTimes(1);
    });
  });

  describe("4. SosAlertToast (Aksesibilitas & Realtime)", () => {
    it("renders with role='alert' and aria-live='assertive'", () => {
      render(
        <SosAlertToast
          id="SOS-ALERT-1"
          pesan="Sinyal darurat baru masuk dari gedung kuliah"
          onDismiss={vi.fn()}
        />
      );

      const alert = screen.getByRole("alert");
      expect(alert.getAttribute("aria-live")).toBe("assertive");
      expect(screen.getByText(/SOS-ALERT-1/i)).toBeDefined();
    });
  });
});
