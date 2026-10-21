import { Navbar } from "@/components/layout/Navbar";
import { GentaFab } from "@/components/genta/GentaFab";

export default function MahasiswaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-bg text-text">
      <Navbar />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 relative">
        {children}
      </main>
      <GentaFab />
      <footer className="border-t border-black/5 dark:border-white/10 py-6 text-center text-xs text-text-muted">
        <p>Denger.in — Ruang Aman Mahasiswa • Kontak Darurat 119 ext. 8</p>
      </footer>
    </div>
  );
}
