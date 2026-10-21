# 03 — Frontend (Next.js + Tailwind, PWA)

> **Lingkup Jira:** SET-02 (SCRUM-167 → 203, 204) · subtask `[FE]` dan `[FE][BE]` (bagian FE) PBI-01 s.d. PBI-20 · IT-06 (SCRUM-282) · IT-08
> **Requirement PRD:** KT-03, KT-04 · FR-MHS/PSI/ADM · NFR-01, NFR-05, NFR-06, NFR-09
> **Pemilik (Jira):** Muhammadjosfi507 (mayoritas FE), Muhammad Zacky (SCRUM-203, 241, 247, 250, dan `[FE][BE]` Sprint 2)
> **Acuan visual:** Mockup Beranda (Gambar 4.5 proposal) — persona *Dhea*, introvert, butuh akses bantuan tanpa tekanan

---

## 1. Stack

| Kebutuhan | Pilihan | Alasan |
|-----------|---------|--------|
| Framework | **Next.js (App Router)** + React + TypeScript strict | KT-03 |
| Styling | **Tailwind CSS** + CSS variables untuk tema | Mode gelap (NFR-06) lewat token |
| Komponen aksesibel | **Radix UI primitives** (atau shadcn/ui yang dibangun di atasnya) | Fokus, ARIA, keyboard sudah benar (WCAG AA) |
| Data fetching | **TanStack Query** | Cache, retry, invalidasi |
| Form | React Hook Form + **zod** (skema dibagi dengan backend lewat `packages/shared`) | |
| Realtime | `socket.io-client` | KT-04, FR-PSI-03 |
| Tema gelap/terang | `next-themes` | |
| PWA | **Serwist** (penerus `next-pwa`) atau service worker manual + `manifest.webmanifest` | KT-03 "dapat dipasang di layar utama" |
| Klien API | Tipe dari OpenAPI backend (`openapi-typescript` + `openapi-fetch`) | Kontrak FE–BE tunggal |
| Crypto E2EE | WebCrypto API atau `libsodium-wrappers` | Chat konseling (NFR-02) |
| Peta (dashboard psikolog) | Leaflet + OpenStreetMap (atau Maps API pilihan tim) | Tampilan lokasi SOS |
| Uji | Vitest + Testing Library, **Playwright** (e2e, desktop & mobile viewport), `axe-core` (aksesibilitas), Lighthouse CI | |

---

## 2. Inisialisasi (SCRUM-203)

```bash
cd apps/web
pnpm add @tanstack/react-query react-hook-form @hookform/resolvers zod \
  socket.io-client next-themes openapi-fetch clsx tailwind-merge lucide-react \
  @radix-ui/react-dialog @radix-ui/react-tabs @radix-ui/react-toast
pnpm add -D openapi-typescript vitest @testing-library/react @testing-library/user-event \
  @playwright/test @axe-core/playwright @serwist/next serwist
```

`next.config.ts` (poin penting):

```ts
const nextConfig = {
  output: 'standalone',                 // untuk Docker (lihat 01-infrastructure.md)
  poweredByHeader: false,
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'Content-Security-Policy', value: csp },   // lihat §9
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'geolocation=(self), microphone=(self), camera=()' },
      ],
    }];
  },
};
```

Generate tipe API (jalankan saat OpenAPI berubah):

```bash
pnpm openapi-typescript http://localhost:3001/api/docs-json -o src/lib/api/schema.d.ts
```

---

## 3. Struktur Folder & Peta Halaman

```
apps/web/src/
├─ app/
│  ├─ (publik)/
│  │  ├─ masuk/page.tsx                  # PBI-01 — tombol "Masuk dengan SSO Kampus"
│  │  ├─ staf/masuk/page.tsx             # login psikolog/dosen admin
│  │  └─ offline/page.tsx                # fallback PWA + nomor hotline
│  ├─ (mahasiswa)/                       # layout: navbar + FAB Genta
│  │  ├─ page.tsx                        # Beranda (mockup)
│  │  ├─ konseling/                      # PBI-10,12,13: daftar, pesan sesi, detail, ubah/batal
│  │  │  ├─ pesan/page.tsx
│  │  │  └─ [id]/ (page.tsx, ruang/page.tsx)
│  │  ├─ cek-mandiri/                    # PBI-15
│  │  ├─ curhat/                         # PBI-16
│  │  ├─ circle/                         # PBI-17,18: telusuri, [id], ajukan
│  │  ├─ sumber-daya/                    # PBI-19
│  │  ├─ genta/status/page.tsx           # status SOS aktif (PBI-05..07)
│  │  └─ akun/                           # PBI-03: profil, kontak darurat, data saya
│  ├─ (psikolog)/psikolog/               # layout: sidebar + banner koneksi realtime
│  │  ├─ sos/                            # PBI-08: dashboard prioritas + detail
│  │  ├─ sesi/                           # PBI-11,13: jadwal, ringkasan, riwayat
│  │  ├─ curhat/                         # PBI-16
│  │  ├─ circle/                         # PBI-18: dampingi & moderasi
│  │  └─ sumber-daya/                    # read-only
│  └─ (admin)/admin/
│     ├─ psikolog/ jadwal-jaga/          # PBI-09 (FR-ADM-02)
│     ├─ konfigurasi-sos/                # PBI-09 (FR-ADM-05)
│     ├─ circle/                         # PBI-17 (FR-ADM-07: persetujuan)
│     ├─ sumber-daya/                    # PBI-19 (FR-ADM-03)
│     ├─ master-data/                    # PBI-20 (kategori minat, template kuesioner)
│     ├─ laporan/                        # PBI-20 (FR-ADM-04)
│     └─ audit-log/                      # PBI-21
├─ components/
│  ├─ ui/                                # Button, Card, Dialog, Toast, Tabs, Badge, Skeleton…
│  ├─ genta/                             # GentaFab, GentaConfirmSheet, SosStatusCard, SosAlertToast
│  └─ layout/ …
├─ features/                             # logika per domain (hooks, query keys, form schema)
├─ lib/ (api/, auth/, socket/, crypto/, a11y/)
├─ middleware.ts                         # gate per peran
└─ sw.ts                                 # service worker (Serwist)
```

**Gate akses** (`middleware.ts`): baca peran dari cookie sesi (verifikasi ringan; otorisasi sebenarnya di backend). Route group `(mahasiswa)`, `/psikolog/*`, `/admin/*` dialihkan ke login jika tidak sesuai peran. Jangan menyimpan token di `localStorage`.

---

## 4. Genta di Frontend (paling kritis) — SCRUM-204, 222, 225, 228

| Persyaratan | Implementasi |
|-------------|--------------|
| FR-MHS-03: tampil di seluruh halaman, **maks 2 ketukan** | `GentaFab` dipasang di layout `(mahasiswa)` (mengambang kanan-bawah, merah — sesuai mockup). Ketukan 1: buka `GentaConfirmSheet`. Ketukan 2: **"Kirim sinyal"** |
| Konfirmasi singkat situasi | Sheet berisi 2–3 pilihan cepat + opsional teks; **tombol kirim sudah aktif tanpa harus memilih** agar tetap 2 ketukan |
| FR-MHS-04: izin lokasi | Toggle "Bagikan lokasiku" di dalam sheet; minta `navigator.geolocation` **hanya** bila dicentang; bila ditolak/timeout (≤ 5 dtk) → kirim SOS **tanpa lokasi**, jangan menahan pengiriman |
| NFR-01 semua perangkat | FAB ≥ 56 px, area sentuh aman dari bar sistem (`env(safe-area-inset-bottom)`) |
| Setelah terkirim | Halaman/kartu status: "Sinyal terkirim", status kasus real-time (BARU → DIAMBIL → …), **selalu tampilkan hotline 119 ext. 8 dengan tombol `tel:`** + info Healing119.id |
| Jaringan buruk | Jangan antre SOS di *service worker* seolah berhasil. Bila gagal kirim: tampilkan error jelas + tombol telepon hotline + coba lagi otomatis |
| Aksesibilitas | `aria-label="Tombol darurat Genta"`, fokus dapat dijangkau keyboard, kontras tinggi, bukan sekadar warna merah (ikon + teks "SOS") |

Kontrak API: `POST /genta/sos` — lihat 02-backend.md §8.2 dan `06-genta-sos-realtime.md`.

### Sisi Psikolog (PBI-07, 08)

- `useSosSocket()` menyambung ke namespace `/sos` memakai cookie sesi; reconnect otomatis; **banner "Realtime terputus"** yang jelas bila koneksi hilang (psikolog tidak boleh mengira antrean kosong).
- Kasus baru → *toast* + bunyi/getar (opsional, dengan izin) + `aria-live="assertive"`.
- Dashboard: tabel diurutkan prioritas lalu waktu; tombol **Ambil kasus** (tangani respons 409 "sudah diambil psikolog lain" dengan pesan ramah dan segarkan daftar); menampilkan hitung mundur eskalasi per kasus.
- Lokasi (bila ada) ditampilkan di peta + tautan buka di aplikasi peta; teks "lokasi tidak dibagikan" bila tidak ada.
- Notifikasi saat tab tertutup: rekomendasikan **Web Push** (VAPID) pada PWA psikolog. Tanpa ini, psikolog yang tidak membuka dashboard tidak akan melihat SOS sampai eskalasi SMS. Ini risiko operasional yang perlu diputuskan PO.

---

## 5. PWA (SCRUM-204)

`public/manifest.webmanifest` (minimum): `name: "Denger.in"`, `short_name`, `start_url: "/"`, `display: "standalone"`, `theme_color`, `background_color`, ikon 192/512 + *maskable*.

Aturan cache service worker (**penting untuk privasi**):

| Jenis | Strategi |
|-------|----------|
| Aset statis (`/_next/static/*`, ikon, font) | Cache-first |
| Halaman publik (`/masuk`, `/offline`) | Stale-while-revalidate |
| **Semua** `/api/*`, `/socket.io/*`, halaman terautentikasi | **Network-only — jangan di-cache** (data kesehatan mental) |
| Navigasi saat offline | Tampilkan `/offline` berisi hotline & direktori kontak statis |

Tambahan: prompt "Pasang ke layar utama" (tangkap `beforeinstallprompt`) di Beranda; bersihkan cache saat logout.

---

## 6. Design Tokens (dari Mockup)

Mockup memakai latar hijau-limau, kartu ungu tua, mint, lavender, krem, dan merah untuk SOS; judul hero memakai serif berkarakter dengan kata kunci bergaya italic. Nilai di bawah **perkiraan** dari gambar — ganti dengan nilai dari berkas desain asli.

```css
/* app/globals.css */
:root {
  --bg: #fbf3e8;            /* krem */
  --surface: #ffffff;
  --text: #1c1840;
  --text-muted: #5b5778;
  --brand: #2a1f5e;         /* ungu tua (kartu psikolog/CTA) */
  --accent-lime: #d9f26b;   /* limau (Cek Mandiri/latar promosi) */
  --accent-mint: #bfeadb;   /* mint (Booking Konseling) */
  --accent-lavender: #e1d3f7; /* lavender (Circle) */
  --danger: #d92b2b;        /* HANYA untuk SOS/Genta & error kritis */
  --focus: #5b3df5;
  --radius: 20px;
}
:root[data-theme='dark'] {
  --bg: #12102a;  --surface: #1c1840;  --text: #f4f1ff;  --text-muted: #b7b1d6;
  --brand: #8f7bff; --focus: #b6a8ff;
}
```

```ts
// tailwind.config.ts → extend.colors: mapkan ke var(--...)
colors: { bg: 'var(--bg)', surface: 'var(--surface)', brand: 'var(--brand)', danger: 'var(--danger)', ... }
```

Prinsip tampilan (dari narasi mockup): hero "Di sini, kamu didengar sebelum semuanya terasa berat"; **pilihan bertahap** (Cek Mandiri → Curhat Anonim → Circle → Konseling) supaya mahasiswa tidak dipaksa langsung bertatap muka; merah dicadangkan eksklusif untuk SOS.

**Copywriting:** bahasa Indonesia santai-hangat, tidak menghakimi; hindari istilah diagnosis ("kamu depresi"). Hasil Cek Mandiri selalu disertai kalimat "Ini bukan diagnosis".

---

## 7. Fitur per Halaman (ringkas, selaras Jira)

| Halaman | PBI / Jira FE | Hal yang wajib ada |
|---------|---------------|--------------------|
| Masuk SSO | PBI-01 / SCRUM-207 | Tombol SSO; pesan `?error=sso_gangguan` → "Layanan SSO sedang gangguan"; kredensial salah ditangani IdP; pasca-login → landing page |
| Akun | PBI-03 / SCRUM-212 | Lihat/ubah profil, kelola kontak darurat, riwayat Cek Mandiri, **ekspor** & **hapus data** dengan konfirmasi ganda |
| Genta | PBI-05/06/07 | Bagian §4 |
| Dashboard SOS | PBI-08 / SCRUM-231 | Bagian §4 |
| Booking | PBI-10 / SCRUM-241 | Pilih psikolog → tanggal → slot → tipe (chat/suara/tatap muka) → form keluhan awal → konfirmasi; tampilkan **alternatif jadwal** saat 409 |
| Ubah/batal | PBI-12 / SCRUM-247 | Dialog konfirmasi; validasi ulang jadwal baru; status "Dibatalkan" |
| Ruang sesi | PBI-11 / SCRUM-245 | Chat E2EE; voice via WebRTC; indikator "terenkripsi end-to-end"; tombol akhiri sesi |
| Jadwal psikolog | PBI-11 / SCRUM-244 | Kalender/daftar sesi, ubah status pelaksanaan |
| Ringkasan & riwayat | PBI-13 / SCRUM-250 | Tampilan **minta consent** ke mahasiswa; form ringkasan psikolog **terkunci** sebelum consent; riwayat hanya mahasiswa yang ditangani |
| Cek Mandiri | PBI-15 / SCRUM-257 | Wizard PHQ-9 lalu GAD-7, progres, simpan sementara di state (bukan localStorage), hasil + rekomendasi + banner bantuan segera bila `jalur_bantuan_segera` |
| Curhat anonim | PBI-16 / SCRUM-260, 261 | Penjelasan anonimitas yang jujur; utas dengan balasan psikolog; sisi psikolog: daftar `Anonim-XXXX` |
| Circle | PBI-17/18 / SCRUM-263, 264, 267 | Telusuri per minat, kartu (anggota/kuota), tombol gabung (state "Penuh"), ajukan Circle baru, rekomendasi, ruang interaksi anonim; moderasi psikolog; persetujuan admin |
| Direktori | PBI-19 / SCRUM-269 | Daftar + filter kategori + detail; tombol `tel:`; tersedia **juga saat offline** (data statis di-cache di halaman publik/offline bila disetujui — tanpa data pengguna) |
| Admin | PBI-09/17/19/20/21 | Tabel dengan paginasi, form validasi zod, konfirmasi aksi destruktif |

---

## 8. Aksesibilitas (NFR-06) & Kinerja (NFR-05)

**Aksesibilitas — dikerjakan sejak awal, bukan hanya di SCRUM-282:**

- Kontras minimal WCAG AA (4.5:1 teks normal, 3:1 teks besar & komponen UI) di **kedua tema**; periksa token di §6.
- Seluruh interaksi bisa dengan keyboard; fokus terlihat (`outline` memakai `--focus`); urutan tab logis; *skip link* "Lewati ke konten".
- Label formulir terhubung ke input; pesan error dibacakan (`aria-live`/`aria-describedby`).
- Pembaca layar: landmark (`header/nav/main`), judul berjenjang, `aria-live` untuk status SOS & hasil Cek Mandiri.
- Mode gelap: ikuti preferensi sistem + toggle manual (`next-themes`), tanpa *flash* tema saat muat.
- Hormati `prefers-reduced-motion`.
- Otomatisasi: `@axe-core/playwright` pada setiap halaman utama di CI; audit manual dengan pembaca layar sebelum rilis.

**Kinerja (halaman utama < 2 dtk pada 4G):**

- Server Components untuk halaman statis/semi-statis; `"use client"` hanya untuk bagian interaktif.
- `next/font` dengan subset; hindari font berat; gambar lewat `next/image`.
- *Code-splitting* modul berat (Leaflet, libsodium) dengan `dynamic()` — hanya dimuat di halaman yang butuh.
- Anggaran: JS awal halaman beranda ≤ ~170 KB gzip (usulan); Lighthouse CI gagalkan PR bila Performance < 85 / Accessibility < 95 pada profil mobile.
- Uji pada throttling "Slow 4G" + CPU 4× di Playwright/Lighthouse.

---

## 9. Keamanan Frontend

- Token **hanya di cookie httpOnly**; `credentials: 'include'`; kirim token CSRF pada mutasi.
- **CSP** ketat: `default-src 'self'`; `connect-src 'self' <API> <WS> <peta>`; `img-src 'self' data: <tile peta>`; tanpa `unsafe-eval`; gunakan nonce untuk skrip inline.
- Jangan `dangerouslySetInnerHTML` untuk konten pengguna (curhat, pesan Circle) — render sebagai teks.
- Jangan simpan jawaban Cek Mandiri, curhat, atau lokasi di `localStorage`/`sessionStorage`/cache PWA.
- E2EE chat: pasangan kunci dibuat di perangkat; kunci privat disimpan terenkripsi di IndexedDB (non-extractable `CryptoKey` bila memungkinkan); sampaikan ke pengguna bahwa kehilangan perangkat = kehilangan akses ke riwayat chat lama (atau sediakan mekanisme cadangan yang disetujui). Detail protokol perlu *design review* oleh Rayindarari.
- Logout: bersihkan state, cache TanStack Query, dan cache service worker.

---

## 10. Pengujian Frontend

| Jenis | Isi minimum |
|-------|-------------|
| Unit/komponen (Vitest) | `GentaFab` (≤ 2 ketukan, kirim tanpa lokasi saat izin ditolak), wizard Cek Mandiri, form booking (validasi), state kuota Circle |
| E2E (Playwright, viewport desktop + 390×844) | Login SSO (Keycloak mock) → Genta → status; booking → ubah → batal; Cek Mandiri → hasil; gabung Circle penuh |
| Aksesibilitas | `axe` pada tiap rute utama, kedua tema |
| Kinerja | Lighthouse CI profil mobile |
| Realtime | Dua konteks browser: mahasiswa menekan SOS → psikolog menerima < 5 dtk |

---

## 11. Definition of Done (Frontend)

- [ ] Responsif 360 px → desktop; diuji di Chrome & Safari mobile.
- [ ] Genta terlihat & bisa dioperasikan ≤ 2 ketukan di setiap halaman mahasiswa.
- [ ] Lolos `axe` (0 pelanggaran serius), kontras AA di kedua tema.
- [ ] State loading, kosong, dan error untuk setiap daftar/form.
- [ ] Tidak ada data sensitif di storage/cache klien.
- [ ] Tipe API dari OpenAPI terbaru; tidak ada `any` pada respons API.
- [ ] E2E halaman terkait lulus di CI.
