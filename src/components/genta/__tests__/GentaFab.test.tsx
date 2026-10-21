import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { GentaFab } from "../GentaFab";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("GentaFab Component (SCRUM-204)", () => {
  it("renders Genta SOS FAB with accessible aria-label", () => {
    render(<GentaFab />);
    const fabButton = screen.getByRole("button", { name: /tombol darurat genta/i });
    expect(fabButton).toBeDefined();
    expect(fabButton.textContent).toContain("SOS Genta");
  });
});
