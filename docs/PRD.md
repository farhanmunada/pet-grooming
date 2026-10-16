# Product Requirements Document (PRD): PetKasih — Sistem Manajemen Pet Grooming & Pet Shop

> **Versi:** 1.0
> **Tanggal:** 16 Oktober 2026
> **Tech Stack:** Nuxt 4, Nuxt UI v4, Drizzle ORM, SQLite, nuxt-auth-utils, Zod, Tailwind CSS v4, TypeScript
> **Deployment:** Single-tenant (satu toko), web-based

---

## 1. Problem Statement

### Latar Belakang

Mayoritas pet grooming salon dan pet shop kecil-menengah di Indonesia masih mengelola operasional secara manual: buku catatan fisik untuk jadwal grooming, spreadsheet untuk inventori, dan WhatsApp chat untuk komunikasi pelanggan. Software yang tersedia di pasar (PetExec, Gingr, MoeGo, Pawfinity) memiliki masalah signifikan:

1. **UI terlalu kompleks** — workflow sederhana seperti booking membutuhkan terlalu banyak langkah (pain point #1 dari 1000+ review pengguna).
2. **Informasi pet tersebar** — data penting (vaksinasi, riwayat grooming, alergi) tidak terlihat dalam satu layar.
3. **Laporan keuangan tidak akurat** — beberapa platform (Gingr) secara spesifik dikritik karena accounting reports tidak match dengan realita transaksi.
4. **Vendor lock-in** — dipaksa pakai payment processor tertentu, tidak bisa export data pelanggan.
5. **Tidak kontekstual Indonesia** — tidak ada dukungan jadwal vaksinasi lokal, format Rupiah, WhatsApp sebagai channel komunikasi utama, atau regulasi obat hewan Indonesia.

### Siapa yang Terdampak

| Stakeholder | Dampak Jika Tidak Diselesaikan |
|-------------|-------------------------------|
| **Pemilik toko** | Kehilangan pendapatan akibat appointment terlewat, stok expired tidak terdeteksi, laporan keuangan tidak akurat untuk pelaporan pajak |
| **Staff groomer** | Tidak punya akses riwayat grooming sebelumnya → harus tanya ulang setiap kunjungan, risiko kecelakaan karena tidak tahu temperamen pet |
| **Pemilik hewan** | Vaksinasi terlewat (terutama Rabies yang wajib), tidak ada transparansi riwayat perawatan pet mereka |

---

## 2. Target Goals & Non-Goals

### Goals (In-Scope) — MVP Fase 1

| # | Goal | Metrik Keberhasilan |
|---|------|-------------------|
| G1 | **Owner & Pet Management** — profil lengkap dengan relasi one-to-many, auto-calculate usia, single-page view | Semua data pet visible dalam 1 halaman, usia otomatis dari DOB |
| G2 | **Service Catalog** — daftar layanan grooming dengan pricing berdasarkan breed/size category | ≥ 4 size category (Small/Medium/Large/Giant) dengan harga berbeda per layanan |
| G3 | **Appointment Scheduling** — calendar view (daily/weekly), status tracking (Requested → Confirmed → InProgress → Completed/Cancelled/NoShow) | Booking baru ≤ 3 klik dari dashboard |
| G4 | **Grooming Notes** — catatan per kunjungan (blade size, shampoo, perilaku, kondisi kulit, foto before/after) | Catatan tersimpan dan visible di profil pet |
| G5 | **Vaccination Tracking** — pencatatan vaksinasi dengan expiry alerts, visual indicator (hijau/kuning/merah), jadwal vaksinasi Indonesia | Reminder otomatis 30/14/7/1 hari sebelum expired |
| G6 | **Basic POS** — pencatatan transaksi (service + produk), multiple payment method (cash, transfer, e-wallet), cetak/export struk | Laporan pendapatan harian akurat 100% match dengan transaksi |
| G7 | **Product Inventory** — stock tracking real-time, reorder alert saat stok ≤ reorder level, expiry date tracking, flag produk obat hewan | Alert muncul saat stok ≤ reorder level |
| G8 | **Notifications** — WhatsApp-ready reminder (generate link wa.me dengan pesan pre-filled), vaccination expiry alerts | Link WhatsApp tersedia untuk setiap reminder |
| G9 | **Basic Reporting** — laporan pendapatan harian/mingguan/bulanan, jumlah appointment, produk terlaris, stok menipis | Export CSV/JSON tersedia |
| G10 | **Data Export** — export data pelanggan, pet, transaksi dalam format CSV/JSON | Export selesai < 5 detik untuk ≤ 10.000 records |

### Non-Goals (Out-of-Scope)

| # | Non-Goal | Alasan |
|---|----------|--------|
| NG1 | **Online payment gateway integration** (Midtrans, Xendit, Stripe) | Pencatatan manual (cash/transfer/e-wallet) sudah cukup untuk single-tenant. Tambah di fase 2 jika diperlukan. |
| NG2 | **Online booking portal untuk customer** | MVP fokus pada staff-facing. Customer booking via WhatsApp, staff input ke sistem. |
| NG3 | **Multi-tenant / multi-cabang** | Arsitektur single-tenant, satu database SQLite per toko. |
| NG4 | **Loyalty/membership program** | Kompleksitas tinggi untuk MVP. Field `loyalty_points` di entity Owner sudah disiapkan untuk fase 2. |
| NG5 | **Commission & payroll tracking** | Field `commission_rate` di entity Groomer sudah disiapkan, tapi kalkulasi dan laporan komisi di fase 2. |
| NG6 | **E-commerce sync** (Shopify, Tokopedia) | Out of scope. |
| NG7 | **Automated WhatsApp sending** (WhatsApp Business API) | MVP hanya generate link `wa.me`. Integrasi API di fase 2. |
| NG8 | **Barcode scanning via kamera** | Input SKU/barcode manual. Hardware scanner support di fase 2. |
| NG9 | **Mobile native app** | Web responsive sudah cukup. PWA bisa ditambah nanti. |

---

## 3. User Stories & Kriteria Penerimaan

### 3.1 Modul: Owners & Pets

#### US-1.1: Registrasi Owner Baru

**Sebagai** staff, **saya ingin** mendaftarkan pemilik hewan baru ke sistem, **agar** data kontak tersimpan untuk komunikasi dan transaksi.

**Kriteria Penerimaan:**

```
GIVEN staff berada di halaman Owners
WHEN staff klik tombol "Tambah Owner" dan mengisi form (nama*, telepon*, email, alamat, preferensi komunikasi, catatan)
THEN owner baru tersimpan di database
AND owner muncul di daftar owners
AND field telepon wajib diisi (validasi format Indonesia: 08xx atau +62xx)
```

```
GIVEN staff mengisi form owner baru
WHEN field telepon sudah ada di database (duplikat)
THEN sistem menampilkan warning "Nomor telepon sudah terdaftar atas nama [X]"
AND staff bisa memilih untuk tetap simpan atau batal
```

#### US-1.2: Registrasi Pet Baru

**Sebagai** staff, **saya ingin** mendaftarkan pet baru yang terhubung ke owner, **agar** riwayat grooming dan vaksinasi tercatat per pet.

**Kriteria Penerimaan:**

```
GIVEN staff berada di halaman detail Owner
WHEN staff klik "Tambah Pet" dan mengisi form (nama*, species*, breed, gender, tanggal lahir, berat, warna, foto, alergi, catatan medis, temperamen, status steril, nomor microchip)
THEN pet tersimpan dan terhubung ke owner tersebut
AND pet muncul di daftar pets milik owner
AND jika tanggal lahir diisi, usia otomatis dihitung dan ditampilkan dalam format "X tahun Y bulan"
```

```
GIVEN pet memiliki tanggal lahir
WHEN staff melihat profil pet
THEN usia ditampilkan otomatis (contoh: "2 tahun 3 bulan") dan di-update setiap hari
```

#### US-1.3: Single-Page Pet View

**Sebagai** staff/groomer, **saya ingin** melihat semua informasi penting pet dalam satu halaman, **agar** tidak perlu berpindah halaman saat melayani pet.

**Kriteria Penerimaan:**

```
GIVEN staff membuka halaman detail pet
WHEN halaman selesai dimuat
THEN halaman menampilkan dalam satu layar:
  - Info dasar (nama, species, breed, usia, berat, foto, gender, warna)
  - Status vaksinasi (badge hijau/kuning/merah)
  - Behavior flags (anxious, aggressive, calm) jika ada
  - Alergi dan catatan medis
  - 5 riwayat grooming terakhir (tanggal, layanan, groomer)
  - Link ke riwayat vaksinasi lengkap
  - Link ke riwayat transaksi
AND semua data terlihat tanpa berpindah halaman
```

#### US-1.4: Edit dan Hapus Owner/Pet

**Sebagai** staff, **saya ingin** mengedit atau menghapus data owner dan pet, **agar** data tetap akurat.

**Kriteria Penerimaan:**

```
GIVEN staff berada di halaman detail owner/pet
WHEN staff klik "Edit" dan mengubah field yang diinginkan
THEN perubahan tersimpan dan halaman menampilkan data terbaru
```

```
GIVEN staff ingin menghapus pet
WHEN pet memiliki riwayat appointment atau transaksi
THEN sistem melakukan soft-delete (is_active = false), pet tidak muncul di daftar aktif tapi data historis tetap ada
```

```
GIVEN staff ingin menghapus owner
WHEN owner masih memiliki pet aktif
THEN sistem menampilkan warning dan meminta konfirmasi
AND jika dikonfirmasi, owner dan semua pet-nya di-soft-delete
```

#### US-1.5: Pencarian Owner dan Pet

**Sebagai** staff, **saya ingin** mencari owner atau pet dengan cepat, **agar** tidak perlu scroll daftar panjang.

**Kriteria Penerimaan:**

```
GIVEN staff berada di halaman Owners atau Pets
WHEN staff mengetik di search bar
THEN hasil pencarian muncul secara real-time (debounce 300ms)
AND pencarian mencakup: nama owner, telepon, nama pet, breed
AND hasil menampilkan maksimum 20 item per halaman dengan pagination
```

---

### 3.2 Modul: Grooming Booking & Appointment

#### US-2.1: Buat Appointment Baru

**Sebagai** staff, **saya ingin** membuat appointment grooming baru, **agar** jadwal groomer terorganisir.

**Kriteria Penerimaan:**

```
GIVEN staff berada di halaman Calendar atau Appointments
WHEN staff klik slot waktu atau tombol "Buat Appointment"
AND memilih owner → pet → groomer → tanggal/jam → layanan (bisa multiple + add-on)
THEN appointment tersimpan dengan status "Confirmed"
AND total harga otomatis dihitung berdasarkan layanan + size category pet
AND durasi estimasi otomatis dihitung berdasarkan layanan + breed
AND appointment muncul di calendar view
```

```
GIVEN staff memilih pet yang vaksinasi Rabies-nya expired
WHEN appointment akan disimpan
THEN sistem menampilkan warning "Vaksinasi Rabies expired sejak [tanggal]"
AND staff bisa memilih untuk tetap simpan (dengan catatan) atau batal
```

```
GIVEN staff memilih slot waktu yang sudah terisi oleh groomer yang sama
WHEN appointment akan disimpan
THEN sistem menampilkan warning konflik jadwal
AND appointment tidak bisa disimpan sampai konflik diselesaikan
```

#### US-2.2: Calendar View

**Sebagai** staff, **saya ingin** melihat jadwal appointment dalam calendar view, **agar** mudah melihat ketersediaan groomer.

**Kriteria Penerimaan:**

```
GIVEN staff membuka halaman Calendar
WHEN halaman dimuat
THEN calendar menampilkan view harian (default) dengan opsi switch ke mingguan
AND setiap appointment ditampilkan sebagai card dengan: nama pet, nama owner, layanan, groomer, waktu
AND card di-color-code berdasarkan status (Confirmed=biru, InProgress=kuning, Completed=hijau, Cancelled=abu-abu, NoShow=merah)
```

```
GIVEN staff melihat calendar view harian
WHEN staff klik appointment card
THEN detail appointment muncul di sidebar/modal tanpa meninggalkan calendar
```

#### US-2.3: Update Status Appointment

**Sebagai** staff/groomer, **saya ingin** mengubah status appointment, **agar** progress grooming terlacak.

**Kriteria Penerimaan:**

```
GIVEN appointment berstatus "Confirmed"
WHEN staff klik "Check-in"
THEN status berubah ke "InProgress"
AND waktu check-in otomatis tercatat
```

```
GIVEN appointment berstatus "InProgress"
WHEN staff klik "Selesai"
THEN status berubah ke "Completed"
AND waktu check-out otomatis tercatat
AND durasi aktual dihitung (check-out - check-in)
AND sistem prompt untuk membuat grooming note dan transaksi
```

```
GIVEN appointment berstatus "Confirmed"
WHEN staff klik "Cancel" atau "No-Show"
THEN status berubah sesuai pilihan
AND alasan pembatalan bisa dicatat (opsional)
```

#### US-2.4: Recurring Appointment

**Sebagai** staff, **saya ingin** membuat appointment berulang, **agar** tidak perlu input ulang untuk pelanggan rutin.

**Kriteria Penerimaan:**

```
GIVEN staff membuat appointment baru
WHEN staff mengaktifkan opsi "Recurring" dan memilih interval (setiap 4/6/8 minggu)
THEN sistem membuat appointment berulang untuk 3 bulan ke depan
AND setiap instance bisa diedit/cancel secara individual
```

```
GIVEN staff ingin mengubah recurring appointment
WHEN staff klik edit pada salah satu instance
THEN sistem menampilkan opsi: "Hanya ini", "Ini dan selanjutnya", atau "Semua"
```

#### US-2.5: Daftar Appointment Hari Ini

**Sebagai** staff, **saya ingin** melihat daftar appointment hari ini di dashboard, **agar** tahu pet mana yang akan datang.

**Kriteria Penerimaan:**

```
GIVEN staff membuka dashboard
WHEN halaman dimuat
THEN daftar appointment hari ini ditampilkan, diurutkan berdasarkan waktu
AND setiap item menampilkan: waktu, nama pet, nama owner, layanan, groomer, status
AND ada quick-action button untuk check-in, complete, dan cancel
```

---

### 3.3 Modul: Grooming Notes

#### US-3.1: Buat Grooming Note

**Sebagai** groomer, **saya ingin** mencatat detail grooming setelah selesai, **agar** kunjungan berikutnya bisa konsisten.

**Kriteria Penerimaan:**

```
GIVEN groomer menyelesaikan grooming (appointment status = Completed)
WHEN groomer mengisi form grooming note (blade size, shampoo, style notes, behavior notes, kondisi kulit)
THEN catatan tersimpan dan terhubung ke appointment dan pet
AND catatan muncul di riwayat grooming pada profil pet
```

#### US-3.2: Upload Foto Before/After

**Sebagai** groomer, **saya ingin** mengupload foto sebelum dan sesudah grooming, **agar** ada dokumentasi visual.

**Kriteria Penerimaan:**

```
GIVEN groomer mengisi grooming note
WHEN groomer mengupload foto (JPEG/PNG/WebP, maks 5MB per foto)
THEN foto tersimpan dan ditampilkan di grooming note
AND foto bisa dilihat di profil pet pada riwayat grooming
```

#### US-3.3: Lihat Riwayat Grooming Pet

**Sebagai** groomer, **saya ingin** melihat catatan grooming sebelumnya untuk pet tertentu, **agar** bisa memberikan layanan yang konsisten.

**Kriteria Penerimaan:**

```
GIVEN groomer membuka profil pet
WHEN groomer klik tab "Riwayat Grooming"
THEN daftar semua grooming notes ditampilkan (terbaru di atas)
AND setiap entry menampilkan: tanggal, groomer, blade size, shampoo, catatan perilaku, foto
AND groomer bisa klik entry untuk melihat detail lengkap
```

---

### 3.4 Modul: Vaccination Tracking

#### US-4.1: Catat Vaksinasi

**Sebagai** staff, **saya ingin** mencatat vaksinasi pet, **agar** status vaksinasi selalu up-to-date.

**Kriteria Penerimaan:**

```
GIVEN staff berada di profil pet
WHEN staff klik "Tambah Vaksinasi" dan mengisi form (nama vaksin*, jenis [Core/NonCore], tanggal pemberian*, tanggal expired, pemberi vaksin, nomor batch, upload bukti)
THEN vaksinasi tersimpan
AND jika tanggal expired tidak diisi, sistem auto-calculate berdasarkan jenis vaksin:
  - Rabies: +1 tahun
  - DHPP/DHPPi: +1 tahun
  - Leptospirosis: +1 tahun
  - Tricat/F3: +1 tahun
  - Tetracat/F4: +1 tahun
```

#### US-4.2: Visual Indicator Status Vaksinasi

**Sebagai** staff, **saya ingin** melihat status vaksinasi pet secara visual, **agar** langsung tahu apakah vaksinasi up-to-date.

**Kriteria Penerimaan:**

```
GIVEN pet memiliki catatan vaksinasi
WHEN staff melihat profil pet atau daftar pets
THEN badge status vaksinasi ditampilkan:
  - 🟢 Hijau: semua vaksinasi wajib (Rabies) up-to-date (expired > 30 hari dari sekarang)
  - 🟡 Kuning: ada vaksinasi yang akan expired dalam 30 hari
  - 🔴 Merah: ada vaksinasi wajib yang sudah expired
  - ⚪ Abu-abu: belum ada catatan vaksinasi
```

#### US-4.3: Reminder Vaksinasi

**Sebagai** staff, **saya ingin** mendapat notifikasi saat vaksinasi pet akan expired, **agar** bisa mengingatkan owner.

**Kriteria Penerimaan:**

```
GIVEN pet memiliki vaksinasi yang akan expired
WHEN tanggal sekarang berada di 30/14/7/1 hari sebelum tanggal expired
THEN sistem menampilkan reminder di dashboard
AND sistem menyediakan link WhatsApp pre-filled untuk mengirim reminder ke owner
AND format pesan: "Halo [nama owner], vaksinasi [nama vaksin] untuk [nama pet] akan expired pada [tanggal]. Silakan jadwalkan booster. Terima kasih - [nama toko]"
```

#### US-4.4: Lihat Daftar Vaksinasi Akan Expired

**Sebagai** staff, **saya ingin** melihat daftar semua pet yang vaksinasinya akan expired, **agar** bisa batch-mengirim reminder.

**Kriteria Penerimaan:**

```
GIVEN staff membuka halaman Vaccination Alerts
WHEN halaman dimuat
THEN daftar pet dengan vaksinasi expiring ditampilkan, dikelompokkan:
  - "Sudah Expired" (merah)
  - "Expired dalam 7 hari" (oranye)
  - "Expired dalam 30 hari" (kuning)
AND setiap item menampilkan: nama pet, nama owner, nama vaksin, tanggal expired
AND ada tombol "Kirim Reminder" (buka WhatsApp link) per item
AND ada tombol "Export CSV" untuk seluruh daftar
```

---

### 3.5 Modul: Products & Inventory

#### US-5.1: Tambah Produk Baru

**Sebagai** staff, **saya ingin** menambahkan produk ke inventori, **agar** stok terkelola di sistem.

**Kriteria Penerimaan:**

```
GIVEN staff berada di halaman Products
WHEN staff klik "Tambah Produk" dan mengisi form (nama*, SKU, barcode, kategori*, brand, deskripsi, harga jual*, harga modal, stok awal*, reorder level, tanggal expired, berat, target species)
THEN produk tersimpan di database
AND produk muncul di daftar produk
AND jika kategori = "Health" atau "Supplements", sistem menampilkan checkbox "Obat Hewan Bebas Terbatas"
```

```
GIVEN staff menambahkan produk dengan kategori obat
WHEN staff mencentang flag "Obat Hewan Bebas Terbatas"
THEN produk ditandai dengan badge khusus di daftar
AND saat penjualan, sistem menampilkan reminder "Pastikan pembeli mengetahui aturan penggunaan"
```

#### US-5.2: Reorder Alert

**Sebagai** pemilik toko, **saya ingin** mendapat alert saat stok produk menipis, **agar** bisa restock tepat waktu.

**Kriteria Penerimaan:**

```
GIVEN produk memiliki reorder_level yang diset
WHEN stock_quantity ≤ reorder_level
THEN produk muncul di daftar "Stok Menipis" di dashboard
AND badge notifikasi muncul di menu navigasi
AND daftar bisa di-export CSV untuk dikirim ke supplier
```

#### US-5.3: Expiry Date Tracking

**Sebagai** staff, **saya ingin** melihat produk yang akan expired, **agar** bisa diprioritaskan untuk dijual atau dibuang.

**Kriteria Penerimaan:**

```
GIVEN produk memiliki expiry_date
WHEN tanggal expired ≤ 30 hari dari sekarang
THEN produk muncul di daftar "Akan Expired" di dashboard
AND jika sudah lewat tanggal expired, produk ditandai merah dan tidak bisa dijual melalui POS (warning muncul)
```

#### US-5.4: Stock Adjustment

**Sebagai** staff, **saya ingin** menyesuaikan stok secara manual, **agar** stok di sistem akurat setelah stock opname, kerusakan, atau return.

**Kriteria Penerimaan:**

```
GIVEN staff berada di halaman detail produk
WHEN staff klik "Adjust Stok" dan mengisi jumlah (+/-) dan alasan (Damaged/Lost/Return/StockOpname/InternalUse)
THEN stok diupdate
AND log adjustment tersimpan (siapa, kapan, jumlah, alasan)
```

#### US-5.5: Daftar dan Pencarian Produk

**Sebagai** staff, **saya ingin** mencari produk dengan cepat, **agar** proses checkout lancar.

**Kriteria Penerimaan:**

```
GIVEN staff berada di halaman Products atau POS
WHEN staff mengetik di search bar
THEN hasil pencarian muncul real-time (debounce 300ms)
AND pencarian mencakup: nama produk, SKU, barcode, brand, kategori
AND hasil bisa difilter berdasarkan kategori dan target species
AND pagination 20 item per halaman
```

---

### 3.6 Modul: POS & Transactions

#### US-6.1: Buat Transaksi Layanan Grooming

**Sebagai** staff, **saya ingin** membuat transaksi setelah grooming selesai, **agar** pembayaran tercatat.

**Kriteria Penerimaan:**

```
GIVEN appointment berstatus "Completed"
WHEN staff klik "Buat Transaksi"
THEN form transaksi muncul dengan data pre-filled: owner, pet, layanan dan harga dari appointment
AND staff bisa menambahkan produk ke transaksi (mixed transaction)
AND staff memilih metode pembayaran (Cash/Transfer/E-Wallet)
AND subtotal, diskon (manual input), dan total otomatis dihitung
AND setelah simpan, transaksi tercatat dengan status "Paid"
```

#### US-6.2: Buat Transaksi Produk (Tanpa Grooming)

**Sebagai** staff, **saya ingin** membuat transaksi penjualan produk saja, **agar** penjualan retail tercatat.

**Kriteria Penerimaan:**

```
GIVEN staff berada di halaman POS
WHEN staff menambahkan produk (cari by nama/SKU/barcode), mengatur quantity, dan memilih metode pembayaran
THEN transaksi tersimpan
AND stok produk otomatis berkurang sesuai quantity
AND jika stok tidak cukup, sistem menampilkan warning dan mencegah transaksi
```

```
GIVEN staff menambahkan produk dengan flag "Obat Hewan Bebas Terbatas"
WHEN produk ditambahkan ke transaksi
THEN sistem menampilkan notice "Produk ini termasuk obat hewan bebas terbatas"
```

#### US-6.3: Cetak/Export Struk

**Sebagai** staff, **saya ingin** mencetak atau mengirim struk ke customer, **agar** ada bukti transaksi.

**Kriteria Penerimaan:**

```
GIVEN transaksi sudah tersimpan
WHEN staff klik "Cetak Struk"
THEN browser membuka print preview dengan format struk (nama toko, tanggal, item, harga, total, metode bayar)
AND ada opsi "Kirim via WhatsApp" yang membuka wa.me link dengan ringkasan transaksi
```

#### US-6.4: Riwayat Transaksi

**Sebagai** pemilik toko, **saya ingin** melihat riwayat semua transaksi, **agar** bisa memantau arus kas.

**Kriteria Penerimaan:**

```
GIVEN pemilik membuka halaman Transaksi
WHEN halaman dimuat
THEN daftar transaksi ditampilkan (terbaru di atas)
AND bisa difilter berdasarkan: tanggal range, tipe (Service/Product/Mixed), metode pembayaran, status pembayaran
AND setiap item menampilkan: tanggal, owner, tipe, total, metode bayar, status
AND ada ringkasan total di atas daftar (total hari ini, minggu ini, bulan ini)
```

#### US-6.5: Pembayaran Partial dan Refund

**Sebagai** staff, **saya ingin** mencatat pembayaran partial atau refund, **agar** status pembayaran akurat.

**Kriteria Penerimaan:**

```
GIVEN transaksi berstatus "Pending" atau "Partial"
WHEN staff mencatat pembayaran baru (jumlah + metode)
THEN jika total terbayar = total transaksi → status jadi "Paid"
AND jika total terbayar < total transaksi → status jadi "Partial"
```

```
GIVEN transaksi berstatus "Paid"
WHEN staff memproses refund (jumlah + alasan)
THEN status berubah ke "Refunded"
AND stok produk dikembalikan (jika refund produk)
AND log refund tersimpan
```

---

### 3.7 Modul: Dashboard & Reports

#### US-7.1: Dashboard Utama

**Sebagai** pemilik/staff, **saya ingin** melihat ringkasan bisnis di dashboard, **agar** punya gambaran cepat kondisi toko.

**Kriteria Penerimaan:**

```
GIVEN user membuka halaman utama (dashboard)
WHEN halaman dimuat
THEN dashboard menampilkan:
  - Appointment hari ini (daftar + jumlah)
  - Pendapatan hari ini (Rp)
  - Pendapatan bulan ini (Rp) + perbandingan bulan lalu (%)
  - Jumlah appointment bulan ini
  - Stok menipis (jumlah produk ≤ reorder level)
  - Vaksinasi akan expired (jumlah pet dalam 30 hari)
  - Produk akan expired (jumlah produk dalam 30 hari)
AND semua angka real-time dari database
```

#### US-7.2: Laporan Pendapatan

**Sebagai** pemilik toko, **saya ingin** melihat laporan pendapatan per periode, **agar** bisa memantau kinerja keuangan.

**Kriteria Penerimaan:**

```
GIVEN pemilik membuka halaman Reports > Pendapatan
WHEN pemilik memilih periode (hari/minggu/bulan/custom range)
THEN laporan menampilkan:
  - Total pendapatan periode
  - Breakdown per kategori (Grooming vs Produk)
  - Breakdown per metode pembayaran
  - Grafik trend pendapatan (bar chart)
  - Jumlah transaksi
AND data bisa di-export CSV/JSON
AND total laporan match 100% dengan jumlah transaksi individual
```

#### US-7.3: Laporan Layanan Populer

**Sebagai** pemilik toko, **saya ingin** melihat layanan mana yang paling diminati, **agar** bisa mengoptimalkan penawaran.

**Kriteria Penerimaan:**

```
GIVEN pemilik membuka halaman Reports > Layanan
WHEN pemilik memilih periode
THEN laporan menampilkan:
  - Ranking layanan berdasarkan jumlah booking
  - Ranking layanan berdasarkan pendapatan
  - Rata-rata booking per hari
AND data bisa di-export CSV
```

#### US-7.4: Laporan Inventori

**Sebagai** pemilik toko, **saya ingin** melihat laporan stok dan penjualan produk, **agar** bisa mengoptimalkan inventori.

**Kriteria Penerimaan:**

```
GIVEN pemilik membuka halaman Reports > Inventori
WHEN halaman dimuat
THEN laporan menampilkan:
  - Produk terlaris (by quantity sold) untuk periode tertentu
  - Produk slow-mover (tidak terjual dalam 30 hari)
  - Nilai total inventori (stok × harga modal)
  - Margin rata-rata per kategori
  - Daftar produk expired/akan expired
AND data bisa di-export CSV
```

---

### 3.8 Modul: Auth & User Management

#### US-8.1: Login

**Sebagai** admin/staff, **saya ingin** login ke sistem, **agar** hanya orang yang berwenang yang bisa mengakses.

**Kriteria Penerimaan:**

```
GIVEN user berada di halaman login
WHEN user mengisi email dan password yang benar
THEN user diarahkan ke dashboard
AND session disimpan di sealed cookie
AND session berlaku selama 7 hari (configurable)
```

```
GIVEN user mengisi password yang salah
WHEN form disubmit
THEN pesan error "Email atau password salah" ditampilkan
AND setelah 5 percobaan gagal dalam 15 menit, akun terkunci selama 30 menit
```

#### US-8.2: Manajemen User (Admin Only)

**Sebagai** admin, **saya ingin** mengelola akun staff, **agar** bisa mengontrol siapa yang punya akses.

**Kriteria Penerimaan:**

```
GIVEN admin berada di halaman Settings > Users
WHEN admin menambah user baru (nama, email, password, role: Admin/Staff)
THEN user baru bisa login dengan kredensial tersebut
AND role menentukan akses:
  - Admin: full access termasuk reports, settings, user management
  - Staff: CRUD owners, pets, appointments, transactions, products. TIDAK bisa akses settings dan user management
```

---

## 4. Batasan Teknis & Keamanan

### 4.1 Performa

| Metrik | Target |
|--------|--------|
| Time to Interactive (TTI) | ≤ 2 detik pada 4G |
| API response time (p95) | ≤ 200ms untuk single-entity read, ≤ 500ms untuk list + join |
| Database size support | ≥ 10.000 owners, ≥ 30.000 pets, ≥ 100.000 transaksi tanpa degradasi |
| Max concurrent users | ≥ 10 (staff toko kecil-menengah) |
| File upload max size | 5MB per file (foto pet, bukti vaksinasi) |
| CSV export | ≤ 5 detik untuk 10.000 records |

### 4.2 Keamanan

| Aspek | Implementasi |
|-------|-------------|
| **Authentication** | nuxt-auth-utils, sealed cookie session, password hashing bawaan |
| **Authorization** | Role-based (Admin/Staff), middleware check per route |
| **Input validation** | Zod schema pada setiap API endpoint (server-side) |
| **SQL injection** | Drizzle ORM parameterized queries (bukan raw SQL) |
| **XSS** | Vue auto-escaping, CSP headers |
| **CSRF** | SameSite cookie + Origin check |
| **Rate limiting** | 5 login attempts per 15 menit per IP |
| **Data privacy (UU PDP)** | Consent recording, data export/delete capability per owner |
| **File upload** | Validasi MIME type (image/jpeg, image/png, image/webp), max 5MB, sanitize filename |
| **Session** | Expired setelah 7 hari, invalidation on password change |

### 4.3 Platform & Kompatibilitas

| Aspek | Detail |
|-------|--------|
| **Browser** | Chrome, Firefox, Safari, Edge (2 versi terakhir) |
| **Responsive** | Mobile-friendly (≥ 375px), optimized untuk tablet dan desktop |
| **Rendering** | SSR + client hydration (Nuxt universal rendering) |
| **Database** | SQLite via better-sqlite3 (upgradable ke PostgreSQL via Drizzle) |
| **Deployment** | Node.js runtime (VPS, DigitalOcean, Railway). BUKAN serverless/edge (SQLite butuh filesystem) |
| **Bahasa UI** | Bahasa Indonesia |
| **Format angka** | Rupiah (Rp 150.000), pemisah ribuan titik, desimal koma |
| **Timezone** | WIB (UTC+7) default, configurable |

---

## 5. Definition of Done (DoD)

Sebuah fitur dianggap "Done" jika memenuhi SEMUA kriteria berikut:

1. ✅ **Kode** — tertulis, lulus TypeScript strict check tanpa error
2. ✅ **Validasi** — semua input divalidasi dengan Zod di server-side
3. ✅ **UI States** — loading, empty, dan error state ditangani di setiap halaman/komponen
4. ✅ **Responsive** — tampil dan berfungsi dengan baik di mobile (375px), tablet (768px), dan desktop (1280px+)
5. ✅ **Accessibility** — keyboard navigable, proper ARIA labels pada form dan interactive elements
6. ✅ **Auth guard** — route yang butuh login terproteksi oleh middleware, role-based access diterapkan
7. ✅ **Error handling** — API mengembalikan error response yang konsisten, UI menampilkan pesan error yang informatif
8. ✅ **Manual test** — workflow end-to-end diuji manual dan berfungsi sesuai kriteria penerimaan
9. ✅ **Data integrity** — foreign key constraints, unique constraints, dan validasi bisnis berjalan benar
10. ✅ **Performance** — halaman memuat ≤ 2 detik, API response ≤ 500ms

---

## 6. Spesifikasi Antarmuka — Web Frontend

### 6.1 Daftar Halaman/Rute

| Rute | Halaman | Auth | Role |
|------|---------|------|------|
| `/login` | Login | ❌ | — |
| `/` | Dashboard | ✅ | All |
| `/owners` | Daftar Owner | ✅ | All |
| `/owners/new` | Form Tambah Owner | ✅ | All |
| `/owners/:id` | Detail Owner + Daftar Pet | ✅ | All |
| `/owners/:id/edit` | Form Edit Owner | ✅ | All |
| `/pets/:id` | Detail Pet (Single-Page View) | ✅ | All |
| `/pets/:id/edit` | Form Edit Pet | ✅ | All |
| `/calendar` | Calendar View Appointment | ✅ | All |
| `/appointments` | Daftar Appointment | ✅ | All |
| `/appointments/new` | Form Buat Appointment | ✅ | All |
| `/appointments/:id` | Detail Appointment | ✅ | All |
| `/services` | Daftar Layanan & Pricing | ✅ | Admin |
| `/services/new` | Form Tambah Layanan | ✅ | Admin |
| `/services/:id/edit` | Form Edit Layanan + Pricing | ✅ | Admin |
| `/products` | Daftar Produk Inventori | ✅ | All |
| `/products/new` | Form Tambah Produk | ✅ | All |
| `/products/:id` | Detail Produk | ✅ | All |
| `/products/:id/edit` | Form Edit Produk | ✅ | All |
| `/pos` | Point of Sale | ✅ | All |
| `/transactions` | Riwayat Transaksi | ✅ | All |
| `/transactions/:id` | Detail Transaksi | ✅ | All |
| `/vaccinations/alerts` | Daftar Vaksinasi Expiring | ✅ | All |
| `/reports` | Dashboard Laporan | ✅ | Admin |
| `/reports/revenue` | Laporan Pendapatan | ✅ | Admin |
| `/reports/services` | Laporan Layanan Populer | ✅ | Admin |
| `/reports/inventory` | Laporan Inventori | ✅ | Admin |
| `/settings` | Pengaturan Toko | ✅ | Admin |
| `/settings/users` | Manajemen User | ✅ | Admin |
| `/settings/groomers` | Manajemen Groomer | ✅ | Admin |

### 6.2 Layout Utama

**Layout: Dashboard Shell**
- **Sidebar kiri** (collapsible di mobile):
  - Logo toko
  - Menu navigasi: Dashboard, Owners, Calendar, Appointments, Products, POS, Transactions, Vaccinations, Reports (Admin only), Settings (Admin only)
  - Badge notifikasi pada menu item jika ada alert (stok menipis, vaksinasi expired)
  - User info + logout di bagian bawah
- **Header bar**:
  - Global search (owner, pet, produk)
  - Notification bell dengan dropdown (stok, vaksinasi, appointment hari ini)
- **Content area**: main content halaman

### 6.3 Deskripsi Halaman Kunci

#### Dashboard (`/`)
```
┌─────────────────────────────────────────────────┐
│ Header: "Dashboard" + Tanggal hari ini          │
├─────────────────────────────────────────────────┤
│ Stats Cards (4 kolom):                          │
│ [Appointment Hari Ini: 8] [Pendapatan Hari Ini: │
│  Rp 2.450.000] [Stok Menipis: 3] [Vaksin       │
│  Expiring: 5]                                   │
├─────────────────────────────────────────────────┤
│ Appointment Hari Ini (tabel/list):              │
│ Waktu | Pet | Owner | Layanan | Groomer | Status│
│ [Quick actions: Check-in / Complete / Cancel]   │
├────────────────────────┬────────────────────────┤
│ Stok Menipis (list)    │ Vaksinasi Expiring     │
│ - Produk A (sisa: 2)  │ - Buddy: Rabies (3hr)  │
│ - Produk B (sisa: 1)  │ - Milo: DHPP (7hr)     │
└────────────────────────┴────────────────────────┘
```

#### Calendar (`/calendar`)
```
┌─────────────────────────────────────────────────┐
│ Header: [◀ Prev] [Hari Ini] [Next ▶]           │
│ View Toggle: [Harian] [Mingguan]                │
│ Filter: [Semua Groomer ▼]                       │
├─────────────────────────────────────────────────┤
│ Timeline (08:00 - 20:00):                       │
│ 08:00 ┃ [🔵 Buddy - Full Groom - Ani]          │
│ 09:00 ┃                                         │
│ 09:30 ┃ [🟡 Milo - Bath & Brush - Budi]        │
│ 10:00 ┃                                         │
│ ...                                              │
├─────────────────────────────────────────────────┤
│ Sidebar (on click appointment):                 │
│ Detail appointment + quick actions              │
└─────────────────────────────────────────────────┘
```

#### Pet Detail (`/pets/:id`)
```
┌─────────────────────────────────────────────────┐
│ [Foto Pet] Buddy                                │
│ Golden Retriever • 2 tahun 3 bulan • 28 kg • ♂ │
│ Owner: Budi Santoso (0812xxxx) [WhatsApp]       │
│ Vaksinasi: [🟢 Up-to-date]                     │
│ Temperamen: [⚠️ Anxious saat blow-dry]         │
│ Alergi: Shampoo parfum kuat                     │
├─────────────────────────────────────────────────┤
│ Tabs: [Info] [Grooming] [Vaksinasi] [Transaksi] │
├─────────────────────────────────────────────────┤
│ Tab Grooming:                                   │
│ 12 Okt 2026 - Full Groom - Ani                  │
│   Blade: #10, Shampoo: Oatmeal, Perilaku: Calm │
│   [📷 Before] [📷 After]                       │
│ 14 Sep 2026 - Bath & Brush - Budi               │
│   ...                                            │
└─────────────────────────────────────────────────┘
```

#### POS (`/pos`)
```
┌──────────────────────┬──────────────────────────┐
│ Search Produk/Scan   │ Keranjang:               │
│ [________________]   │ 1x Full Groom (L) 150.000│
│                      │ 1x Shampoo Oatmeal 85.000│
│ Hasil:               │ ─────────────────────────│
│ [+ Produk A  Rp XX]  │ Subtotal:    Rp 235.000  │
│ [+ Produk B  Rp XX]  │ Diskon:      Rp       0  │
│ [+ Produk C  Rp XX]  │ Total:       Rp 235.000  │
│                      │                          │
│ Owner: [Pilih ▼]     │ Bayar: [Cash][TF][E-Wal] │
│ Appointment: [▼]     │ [Proses Pembayaran]      │
└──────────────────────┴──────────────────────────┘
```

### 6.4 UI States

Setiap halaman WAJIB menangani state berikut:

| State | Tampilan |
|-------|----------|
| **Loading** | Skeleton loader (Nuxt UI `USkeleton`) pada area konten. BUKAN full-page spinner. |
| **Empty** | Ilustrasi/icon + pesan deskriptif + CTA. Contoh: "Belum ada pet terdaftar. [+ Tambah Pet]" |
| **Error** | Alert/banner merah dengan pesan error yang informatif + tombol "Coba Lagi". Contoh: "Gagal memuat data. Periksa koneksi internet Anda." |
| **Success** | Toast notification (Nuxt UI `UToast`) untuk aksi berhasil (simpan, hapus, update). Auto-dismiss 3 detik. |
| **Confirmation** | Modal dialog untuk aksi destruktif (hapus, cancel appointment). Wajib ketik atau klik konfirmasi. |

---

## 7. Spesifikasi API & Kontrak Data

### 7.1 Konvensi Umum

- **Base URL:** `/api`
- **Format:** JSON
- **Auth:** Sealed cookie session via `nuxt-auth-utils`. Endpoint yang butuh auth menggunakan `requireUserSession(event)`.
- **Validasi:** Zod schema pada setiap request body via `readValidatedBody(event, schema.parse)`
- **Pagination:** `?page=1&limit=20` → response includes `{ data: [], meta: { page, limit, total, totalPages } }`
- **Sorting:** `?sort=createdAt&order=desc`
- **Search:** `?q=keyword`
- **Date format:** ISO 8601 (`2026-10-16T08:00:00+07:00`)
- **Money:** Integer (sen/cent) di database dan API. Format Rupiah hanya di UI. Contoh: `150000` = Rp 1.500 → API pakai integer harga dalam Rupiah utuh (tanpa sen, karena Rupiah tidak pakai subunit).

### 7.2 Error Response Format

```json
{
  "statusCode": 400,
  "statusMessage": "Bad Request",
  "message": "Validation failed",
  "data": {
    "issues": [
      { "path": ["phone"], "message": "Format telepon tidak valid" }
    ]
  }
}
```

Status codes yang digunakan:

| Code | Penggunaan |
|------|-----------|
| 200 | OK (GET, PUT, PATCH) |
| 201 | Created (POST) |
| 204 | No Content (DELETE) |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (not logged in) |
| 403 | Forbidden (role not allowed) |
| 404 | Not Found |
| 409 | Conflict (duplicate data, scheduling conflict) |
| 429 | Too Many Requests (rate limit) |
| 500 | Internal Server Error |

### 7.3 Auth Endpoints

#### `POST /api/auth/login`

Login dengan email dan password.

| | Detail |
|---|--------|
| **Request Body** | `{ email: string, password: string }` |
| **Response 200** | `{ user: { id, name, email, role } }` |
| **Response 401** | `{ message: "Email atau password salah" }` |
| **Response 429** | `{ message: "Terlalu banyak percobaan. Coba lagi dalam 30 menit." }` |
| **Side Effect** | Set sealed cookie session |

#### `POST /api/auth/logout`

Logout dan hapus session.

| | Detail |
|---|--------|
| **Response 200** | `{}` |
| **Side Effect** | Clear sealed cookie |

#### `GET /api/auth/session`

Ambil session saat ini.

| | Detail |
|---|--------|
| **Response 200** | `{ user: { id, name, email, role } }` |
| **Response 401** | `{ message: "Unauthorized" }` |

### 7.4 Owner Endpoints

#### `GET /api/owners`

| | Detail |
|---|--------|
| **Query Params** | `?q=keyword&page=1&limit=20&sort=name&order=asc` |
| **Response 200** | `{ data: Owner[], meta: { page, limit, total, totalPages } }` |

#### `POST /api/owners`

| | Detail |
|---|--------|
| **Request Body** | `{ name: string, phone: string, email?: string, address?: string, communicationPref?: "Email"\|"SMS"\|"WhatsApp", notes?: string }` |
| **Response 201** | `{ data: Owner }` |
| **Validation** | `name` required min 2 chars, `phone` required regex `/^(\+62\|08)\d{8,13}$/` |

#### `GET /api/owners/:id`

| | Detail |
|---|--------|
| **Response 200** | `{ data: Owner & { pets: Pet[] } }` |
| **Response 404** | Owner tidak ditemukan |

#### `PUT /api/owners/:id`

| | Detail |
|---|--------|
| **Request Body** | Same as POST |
| **Response 200** | `{ data: Owner }` |

#### `DELETE /api/owners/:id`

| | Detail |
|---|--------|
| **Response 204** | Soft delete berhasil |
| **Side Effect** | Set `deletedAt` timestamp, soft-delete semua pet terkait |

### 7.5 Pet Endpoints

#### `GET /api/pets`

| | Detail |
|---|--------|
| **Query Params** | `?ownerId=1&q=keyword&species=Dog&page=1&limit=20` |
| **Response 200** | `{ data: Pet[], meta }` — Pet includes computed `age` field |

#### `POST /api/pets`

| | Detail |
|---|--------|
| **Request Body** | `{ ownerId: number, name: string, species: "Dog"\|"Cat"\|"Rabbit"\|"Other", breedId?: number, breedNotes?: string, gender?: "Male"\|"Female", dateOfBirth?: string, weight?: number, color?: string, allergies?: string, medicalNotes?: string, temperament?: string, isNeutered?: boolean, microchipNumber?: string }` |
| **Response 201** | `{ data: Pet }` |

#### `GET /api/pets/:id`

| | Detail |
|---|--------|
| **Response 200** | `{ data: Pet & { owner: Owner, vaccinations: Vaccination[], recentAppointments: Appointment[5], vaccinationStatus: "up-to-date"\|"expiring"\|"expired"\|"unknown" } }` |

#### `PUT /api/pets/:id`

| | Detail |
|---|--------|
| **Request Body** | Same as POST (tanpa `ownerId`) |
| **Response 200** | `{ data: Pet }` |

#### `DELETE /api/pets/:id`

| | Detail |
|---|--------|
| **Response 204** | Soft delete |

#### `POST /api/pets/:id/photo`

| | Detail |
|---|--------|
| **Request Body** | `multipart/form-data` — field `file` (JPEG/PNG/WebP, max 5MB) |
| **Response 200** | `{ data: { url: string } }` |

### 7.6 Breed Endpoints (Reference Data)

#### `GET /api/breeds`

| | Detail |
|---|--------|
| **Query Params** | `?species=Dog` |
| **Response 200** | `{ data: Breed[] }` |

### 7.7 Service Endpoints

#### `GET /api/services`

| | Detail |
|---|--------|
| **Query Params** | `?category=Grooming&isActive=true` |
| **Response 200** | `{ data: Service[] }` — includes `pricings: ServicePricing[]` |

#### `POST /api/services`

| | Detail |
|---|--------|
| **Auth** | Admin only |
| **Request Body** | `{ name: string, description?: string, category: string, baseDurationMin: number, basePrice: number, isAddOn: boolean, pricings?: [{ sizeCategory: string, breedId?: number, price: number, durationMin?: number }] }` |
| **Response 201** | `{ data: Service }` |

#### `PUT /api/services/:id`

| | Detail |
|---|--------|
| **Auth** | Admin only |
| **Request Body** | Same as POST |
| **Response 200** | `{ data: Service }` |

#### `DELETE /api/services/:id`

| | Detail |
|---|--------|
| **Auth** | Admin only |
| **Response 204** | Soft delete (`isActive = false`) |

### 7.8 Appointment Endpoints

#### `GET /api/appointments`

| | Detail |
|---|--------|
| **Query Params** | `?date=2026-10-16&dateFrom=...&dateTo=...&groomerId=1&status=Confirmed&page=1&limit=50` |
| **Response 200** | `{ data: Appointment[] }` — includes `pet.name`, `owner.name`, `groomer.name`, `services[]` |

#### `GET /api/appointments/today`

| | Detail |
|---|--------|
| **Response 200** | `{ data: Appointment[] }` — hari ini, sorted by `scheduledAt` |

#### `POST /api/appointments`

| | Detail |
|---|--------|
| **Request Body** | `{ ownerId: number, petId: number, groomerId: number, scheduledAt: string, notes?: string, isRecurring?: boolean, recurrenceWeeks?: number, serviceIds: number[] }` |
| **Response 201** | `{ data: Appointment }` |
| **Validation** | Check groomer availability (no overlap), `scheduledAt` must be in the future |
| **Side Effect** | Auto-calculate `estimatedDurationMin` dan `totalPrice` dari services + pet size |

#### `GET /api/appointments/:id`

| | Detail |
|---|--------|
| **Response 200** | `{ data: Appointment & { pet: Pet, owner: Owner, groomer: Groomer, services: AppointmentService[], groomingNotes: GroomingNote[], transaction?: Transaction } }` |

#### `PATCH /api/appointments/:id/status`

| | Detail |
|---|--------|
| **Request Body** | `{ status: "Confirmed"\|"InProgress"\|"Completed"\|"Cancelled"\|"NoShow", cancelReason?: string }` |
| **Response 200** | `{ data: Appointment }` |
| **Side Effect** | `InProgress` → set `checkInAt`, `Completed` → set `checkOutAt` + calculate `actualDurationMin` |

#### `DELETE /api/appointments/:id`

| | Detail |
|---|--------|
| **Response 204** | Cancel appointment |

### 7.9 Grooming Note Endpoints

#### `GET /api/appointments/:appointmentId/notes`

| | Detail |
|---|--------|
| **Response 200** | `{ data: GroomingNote[] }` |

#### `POST /api/appointments/:appointmentId/notes`

| | Detail |
|---|--------|
| **Request Body** | `{ bladeSize?: string, shampooUsed?: string, styleNotes?: string, behaviorNotes?: string, skinCondition?: string }` |
| **Response 201** | `{ data: GroomingNote }` |

#### `POST /api/grooming-notes/:id/photos`

| | Detail |
|---|--------|
| **Request Body** | `multipart/form-data` — fields `before` and/or `after` (JPEG/PNG/WebP, max 5MB each) |
| **Response 200** | `{ data: { beforePhotoUrl?: string, afterPhotoUrl?: string } }` |

#### `GET /api/pets/:petId/grooming-history`

| | Detail |
|---|--------|
| **Query Params** | `?page=1&limit=10` |
| **Response 200** | `{ data: GroomingNote[], meta }` |

### 7.10 Vaccination Endpoints

#### `GET /api/pets/:petId/vaccinations`

| | Detail |
|---|--------|
| **Response 200** | `{ data: Vaccination[] }` |

#### `POST /api/pets/:petId/vaccinations`

| | Detail |
|---|--------|
| **Request Body** | `{ vaccineName: string, vaccineType: "Core"\|"NonCore", dateAdministered: string, expiryDate?: string, administeredBy?: string, batchNumber?: string, notes?: string }` |
| **Response 201** | `{ data: Vaccination }` |
| **Side Effect** | Jika `expiryDate` kosong, auto-calculate +1 tahun dari `dateAdministered` |

#### `POST /api/vaccinations/:id/document`

| | Detail |
|---|--------|
| **Request Body** | `multipart/form-data` — field `file` (JPEG/PNG/WebP/PDF, max 5MB) |
| **Response 200** | `{ data: { documentUrl: string } }` |

#### `GET /api/vaccinations/alerts`

| | Detail |
|---|--------|
| **Query Params** | `?days=30` (vaksinasi expiring dalam X hari) |
| **Response 200** | `{ data: [{ pet: Pet, owner: Owner, vaccination: Vaccination, daysUntilExpiry: number }] }` |

#### `GET /api/vaccinations/alerts/whatsapp/:petId`

| | Detail |
|---|--------|
| **Response 200** | `{ data: { url: string, message: string } }` — `url` = `https://wa.me/62xxx?text=...` |

### 7.11 Product Endpoints

#### `GET /api/products`

| | Detail |
|---|--------|
| **Query Params** | `?q=keyword&category=Food&speciesTarget=Dog&lowStock=true&expiringSoon=true&page=1&limit=20` |
| **Response 200** | `{ data: Product[], meta }` |

#### `POST /api/products`

| | Detail |
|---|--------|
| **Request Body** | `{ name: string, sku?: string, barcode?: string, category: string, brand?: string, description?: string, unitPrice: number, costPrice?: number, stockQuantity: number, reorderLevel?: number, expiryDate?: string, weight?: number, speciesTarget?: "Dog"\|"Cat"\|"All", isRestrictedMedicine?: boolean }` |
| **Response 201** | `{ data: Product }` |

#### `PUT /api/products/:id`

| | Detail |
|---|--------|
| **Request Body** | Same as POST |
| **Response 200** | `{ data: Product }` |

#### `PATCH /api/products/:id/stock`

Stock adjustment.

| | Detail |
|---|--------|
| **Request Body** | `{ adjustment: number, reason: "Damaged"\|"Lost"\|"Return"\|"StockOpname"\|"InternalUse", notes?: string }` |
| **Response 200** | `{ data: Product }` |
| **Validation** | Resulting stock tidak boleh negatif |
| **Side Effect** | Log stock adjustment (user, timestamp, amount, reason) |

#### `DELETE /api/products/:id`

| | Detail |
|---|--------|
| **Response 204** | Soft delete (`isActive = false`) |

#### `GET /api/products/low-stock`

| | Detail |
|---|--------|
| **Response 200** | `{ data: Product[] }` — produk dengan `stockQuantity ≤ reorderLevel` |

#### `GET /api/products/expiring`

| | Detail |
|---|--------|
| **Query Params** | `?days=30` |
| **Response 200** | `{ data: Product[] }` — produk yang expired dalam X hari |

### 7.12 Transaction Endpoints

#### `GET /api/transactions`

| | Detail |
|---|--------|
| **Query Params** | `?dateFrom=...&dateTo=...&type=Service\|Product\|Mixed&paymentMethod=Cash&paymentStatus=Paid&page=1&limit=20` |
| **Response 200** | `{ data: Transaction[], meta }` |

#### `POST /api/transactions`

| | Detail |
|---|--------|
| **Request Body** | `{ ownerId?: number, appointmentId?: number, type: "Service"\|"Product"\|"Mixed", discount?: number, paymentMethod: "Cash"\|"Transfer"\|"EWallet", paymentStatus: "Paid"\|"Pending"\|"Partial", notes?: string, items: [{ itemType: "Service"\|"Product", serviceId?: number, productId?: number, quantity: number, unitPrice: number, discount?: number }] }` |
| **Response 201** | `{ data: Transaction }` |
| **Validation** | Jika `itemType = "Product"`, check stok cukup |
| **Side Effect** | Kurangi stok produk sesuai quantity. Hitung `subtotal` dan `total` otomatis. |

#### `GET /api/transactions/:id`

| | Detail |
|---|--------|
| **Response 200** | `{ data: Transaction & { items: TransactionItem[], owner?: Owner, appointment?: Appointment } }` |

#### `POST /api/transactions/:id/payments`

Catat pembayaran (untuk partial payment).

| | Detail |
|---|--------|
| **Request Body** | `{ amount: number, paymentMethod: "Cash"\|"Transfer"\|"EWallet" }` |
| **Response 200** | `{ data: Transaction }` |
| **Side Effect** | Update `paymentStatus` berdasarkan total terbayar vs total transaksi |

#### `POST /api/transactions/:id/refund`

| | Detail |
|---|--------|
| **Request Body** | `{ amount: number, reason: string, refundItems?: [{ transactionItemId: number, quantity: number }] }` |
| **Response 200** | `{ data: Transaction }` |
| **Side Effect** | Kembalikan stok produk jika ada `refundItems` |

#### `GET /api/transactions/:id/receipt`

| | Detail |
|---|--------|
| **Response 200** | `{ data: { html: string, whatsappUrl: string } }` — `html` = printable receipt, `whatsappUrl` = wa.me link with summary |

### 7.13 Groomer Endpoints

#### `GET /api/groomers`

| | Detail |
|---|--------|
| **Query Params** | `?isActive=true` |
| **Response 200** | `{ data: Groomer[] }` |

#### `POST /api/groomers`

| | Detail |
|---|--------|
| **Auth** | Admin only |
| **Request Body** | `{ name: string, phone?: string, specialties?: string, commissionRate?: number, bio?: string }` |
| **Response 201** | `{ data: Groomer }` |

#### `PUT /api/groomers/:id`

| | Detail |
|---|--------|
| **Auth** | Admin only |
| **Request Body** | Same as POST |
| **Response 200** | `{ data: Groomer }` |

#### `GET /api/groomers/:id/schedule`

| | Detail |
|---|--------|
| **Query Params** | `?date=2026-10-16` atau `?dateFrom=...&dateTo=...` |
| **Response 200** | `{ data: Appointment[] }` — jadwal groomer pada tanggal tersebut |

### 7.14 Report Endpoints

#### `GET /api/reports/revenue`

| | Detail |
|---|--------|
| **Auth** | Admin only |
| **Query Params** | `?period=daily\|weekly\|monthly&dateFrom=...&dateTo=...` |
| **Response 200** | `{ data: { total: number, byCategory: { service: number, product: number }, byPaymentMethod: { Cash: number, Transfer: number, EWallet: number }, transactionCount: number, trend: [{ date: string, amount: number }] } }` |

#### `GET /api/reports/services`

| | Detail |
|---|--------|
| **Auth** | Admin only |
| **Query Params** | `?dateFrom=...&dateTo=...` |
| **Response 200** | `{ data: { byBookingCount: [{ service: string, count: number }], byRevenue: [{ service: string, revenue: number }], avgBookingsPerDay: number } }` |

#### `GET /api/reports/inventory`

| | Detail |
|---|--------|
| **Auth** | Admin only |
| **Response 200** | `{ data: { topSellers: [{ product: string, quantitySold: number }], slowMovers: [{ product: string, lastSoldAt: string }], totalInventoryValue: number, avgMarginByCategory: [{ category: string, margin: number }] } }` |

### 7.15 Export Endpoints

#### `GET /api/export/:entity`

| | Detail |
|---|--------|
| **Auth** | Admin only |
| **Path Params** | `entity` = `owners` \| `pets` \| `transactions` \| `products` \| `appointments` |
| **Query Params** | `?format=csv\|json&dateFrom=...&dateTo=...` |
| **Response 200** | File download (Content-Disposition: attachment) |

### 7.16 Settings Endpoints

#### `GET /api/settings`

| | Detail |
|---|--------|
| **Auth** | Admin only |
| **Response 200** | `{ data: { shopName: string, phone: string, address: string, timezone: string, vaccinationBlockBooking: boolean } }` |

#### `PUT /api/settings`

| | Detail |
|---|--------|
| **Auth** | Admin only |
| **Request Body** | Same as response data |
| **Response 200** | `{ data: Settings }` |

### 7.17 User Management Endpoints

#### `GET /api/users`

| | Detail |
|---|--------|
| **Auth** | Admin only |
| **Response 200** | `{ data: User[] }` — tanpa field password |

#### `POST /api/users`

| | Detail |
|---|--------|
| **Auth** | Admin only |
| **Request Body** | `{ name: string, email: string, password: string, role: "Admin"\|"Staff" }` |
| **Response 201** | `{ data: User }` |

#### `PUT /api/users/:id`

| | Detail |
|---|--------|
| **Auth** | Admin only |
| **Request Body** | `{ name?: string, email?: string, role?: string }` |
| **Response 200** | `{ data: User }` |

#### `PATCH /api/users/:id/password`

| | Detail |
|---|--------|
| **Auth** | Admin only, atau user sendiri |
| **Request Body** | `{ currentPassword: string, newPassword: string }` |
| **Response 200** | `{}` |
| **Side Effect** | Invalidate semua session user tersebut |

#### `DELETE /api/users/:id`

| | Detail |
|---|--------|
| **Auth** | Admin only |
| **Response 204** | Soft delete |
| **Validation** | Tidak bisa hapus user sendiri. Minimal 1 Admin harus tetap ada. |

---

*Dokumen ini adalah living document. Update sesuai kebutuhan selama development.*
