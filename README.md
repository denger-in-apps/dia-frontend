# Denger.in — Frontend

Frontend aplikasi Denger.in untuk mendukung layanan kesehatan mental dan pendampingan mahasiswa. Aplikasi dibangun dengan Next.js App Router, React, TypeScript, dan Tailwind CSS.

## Menjalankan aplikasi

Pastikan Node.js dan pnpm sudah tersedia, lalu jalankan:

```bash
pnpm install
pnpm dev
```

Buka alamat yang ditampilkan oleh Next.js di terminal. URL backend dapat diatur melalui `NEXT_PUBLIC_API_URL`; jika tidak diatur, klien API menggunakan `http://localhost:3001`.

## Perubahan terbaru

### Tombol SOS Genta

Tombol **SOS Darurat** tampil mengambang di area kanan bawah halaman mahasiswa. Saat ditekan, tombol membuka konfirmasi **Sinyal Darurat Genta** dengan pilihan kategori situasi, catatan opsional, dan opsi berbagi lokasi. Konfirmasi dapat ditutup dengan tombol tutup atau tombol Escape.

Berbagi lokasi tidak aktif secara default. Jika mahasiswa mencentang opsi lokasi lalu menekan **Kirim Sinyal Bantuan Sekarang**, aplikasi meminta lokasi perangkat dengan batas waktu 5 detik dan menyertakan koordinat serta akurasi pada payload. Jika opsi tidak dicentang, izin ditolak, lokasi tidak tersedia, atau permintaan timeout, pengiriman tetap dilanjutkan tanpa lokasi. Konfirmasi juga menampilkan hotline 119 Ext. 8 dan Healing119.id.

**Status implementasi:** komponen pengiriman SOS saat ini masih berupa simulasi frontend; belum memanggil backend. Halaman status menerima ID simulasi. Opsi lokasi berupa checkbox pada konfirmasi yang sama, belum berupa layar persetujuan khusus yang muncul segera setelah tombol SOS ditekan.

### Halaman akun dan privasi mahasiswa

Halaman `/akun` diperbarui agar mahasiswa dapat melihat informasi profil dalam satu tampilan, membuka mode ubah untuk nama dan kontak darurat, serta melihat bahwa NIM bersifat hanya-baca. Halaman juga menyediakan bagian salinan data dan opsi penghapusan dengan dialog informasi.

**Status implementasi:** antarmuka prototipe. Belum ada integrasi backend untuk memuat atau menyimpan profil, mengekspor data, maupun menghapus data. Perubahan yang diketik hanya tersimpan sementara di state halaman dan tidak dikirim ke server. Dialog penghapusan secara eksplisit menyatakan bahwa tidak ada data yang dihapus.

## Catatan fitur

- Autentikasi pada tampilan masuk masih berupa prototipe.
- Beberapa halaman mahasiswa dan staf masih menggunakan data contoh.
- Kontrak API frontend didefinisikan di `src/lib/api/schema.d.ts` dan kliennya di `src/lib/api/client.ts`.
