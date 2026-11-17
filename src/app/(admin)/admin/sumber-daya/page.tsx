"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Plus, Trash2, Pencil, Search, Phone, ExternalLink, X, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSumberDaya, type SumberDayaItem } from "@/lib/sumber-daya";

const categories = ["Krisis Darurat", "Layanan Kampus", "Eksternal / LSM", "Edukasi & Mandiri"];
const emptyForm = { nama: "", kategori: categories[1], deskripsi: "", telepon: "", tautan: "" };

export default function AdminSumberDayaPage() {
  const { items, setItems, isReady } = useSumberDaya();
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [feedback, setFeedback] = useState("");

  const filteredItems = useMemo(() => items.filter((item) =>
    `${item.nama} ${item.kategori} ${item.deskripsi} ${item.telepon ?? ""}`.toLowerCase().includes(query.toLowerCase()),
  ), [items, query]);

  function startAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setIsFormOpen(true);
    setFeedback("");
  }

  function startEdit(item: SumberDayaItem) {
    setEditingId(item.id);
    setForm({ nama: item.nama, kategori: item.kategori, deskripsi: item.deskripsi, telepon: item.telepon ?? "", tautan: item.tautan ?? "" });
    setIsFormOpen(true);
    setFeedback("");
  }

  function saveItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const item: SumberDayaItem = {
      id: editingId ?? `resource-${Date.now()}`,
      nama: form.nama.trim(),
      kategori: form.kategori,
      deskripsi: form.deskripsi.trim(),
      ...(form.telepon.trim() ? { telepon: form.telepon.trim() } : {}),
      ...(form.tautan.trim() ? { tautan: form.tautan.trim() } : {}),
    };
    if (editingId) setItems((current) => current.map((entry) => entry.id === editingId ? item : entry));
    else setItems((current) => [item, ...current]);
    setIsFormOpen(false);
    setEditingId(null);
    setFeedback(editingId ? "Kontak berhasil diperbarui." : "Kontak baru berhasil ditambahkan.");
  }

  function deleteItem(item: SumberDayaItem) {
    if (!window.confirm(`Hapus “${item.nama}” dari direktori bantuan?`)) return;
    setItems((current) => current.filter((entry) => entry.id !== item.id));
    setFeedback("Kontak berhasil dihapus dari direktori.");
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-black text-brand dark:text-text">Manajemen Sumber Daya & Kontak Rujukan</h1>
          <p className="mt-1 text-sm text-text-muted">Kelola kontak layanan bantuan yang ditampilkan kepada mahasiswa dan psikolog.</p>
        </div>
        <Button variant="primary" size="sm" onClick={startAdd} className="gap-1.5 self-start"><Plus className="h-4 w-4" />Tambah kontak</Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <label className="relative block w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari nama, kategori, atau nomor" className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-surface py-2.5 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-focus" />
        </label>
        <Badge variant="outline">{filteredItems.length} dari {items.length} kontak</Badge>
      </div>

      {feedback && <p role="status" className="rounded-xl border border-emerald-300 bg-emerald-50 dark:bg-emerald-950/20 px-4 py-3 text-xs font-semibold text-emerald-700">{feedback}</p>}

      {isFormOpen && (
        <Card className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-bold text-brand dark:text-text">{editingId ? "Ubah kontak bantuan" : "Tambah kontak bantuan"}</h2>
            <button type="button" onClick={() => setIsFormOpen(false)} aria-label="Tutup form" className="rounded-full p-2 text-text-muted hover:bg-black/5 dark:hover:bg-white/5"><X className="h-4 w-4" /></button>
          </div>
          <form onSubmit={saveItem} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="space-y-1 text-xs font-semibold text-text-muted">Nama layanan / materi
              <input required maxLength={100} value={form.nama} onChange={(event) => setForm({ ...form, nama: event.target.value })} placeholder="Contoh: Hotline Konseling Kampus" className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-surface p-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-focus" />
            </label>
            <label className="space-y-1 text-xs font-semibold text-text-muted">Kategori
              <select value={form.kategori} onChange={(event) => setForm({ ...form, kategori: event.target.value })} className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-surface p-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-focus">
                {categories.map((category) => <option key={category}>{category}</option>)}
              </select>
            </label>
            <label className="space-y-1 text-xs font-semibold text-text-muted sm:col-span-2">Deskripsi
              <textarea required maxLength={500} rows={3} value={form.deskripsi} onChange={(event) => setForm({ ...form, deskripsi: event.target.value })} placeholder="Jelaskan jenis dukungan atau layanan yang tersedia" className="w-full resize-y rounded-xl border border-black/10 dark:border-white/10 bg-surface p-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-focus" />
            </label>
            <label className="space-y-1 text-xs font-semibold text-text-muted">Nomor telepon (opsional)
              <input type="tel" maxLength={30} value={form.telepon} onChange={(event) => setForm({ ...form, telepon: event.target.value })} placeholder="Contoh: 0211234567" className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-surface p-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-focus" />
            </label>
            <label className="space-y-1 text-xs font-semibold text-text-muted">Tautan (opsional)
              <input type="url" value={form.tautan} onChange={(event) => setForm({ ...form, tautan: event.target.value })} placeholder="https://contoh.id" className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-surface p-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-focus" />
            </label>
            <div className="sm:col-span-2 flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsFormOpen(false)}>Batal</Button>
              <Button type="submit" size="sm">{editingId ? "Simpan perubahan" : "Tambahkan ke direktori"}</Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-xs">
            <thead className="bg-black/5 dark:bg-white/5 border-b border-black/5 dark:border-white/10 font-bold">
              <tr><th className="p-4">Nama layanan / materi</th><th className="p-4">Kategori</th><th className="p-4">Kontak & tautan</th><th className="p-4 text-right">Aksi</th></tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {filteredItems.map((item) => (
                <tr key={item.id} className="align-top hover:bg-black/[0.03] dark:hover:bg-white/[0.03]">
                  <td className="p-4"><div className="font-bold text-brand dark:text-text">{item.nama}</div><p className="mt-1 max-w-sm text-text-muted">{item.deskripsi}</p></td>
                  <td className="p-4"><Badge variant="mint">{item.kategori}</Badge></td>
                  <td className="p-4"><div className="space-y-2">{item.telepon && <a href={`tel:${item.telepon}`} className="flex items-center gap-1.5 font-mono hover:text-brand"><Phone className="h-3.5 w-3.5" />{item.telepon}</a>}{item.tautan && <a href={item.tautan} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-brand underline"><ExternalLink className="h-3.5 w-3.5" />Buka tautan</a>}{!item.telepon && !item.tautan && <span className="text-text-muted">Tidak ada kontak</span>}</div></td>
                  <td className="p-4"><div className="flex justify-end gap-1"><button type="button" onClick={() => startEdit(item)} className="rounded-full p-2 text-text-muted hover:bg-black/5 hover:text-brand dark:hover:bg-white/5" aria-label={`Ubah ${item.nama}`}><Pencil className="h-4 w-4" /></button><button type="button" onClick={() => deleteItem(item)} className="rounded-full p-2 text-text-muted hover:bg-danger/10 hover:text-danger" aria-label={`Hapus ${item.nama}`}><Trash2 className="h-4 w-4" /></button></div></td>
                </tr>
              ))}
              {filteredItems.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-text-muted"><BookOpen className="mx-auto mb-2 h-5 w-5" />{items.length === 0 ? "Belum ada kontak. Tambahkan kontak pertama." : "Kontak tidak ditemukan. Coba kata kunci lain."}</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
      <p className="text-[11px] text-text-muted">{isReady ? "Perubahan tersimpan di browser ini dan akan terlihat pada direktori mahasiswa serta psikolog." : "Memuat data direktori…"} Data ini masih simulasi frontend dan belum disimpan ke server.</p>
    </div>
  );
}
