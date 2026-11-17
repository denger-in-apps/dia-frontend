"use client";

import { useEffect, useState } from "react";

export type SumberDayaItem = {
  id: string;
  nama: string;
  kategori: string;
  deskripsi: string;
  telepon?: string;
  tautan?: string;
};

const STORAGE_KEY = "dengerin_sumber_daya_demo_v1";

export const initialSumberDaya: SumberDayaItem[] = [
  { id: "1", nama: "Hotline Krisis Kemenkes RI (119 Ext. 8)", kategori: "Krisis Darurat", deskripsi: "Layanan dukungan psikologis awal melalui Healing119.id. Jika berada dalam bahaya langsung, hubungi layanan darurat setempat.", telepon: "119,8", tautan: "https://healing119.id" },
  { id: "2", nama: "Pusat Bantuan Konseling Mahasiswa Kampus", kategori: "Layanan Kampus", deskripsi: "Kantor Bimbingan Konseling dan Pendampingan Psikologis Mahasiswa.", telepon: "081234567890" },
  { id: "3", nama: "Yayasan Pulih", kategori: "Eksternal / LSM", deskripsi: "Layanan dukungan dan pemulihan psikososial.", telepon: "02178842580", tautan: "https://yayasanpulih.org" },
  { id: "4", nama: "Panduan Pertolongan Pertama Emosional", kategori: "Edukasi & Mandiri", deskripsi: "Materi latihan pernapasan dan grounding untuk membantu menenangkan diri.", tautan: "https://healing119.id" },
];

export function useSumberDaya() {
  const [items, setItems] = useState<SumberDayaItem[]>(initialSumberDaya);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) setItems(parsed as SumberDayaItem[]);
      }
    } catch {
      // Gunakan data contoh jika penyimpanan browser tidak tersedia atau rusak.
    }
    setIsReady(true);

    function syncFromAnotherTab(event: StorageEvent) {
      if (event.key !== STORAGE_KEY || !event.newValue) return;
      try {
        const parsed: unknown = JSON.parse(event.newValue);
        if (Array.isArray(parsed)) setItems(parsed as SumberDayaItem[]);
      } catch {
        // Abaikan nilai penyimpanan yang tidak valid.
      }
    }
    window.addEventListener("storage", syncFromAnotherTab);
    return () => window.removeEventListener("storage", syncFromAnotherTab);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Perubahan tetap dapat digunakan selama halaman aktif.
    }
  }, [items, isReady]);

  return { items, setItems, isReady };
}
