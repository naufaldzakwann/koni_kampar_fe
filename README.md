# KONI Kampar Frontend

Frontend React dan TypeScript berdasarkan [desain Figma SKRIPSI](https://www.figma.com/design/oimXwIsh0xACU1gL9ODUAo/SKRIPSI?node-id=121-47782). Tampilan mempertahankan warna merah, font Plus Jakarta Sans, dan aset asli; pembaruan berfokus pada hierarki teks, navigasi, kartu konten, serta layout mobile.

## Menjalankan

Gunakan Node.js 22.12+ atau versi yang kompatibel dengan Vite 8.

```bash
npm install
npm run dev
```

Buka `http://127.0.0.1:5173`. Dependensi sudah terpasang di workspace ini.

```bash
npm run build
npm run preview
```

Build menghasilkan file statis di `dist/`. Untuk hosting, arahkan semua URL halaman ke `index.html` agar React Router dapat menangani deep link.

## Halaman dan perilaku

Portal memiliki beranda, profil KONI, berita dan detailnya, event dan detailnya, daftar cabor, detail cabor, galeri, prestasi, anggota, struktur organisasi, fasilitas, kontak, serta kebijakan privasi. Navigasi juga menyediakan pencarian halaman.

Masuk melalui `/login` untuk mencoba area `/admin`. Data pengelolaan admin tersimpan di browser; gunakan data contoh saat mencoba tambah, edit, pencarian, dan hapus.

**Ini prototipe frontend.** Login demo tidak mengautentikasi pengguna melalui server. Konten, angka, nama pengurus, tanggal, dan informasi kontak berasal dari contoh desain atau data demonstrasi, sehingga perlu verifikasi sebelum publikasi. Formulir kontak tidak mengirim email atau pesan ke pihak lain.

## Struktur sumber

- `src/App.tsx`: routing, navigasi, pencarian, footer, dan beranda.
- `src/styles.css`: token desain, layout portal, dan breakpoint responsif.
- `src/pages/PortalPages.tsx` dan `portal.css`: halaman informasi serta interaksi publik.
- `src/pages/Admin.tsx` dan `admin.css`: login demo, dashboard, dan pengelolaan data lokal.
- `public/images/`: aset yang diunduh dari desain Figma.

Hubungkan data ke API dan tambahkan autentikasi serta otorisasi pada backend sebelum memakai admin untuk data sungguhan. Konfigurasi deployment tidak menyertakan kredensial atau layanan eksternal.

Konten publik dan data admin demo masih memakai sumber data terpisah. Tab Video menyediakan tampilan kosong sampai sumber video tersedia.

## Verifikasi

Build produksi dan pemeriksaan TypeScript lulus. Pemeriksaan browser mencakup rute publik serta admin pada desktop dan mobile 375px, pencarian situs, filter berita, galeri dan navigasi foto, draf kontak, serta tambah/edit/hapus data admin dan persistensi setelah refresh.

Pratinjau tersimpan di `docs/`: beranda desktop/mobile dan dashboard admin.
