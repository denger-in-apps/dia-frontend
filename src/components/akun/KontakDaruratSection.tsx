
"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Pencil, Plus, Trash2, X, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  getKontakDarurat,
  createKontakDarurat,
  updateKontakDarurat,
  deleteKontakDarurat,
} from "@/lib/api/akun";
import type { KontakDarurat } from "@/lib/api/types";

type FormDataKontak = {
  nama_kontak: string;
  no_telepon: string;
  hubungan: string;
};

const initialForm: FormDataKontak = {
  nama_kontak: "",
  no_telepon: "",
  hubungan: "",
};

const inputClass =
  "w-full rounded-xl border border-black/10 bg-bg px-3.5 py-3 text-sm text-text outline-none focus:border-focus focus:ring-2 focus:ring-focus/20 dark:border-white/10";

export function KontakDaruratSection() {
  const { user, isLoading: authLoading } = useAuth();

  const [contacts, setContacts] = useState<KontakDarurat[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormDataKontak>(initialForm);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const isMahasiswa = user?.role === "MAHASISWA";

  const loadContacts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getKontakDarurat();
      setContacts(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? `Gagal memuat kontak: ${err.message}`
          : "Gagal memuat kontak darurat."
      );
    } finally {
      setLoading(false);
    }
  }, []);

useEffect(() => {
  if (authLoading || !isMahasiswa) return;

  let cancelled = false;

  const fetchContacts = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getKontakDarurat();

      if (!cancelled) {
        setContacts(data);
      }
    } catch (err) {
      if (!cancelled) {
        setError(
          err instanceof Error
            ? `Gagal memuat kontak: ${err.message}`
            : "Gagal memuat kontak darurat."
        );
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  };

  void fetchContacts();

  return () => {
    cancelled = true;
  };
}, [authLoading, isMahasiswa]);

  function startAdd() {
    setEditingId(null);
    setForm(initialForm);
    setFormOpen(true);
    setError("");
    setNotice("");
  }

  function startEdit(contact: KontakDarurat) {
    setEditingId(contact.id);
    setForm({
      nama_kontak: contact.nama_kontak,
      no_telepon: contact.no_telepon,
      hubungan: contact.hubungan ?? "",
    });
    setFormOpen(true);
    setError("");
    setNotice("");
  }

  function cancelForm() {
    if (saving) return;
    setFormOpen(false);
    setEditingId(null);
    setForm(initialForm);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isMahasiswa || saving) return;

    const nama = form.nama_kontak.trim();
    const nomor = form.no_telepon.trim();
    const hubungan = form.hubungan.trim();

    if (!nama || !nomor) {
      setError("Nama kontak dan nomor telepon wajib diisi.");
      return;
    }

    const normalizedNumber = nomor.replace(/[\s().-]/g, "");
    if (!/^\+?\d{8,15}$/.test(normalizedNumber)) {
      setError("Nomor telepon harus 8–15 digit dan boleh diawali +.");
      return;
    }

    setSaving(true);
    setError("");
    setNotice("");

    try {
      if (editingId) {
        await updateKontakDarurat(editingId, {
          nama_kontak: nama,
          no_telepon: nomor,
          hubungan: hubungan || null,
        });
        setNotice("Kontak darurat berhasil diperbarui.");
      } else {
        if (contacts.length >= 5) {
          setError("Maksimal 5 kontak darurat.");
          return;
        }

        await createKontakDarurat({
          nama_kontak: nama,
          no_telepon: nomor,
          ...(hubungan ? { hubungan } : {}),
        });
        setNotice("Kontak darurat berhasil ditambahkan.");
      }

      setFormOpen(false);
      setEditingId(null);
      setForm(initialForm);
      await loadContacts();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal menyimpan kontak darurat."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(contact: KontakDarurat) {
    if (!isMahasiswa || deletingId) return;

    const confirmed = window.confirm(
      `Hapus kontak darurat "${contact.nama_kontak}"?`
    );
    if (!confirmed) return;

    setDeletingId(contact.id);
    setError("");
    setNotice("");

    try {
      await deleteKontakDarurat(contact.id);
      setContacts((current) =>
        current.filter((item) => item.id !== contact.id)
      );
      setNotice("Kontak darurat berhasil dihapus.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal menghapus kontak darurat."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <Card className="space-y-5 p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-text-muted">
            Informasi kontak
          </p>
          <h2 className="mt-1 text-xl font-bold text-brand dark:text-text">
            Kontak darurat
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            Kelola maksimal 5 kontak yang dapat dihubungi
            jika diperlukan.
          </p>
        </div>

        <Button
          type="button"
          size="sm"
          variant="outline"
          className="gap-2"
          onClick={startAdd}
          disabled={
            authLoading ||
            !isMahasiswa ||
            loading ||
            formOpen ||
            contacts.length >= 5
          }
        >
          <Plus className="h-4 w-4" />
          Tambah kontak
        </Button>
      </div>

      <p className="text-xs text-text-muted">
        {contacts.length} dari 5 kontak tersimpan
      </p>

      {notice && (
        <p
          role="status"
          className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800"
        >
          {notice}
        </p>
      )}

      {error && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {!authLoading && !isMahasiswa && (
        <p className="text-sm text-text-muted">
          Masuk menggunakan akun mahasiswa untuk mengelola
          kontak darurat.
        </p>
      )}

      {loading && (
        <p className="text-sm text-text-muted">
          Memuat kontak darurat...
        </p>
      )}

      {!loading && isMahasiswa && contacts.length === 0 && (
        <p className="rounded-xl border border-dashed border-black/10 p-4 text-sm text-text-muted dark:border-white/10">
          Belum ada kontak darurat.
        </p>
      )}

      <div className="space-y-3">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-black/10 p-4 dark:border-white/10"
          >
            <div className="min-w-0">
              <p className="font-semibold text-text">
                {contact.nama_kontak}
              </p>
              <p className="text-sm text-text-muted">
                {contact.no_telepon}
              </p>
              <p className="text-xs text-text-muted">
                {contact.hubungan || "Hubungan tidak diisi"}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={saving || deletingId !== null}
                onClick={() => startEdit(contact)}
              >
                <Pencil className="h-4 w-4" />
              </Button>

              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={saving || deletingId !== null}
                onClick={() => void handleDelete(contact)}
              >
                <Trash2 className="h-4 w-4 text-danger" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {formOpen && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-black/10 p-4 dark:border-white/10"
        >
          <h3 className="font-semibold text-text">
            {editingId ? "Ubah kontak darurat" : "Tambah kontak darurat"}
          </h3>

          <div>
            <label
              htmlFor="nama-kontak"
              className="mb-1 block text-sm font-medium"
            >
              Nama kontak
            </label>
            <input
              id="nama-kontak"
              required
              maxLength={100}
              className={inputClass}
              value={form.nama_kontak}
              onChange={(e) =>
                setForm((current) => ({
                  ...current,
                  nama_kontak: e.target.value,
                }))
              }
            />
          </div>

          <div>
            <label
              htmlFor="nomor-kontak"
              className="mb-1 block text-sm font-medium"
            >
              Nomor telepon
            </label>
            <input
              id="nomor-kontak"
              required
              type="tel"
              className={inputClass}
              value={form.no_telepon}
              onChange={(e) =>
                setForm((current) => ({
                  ...current,
                  no_telepon: e.target.value,
                }))
              }
              placeholder="081234567890"
            />
          </div>

          <div>
            <label
              htmlFor="hubungan-kontak"
              className="mb-1 block text-sm font-medium"
            >
              Hubungan (opsional)
            </label>
            <input
              id="hubungan-kontak"
              className={inputClass}
              value={form.hubungan}
              onChange={(e) =>
                setForm((current) => ({
                  ...current,
                  hubungan: e.target.value,
                }))
              }
              placeholder="Contoh: Orang tua"
            />
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              disabled={saving}
              onClick={cancelForm}
            >
              <X className="mr-1 h-4 w-4" />
              Batal
            </Button>

            <Button
              type="submit"
              disabled={saving}
              className="gap-2"
            >
              <Check className="h-4 w-4" />
              {saving ? "Menyimpan..." : "Simpan kontak"}
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
}
