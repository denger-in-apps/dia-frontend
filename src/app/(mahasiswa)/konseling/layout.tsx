import type { ReactNode } from "react";
import { SesiKonselingProvider } from "./SesiKonselingContext";

export default function KonselingLayout({ children }: { children: ReactNode }) {
  return <SesiKonselingProvider>{children}</SesiKonselingProvider>;
}
