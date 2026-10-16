# Riset Domain: Sistem Manajemen Pet Grooming & Pet Shop

> **Tanggal riset:** 16 Oktober 2026
> **Scope:** Single-tenant (satu toko), web-based management system
> **Status:** ✅ Verified (dari sumber resmi/docs) | ⚠️ Unverified (dari sumber sekunder)

---

## Daftar Isi

1. [Fitur Umum Sistem Booking Pet Grooming](#1-fitur-umum-sistem-booking-pet-grooming)
2. [Data Entities yang Dibutuhkan](#2-data-entities-yang-dibutuhkan)
3. [Jadwal Vaksinasi & Best Practices](#3-jadwal-vaksinasi--best-practices)
4. [Fitur Manajemen Inventori Pet Shop](#4-fitur-manajemen-inventori-pet-shop)
5. [Pain Points Software yang Ada](#5-pain-points-software-yang-ada)
6. [Pertimbangan Regulasi](#6-pertimbangan-regulasi)

---

## 1. Fitur Umum Sistem Booking Pet Grooming

Berdasarkan analisis empat platform utama: **PetExec**, **Gingr**, **MoeGo**, dan **Pawfinity**.

### 1.1 Scheduling & Calendar Management

| Fitur | PetExec | Gingr | MoeGo | Pawfinity |
|-------|---------|-------|-------|-----------|
| Drag-and-drop calendar | ✅ | ✅ | ✅ | ✅ |
| Color-coded per groomer | ✅ | ✅ | ✅ | ✅ |
| Recurring appointments | ✅ | ✅ | ✅ | ✅ |
| Online booking 24/7 | ✅ | ✅ | ✅ | ✅ |
| Multi-groomer scheduling | ✅ | ✅ | ✅ | ✅ |
| Booking rules (breed/size/weight) | ✅ | ✅ | ✅ | ❌ |
| Smart gap-filling / AI scheduling | ❌ | ❌ | ✅ | ❌ |
| Waitlist management | ✅ | ✅ | ✅ | ❌ |
| Buffer time antar appointment | ⚠️ | ⚠️ | ✅ | ⚠️ |

**Sumber:**
- ✅ PetExec: https://www.petexec.net/service/groomers
- ✅ Gingr: https://www.gingrapp.com/pet-grooming-software
- ✅ MoeGo: https://www.moego.pet/pet-grooming-software
- ✅ Pawfinity: https://www.pawfinity.com/pet-grooming-software/

### 1.2 Client & Pet Management

| Fitur | Deskripsi | Status |
|-------|-----------|--------|
| Owner profile | Nama, kontak, alamat, preferensi komunikasi, catatan VIP/difficult | ✅ Verified |
| Pet profile | Nama, species, breed, berat, usia, foto, alergi, temperamen | ✅ Verified |
| Multiple pets per owner | Satu akun owner bisa punya banyak pet | ✅ Verified |
| Grooming notes per pet | Preferensi style, blade size, shampoo, catatan perilaku | ✅ Verified |
| Service history per pet | Log semua groom sebelumnya attached ke pet, bukan owner | ✅ Verified |
| Vaccination records | Upload dan tracking status vaksinasi | ✅ Verified |
| Behavior flags / alerts | Tanda peringatan untuk pet yang anxious, reaktif, atau agresif | ✅ Verified |
| Before/after photos | Foto per session, bisa dikirim ke owner via SMS | ✅ Verified |
| Pet birthday tracking | Tracking ulang tahun pet | ✅ Verified |

**Sumber:**
- ✅ PetExec features: https://www.softwareadvice.com/pet-grooming/petexec-profile/
- ✅ Gingr profiles: https://www.gingrapp.com/blog/5-gingr-features-to-streamline-your-pet-grooming-business
- ✅ Pawfinity profiles: https://www.pawfinity.com/features/rich-client-pet-profiles/
- ✅ MoeGo: https://www.moego.pet/grooming-software-pet-parent-experience

### 1.3 Communication & Notifications

| Fitur | Deskripsi | Status |
|-------|-----------|--------|
| Automated appointment reminders | Email/SMS otomatis sebelum appointment | ✅ Verified |
| Multiple reminder types | MoeGo kirim 3 jenis reminder berbeda | ✅ Verified |
| "Ready for pickup" notification | Notifikasi saat pet selesai di-groom | ✅ Verified |
| Two-way SMS | Komunikasi dua arah dengan owner | ✅ Verified |
| Grooming report cards | Laporan detail kondisi pet setelah grooming | ✅ Verified |
| Marketing campaigns | Email/SMS marketing tersegmentasi | ✅ Verified |
| Review request automation | Otomatis minta review setelah visit | ✅ Verified |
| Vaccination due reminders | Notifikasi vaksinasi yang akan expired | ✅ Verified |
| No-show follow-up | Tindak lanjut otomatis untuk no-show | ✅ Verified |

**Sumber:**
- ✅ MoeGo 3 reminders: https://www.moego.pet/pet-grooming-software
- ✅ PetExec texting: https://www.petexec.net/service/groomers
- ✅ Gingr report cards: https://www.gingrapp.com/pet-grooming-software

### 1.4 Payment & POS

| Fitur | Deskripsi | Status |
|-------|-----------|--------|
| Integrated POS | Point-of-sale terintegrasi | ✅ Verified |
| Online payment | Pembayaran online via portal/app | ✅ Verified |
| Card on file | Simpan kartu kredit untuk charge otomatis | ✅ Verified |
| Deposit / prepayment | Deposit sebelum appointment untuk kurangi no-show | ✅ Verified |
| Package / membership | Paket kunjungan (10-visit, monthly) dengan auto-renew | ✅ Verified |
| Tip management | Tracking tip untuk groomer | ✅ Verified |
| Commission calculation | Hitung komisi groomer otomatis | ✅ Verified |
| Invoice generation | Buat dan kirim invoice | ✅ Verified |
| No-show fee | Charge fee untuk no-show | ✅ Verified |
| Multi-pet discount | Diskon otomatis untuk beberapa pet dalam satu visit | ✅ Verified |
| Loyalty / rewards program | Program loyalitas pelanggan | ✅ Verified |

**Sumber:**
- ✅ Gingr payments: https://www.gingrapp.com/why-gingr
- ✅ MoeGo POS: https://www.moego.pet/mobile-grooming
- ✅ Pawfinity POS: https://www.pawfinity.com/pet-grooming-software/

### 1.5 Pricing & Service Management

| Fitur | Deskripsi | Status |
|-------|-----------|--------|
| Pricing by breed/size | Harga berbeda berdasarkan breed dan ukuran | ✅ Verified |
| Pricing by coat type/weight | Harga berdasarkan jenis bulu dan berat | ✅ Verified |
| Add-on services | Layanan tambahan (nail trim, de-shedding, teeth cleaning) | ✅ Verified |
| Per-groomer pricing | Tiap groomer bisa set harga sendiri | ✅ Verified |
| Service duration estimation | Estimasi durasi berdasarkan breed + service complexity | ✅ Verified |
| Service catalog customization | Kustomisasi menu layanan | ✅ Verified |
| Dynamic pricing | Peak pricing, diskon otomatis | ✅ Verified |

**Sumber:**
- ✅ PetExec breed pricing: https://www.petexec.net/service/groomers
- ✅ MoeGo pricing templates: https://www.moego.pet/pet-grooming-software
- ✅ Gingr dynamic pricing: https://www.gingrapp.com/why-gingr

### 1.6 Staff & Business Management

| Fitur | Deskripsi | Status |
|-------|-----------|--------|
| Employee time clock | Clock in/out terintegrasi | ✅ Verified |
| Role-based permissions | Akses berbeda per role (admin, groomer, receptionist) | ✅ Verified |
| Commission tracking | Track komisi per groomer per service | ✅ Verified |
| Performance reports | Laporan kinerja staff | ✅ Verified |
| Schedule management | Jadwal kerja, time-off requests | ✅ Verified |
| Revenue & booking reports | Dashboard KPI bisnis | ✅ Verified |
| Tax reports | Laporan pajak | ✅ Verified |
| Digital contracts / agreements | Kontrak digital dengan e-signature | ✅ Verified |
| Client portal / mobile app | Portal self-service untuk owner | ✅ Verified |

**Sumber:**
- ✅ MoeGo staff: https://www.moego.pet/pet-grooming-software
- ✅ PetExec reports: https://www.softwareadvice.com/pet-grooming/petexec-profile/reviews/
- ✅ Pawfinity time clock: https://www.pawfinity.com/pet-grooming-software/

### 1.7 Fitur Kunci untuk Sistem Kita (Rekomendasi Prioritas)

Berdasarkan analisis keempat platform, fitur **MVP** yang wajib ada:

1. **Appointment scheduling** dengan calendar view (daily/weekly/monthly)
2. **Pet & owner profiles** dengan relasi one-to-many
3. **Service catalog** dengan pricing by breed/size
4. **Automated reminders** (minimal email, idealnya SMS)
5. **Service history** per pet
6. **Basic POS** / payment tracking
7. **Grooming notes** per pet per visit
8. **Vaccination tracking** dengan expiry alerts

---

## 2. Data Entities yang Dibutuhkan

### 2.1 Entity Relationship Overview

```
Owner (1) ──── (N) Pet
  │                  │
  │                  ├── (N) Vaccination Record
  │                  │
  │                  └── (N) Appointment ──── (N) Service
  │                           │                    │
  │                           ├── (1) Groomer       └── (N) Service Pricing
  │                           │                          (by breed/size)
  │                           ├── (N) Grooming Note
  │                           │
  │                           └── (1) Payment / Invoice
  │
  └── (N) Transaction ──── (N) Product (Inventory)

Breed (reference table)
Species (reference table: Dog, Cat, etc.)
```

### 2.2 Detail Entity dan Field

#### **Owners (Pemilik Hewan)**
| Field | Type | Keterangan |
|-------|------|------------|
| id | PK | |
| name | string | Nama lengkap |
| email | string | Nullable |
| phone | string | Required — kontak utama |
| address | text | Alamat rumah |
| notes | text | Catatan internal (VIP, difficult, dll) |
| loyalty_points | integer | Poin loyalitas |
| joined_at | timestamp | Tanggal registrasi |
| communication_pref | enum | Email/SMS/WhatsApp |

#### **Pets (Hewan Peliharaan)**
| Field | Type | Keterangan |
|-------|------|------------|
| id | PK | |
| owner_id | FK → Owners | |
| name | string | Nama pet |
| species | enum | Dog, Cat, Rabbit, dll |
| breed_id | FK → Breeds | Nullable untuk mixed |
| breed_notes | string | "Mixed Poodle" dll |
| gender | enum | Male/Female |
| date_of_birth | date | Nullable jika tidak diketahui |
| weight | decimal | Dalam kg |
| color | string | Warna bulu |
| photo_url | string | Foto profil |
| allergies | text | Alergi yang diketahui |
| medical_notes | text | Catatan medis |
| temperament | text | Catatan perilaku (anxious, aggressive, calm) |
| is_neutered | boolean | Status steril |
| microchip_number | string | Nomor microchip |

#### **Breeds (Ras)**
| Field | Type | Keterangan |
|-------|------|------------|
| id | PK | |
| species | enum | Dog/Cat |
| name | string | "Golden Retriever", "Persian" |
| size_category | enum | Small/Medium/Large/Giant |
| coat_type | enum | Short/Medium/Long/Wire/Curly/Double |
| default_groom_duration_min | integer | Estimasi default durasi grooming |
| grooming_frequency_weeks | integer | Rekomendasi frekuensi (4/6/8 minggu) |
| special_notes | text | Catatan breed-specific (facial fold cleaning, ear care) |

#### **Services (Layanan)**
| Field | Type | Keterangan |
|-------|------|------------|
| id | PK | |
| name | string | "Full Groom", "Bath & Brush", "Nail Trim" |
| description | text | |
| category | enum | Grooming/Bath/NailCare/TeethCleaning/DeShedding/AddOn |
| base_duration_min | integer | Durasi dasar |
| base_price | decimal | Harga dasar |
| is_add_on | boolean | Apakah ini layanan tambahan |
| is_active | boolean | Masih ditawarkan atau tidak |

#### **Service Pricings (Harga per Breed/Size)**
| Field | Type | Keterangan |
|-------|------|------------|
| id | PK | |
| service_id | FK → Services | |
| size_category | enum | Small/Medium/Large/Giant |
| breed_id | FK → Breeds | Nullable (kalau by size saja) |
| price | decimal | |
| duration_min | integer | Override durasi |

#### **Groomers (Groomer/Staff)**
| Field | Type | Keterangan |
|-------|------|------------|
| id | PK | |
| user_id | FK → Users | Untuk auth |
| name | string | |
| phone | string | |
| specialties | text | Keahlian khusus |
| commission_rate | decimal | Persentase komisi |
| is_active | boolean | |
| bio | text | |

#### **Appointments (Janji Temu)**
| Field | Type | Keterangan |
|-------|------|------------|
| id | PK | |
| owner_id | FK → Owners | |
| pet_id | FK → Pets | |
| groomer_id | FK → Groomers | |
| scheduled_at | datetime | Waktu mulai |
| estimated_duration_min | integer | |
| actual_duration_min | integer | Nullable sampai selesai |
| status | enum | Requested/Confirmed/InProgress/Completed/Cancelled/NoShow |
| notes | text | Catatan untuk appointment ini |
| check_in_at | datetime | Waktu check-in |
| check_out_at | datetime | Waktu check-out |
| total_price | decimal | |
| is_recurring | boolean | |
| recurrence_rule | string | RRULE atau interval minggu |

#### **Appointment Services (Layanan per Appointment)**
| Field | Type | Keterangan |
|-------|------|------------|
| id | PK | |
| appointment_id | FK → Appointments | |
| service_id | FK → Services | |
| price | decimal | Harga aktual (bisa override) |
| notes | text | |

#### **Grooming Notes (Catatan Grooming)**
| Field | Type | Keterangan |
|-------|------|------------|
| id | PK | |
| appointment_id | FK → Appointments | |
| pet_id | FK → Pets | |
| groomer_id | FK → Groomers | |
| blade_size | string | Blade yang digunakan |
| shampoo_used | string | |
| style_notes | text | Catatan style/potongan |
| behavior_notes | text | Catatan perilaku saat grooming |
| skin_condition | text | Kondisi kulit yang ditemukan |
| before_photo_url | string | |
| after_photo_url | string | |
| created_at | timestamp | |

#### **Vaccination Records (Catatan Vaksinasi)**
| Field | Type | Keterangan |
|-------|------|------------|
| id | PK | |
| pet_id | FK → Pets | |
| vaccine_name | string | "Rabies", "DHPP", "Tricat/F3" |
| vaccine_type | enum | Core/NonCore |
| date_administered | date | Tanggal diberikan |
| expiry_date | date | Tanggal expired/perlu booster |
| administered_by | string | Nama dokter hewan / klinik |
| batch_number | string | Nomor batch vaksin |
| document_url | string | Scan/foto bukti vaksinasi |
| notes | text | |
| reminder_sent | boolean | Apakah reminder sudah dikirim |

#### **Products (Produk Toko)**
| Field | Type | Keterangan |
|-------|------|------------|
| id | PK | |
| sku | string | Stock Keeping Unit |
| barcode | string | |
| name | string | |
| category | enum | Food/Treats/Toys/Accessories/Grooming/Health/Supplements |
| brand | string | |
| description | text | |
| unit_price | decimal | Harga jual |
| cost_price | decimal | Harga beli/modal |
| stock_quantity | integer | Stok saat ini |
| reorder_level | integer | Minimum stok sebelum reorder |
| expiry_date | date | Nullable, untuk makanan/obat |
| is_active | boolean | |
| weight | decimal | Berat produk |
| species_target | enum | Dog/Cat/All |

#### **Transactions / Invoices (Transaksi)**
| Field | Type | Keterangan |
|-------|------|------------|
| id | PK | |
| owner_id | FK → Owners | |
| appointment_id | FK → Appointments | Nullable (bisa transaksi produk saja) |
| type | enum | Service/Product/Package/Mixed |
| subtotal | decimal | |
| discount | decimal | |
| tax | decimal | |
| total | decimal | |
| payment_method | enum | Cash/Card/Transfer/EWallet |
| payment_status | enum | Pending/Paid/Partial/Refunded |
| paid_at | datetime | |
| notes | text | |

#### **Transaction Items (Detail Transaksi)**
| Field | Type | Keterangan |
|-------|------|------------|
| id | PK | |
| transaction_id | FK → Transactions | |
| item_type | enum | Service/Product |
| service_id | FK → Services | Nullable |
| product_id | FK → Products | Nullable |
| quantity | integer | |
| unit_price | decimal | |
| discount | decimal | |
| total | decimal | |

**Sumber:**
- ✅ Back4app data model: https://www.back4app.com/tutorials/how-to-build-an-app-for-a-pet-grooming-business
- ✅ Zipprr database architecture: https://zipprr.com/blog/pet-care-booking-management-technical-case-study/
- ✅ Zigpoll schema design: https://www.zigpoll.com/content/how-can-i-design-an-efficient-database-schema-to-manage-pet-profiles-appointment-scheduling-and-customer-feedback-for-a-pet-care-company
- ✅ ViaSheet CRM structure: https://viasheet.com/en/blog/pet-grooming-crm-client-booking-spreadsheet-guide/

---

## 3. Jadwal Vaksinasi & Best Practices

### 3.1 Vaksin Wajib (Core Vaccines) — Anjing

| Vaksin | Penyakit | Jadwal Puppy | Booster Dewasa |
|--------|----------|-------------|----------------|
| **DHPP/DHPPi** | Distemper, Hepatitis, Parvovirus, Parainfluenza | 6-8 minggu, lalu setiap 2-4 minggu sampai 16 minggu | Booster 1 tahun setelah seri terakhir, lalu setiap 1-3 tahun |
| **Rabies** | Rabies | Mulai usia 12-16 minggu | Booster 1 tahun kemudian, lalu setiap 1-3 tahun |
| **Leptospirosis** | Leptospira | 10-12 minggu, booster 3-4 minggu kemudian | **Setiap tahun** (tidak bisa 3 tahun) |

### 3.2 Vaksin Wajib (Core Vaccines) — Kucing

| Vaksin | Penyakit | Jadwal Kitten | Booster Dewasa |
|--------|----------|--------------|----------------|
| **Tricat/F3 (FVRCP)** | Panleukopenia, Rhinotracheitis, Calicivirus | 6-8 minggu, lalu setiap 3-4 minggu sampai 16 minggu | Booster 1 tahun, lalu setiap 1-3 tahun |
| **Tetracat/F4** | F3 + Chlamydia | 10-12 minggu | Booster tahunan |
| **Rabies** | Rabies | Mulai usia 12-16 minggu | Booster 1 tahun, lalu setiap 1-3 tahun |

### 3.3 Vaksin Opsional (Non-Core)

| Spesies | Vaksin | Kapan Direkomendasikan |
|---------|--------|----------------------|
| Anjing | **Bordetella** (Kennel Cough) | Pet yang sering ke boarding, daycare, grooming, dog park |
| Anjing | **Canine Influenza** | Pet yang sering berinteraksi dengan anjing lain |
| Anjing | **Lyme Disease** | Daerah dengan risiko kutu tinggi |
| Anjing | **Corona** | Sesuai rekomendasi drh (umum di Indonesia) |
| Kucing | **FeLV** (Feline Leukemia) | Kucing outdoor atau multi-cat household |
| Kucing | **FIV** (Feline Immunodeficiency) | Kucing outdoor |

### 3.4 Jadwal Vaksinasi Konteks Indonesia

| Usia | Anjing | Kucing |
|------|--------|--------|
| 6-8 minggu | Parvo + Distemper / DHPP pertama | Tricat/F3 pertama |
| 10-12 minggu | DHLPPi (+ Leptospirosis) | Tetracat/F4 booster |
| 14-16 minggu | DHLPPi booster + **Rabies** | F4 booster + **Rabies** |
| 6 bulan | Opsional: Rabies booster | — |
| 1 tahun | Booster tahunan DHLPPi + Rabies | Booster tahunan F4 + Rabies |
| Setelahnya | **Setiap 1 tahun** (standar Indonesia) | **Setiap 1 tahun** |

> **Catatan Indonesia:** Vaksinasi rabies **wajib** berdasarkan peraturan pemerintah. Standar Indonesia umumnya merekomendasikan booster **tahunan** (berbeda dengan WSAVA yang merekomendasikan setiap 3 tahun untuk core vaccines pada dewasa).

### 3.5 Best Practices untuk Fitur Vaccination Tracking di Sistem

1. **Auto-calculate expiry date** berdasarkan jenis vaksin dan tanggal pemberian
2. **Reminder bertahap:** 30 hari, 14 hari, 7 hari, dan 1 hari sebelum expired
3. **Block booking** jika vaksinasi wajib (terutama Rabies) sudah expired — konfigurabel per salon
4. **Upload bukti vaksinasi** (foto/scan surat vaksin dari drh)
5. **Visual indicator** pada profil pet: hijau (up-to-date), kuning (akan expired), merah (expired)
6. **Template jadwal** otomatis berdasarkan species dan usia pet saat registrasi
7. **Syarat grooming:** Banyak salon mewajibkan vaksin up-to-date sebelum terima pet, fitur ini harus bisa di-enforce atau di-warn

**Sumber:**
- ✅ ASPCA: https://www.aspca.org/pet-care/general-pet-care/vaccinations-your-pet
- ✅ AVMA: https://www.avma.org/resources-tools/pet-owners/petcare/vaccinations
- ✅ WSAVA Guidelines (PMC/NIH): https://pmc.ncbi.nlm.nih.gov/articles/PMC7166980/
- ✅ UC Davis Veterinary: https://healthtopics.vetmed.ucdavis.edu/health-topics/feline/vaccination-guidelines-dogs-and-cats
- ✅ Today's Veterinary Practice: https://www.todaysveterinarypractice.com/preventive-medicine/dog-cat-vaccination-recommendations/
- ✅ Purina Indonesia: https://www.purina.co.id/perawatan-dan-saran/anjing/kesehatan/pentingnya-vaksin
- ✅ Petopaw Indonesia: https://www.petopaw.id/en/blogs/jadwal-vaksinasi-kucing-dan-anjing-panduan-lengkap-untuk-pemilik-baru-2026-28
- ✅ Nature Bridge Indonesia: https://naturebridge.id/id/pet-tips
- ✅ Wikipedia ID Vaksinasi Hewan: https://id.wikipedia.org/wiki/Vaksinasi_hewan

---

## 4. Fitur Manajemen Inventori Pet Shop

### 4.1 Core Inventory Features

| Fitur | Deskripsi | Prioritas |
|-------|-----------|-----------|
| **Real-time stock tracking** | Stok terupdate otomatis setelah setiap penjualan | Wajib |
| **Barcode scanning** | Scan barcode produk untuk checkout cepat dan update stok | Wajib |
| **Reorder alerts** | Notifikasi otomatis saat stok mencapai minimum level | Wajib |
| **Category management** | Kategori: Food, Treats, Toys, Accessories, Grooming, Health | Wajib |
| **Expiry date tracking** | Khusus untuk makanan, treats, dan obat/suplemen | Wajib |
| **Cost & margin tracking** | Track harga beli (modal) vs harga jual untuk hitung margin | Wajib |
| **Product search** | Cari produk by nama, SKU, barcode, kategori, brand | Wajib |
| **Stock adjustment** | Adjust stok manual untuk damaged, lost, atau returned items | Wajib |

### 4.2 Advanced Inventory Features

| Fitur | Deskripsi | Prioritas |
|-------|-----------|-----------|
| **Automatic purchase orders** | Generate PO otomatis saat stok di bawah reorder level | Sedang |
| **Supplier/vendor management** | Track supplier, harga beli, lead time, riwayat order | Sedang |
| **Sales trend analysis** | Analisis produk best-seller vs slow-mover | Sedang |
| **Bulk price update** | Update harga banyak produk sekaligus | Sedang |
| **Promotion/discount management** | Set promo per produk/kategori dengan durasi | Sedang |
| **Species-targeted filtering** | Filter produk by target species (Dog/Cat/All) | Rendah |
| **Cross-sell suggestions** | Saran produk terkait saat checkout | Rendah |
| **E-commerce sync** | Sinkronisasi stok dengan toko online | Rendah |

### 4.3 Pet-Specific Inventory Considerations

- **Makanan hewan:** Turnover cepat, perlu stok 1-2 bulan. Monitor expiry date ketat.
- **Treats & snacks:** Expiry date management penting, safety margin 25%.
- **Aksesoris (kalung, tali, baju):** Slow-mover, stok 3-4 bulan cukup.
- **Produk grooming (shampoo, conditioner):** Dipakai salon sendiri + dijual retail — track pemakaian internal vs penjualan.
- **Obat & suplemen:** Perhatikan regulasi (di Indonesia: obat hewan bebas boleh dijual, obat keras TIDAK boleh tanpa resep drh).
- **PAR level recommended:** Pet store sehat biasanya simpan stok 2-3 bulan penjualan.

**Sumber:**
- ✅ eTailPet features: https://etailpet.io/blog/pet-store-pos-software
- ✅ eTailPet inventory management: https://etailpet.io/blog/pet-store-inventory-management-software
- ✅ eTailPet inventory tips: https://etailpet.io/blog/pet-store-inventory-management-tips
- ✅ GoFrugal pet POS: https://www.gofrugal.com/retail/specialized-retail-pos/pet-store-software.html
- ✅ Erply POS features: https://erply.com/what-pos-features-do-you-need-for-your-pet-supply-store
- ⚠️ MargBooks: https://margbooks.com/blogs/how-to-automate-your-pet-shop-with-pet-store-management-software-free/

---

## 5. Pain Points Software yang Ada

Berdasarkan review pengguna real dari Software Advice, Capterra, dan GetApp (total 1000+ reviews dianalisis):

### 5.1 Masalah UX/UI

| Pain Point | Detail | Sumber |
|-----------|--------|--------|
| **UI cumbersome / terlalu banyak langkah** | Pain point #1 yang paling sering disebut. Tugas sederhana butuh terlalu banyak klik. | ✅ [Software Advice](https://www.softwareadvice.com/pet-grooming/) |
| **Learning curve tinggi** | Butuh waktu lama untuk onboarding staff baru. PetExec dan Pawfinity disebut. | ✅ [PetExec Reviews](https://www.softwareadvice.com/pet-grooming/petexec-profile/reviews/) |
| **Recurring appointment management ribet** | Sulit reset/ubah recurring appointment kalau customer cancel atau reschedule. | ✅ [Groomsoft Reviews](https://www.softwareadvice.com/pet-grooming/groomsoft-profile/) |
| **Informasi pet tidak lengkap di satu layar** | Warna, ukuran, room type tidak terlihat di detail page — harus buka halaman lain. | ✅ [Gingr Reviews](https://www.softwareadvice.com/pet-grooming/gingr-profile/reviews/) |
| **Usia pet tidak mudah terlihat** | Harus hitung manual dari tanggal lahir. | ✅ [MoeGo Reviews](https://www.softwareadvice.com/pet-grooming/moego-profile/reviews/) |
| **Client portal confusing** | Portal pelanggan tidak user-friendly, terlalu banyak step untuk booking. | ✅ [Pawfinity Reviews](https://www.softwareadvice.com/pet-grooming/pawfinity-profile/reviews/) |

### 5.2 Masalah Teknis & Bug

| Pain Point | Detail | Sumber |
|-----------|--------|--------|
| **Bug sering muncul setelah update** | Update software menimbulkan bug di fitur lain yang tidak terkait. | ✅ [Gingr Reviews](https://www.softwareadvice.com/pet-grooming/gingr-profile/reviews/) |
| **Laporan keuangan tidak akurat** | Accounting reports tidak match dengan realita transaksi. Gingr secara khusus disebut. | ✅ [Gingr Reviews](https://www.softwareadvice.com/pet-grooming/gingr-profile/reviews/) |
| **Software lambat / glitchy** | Performance issues terutama dengan database besar (6000+ clients). | ✅ [Gingr Reviews](https://www.softwareadvice.com/pet-grooming/gingr-profile/reviews/) |
| **Input data lambat di tablet/iPad** | Performance buruk pada mobile devices. | ✅ [Pawfinity Reviews](https://www.softwareadvice.com/pet-grooming/pawfinity-profile/reviews/) |
| **Dashboard refresh mengganggu** | Daftar hewan di dashboard refresh setiap kali update satu entry — mengganggu workflow batch. | ✅ [Gingr Reviews](https://www.softwareadvice.com/pet-grooming/gingr-profile/reviews/) |

### 5.3 Masalah Payment & Integrasi

| Pain Point | Detail | Sumber |
|-----------|--------|--------|
| **Vendor lock-in payment processor** | Dipaksa pakai payment processor bawaan, tidak bisa pakai merchant sendiri. PetExec & Gingr. | ✅ [PetExec Reviews](https://www.softwareadvice.com/pet-grooming/petexec-profile/reviews/), [Gingr Reviews](https://www.softwareadvice.com/pet-grooming/gingr-profile/reviews/) |
| **Integrasi terbatas** | Kurang integrasi dengan software lain (accounting, e-commerce). MoeGo tidak integrasi Shopify → double transaction fee. | ✅ [PetExec Reviews](https://www.softwareadvice.com/pet-grooming/petexec-profile/reviews/), [MoeGo Reviews](https://www.softwareadvice.com/pet-grooming/moego-profile/reviews/) |
| **Pricing structure membingungkan** | Tier harga tidak jelas, banyak fitur terkunci di tier mahal. SMS/email extra cost. | ✅ [Software Advice](https://www.softwareadvice.com/pet-grooming/) |

### 5.4 Masalah Customer Support

| Pain Point | Detail | Sumber |
|-----------|--------|--------|
| **Response time lambat** | Support bisa 3+ hari untuk respon. Gingr & MoeGo disebut. | ✅ [Gingr Reviews](https://www.softwareadvice.com/pet-grooming/gingr-profile/reviews/) |
| **Support via chat/AI saja** | Tidak ada opsi telepon, dipaksa chat dengan AI yang tidak menyelesaikan masalah. | ✅ [MoeGo Reviews Capterra](https://www.capterra.com/p/165732/MoeGo/reviews/?page=2) |
| **Data export / migration sulit** | Tidak bisa export database customer+pet untuk migrasi ke vendor lain. Data lock-in. | ✅ [Pawfinity Reviews](https://www.softwareadvice.com/pet-grooming/pawfinity-profile/reviews/) |

### 5.5 Implikasi untuk Sistem Kita

| Pelajaran | Aksi |
|-----------|------|
| UI harus minimal-step | Setiap workflow utama (booking, check-in, checkout) ≤ 3 klik |
| Pet info lengkap di satu layar | Single-page pet profile dengan semua data penting visible |
| Auto-calculate usia pet | Tampilkan usia otomatis dari DOB, format "2 tahun 3 bulan" |
| Report keuangan akurat | Gunakan double-entry atau reconciliation check |
| Tidak lock-in payment | Support multiple payment methods (cash, transfer, e-wallet) |
| Data portability | Fitur export data CSV/JSON sejak awal |
| Performance di database besar | Pagination, lazy loading, indexing yang benar |
| Recurring appointment yang mudah di-edit | Opsi: edit this one / this & future / all |

---

## 6. Pertimbangan Regulasi

### 6.1 Regulasi Indonesia (Spesifik)

#### Perizinan Usaha (OSS RBA)

Berdasarkan **PP No. 5 Tahun 2021** tentang Penyelenggaraan Perizinan Berusaha Berbasis Risiko:

| Kode KBLI | Deskripsi | Tingkat Risiko | Izin yang Diperlukan |
|-----------|-----------|----------------|---------------------|
| **96990** | Jasa Perorangan Lainnya YTDL (termasuk salon grooming, pet hotel, pelatihan non-medis) | **Menengah Rendah** | NIB + Sertifikat Standar |
| **47754** | Perdagangan Eceran Hewan Kesayangan & Pakan | **Rendah - Menengah Rendah** | NIB |
| **47728** | Perdagangan Eceran Kosmetik untuk Hewan | **Menengah Tinggi** | NIB + Sertifikat Standar |
| **75000** | Aktivitas Kesehatan Hewan (klinik) | **Tinggi** | NIB + Izin operasional klinik + SIP drh |

> **Catatan:** Jika pet shop + grooming, wajib daftarkan **KBLI 47754 + 96990** sekaligus dalam satu NIB.

#### Regulasi Obat Hewan (PP No. 78/1992)

| Golongan | Contoh | Boleh Dijual di Pet Shop? |
|----------|--------|--------------------------|
| **Obat Hewan Bebas** | Vitamin, suplemen oral, shampoo anti-parasit | ✅ Ya, tanpa resep |
| **Obat Hewan Bebas Terbatas** | Obat tetes kutu (spot-on), obat cacing tertentu | ⚠️ Ya, TAPI wajib punya Tanda Daftar Pengecer Obat Hewan dari Dinas Peternakan |
| **Obat Hewan Keras** | Antibiotik, anestesi, vaksin (Rabies, Parvovirus) | ❌ DILARANG dijual bebas, hanya via resep di klinik KBLI 75000 |

#### Regulasi Lingkungan

| Aspek | Kewajiban |
|-------|-----------|
| **Limbah cair** | SPPL (Surat Pernyataan Kesanggupan Pengelolaan dan Pemantauan Lingkungan Hidup) atau UKL/UPL untuk skala besar |
| **Hair trap** | Wajib pasang saringan bulu pada saluran pembuangan air |
| **Kebisingan** | Beberapa daerah (DKI, Tangerang, Surabaya) wajib insulasi peredam suara pada area kandang dan ruang blower |
| **Sanitasi** | Komitmen sanitasi lingkungan, air bersih, desinfeksi kandang rutin |

#### Kesejahteraan Hewan

- **UU No. 41 Tahun 2014** (Perubahan UU No. 18/2009 tentang Peternakan dan Kesehatan Hewan)
- Melarang segala bentuk penelantaran dan penyalahgunaan terhadap hewan
- Wajib menyediakan penanganan darurat jika hewan sakit/cedera selama di-grooming

#### Vaksinasi Rabies

- **Wajib** berdasarkan peraturan pemerintah Indonesia
- Pet grooming salon disarankan (dan di beberapa jurisdiksi diwajibkan) untuk memeriksa status vaksinasi Rabies sebelum menerima hewan

**Sumber:**
- ✅ Legalizin (panduan izin pet shop 2026): https://legalizin.com/blog/panduan-syarat-izin-usaha-pet-shop-dan-grooming-2026-alur-kbli-47754-96990-izin-obat-hewan-dan-oss-rba
- ✅ LegalMP (legalitas petshop): https://legalmp.id/artikel/legalitas/cara-mengurus-izin-usaha-petshop-standar-kesehatan-hewan-legalitas-terbaru/
- ⚠️ 6W Research (Indonesia pet market): https://www.6wresearch.com/industry-report/indonesia-pet-grooming-services-market

### 6.2 Regulasi Internasional (Referensi)

| Negara/Wilayah | Regulasi Kunci | Status |
|----------------|---------------|--------|
| **USA** | Business license wajib; sertifikasi groomer tidak wajib di kebanyakan state tapi direkomendasikan (NDGAA, IPG, ISCC); liability insurance ($300-600/tahun); zoning compliance | ✅ [The Dog Gurus](https://thedoggurus.com/blog/how-to-start-a-pet-grooming-business-in-2026/) |
| **New York City** | Permit dari Dept. of Health; supervising manager wajib lulus Animal Care and Handling Course; inspeksi fasilitas | ✅ [NYC Business](https://nyc-business.nyc.gov/nycbusiness/description/small-animal-grooming-establishment-permit) |
| **Toronto** | Pet Grooming endorsement pada licence; wajib cek vaksinasi up-to-date sebelum terima hewan; inspeksi intake per hewan; bathtub anti-slip | ✅ [Toronto Licensing](https://www.toronto.ca/legdocs/mmis/2025/ec/bgrd/backgroundfile-256789.pdf) |
| **UK/Scotland** | Animal Welfare Act 2006; konsultasi untuk licensing scheme formal; registrasi HMRC; GDPR compliance; public liability insurance wajib | ✅ [Gov.scot](https://www.gov.scot/publications/licensing-activities-involving-animals-consultation-document/pages/3/), [LegalVision UK](https://legalvision.co.uk/business-structures/dog-grooming-legal/) |

### 6.3 Implikasi untuk Fitur Sistem

| Regulasi | Fitur yang Dibutuhkan |
|----------|----------------------|
| Vaksinasi Rabies wajib | **Vaccination status check** — warning/block saat booking jika Rabies expired |
| Klasifikasi obat hewan | **Product category flags** — tandai produk yang butuh izin khusus, cegah penjualan obat keras |
| SPPL / lingkungan | **Record keeping** — log penggunaan air, desinfeksi, dan waste management (opsional, untuk audit) |
| Perlindungan data (UU PDP Indonesia) | **Data privacy** — consent management, data encryption, export/delete customer data |
| Kesejahteraan hewan | **Intake checklist** — form inspeksi kondisi hewan saat check-in |
| Pencatatan transaksi (pajak) | **Tax reporting** — laporan penjualan untuk pelaporan pajak |

---

## Ringkasan Temuan Utama

### Fitur MVP yang Direkomendasikan (Fase 1)

1. ✅ **Owner & Pet Management** — profil lengkap, multiple pets per owner
2. ✅ **Service Catalog** — dengan pricing by breed/size
3. ✅ **Appointment Scheduling** — calendar view, drag-drop, status tracking
4. ✅ **Grooming Notes** — per visit, before/after photo
5. ✅ **Vaccination Tracking** — dengan expiry alerts dan visual indicators
6. ✅ **Basic POS** — payment tracking, receipt generation
7. ✅ **Product Inventory** — stock tracking, reorder alerts, barcode
8. ✅ **Notifications** — appointment reminders, vaccination alerts
9. ✅ **Basic Reporting** — revenue, appointment count, popular services

### Fitur Fase 2 (Enhancement)

- Online booking portal untuk customer
- Loyalty/membership program
- Commission & payroll tracking
- Advanced analytics & trend reports
- Marketing campaigns (email/SMS)
- Digital contracts/agreements
- Multi-pet booking dalam satu visit

### Keunggulan Kompetitif yang Bisa Diambil

Berdasarkan pain points yang ditemukan:

1. **UI sederhana** — target ≤ 3 klik untuk setiap workflow utama
2. **Single-page pet view** — semua info penting visible tanpa berpindah halaman
3. **Data portability** — export CSV/JSON kapan saja
4. **No payment processor lock-in** — support cash, transfer, e-wallet
5. **Accurate financial reports** — prioritaskan kebenaran data keuangan
6. **Indonesia-first** — jadwal vaksinasi lokal, integrasi e-wallet (GoPay, OVO, DANA), bahasa Indonesia, format Rupiah
7. **WhatsApp integration** — channel komunikasi utama di Indonesia (bukan SMS)

---

*Dokumen ini dibuat berdasarkan riset dari sumber resmi dan review pengguna real. Setiap temuan ditandai dengan status verifikasi dan sumber URL.*
