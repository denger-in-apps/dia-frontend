# Denger.in — Frontend

Denger.in adalah aplikasi web untuk layanan kesehatan mental dan pendampingan mahasiswa. Frontend menggunakan Next.js App Router, React, TypeScript, dan Tailwind CSS.

## Menjalankan secara lokal

Pastikan Node.js yang didukung Next.js dan pnpm tersedia. Versi package manager proyek adalah pnpm 12.14.0.

```bash
pnpm install
pnpm dev
```

Buka alamat yang muncul di terminal, biasanya [http://localhost:3000](http://localhost:3000). Rute `/` mengarahkan ke halaman `/masuk`.

### Konfigurasi backend

Buat `.env.local` di root proyek bila backend tidak memakai alamat default:

```env
NEXT_PUBLIC_API_URL=https://localhost/api/v1
NEXT_PUBLIC_WS_URL=http://localhost:3001
NEXT_PUBLIC_SOS_NEW_EVENT=sos:new
```

`NEXT_PUBLIC_API_URL` dan `NEXT_PUBLIC_WS_URL` adalah alamat publik yang dipakai browser. Nilai default API adalah `https://localhost/api/v1`; nilai default Socket.IO adalah `http://localhost:3001`. Sesuaikan dengan alamat backend yang sedang dijalankan. Restart `pnpm dev` setelah mengubah `.env.local`.

Frontend meminta endpoint sesi (`/auth/refresh` dan `/auth/me`) saat memuat status autentikasi. Jalankan backend pada alamat yang benar agar pemeriksaan sesi selesai.

## Login prototipe

- `/masuk` adalah halaman pilihan akun mahasiswa, psikolog, dan dosen admin. Tombol SOS Genta tersedia di halaman ini.
- `/sso/login` menampilkan formulir username dan password SSO. Untuk prototipe, nilai apa pun yang diisi akan membawa pengguna ke `/beranda`; nilai input tidak dikirim atau disimpan.
- Dalam mode development, formulir Psikolog di `/staf/masuk?role=PSIKOLOG` meminta username dan password, lalu menerima input apa pun dan membuka dashboard dengan sesi demo. Sesi demo disimpan sebagai penanda sementara di `sessionStorage`, tanpa menyimpan username atau password.
- Login dosen admin di `/staf/masuk` memakai API backend `/auth/staff/login`. Login psikolog juga memakai API tersebut saat build production.
- Prototipe login mahasiswa belum menjalankan autentikasi SSO sungguhan atau membuat sesi backend.

## Rute utama

| Rute | Fungsi |
|---|---|
| `/masuk` | Pilihan jenis akun |
| `/sso/login` | Formulir login mahasiswa simulasi |
| `/staf/masuk` | Login psikolog atau dosen admin |
| `/beranda` | Beranda mahasiswa |
| `/cek-mandiri` | Kuesioner refleksi suasana hati |
| `/curhat` | Curhat anonim |
| `/circle` | Daftar Circle komunitas |
| `/konseling` | Daftar dan pemesanan sesi konseling |
| `/sumber-daya` | Direktori bantuan |
| `/akun` | Profil dan privasi mahasiswa |
| `/genta/status` | Status sinyal Genta |
| `/psikolog` | Dashboard psikolog |
| `/psikolog/sos` | Antrean sinyal darurat |
| `/admin` | Dashboard dosen admin |
| `/offline` | Informasi bantuan saat offline |

Navbar mahasiswa menghubungkan halaman utama, Cek Mandiri, Curhat, Circle, Konseling, Direktori Bantuan, dan Akun. Sidebar psikolog dan admin menyediakan navigasi sesuai peran.

## Dashboard psikolog

Dashboard `/psikolog` menampilkan sapaan pengguna, status koneksi SOS real-time, ringkasan kasus baru, dan tautan cepat ke antrean SOS, jadwal sesi, Curhat Anonim, serta Circle. Angka sesi, utas, dan Circle masih berupa data contoh; indikator kasus baru dihitung dari event SOS yang diterima selama aplikasi berjalan.

## Status fitur

### Genta SOS

Tombol Genta tersedia pada halaman mahasiswa, `/masuk`, dan `/sso/login`. Tombol membuka lembar konfirmasi yang berisi pilihan situasi, catatan opsional, persetujuan berbagi lokasi, serta tautan hotline 119 Ext. 8 dan Healing119.id. Jika izin lokasi ditolak atau permintaan lokasi timeout, alur tetap dapat mengirim tanpa koordinat.

Pengiriman SOS dan halaman status masih berupa simulasi frontend. Belum ada permintaan ke backend untuk membuat kasus. Jawaban verifikasi niat di halaman status dan pembatalan juga belum disimpan ke backend.

### Notifikasi SOS real-time

Layout psikolog menyambung ke namespace Socket.IO `/sos`. Event default adalah `sos:new` dan bisa diganti melalui `NEXT_PUBLIC_SOS_NEW_EVENT`. Payload perlu memuat `id` atau `sosId`, dan dapat berisi kategori, waktu, catatan, eskalasi, status, serta lokasi. Toast kasus baru, hitungan antrean, dan status koneksi membutuhkan backend yang mengirim event sesuai kontrak tersebut.

### Akun mahasiswa

Halaman `/akun` memakai API backend untuk mengambil dan mengubah profil, mengelola kontak darurat, mengekspor data, dan meminta penghapusan akun. Fitur tersebut memerlukan backend yang aktif dan mendukung endpoint terkait.

### Halaman lainnya

Beberapa halaman mahasiswa, psikolog, dan admin masih memakai data contoh atau state lokal. Periksa status API sebelum menganggap perubahan pada halaman contoh sudah tersimpan di server.

## Perintah proyek

```bash
pnpm dev          # Jalankan server pengembangan
pnpm build        # Buat build produksi
pnpm start        # Jalankan build produksi
pnpm lint         # Jalankan ESLint
pnpm test         # Jalankan tes Vitest
pnpm test:e2e     # Jalankan tes Playwright
pnpm api:generate # Buat tipe TypeScript dari OpenAPI lokal
```

Perintah `pnpm api:generate` mengambil skema dari `http://localhost:3001/api/docs-json` dan menulis hasilnya ke `src/lib/api/schema.d.ts`.

## Struktur kode

```text
src/
├── app/          # Rute Next.js untuk mahasiswa, psikolog, admin, dan publik
├── components/   # Komponen UI, navigasi, autentikasi, dan Genta
├── contexts/     # State sesi pengguna
└── lib/          # Klien API, autentikasi, socket, dan utilitas
```
