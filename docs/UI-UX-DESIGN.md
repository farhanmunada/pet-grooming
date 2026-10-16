# UI/UX DESIGN — PetKasih (Pet Grooming & Pet Shop Management)

**Versi:** 1.0  
**Tanggal:** 16 Oktober 2026  
**Stack:** Nuxt 4, Nuxt UI v4, Tailwind CSS v4, TypeScript  
**Bahasa UI:** Bahasa Indonesia  
**Konteks:** Single-tenant web-based pet grooming salon management system

---

## 1. Design Principles

### 1.1 Simplicity: Max 3 Clicks Per Workflow
- **Target:** Setiap tugas (booking, POS, cek vaksinasi) selesai dalam ≤ 3 klik dari dashboard.
- **Penerapan:**
  - Dashboard shortcuts untuk 5 aksi paling sering (Booking Baru, Check-in, POS, Cari Pet, Lihat Jadwal).
  - Multi-step forms diubah menjadi single-page form atau tab-based form tanpa page reload.
  - Search/filter instantly di list pages (debounce 300ms, no page reload).
  - Quick-action buttons di setiap row (Edit, Delete, Check-in, Complete, Cancel tanpa modal konfirmasi, hanya toast feedback).

### 1.2 Pet-Centric View: All Pet Data Visible on 1 Screen
- **Target:** Groomer/staff tidak perlu scroll berpindah-pindah saat melayani pet di salon.
- **Penerapan:**
  - Pet detail page menampilkan dalam satu viewport (≤ 1920px height pada desktop):
    - Foto + basic info (nama, spesies, breed, usia, berat, gender, warna).
    - Vaksinasi status badge (hijau/kuning/merah).
    - Temperament flags (anxious, aggressive, calm).
    - Alergi & catatan medis penting.
    - 5 riwayat grooming terakhir (compact list).
    - Quick links (riwayat vaksinasi lengkap, transaksi, edit).
  - Gunakan card-based layout, bukan tab untuk memaksimalkan info yang terlihat.
  - Ukuran font readable pada 1024px width (tablet di salon).

### 1.3 Efficiency: Minimize Data Entry, Maximize Pre-fills & Auto-calculations
- **Target:** Staff input data sekecil mungkin; sistem auto-calculate sisanya.
- **Penerapan:**
  - Appointment form: Pilih owner → pet → service → datetime. Groomer, price, durasi auto-filled.
  - POS form: Search produk → auto-fill harga, kategori. Qty input → auto-calculate line total.
  - Vaccination form: Jika expiry kosong → auto-calc +1 tahun dari tanggal pemberian.
  - Pet age auto-calc dari DOB; update setiap hari.
  - Service pricing auto-lookup dari pet size + breed.

### 1.4 Accessibility: WCAG AA Minimum
- **Kontras:** ≥ 4.5:1 untuk teks vs background.
- **Keyboard nav:** Semua form/button navigable via Tab, Enter, Space, Escape.
- **Labels:** Setiap input mempunyai associated label (bukan placeholder saja).
- **Focus indicator:** Visible focus ring di setiap focusable element (outline 2px solid #3b82f6).
- **ARIA labels:** Button dengan icon saja harus punya aria-label. Modal harus aria-modal="true", dialogTitle.
- **Color not only:** Status indicator (badge) pakai icon + warna + text (bukan warna saja).
- **Loading state:** Tidak freeze UI; show spinner atau skeleton loader.
- **Error messages:** Warna merah + icon ⚠️ + text informatif, bukan hanya warna.

### 1.5 Indonesia Context
- **Bahasa:** UI 100% Bahasa Indonesia (kecuali technical terms).
- **Currency:** Rupiah (Rp 150.000) — display dengan pemisah ribuan titik, bukan koma. Tanpa sen/subunit (integer only).
- **Phone format:** Validasi Indonesia: `+62xxx` atau `08xx`, 10-13 digit.
- **Timezone:** WIB (UTC+7) default. Datetime picker selalu tampilkan zona (e.g., "14:30 WIB").
- **Vaccination schedule:** Indonesia standard (Rabies mandatory, DHPP, Tetracat untuk kucing).
- **WhatsApp links:** Generate `wa.me/62xxx?text=...` untuk komunikasi langsung.
- **Pet culture:** Terminologi lokal (grooming styles, jenis shampoo umum di Indonesia, etc.).

---

## 2. Wireframes (ASCII-based per Halaman Kunci)

### 2.1 Dashboard (`/`)

```
┌──────────────────────────────────────────────────────────────────┐
│ 🏠 PetKasih Dashboard — Rabu, 16 Oktober 2026                   │
├──────────────────────────────────────────────────────────────────┤
│ Quick Actions:                                                   │
│ [➕ Booking Baru]  [🛒 POS]  [🔍 Cari Pet]  [📅 Jadwal]  [⚠️ Alert]
├──────────────────────────────────────────────────────────────────┤
│ STATS (4-column grid):                                           │
│ ┌──────────────┬──────────────┬──────────────┬──────────────┐    │
│ │ Appointment  │ Pendapatan    │ Stok Menipis │ Vaksin       │    │
│ │ Hari Ini     │ Hari Ini      │              │ Akan Expired │    │
│ │              │              │              │              │    │
│ │ 8            │ Rp 2.450.000  │ 3            │ 5            │    │
│ │ dengan ▼     │ ▲ Rp 300.000  │ produk       │ pet dalam    │    │
│ │              │ vs kemarin    │              │ 30 hari      │    │
│ └──────────────┴──────────────┴──────────────┴──────────────┘    │
├──────────────────────────────────────────────────────────────────┤
│ APPOINTMENT HARI INI (tabel compact):                            │
│ Waktu | Pet       | Owner          | Layanan      | Groomer | ⚡ │
│ ──────┼───────────┼────────────────┼──────────────┼─────────┼──  │
│ 08:30 | Buddy     | Budi Santoso   | Full Groom   | Ani     | ✅  │
│       |           |                |              |         | [C] │
│ ──────┼───────────┼────────────────┼──────────────┼─────────┼──  │
│ 10:00 | Milo      | Siti Aminah    | Bath & Brush | Budi    | ◻️  │
│       |           |                |              |         | [C] │
│ ──────┼───────────┼────────────────┼──────────────┼─────────┼──  │
│ ... (max 5 baris) [Lihat Semua →]                                │
├──────────────────────────────────────────────────────────────────┤
│ 2-COLUMN LAYOUT:                                                 │
│ ┌──────────────────────────┬──────────────────────────┐         │
│ │ STOK MENIPIS             │ VAKSINASI EXPIRING       │         │
│ │ • Shampoo Oatmeal (2)    │ • Buddy: Rabies (3 hari) │         │
│ │ • Dog Shampoo (1)        │ • Milo: DHPP (7 hari)    │         │
│ │ • Conditioner (0 - ORDER) │ • Ci-Ci: F4 (14 hari)   │         │
│ │ [Export CSV]             │ [Kirim Reminder via WA]  │         │
│ └──────────────────────────┴──────────────────────────┘         │
└──────────────────────────────────────────────────────────────────┘

Quick Action Behaviors:
- [➕ Booking Baru] → navigate to /appointments/new
- [✅ Check-in] on appointment → PATCH /api/appointments/:id/status (InProgress) → toast "Check-in berhasil"
- [◻️ Complete] → PATCH /api/appointments/:id/status (Completed) → redirect to form grooming note
- Stats cards clickable → navigate to respective report/list page
```

**UI States:**
- **Loading:** Skeleton cards di place of stats, appointment list.
- **Empty:** "Belum ada appointment hari ini. [+ Buat Appointment]"
- **Error:** Alert merah "Gagal memuat data. [Coba Lagi]"

---

### 2.2 Owner Management (`/owners`)

```
┌──────────────────────────────────────────────────────────────────┐
│ 👥 Daftar Owner                                                  │
├──────────────────────────────────────────────────────────────────┤
│ [🔍 Cari nama/telepon...]        [+ Tambah Owner Baru]          │
│ Filters: [Semua] [Aktif] [Inactive]                             │
├──────────────────────────────────────────────────────────────────┤
│ TABLE:                                                            │
│ Nama          | Telepon       | Email              | Pet | ⚙️   │
│ ──────────────┼───────────────┼────────────────────┼─────┼──    │
│ Budi Santoso  | 0812-3456-789 | budi@email.com     │ 2   │ [●] │
│               |               |                    |     │      │
│ Siti Aminah   | 0852-9876-543 | siti@mail.co.id    │ 1   │ [●] │
│               |               |                    |     │      │
│ ... (pagination: 20 per halaman)                               │
│                                                                 │
│ Menu [●]: ◄─► [Edit] [Lihat Detail] [Hapus]                    │
│                                                                 │
│ [◀ Prev] Page 1 of 15 [Next ▶]                                │
└──────────────────────────────────────────────────────────────────┘

Owner Detail Modal (on click row):
┌────────────────────────────────┐
│ Budi Santoso — 0812-3456-789   │
│ budi@email.com                 │
│ Jln. Merdeka No. 123, Jakarta   │
│ Pref: WhatsApp | Loyalty: 100 poin
│ Catatan: Loyal customer, suka full groom
│                                │
│ PETS (2):                       │
│ • Buddy (Golden Retriever, 2y) │
│ • Rusty (Pug, 1y)              │
│                                │
│ [Edit] [+ Tambah Pet] [Hapus]   │
└────────────────────────────────┘
```

**Form: Owner (New/Edit)**
```
Form Title: "Tambah Owner Baru" atau "Edit Owner"

FIELDS (all required except email, address, notes):
┌────────────────────────────────────────────┐
│ Nama *                                     │
│ [________________]                         │
│ (min 2 char, max 100)                      │
│                                            │
│ Nomor Telepon *                            │
│ [0812-1234-5678]                           │
│ (validation: +62 atau 08, 10-13 digit)    │
│                                            │
│ Email                                      │
│ [budi@email.com]                           │
│ (optional)                                 │
│                                            │
│ Alamat                                     │
│ [Jln. Merdeka No. 123, Jakarta]            │
│ (optional, max 500 char)                   │
│                                            │
│ Preferensi Komunikasi *                    │
│ ○ Email  ○ WhatsApp (default)  ○ SMS       │
│                                            │
│ Catatan                                    │
│ [Multi-line input for staff notes]         │
│                                            │
│ [Simpan] [Batal]                           │
└────────────────────────────────────────────┘

Validation Errors:
- "Nomor telepon sudah terdaftar atas nama Siti Aminah" (409 conflict)
- "Nomor telepon tidak valid. Gunakan format 08xx atau +62xx" (400)
- "Nama wajib diisi" (empty)

Success Feedback:
Toast: "Owner berhasil disimpan" (3 detik, dismiss auto)
```

---

### 2.3 Pet Profile (`/pets/:id`)

```
┌──────────────────────────────────────────────────────────────────┐
│ Back ◄  Buddy — Golden Retriever  [Edit] [Hapus]               │
├──────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ [📷 Foto Pet]  │ Nama: Buddy                                 │ │
│ │ (200x200)      │ Spesies: Anjing • Breed: Golden Retriever   │ │
│ │                │ Usia: 2 tahun 3 bulan (DOB: 15 Jul 2024)    │ │
│ │ [Ganti Foto]   │ Gender: Jantan • Berat: 28 kg • Warna: Emas │ │
│ │                │                                               │ │
│ │                │ Owner: Budi Santoso (0812-3456-789)         │ │
│ │                │ Status: [🟢 Vaksinasi Up-to-date]           │ │
│ │                │ Temperamen: [⚠️ Gugup saat blow-dry]       │ │
│ │                │ Status Steril: Ya • Microchip: ABC123456789  │ │
│ └─────────────────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────┤
│ IMPORTANT INFO:                                                  │
│ Alergi: Shampoo parfum kuat                                      │
│ Catatan Medis: Kulit sensitif, gunakan shampoo hypoallergenic    │
├──────────────────────────────────────────────────────────────────┤
│ TABS: [Info Dasar ✓] [Grooming (5)] [Vaksinasi (3)] [Transaksi] │
├──────────────────────────────────────────────────────────────────┤
│ TAB: Grooming History (latest first)                             │
│ ─────────────────────────────────────────────────────────────    │
│ 12 Okt 2026 | Full Groom | Ani                                   │
│   Blade #10, Oatmeal shampoo, calm behavior                      │
│   [📷 Before] [📷 After]                                         │
│   ─                                                               │
│ 30 Sep 2026 | Bath & Brush | Budi                               │
│   Baju Renang shampoo, anxious                                   │
│   [📷 Before] [📷 After]                                         │
│   ─                                                               │
│ [Lihat Semua →]                                                  │
├──────────────────────────────────────────────────────────────────┤
│ TAB: Vaccination Status                                          │
│ [🟢 Rabies] expired 2025-10-15 (Aktif)                          │
│ [🟢 DHPP] expired 2025-11-20 (Aktif)                            │
│ [🟡 Leptospirosis] expired 2026-10-20 (7 hari) [⚠️ Alert]       │
│ [+ Tambah Vaksinasi]                                             │
├──────────────────────────────────────────────────────────────────┤
│ TAB: Transaction History                                         │
│ 12 Okt 2026 | Full Groom | Rp 150.000 | Lunas                   │
│ 30 Sep 2026 | Bath + Shampoo | Rp 120.000 | Lunas               │
│ [Lihat Semua →]                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Quick Actions:**
- Foto: Click untuk zoom, hover untuk [Ganti Foto] button.
- Tab clicks tidak reload halaman, hanya swap konten.
- [Edit] → navigate to /pets/:id/edit
- [Hapus] → modal konfirmasi "Yakin hapus pet?" (soft-delete)
- [Tambah Vaksinasi] → inline form atau modal:

**Form: Tambah Vaksinasi (inline/modal)**
```
┌──────────────────────────────────────────┐
│ Tambah Vaksinasi — Buddy                 │
├──────────────────────────────────────────┤
│ Nama Vaksin *                            │
│ [Pilih: Rabies|DHPP|Leptospirosis|...▼] │
│                                          │
│ Jenis Vaksin *                           │
│ ○ Core (wajib)  ○ Non-Core (optional)   │
│                                          │
│ Tanggal Pemberian *                      │
│ [15-10-2025]                             │
│                                          │
│ Tanggal Kadaluarsa                       │
│ [15-10-2026]                             │
│ (auto-filled +1 tahun jika kosong)       │
│                                          │
│ Diberikan oleh                           │
│ [Dr. Hewan ABC Clinic]                   │
│                                          │
│ Nomor Batch                              │
│ [BATCH-2025-123]                         │
│                                          │
│ Upload Bukti (optional)                  │
│ [Choose file - JPEG/PNG/PDF max 5MB]     │
│                                          │
│ Catatan                                  │
│ [Multi-line input]                       │
│                                          │
│ [Simpan] [Batal]                         │
└──────────────────────────────────────────┘
```

---

### 2.4 Appointment Scheduling (`/appointments/new` - multi-step form)

```
┌──────────────────────────────────────────────────────────────────┐
│ Buat Appointment Baru                    [Progress: 1/4]        │
├──────────────────────────────────────────────────────────────────┤
│ STEP 1: PILIH OWNER                                              │
│                                                                  │
│ Cari Owner: [🔍 Nama atau telepon...]                            │
│                                                                  │
│ Hasil:                                                            │
│ ┌────────────────────────────────────────┐                      │
│ │ Budi Santoso • 0812-3456-789          │ [Pilih]              │
│ └────────────────────────────────────────┘                      │
│ ┌────────────────────────────────────────┐                      │
│ │ Siti Aminah • 0852-9876-543            │ [Pilih]              │
│ └────────────────────────────────────────┘                      │
│                                                                  │
│ Tidak ada? [+ Buat Owner Baru]                                   │
│                                                                  │
│ [Batal]                                 [Lanjut →]              │
└──────────────────────────────────────────────────────────────────┘

STEP 2 (on click [Lanjut]):
┌──────────────────────────────────────────────────────────────────┐
│ Buat Appointment Baru                    [Progress: 2/4]        │
├──────────────────────────────────────────────────────────────────┤
│ Owner: Budi Santoso (0812-3456-789)  [Ubah]                      │
│                                                                  │
│ STEP 2: PILIH PET                                                │
│                                                                  │
│ Pets milik owner:                                                │
│ ┌────────────────────────────────────────┐                      │
│ │ 🐕 Buddy • Golden Retriever            │ [Pilih]              │
│ │    2 tahun 3 bulan • 28 kg             │                      │
│ │    Status: [🟢 Vaksinasi OK]           │                      │
│ └────────────────────────────────────────┘                      │
│ ┌────────────────────────────────────────┐                      │
│ │ 🐕 Rusty • Pug                         │ [Pilih]              │
│ │    1 tahun • 8 kg                      │                      │
│ │    Status: [🟡 Vaksinasi exp 7 hari]   │                      │
│ │    ⚠️ Lanjutkan booking? [Ya] [Tidak]   │                      │
│ └────────────────────────────────────────┘                      │
│                                                                  │
│ [← Kembali]                             [Lanjut →]              │
└──────────────────────────────────────────────────────────────────┘

STEP 3 (on click [Lanjut]):
┌──────────────────────────────────────────────────────────────────┐
│ Buat Appointment Baru                    [Progress: 3/4]        │
├──────────────────────────────────────────────────────────────────┤
│ Owner: Budi Santoso  |  Pet: Buddy  [Ubah]                       │
│                                                                  │
│ STEP 3: PILIH GROOMER, TANGGAL, & LAYANAN                       │
│                                                                  │
│ Groomer * (Availability akan dicek)                             │
│ [Ani (Specialist in curly coats) ▼]                             │
│ [Budi] [Ani] [Siti]  (click untuk lihat availability)           │
│                                                                  │
│ Tanggal & Jam * (sesuai groomer availability)                   │
│ [16 Oktober 2026] [14:00] (format: DD-MM-YYYY HH:MM WIB)        │
│ Available slots: 09:00, 10:30, 14:00, 15:30, 17:00              │
│ (slots calculated from groomer schedule)                        │
│                                                                  │
│ Layanan(s) * (multi-select)                                     │
│ ☑ Full Groom (60 min) — Rp 150.000                              │
│ ☐ Bath & Brush (45 min) — Rp 120.000                            │
│ ☐ Nail Trim (15 min) — Rp 30.000                                │
│ ☐ Ear Clean (10 min) — Rp 20.000                                │
│ ☐ Teeth Cleaning (20 min) — Rp 50.000                           │
│                                                                  │
│ Catatan (optional)                                              │
│ [Gugup saat blow-dry, gunakan suara lembut]                     │
│                                                                  │
│ SUMMARY (auto-calculated):                                       │
│ Estimated duration: 60 min                                       │
│ Total price: Rp 150.000                                          │
│                                                                  │
│ [← Kembali]                             [Review →]              │
└──────────────────────────────────────────────────────────────────┘

STEP 4 (Review & Confirm):
┌──────────────────────────────────────────────────────────────────┐
│ Buat Appointment Baru                    [Progress: 4/4]        │
├──────────────────────────────────────────────────────────────────┤
│ REVIEW & CONFIRM                                                 │
│                                                                  │
│ Owner: Budi Santoso (0812-3456-789)                              │
│ Pet: Buddy (Golden Retriever, 2y 3m)                             │
│ Groomer: Ani                                                     │
│ Jadwal: Rabu, 16 Oktober 2026 — 14:00 WIB                        │
│ Layanan: Full Groom                                              │
│ Durasi: ~60 menit                                                │
│ Total: Rp 150.000                                                │
│ Catatan: Gugup saat blow-dry, gunakan suara lembut               │
│                                                                  │
│ [← Edit]                                [Konfirmasi Booking]    │
└──────────────────────────────────────────────────────────────────┘

On Submit:
POST /api/appointments
Response: 201 { data: Appointment, message: "Booking berhasil dibuat" }
Toast: "Appointment berhasil dibuat. ID: #APT-12345" (with WhatsApp share button)
Navigate to /appointments/:id
```

**Validation & Interactions:**
- Step 1: Owner required, search debounced 300ms, min 2 char.
- Step 2: Pet required, display vaccine warning if expired.
- Step 3: Groomer required, real-time slot calculation based on `/api/groomers/:id/schedule?date=X`.
- Step 4: Disable [Konfirmasi] if any field invalid.

---

### 2.5 Grooming Session (`/appointments/:id` during InProgress state)

```
┌──────────────────────────────────────────────────────────────────┐
│ Appointment #APT-12345 — Buddy (Grooming In Progress)           │
├──────────────────────────────────────────────────────────────────┤
│ STATUS: [🟡 IN PROGRESS]                                        │
│ Check-in: 14:05  |  Estimated end: 15:05  |  Duration so far: 4min
│                                                                  │
│ QUICK ACTIONS:                                                   │
│ [⏹️ Selesai & Buat Catatan] [⏸️ Pause] [❌ Cancel] [📞 Call Owner]
├──────────────────────────────────────────────────────────────────┤
│ PET INFO:                                                        │
│ [Foto Buddy]  Buddy | Golden Retriever | 2y 3m | 28kg           │
│ Temperamen: Gugup saat blow-dry                                  │
│ Alergi: Shampoo parfum kuat                                      │
│ Riwayat grooming: Full Groom (30 Sep) — blade #10, calm          │
├──────────────────────────────────────────────────────────────────┤
│ GROOMING NOTES (real-time form):                                 │
│                                                                  │
│ Blade Size: [# 10 ▼]                                             │
│ Shampoo: [Oatmeal Hypoallergenic ▼]                              │
│ Conditioning: ☑ Yes                                              │
│ Dryer Type: [Force Dryer] ○ Cage Dryer                           │
│                                                                  │
│ Style Notes: [Multi-line input - capture style specifics]        │
│ [Rounded face, leave long on ears]                               │
│                                                                  │
│ Behavior Notes: [Multi-line input]                               │
│ [Calm throughout, gentle with front paws]                        │
│                                                                  │
│ Skin Condition: [Normal ▼]  ☐ Flag skin issue                    │
│ If flagged: [Recommend owner to vet]                             │
│                                                                  │
│ Photo Upload:                                                    │
│ [+ Add BEFORE photo] [+ Add AFTER photo]                         │
│ (JPEG/PNG/WebP max 5MB each)                                     │
│ Uploads: [Preview thumbnails if added]                          │
│                                                                  │
│ [Draft] (auto-save)  [Selesai]                                   │
└──────────────────────────────────────────────────────────────────┘

On Click [Selesai]:
PATCH /api/appointments/:id/status { status: "Completed" }
POST /api/appointments/:id/notes { bladeSize, shampooUsed, styleNotes, behaviorNotes, skinCondition }
POST /api/grooming-notes/:id/photos { before, after files }

Response: Success toast "Grooming selesai. Lanjut ke POS atau cek appointment lain."

Next action: Suggest transaction form (POS) atau kembali ke dashboard
```

---

### 2.6 Vaccination Alerts (`/vaccinations/alerts`)

```
┌──────────────────────────────────────────────────────────────────┐
│ ⚠️ Vaksinasi Expiring — Batch Reminder                           │
├──────────────────────────────────────────────────────────────────┤
│ Filter: [Semua] [Sudah Expired] [7 hari] [14 hari] [30 hari]   │
│ [Export CSV] [Kirim Semua via WA]                                │
├──────────────────────────────────────────────────────────────────┤
│ 🔴 SUDAH EXPIRED (4 pet)                                        │
│ ─────────────────────────────────────────────────────────────    │
│ Pet: Fluffy | Owner: Siti (0852-9876-543)                       │
│ Vaksin: Rabies | Expired: 15-10-2025 (370 hari lalu)            │
│ [Kirim Reminder WA] [Edit Pet]                                   │
│ ─────────────────────────────────────────────────────────────    │
│ Pet: Max | Owner: Yudhi (0877-1234-567)                          │
│ Vaksin: DHPP | Expired: 01-09-2026 (45 hari lalu)               │
│ [Kirim Reminder WA] [Edit Pet]                                   │
│                                                                  │
│ 🟠 EXPIRED DALAM 7 HARI (2 pet)                                 │
│ ─────────────────────────────────────────────────────────────    │
│ Pet: Buddy | Owner: Budi (0812-3456-789)                        │
│ Vaksin: Leptospirosis | Expires: 20-10-2026 (4 hari)           │
│ [Kirim Reminder WA] [Edit Pet]                                   │
│ ─────────────────────────────────────────────────────────────    │
│ Pet: Ci-Ci | Owner: Hana (0813-5678-901)                        │
│ Vaksin: F4 (Tetracat) | Expires: 22-10-2026 (6 hari)           │
│ [Kirim Reminder WA] [Edit Pet]                                   │
│                                                                  │
│ 🟡 EXPIRED DALAM 30 HARI (5 pet)                                │
│ ─────────────────────────────────────────────────────────────    │
│ [Similar format, collapsible section]                            │
│                                                                  │
│ [Export CSV untuk supplier]                                      │
└──────────────────────────────────────────────────────────────────┘

On Click [Kirim Reminder WA]:
GET /api/vaccinations/alerts/whatsapp/:petId
Response: {
  url: "https://wa.me/6285298765432?text=Halo%20Siti%2C%20vaksinasi...",
  message: "Halo Siti, vaksinasi Rabies untuk Fluffy sudah expired sejak 15-10-2025. Silakan segera jadwalkan booster. Terima kasih - PetKasih Grooming"
}
Action: Open link di tab baru (staff review & send manual)
Toast: "Link WhatsApp siap dibagikan. Silakan review pesan dan kirim."
```

---

### 2.7 POS Checkout (`/pos`)

```
┌────────────────────────────────┬──────────────────────────────────┐
│ 🛒 POINT OF SALE               │ 📋 KERANJANG CHECKOUT           │
├────────────────────────────────┼──────────────────────────────────┤
│ Owner (optional):              │ ITEMS:                            │
│ [🔍 Cari owner...]             │ 1x Full Groom (L) @150.000       │
│                                │    Qty: [1 ▼] [✕]                │
│ OR [+ Owner Baru]              │    Subtotal: Rp 150.000           │
│                                │                                  │
│ ─────────────────────────────  │ 1x Shampoo Oatmeal @85.000       │
│                                │    Qty: [2 ▼] [✕]                │
│ SELECT ITEM:                   │    Subtotal: Rp 170.000           │
│ Tab: [Layanan] [Produk]        │                                  │
│                                │ ────────────────────────────     │
│ [Cari produk/layanan...]       │ SUBTOTAL:     Rp 320.000         │
│                                │ DISKON:       Rp      0 [-]      │
│ HASIL (Tab: Layanan):          │ ────────────────────────────     │
│ [+ Full Groom (L)] Rp 150.000  │ TOTAL:        Rp 320.000 ★       │
│ [+ Bath & Brush] Rp 120.000    │                                  │
│ [+ Nail Trim] Rp 30.000        │ ────────────────────────────     │
│ [+ Teeth Clean] Rp 50.000      │ METODE PEMBAYARAN:               │
│                                │ ○ Tunai  ○ Transfer  ○ E-Wallet  │
│ Tab: [Produk]                  │ (default: Tunai)                 │
│ [+ Shampoo Oatmeal] Rp 85.000  │                                  │
│ [+ Dog Shampoo] Rp 75.000      │ ────────────────────────────     │
│ [+ Conditioner] Rp 45.000      │ [Proses Pembayaran]              │
│ [+ Ear Powder] Rp 25.000       │ [Cetak Struk]                    │
│                                │ [Share WhatsApp]                 │
│ ... (pagination if >10 items)  │ [Reset Keranjang]                │
└────────────────────────────────┴──────────────────────────────────┘

On Click [+ Full Groom]:
Adds item to keranjang
Cart updates: qty auto +1 if same item, else append
Subtotal, Total auto-recalculate
Toast: "Full Groom ditambahkan ke keranjang"

On Click Diskon [-]:
Modal Diskon:
┌──────────────────────────────┐
│ Terapkan Diskon              │
├──────────────────────────────┤
│ Tipe Diskon:                 │
│ ○ Nominal (Rp) ○ Persen (%)  │
│                              │
│ Jumlah: [50000]              │
│ (nominal: max sampai total)  │
│ (persen: auto-calc Rp)       │
│                              │
│ Alasan: [Member|Promo|Other] │
│                              │
│ [Terapkan] [Batal]           │
└──────────────────────────────┘

On Click [Proses Pembayaran]:
POST /api/transactions
{
  ownerId?: number,
  type: "Mixed" | "Service" | "Product",
  discount: number,
  paymentMethod: "Cash" | "Transfer" | "EWallet",
  paymentStatus: "Paid" | "Pending",
  items: [{ itemType, serviceId/productId, quantity, unitPrice, discount }]
}

Response: 201 { data: Transaction }
Toast: "Transaksi berhasil #TXN-12345"

Then show Receipt Preview:
┌──────────────────────────────┐
│ PetKasih Grooming & Pet Shop  │
│ Jln. Merdeka No. 123, Jakarta │
│ 0812-1234-5678               │
├──────────────────────────────┤
│ TXN #TXN-12345               │
│ 16-10-2026 14:30 WIB         │
│                              │
│ Owner: Budi Santoso          │
│ Pet: Buddy                   │
│                              │
│ ─────────────────────────────│
│ 1x Full Groom   Rp 150.000   │
│ 2x Shampoo      Rp 170.000   │
│ ─────────────────────────────│
│ Subtotal        Rp 320.000   │
│ Diskon 0%       Rp       0   │
│ ─────────────────────────────│
│ TOTAL           Rp 320.000   │
│ ─────────────────────────────│
│ Pembayaran: Tunai            │
│ Status: LUNAS                │
│                              │
│ Terima kasih telah memilih   │
│ PetKasih Grooming!           │
│ [print]  [WhatsApp]  [Close] │
└──────────────────────────────┘

On Click [Cetak Struk]:
window.print() → browser print dialog
Receipt print layout (80mm POS paper)

On Click [Share WhatsApp]:
GET /api/transactions/:id/receipt
Response: { html: "...", whatsappUrl: "https://wa.me/..." }
open(whatsappUrl)
```

---

### 2.8 Product Inventory (`/products`)

```
┌──────────────────────────────────────────────────────────────────┐
│ 📦 Inventori Produk                                              │
├──────────────────────────────────────────────────────────────────┤
│ [🔍 Cari produk/SKU...]  [+ Tambah Produk]                       │
│ Filters: [Kategori ▼] [Species ▼] [Stok: Semua|Menipis|Expired] │
├──────────────────────────────────────────────────────────────────┤
│ TABLE:                                                            │
│ Nama            | SKU      | Stok  | Reorder | Expired | Harga  | ⚙️ │
│ ────────────────┼──────────┼───────┼─────────┼─────────┼────────┼─── │
│ Shampoo Oatmeal │ SHA-001  │  🟢 5 │   10    │ 30-11   │ 85.000 │ [●]│
│                 │          │       │         │         │        │    │
│ Dog Shampoo     │ SHA-002  │  🟡 2 │   10    │ —       │ 75.000 │ [●]│
│                 │          │       │  ORDER  │         │        │    │
│                 │          │       │ NOW ⚠️  │         │        │    │
│ Conditioner     │ CON-001  │  🔴 0 │   10    │ —       │ 45.000 │ [●]│
│                 │          │       │  EMPTY  │         │        │    │
│                 │          │       │         │         │        │    │
│ Ear Powder      │ EAR-001  │  🟢 15│   5     │ 15-12   │ 25.000 │ [●]│
│                 │          │       │         │         │        │    │
│ ... (20 per halaman)                                              │
│                                                                  │
│ Stock Color Legend:                                               │
│ 🟢 > reorder level  |  🟡 = reorder level  |  🔴 <= 0             │
│                                                                  │
│ Menu [●]: [Lihat Detail] [Edit] [Adjust Stok] [Hapus]           │
│                                                                  │
│ [◀ Prev] Page 1 of 8 [Next ▶]                                  │
└──────────────────────────────────────────────────────────────────┘

Product Detail Modal:
┌────────────────────────────────────┐
│ Shampoo Oatmeal Hypoallergenic      │
├────────────────────────────────────┤
│ SKU: SHA-001                        │
│ Barcode: 1234567890123              │
│ Category: Health/Shampoo            │
│ Brand: PetCare Premium              │
│ Target Species: Dog                 │
│ ⚠️ Restricted Medicine: No           │
│                                    │
│ Harga Jual: Rp 85.000               │
│ Harga Modal: Rp 40.000              │
│ Margin: 52.9%                       │
│                                    │
│ Stok: 5 unit                        │
│ Reorder Level: 10                   │
│ Expiry: 30-11-2026                  │
│ Berat: 250g                         │
│                                    │
│ Deskripsi: Gentle shampoo untuk...  │
│                                    │
│ Activity Log:                       │
│ • +5 StockOpname by Ani (16 Oct)    │
│ • -2 Sale by Budi (15 Oct)          │
│ • +1 Return by Ani (14 Oct)         │
│                                    │
│ [Edit] [Adjust Stok] [Hapus]        │
└────────────────────────────────────┘

Form: Adjust Stok
┌─────────────────────────────────┐
│ Sesuaikan Stok — SHA-001        │
├─────────────────────────────────┤
│ Stok Saat Ini: 5                │
│                                 │
│ Adjustment:                     │
│ ○ Tambah  ○ Kurangi             │
│                                 │
│ Jumlah: [5]                     │
│ Alasan: [Damaged ▼]             │
│ Options:                        │
│  - Damaged                      │
│  - Lost                         │
│  - Return                       │
│  - StockOpname                  │
│  - InternalUse                  │
│                                 │
│ Catatan: [Multi-line input]     │
│ "Rusak saat shipping"           │
│                                 │
│ [Simpan] [Batal]                │
└─────────────────────────────────┘
```

---

### 2.9 Reports/Analytics (`/reports/revenue` example)

```
┌──────────────────────────────────────────────────────────────────┐
│ 📊 Laporan Pendapatan                                            │
├──────────────────────────────────────────────────────────────────┤
│ Periode: [Pilih: Hari ini | Minggu | Bulan | Custom range ▼]    │
│ From: [16-10-2026]  To: [16-10-2026]                             │
│ [Tampilkan]                                                      │
├──────────────────────────────────────────────────────────────────┤
│ KEY METRICS:                                                     │
│ Total Pendapatan: Rp 2.450.000  ▲ +15% vs kemarin               │
│ Transaksi: 8  |  Rata-rata: Rp 306.250                           │
├──────────────────────────────────────────────────────────────────┤
│ BREAKDOWN BY CATEGORY:                                           │
│ Grooming:  Rp 1.850.000 (75.5%)  [████████░]                     │
│ Produk:    Rp 600.000 (24.5%)   [██░░░░░░░]                      │
├──────────────────────────────────────────────────────────────────┤
│ BREAKDOWN BY PAYMENT METHOD:                                     │
│ Tunai:     Rp 1.200.000 (49%)   [█████░░░░░]                     │
│ Transfer:  Rp 900.000 (37%)     [████░░░░░░]                     │
│ E-Wallet:  Rp 350.000 (14%)     [█░░░░░░░░░]                     │
├──────────────────────────────────────────────────────────────────┤
│ CHART: Trend Harian (7 hari terakhir)                            │
│ (Bar chart: dates on X, Rp amounts on Y)                         │
│ 10 Oct: Rp 1.800.000                                             │
│ 11 Oct: Rp 2.100.000  ▲                                          │
│ 12 Oct: Rp 1.950.000                                             │
│ 13 Oct: Rp 2.300.000  ▲▲                                         │
│ 14 Oct: Rp 2.050.000                                             │
│ 15 Oct: Rp 2.120.000                                             │
│ 16 Oct: Rp 2.450.000  ▲▲▲ ← Today                                │
├──────────────────────────────────────────────────────────────────┤
│ TRANSACTIONS TABLE:                                               │
│ Date     | Owner    | Tipe   | Items       | Total      | Metode │
│ ─────────┼──────────┼────────┼─────────────┼────────────┼─────── │
│ 16:45    | Budi     | Mixed  | Full Groom+ | Rp 320.000 │ Tunai  │
│ 15:20    | Siti     | Produk | Shampoo ×2  | Rp 160.000 │ TF     │
│ 14:00    | Hana     | Svc    | Full Groom  | Rp 150.000 │ E-Walk │
│ ...                                                               │
│                                                                  │
│ [◀ Prev] [Next ▶]                                                │
├──────────────────────────────────────────────────────────────────┤
│ [📥 Export CSV]  [Print]                                         │
└──────────────────────────────────────────────────────────────────┘
```

---

### 2.10 Settings (`/settings/users` example)

```
┌──────────────────────────────────────────────────────────────────┐
│ ⚙️ Pengaturan — Manajemen User                                   │
├──────────────────────────────────────────────────────────────────┤
│ [+ Tambah User Baru]                                             │
├──────────────────────────────────────────────────────────────────┤
│ TABLE:                                                            │
│ Nama           | Email              | Role   | Status  | ⚙️     │
│ ──────────────┼────────────────────┼────────┼─────────┼─────── │
│ Ani Groomer   | ani@petshop.id     │ Admin  │ 🟢 Aktif│ [●]   │
│ Budi Groomer  | budi@petshop.id    │ Staff  │ 🟢 Aktif│ [●]   │
│ Siti Admin    | siti@petshop.id    │ Admin  │ 🟢 Aktif│ [●]   │
│ Hana Intern   | hana@petshop.id    │ Staff  │ 🔴 Mati │ [●]   │
│                                                                  │
│ Menu [●]: [Edit] [Reset Password] [Deactivate] [Hapus]          │
├──────────────────────────────────────────────────────────────────┤
│ [◀ Prev] Page 1 of 1 [Next ▶]                                  │
└──────────────────────────────────────────────────────────────────┘

Form: Tambah/Edit User
┌─────────────────────────────────────┐
│ Tambah User Baru                    │
├─────────────────────────────────────┤
│ Nama *                              │
│ [_________________________]          │
│ (min 2 char)                        │
│                                     │
│ Email *                             │
│ [_________________________]          │
│ (unique, valid email format)        │
│                                     │
│ Password * (only on create)         │
│ [_________________________]          │
│ (min 8 char, mix alphanumeric)      │
│                                     │
│ Role *                              │
│ ○ Admin (full access)               │
│ ○ Staff (CRUD, no reports/settings) │
│                                     │
│ Status                              │
│ ○ Aktif  ○ Non-Aktif                │
│                                     │
│ [Simpan] [Batal]                    │
└─────────────────────────────────────┘
```

---

## 3. Component Breakdown (Nuxt UI v4)

### 3.1 Dashboard Page (`/`)

| Component | Usage | Props/Notes |
|-----------|-------|-----------|
| **UCard** | Stats cards (4-column grid) | `color="blue"` for appointment, `color="green"` for revenue |
| **UButton** | Quick action buttons (Booking, POS, etc.) | `size="lg"`, `variant="soft"` |
| **UTable** | Appointment table | Sort by time, columns: time, pet, owner, service, groomer, status |
| **UBadge** | Vaccination status badge on pet row | `color="green"`, `color="yellow"`, `color="red"` |
| **UIcon** | Status indicator icons (✅, ◻️, 🔴) | Import from `@heroicons/vue/24/solid` |
| **UAlert** | Stok menipis / vaksinasi warning | `color="orange"` for expiring, `color="red"` for expired |
| **USkeleton** | Loading state for stats | Array of 4 skeletons |
| **UNotification** | Toast feedback (check-in, complete) | Auto-dismiss after 3s |

### 3.2 Owner List & Form (`/owners`, `/owners/new`)

| Component | Usage | Props/Notes |
|-----------|-------|-----------|
| **UInput** | Search bar (debounced 300ms) | `placeholder="Cari nama/telepon..."`, `@update:modelValue` |
| **UTable** | Owner table | Sortable columns: name, phone, email, pet count |
| **UButton** | Add owner, Edit, Delete buttons | `variant="ghost"` for quick actions |
| **UForm** | Owner form (create/edit) | Multi-field form with validation |
| **UFormGroup** | Wrap each form field | `label`, `required`, `error` |
| **UInput** | Name, phone, email, address inputs | Type-specific (text, email, tel) |
| **USelect** | Communication preference dropdown | Options: Email, SMS, WhatsApp |
| **UTextarea** | Notes field | Resizable |
| **UModal** | Confirm delete modal | Title: "Hapus owner?", warning for soft-delete |
| **UPagination** | Table pagination | 20 items per page, goto page |

### 3.3 Pet Profile (`/pets/:id`)

| Component | Usage | Props/Notes |
|-----------|-------|-----------|
| **UCard** | Pet info card (photo + basic data) | Avatar + flex layout |
| **UAvatar** | Pet photo thumbnail | Rounded, upload trigger on click |
| **UFileInput** | Pet photo upload | `accept="image/*"`, max 5MB, display preview |
| **UTabs** | Info / Grooming / Vaccination / Transaction tabs | `defaultValue="Info"`, lazy load content |
| **UBadge** | Vaccination status (green/yellow/red) | Icon + text |
| **UAlert** | Temperament warning / alergi | `color="amber"` for caution |
| **UButton** | Edit, Delete, Add Vaccination buttons | Size small, soft variant |
| **UTable** | Grooming history, vaccination, transaction tables | Show 5 recent items |
| **UModal** | Add vaccination form | Fields: vaccine name, type, dates, file upload |
| **UDatePicker** | Vaccination dates | Inline or popover |
| **UFormGroup** | Form fields in modal | Label + validation error |

### 3.4 Appointment Booking (`/appointments/new`)

| Component | Usage | Props/Notes |
|-----------|-------|-----------|
| **UCard** | Step indicator + form card | Step 1/2/3/4 progress display |
| **UInput** | Owner search | Autocomplete suggest list below |
| **USelect** | Owner dropdown (post-search) | Filtered list |
| **UButton** | [Lanjut], [Kembali], [Konfirmasi] | Primary vs secondary variant |
| **UAlert** | Vaccine expired warning | `color="red"`, dismissible |
| **UDatePicker** | Schedule date picker | Min date = today, format DD-MM-YYYY |
| **USelect** | Time picker (from groomer availability) | 30-min slots |
| **UCheckbox** | Multi-select services | Display price per service |
| **UTextarea** | Appointment notes | Optional field |
| **UDivider** | Separate form sections | Visual break between steps |
| **UBadge** | Vaccine status on pet option | Inline badge |

### 3.5 Grooming Session (`/appointments/:id` InProgress)

| Component | Usage | Props/Notes |
|-----------|-------|-----------|
| **UCard** | Appointment header + pet info | Display status, timing, pet photo |
| **UButton** | [Selesai], [Pause], [Cancel], [Call Owner] | Primary/danger variants |
| **USelect** | Blade size, Shampoo, Dryer type | Dropdowns with common values |
| **UCheckbox** | Conditioning, Skin issue flag | Boolean toggles |
| **UTextarea** | Style notes, Behavior notes | Multi-line input |
| **UFileInput** | Before/After photo upload | Multiple file upload, drag-and-drop zone |
| **UImage** | Preview uploaded photos | Show thumbnails inline |
| **UButton** | [Draft], [Selesai] | Auto-save on [Draft] |

### 3.6 POS Page (`/pos`)

| Component | Usage | Props/Notes |
|-----------|-------|-----------|
| **UInput** | Owner search, Item search (tabs) | Debounced search, suggest list |
| **UButton** | Add item to cart (+), Diskon, Proses Pembayaran | Style variations |
| **UTable** | Cart items table | Columns: item, qty, unit price, subtotal, delete |
| **UInputNumber** | Quantity input (cart) | Min 1, inline control |
| **USelect** | Payment method | Cash (default), Transfer, E-Wallet |
| **UModal** | Apply discount modal | Radio buttons for nominal/percent |
| **UCard** | Cart summary (subtotal, discount, total) | Right sidebar, sticky |
| **UDivider** | Section divider | Between item tab and summary |
| **UButton** | [Proses], [Cetak], [Share WA], [Reset] | Primary/secondary |

### 3.7 Product Inventory (`/products`)

| Component | Usage | Props/Notes |
|-----------|-------|-----------|
| **UInput** | Search by name/SKU | Debounced search |
| **USelect** | Filter by category, species, status | Multi-select or single |
| **UTable** | Product list table | Columns: name, SKU, stock (with color), reorder level, expiry, price |
| **UBadge** | Stock status indicator | Color-coded (green/yellow/red) |
| **UButton** | Add product, Edit, Adjust stock, Delete | Quick action menu |
| **UModal** | Product detail view | Show all fields including margin |
| **UForm** | Add/Edit product form | Many fields: name, SKU, category, price, stock, etc. |
| **UDatePicker** | Expiry date picker | Inline calendar |
| **UCheckbox** | Restricted medicine flag | Boolean |
| **UFileInput** | Product image upload (future) | Optional |
| **UTable** | Activity log inside modal | Show stock adjustments history |

### 3.8 Vaccination Alerts (`/vaccinations/alerts`)

| Component | Usage | Props/Notes |
|-----------|-------|-----------|
| **USelect** | Filter by urgency (all, expired, 7d, 14d, 30d) | Button-like tabs |
| **UButton** | Export CSV, Send all WhatsApp | Bulk actions |
| **UAlert** | Section header for each urgency category | Color-coded (red, orange, yellow) |
| **UCard** | Pet alert item | Pet name, owner, vaccine, expiry, buttons |
| **UButton** | Kirim Reminder WA per item | Link button, opens WhatsApp |
| **ULink** | WhatsApp link button | External link, target="_blank" |

### 3.9 Reports (`/reports/revenue`)

| Component | Usage | Props/Notes |
|-----------|-------|-----------|
| **USelect** | Period selector (daily/weekly/monthly/custom) | Dropdown |
| **UDatePicker** | Custom date range (from/to) | Dual calendar or two date inputs |
| **UButton** | [Tampilkan], Export CSV, Print | Action buttons |
| **UCard** | Key metrics (total, transactions, avg) | 3-card grid display |
| **UChart** | Trend chart (bar/line) | VueChart or Chart.js via NuxtChart |
| **UTable** | Transaction detail table | Paginated list |
| **UBadge** | Payment method indicator | Small badge per transaction |
| **UProgress** | Percentage breakdown (category, payment method) | Stacked bar or pie chart |

### 3.10 Settings (`/settings/users`)

| Component | Usage | Props/Notes |
|-----------|-------|-----------|
| **UButton** | Add new user | Primary button |
| **UTable** | User list | Columns: name, email, role, status |
| **UBadge** | Status indicator (Active/Inactive) | Green/gray color |
| **UButton** | Quick actions (Edit, Reset password, Deactivate, Delete) | Menu or inline |
| **UForm** | Add/Edit user form | Fields: name, email, password (create only), role, status |
| **UCheckbox** | Role selector (radio as checkbox) | Admin vs Staff |
| **UModal** | Confirm delete modal | Warning: cannot delete last admin |

---

## 4. User Flows

### 4.1 Booking Workflow

```
┌─────────────────────────────────────────────────────────┐
│ START: Staff at Dashboard                               │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │ Click [➕ Booking Baru]        │
        │ OR Navigate to /appointments/new│
        └────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │ STEP 1: SEARCH OWNER           │
        │ Input owner name/phone         │
        │ Select from suggestions        │
        │ OR Create new owner            │
        └────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │ STEP 2: SELECT PET             │
        │ Show pet list (owner's pets)   │
        │ Display vaccine status per pet │
        │ Warn if vaccine expired        │
        └────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │ STEP 3: SELECT GROOMER+DATETIME│
        │ Show groomer availability      │
        │ Pick date/time from slots      │
        │ Select services (multi)        │
        │ Notes (optional)               │
        │ AUTO: price + duration calc    │
        └────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │ STEP 4: REVIEW & CONFIRM       │
        │ Show all booking summary       │
        │ Click [Konfirmasi]             │
        └────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │ POST /api/appointments ✓       │
        │ Status 201 + Appointment ID    │
        └────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │ RESULT: Toast + Receipt        │
        │ "Booking berhasil #APT-12345"  │
        │ Options: Print, Share WhatsApp │
        │ Redirect to /appointments/:id  │
        └────────────────────────────────┘
```

### 4.2 POS Workflow

```
┌─────────────────────────────────────────────────────────┐
│ START: Staff at Dashboard → Click [🛒 POS]             │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │ POS Page (2-column layout)      │
        │ LEFT: Search items              │
        │ RIGHT: Cart summary             │
        └────────────────────────────────┘
                         │
                ┌────────┴────────┐
                ▼                 ▼
        ┌────────────────┐ ┌──────────────────┐
        │ (OPT) SELECT   │ │ CART STARTS      │
        │ OWNER          │ │ EMPTY            │
        │ (Link to appt) │ │                  │
        └────────────────┘ └──────────────────┘
                │                 │
                └────────┬────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │ SEARCH TAB: SERVICES/PRODUCTS  │
        │ Input search, see results      │
        │ Click [+ Full Groom] → add     │
        │ Cart updates: qty, subtotal    │
        └────────────────────────────────┘
                         │
                ┌────────┴─────────┐
                ▼                  ▼
        ┌────────────────┐ ┌──────────────────┐
        │ ADD MORE ITEMS │ │ CART UPDATES     │
        │ (repeat)       │ │ • New items      │
        │                │ │ • Qty changes    │
        │                │ │ • Total recalc   │
        └────────────────┘ └──────────────────┘
                │                  │
                └────────┬─────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │ APPLY DISCOUNT (optional)      │
        │ Click [-] in cart              │
        │ Modal: Nominal or Percent      │
        │ Auto-calc total                │
        └────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │ SELECT PAYMENT METHOD          │
        │ Tunai (default)                │
        │ Transfer                       │
        │ E-Wallet                       │
        └────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │ CLICK [Proses Pembayaran]      │
        │ POST /api/transactions         │
        │ ✓ 201 response                 │
        │ Stock deducted                 │
        └────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │ RECEIPT PREVIEW SHOWN           │
        │ Options:                        │
        │ • [Print] → window.print()     │
        │ • [Share WA] → wa.me link      │
        │ • [Close] → reset cart         │
        └────────────────────────────────┘
```

### 4.3 Vaccination Alert Workflow

```
┌──────────────────────────────────────┐
│ SYSTEM: Background check daily       │
│ Scan vaccinations expiring ≤30 days  │
└──────────────────────────────────────┘
                │
                ▼
    ┌───────────────────────────────┐
    │ GET /api/vaccinations/alerts  │
    │ Returns: pets with expiring   │
    └───────────────────────────────┘
                │
                ▼
    ┌───────────────────────────────┐
    │ DASHBOARD WIDGET:             │
    │ "Vaksinasi akan expired: N"   │
    │ Badge notification            │
    └───────────────────────────────┘
                │
                ▼
    ┌───────────────────────────────┐
    │ STAFF: Click widget or        │
    │ Navigate to /vaccinations/alerts
    └───────────────────────────────┘
                │
                ▼
    ┌───────────────────────────────┐
    │ PAGE: Grouped by urgency      │
    │ 🔴 Expired                    │
    │ 🟠 7 days                     │
    │ 🟡 30 days                    │
    └───────────────────────────────┘
                │
                ▼
    ┌───────────────────────────────┐
    │ STAFF: Click [Kirim Reminder] │
    │ Per item or batch "Kirim     │
    │ Semua"                        │
    └───────────────────────────────┘
                │
                ▼
    ┌───────────────────────────────┐
    │ GET /api/vaccinations/alerts/ │
    │ whatsapp/:petId               │
    │ Response: wa.me link          │
    └───────────────────────────────┘
                │
                ▼
    ┌───────────────────────────────┐
    │ LINK OPENS: WhatsApp app      │
    │ (mobile) or wa.me web         │
    │ Pre-filled message shown      │
    │ Staff reviews & sends manual  │
    └───────────────────────────────┘
                │
                ▼
    ┌───────────────────────────────┐
    │ OWNER: Receives message on    │
    │ WhatsApp, schedules booster   │
    └───────────────────────────────┘
```

---

## 5. Form Design

### 5.1 Owner Form

```
FIELDS:

Nama *
├─ Type: Text input
├─ Validation: min 2, max 100 chars
├─ Error: "Nama wajib diisi" | "Nama terlalu panjang"
└─ Placeholder: "Budi Santoso"

Nomor Telepon *
├─ Type: Text input with phone formatting
├─ Validation: regex /^(\+62|08)\d{8,13}$/
├─ Error: "Format telepon tidak valid. Gunakan 08xx atau +62xx"
│         "Nomor telepon sudah terdaftar atas nama [X]" (409 conflict)
└─ Placeholder: "0812-1234-5678"

Email (optional)
├─ Type: Email input
├─ Validation: valid email format or empty
├─ Error: "Email tidak valid"
└─ Placeholder: "budi@email.com"

Alamat (optional)
├─ Type: Textarea
├─ Validation: max 500 chars
├─ Error: "Alamat terlalu panjang"
└─ Placeholder: "Jln. Merdeka No. 123, Jakarta"

Preferensi Komunikasi *
├─ Type: Radio group
├─ Options: Email, SMS, WhatsApp (default)
├─ Validation: required
└─ Error: "Pilih preferensi komunikasi"

Catatan (optional)
├─ Type: Textarea
├─ Validation: max 500 chars
├─ Error: "Catatan terlalu panjang"
└─ Placeholder: "Contoh: Loyal customer, prefer full groom"

SUCCESS FEEDBACK:
├─ Toast: "Owner berhasil disimpan" (3s auto-dismiss)
├─ If create: Toast + navigate to /owners/:id
└─ If edit: Toast + stay on same page

ERROR HANDLING:
├─ Field-level errors: Below each input, color red
├─ Server error: Alert banner at top of form
└─ Example: "Gagal menyimpan owner. Silakan coba lagi."
```

### 5.2 Pet Form

```
FIELDS:

Nama *
├─ Validation: min 2, max 100
└─ Placeholder: "Buddy"

Spesies *
├─ Type: Select dropdown
├─ Options: Anjing, Kucing, Kelinci, Lainnya
└─ Validation: required

Breed (optional)
├─ Type: Select autocomplete (filtered by species)
├─ Options: [List dari database berdasarkan species]
└─ Placeholder: "Golden Retriever"

Breed Notes (optional)
├─ Type: Text input
└─ Placeholder: "Jika breed tidak tersedia di daftar"

Gender *
├─ Type: Radio group
├─ Options: Jantan, Betina
└─ Validation: required

Tanggal Lahir (optional)
├─ Type: Date picker
├─ Validation: date not in future
├─ Auto: Age calculated from DOB (display: "X tahun Y bulan")
└─ Error: "Tanggal lahir tidak bisa lebih besar dari hari ini"

Berat (optional)
├─ Type: Number input (kg)
├─ Validation: positive number
└─ Placeholder: "28"

Warna (optional)
├─ Type: Text input
└─ Placeholder: "Emas, Hitam, dll"

Foto (optional)
├─ Type: File input (image only)
├─ Validation: JPEG/PNG/WebP, max 5MB
├─ Preview: Show thumbnail if uploaded
└─ Error: "File terlalu besar (max 5MB)" | "Tipe file tidak didukung"

Alergi (optional)
├─ Type: Textarea
└─ Placeholder: "Shampoo parfum kuat"

Catatan Medis (optional)
├─ Type: Textarea
└─ Placeholder: "Kulit sensitif, gunakan hypoallergenic shampoo"

Temperamen (optional)
├─ Type: Multi-select checkboxes
├─ Options: Calm, Friendly, Anxious, Aggressive, Playful, Shy
└─ Display selected as chips

Status Steril (optional)
├─ Type: Checkbox (boolean)
└─ Label: "Sudah steril/kastrasi"

Nomor Microchip (optional)
├─ Type: Text input
└─ Placeholder: "ABC123456789"

SUCCESS:
├─ Toast: "Pet berhasil disimpan"
└─ Navigate to /pets/:id

ERROR:
├─ Field errors: Below each field (color red)
├─ Alert: Server error message
└─ Example: "Gagal menyimpan pet. Periksa koneksi internet."
```

### 5.3 Appointment Form (Multi-step)

Covered in Wireframe 2.4 above. Key fields:

- STEP 1: Owner selection (search + select)
- STEP 2: Pet selection (multi-option with vaccine warnings)
- STEP 3: Groomer, date/time, services, notes
- STEP 4: Review + confirm

Validations:
- Owner required
- Pet required, warn if vaccine expired
- Groomer required, must have available slot
- DateTime required, must be future, no overlap with groomer schedule
- Services required, at least 1

### 5.4 Vaccination Form

Covered in Wireframe 2.3 (Pet detail). Key fields:

- Vaccine name (required, select/input)
- Vaccine type (required, Core/NonCore)
- Date administered (required, date picker)
- Expiry date (optional, auto-filled +1yr if empty)
- Administered by (optional, text)
- Batch number (optional, text)
- Document upload (optional, PDF/image, max 5MB)
- Notes (optional, textarea)

Validation:
- All required fields must be filled
- Dates valid (administered ≤ today, expiry > administered)
- File size ≤ 5MB

### 5.5 Product Form

Covered in Wireframe 2.8. Key fields:

- Name (required, text)
- SKU (optional, unique if provided)
- Barcode (optional, text)
- Category (required, select)
- Brand (optional, text)
- Description (optional, textarea)
- Unit price (required, number Rp)
- Cost price (optional, number Rp)
- Stock quantity (required, number ≥0)
- Reorder level (optional, number ≥0)
- Expiry date (optional, date picker)
- Weight (optional, number kg)
- Species target (optional, select: Dog/Cat/All)
- Restricted medicine (optional, checkbox)

Validation:
- Name required, 2-100 chars
- Price > 0
- Stock ≥ 0
- Category required
- SKU unique if provided
- Expiry date valid (not in past)

### 5.6 Transaction/POS Form

Covered in Wireframe 2.7. Key fields:

- Owner (optional, search autocomplete)
- Items (required, at least 1)
  - Per item: product/service ID, quantity, unit price
- Discount (optional, nominal Rp or percent %)
- Payment method (required, Cash/Transfer/E-Wallet)
- Payment status (default: Paid, optional: Pending/Partial)
- Notes (optional, textarea)

Validation:
- Items required, qty ≥ 1
- Payment method required
- Product stock sufficient (checked on submit)
- Total calculated correctly

---

## 6. Data Display Tables

### 6.1 Appointments Table

**Columns:**
```
Time | Pet | Owner | Service | Groomer | Status | Actions
```

**Sorting:**
- Default: time ascending (earliest first)
- Clickable headers: toggle sort direction

**Filtering:**
- By status: Confirmed, InProgress, Completed, Cancelled, NoShow
- By date: today, this week, this month, custom range
- By groomer: dropdown select single or multiple

**Inline Actions (Quick buttons per row):**
- ✅ Check-in (if status = Confirmed)
- ◻️ Complete (if status = InProgress)
- ❌ Cancel
- 🔍 View detail
- Edit (if status = Confirmed only)

**Color coding:**
- Status badge color: Confirmed=blue, InProgress=yellow, Completed=green, Cancelled=gray, NoShow=red

---

### 6.2 Pet List Table

**Columns:**
```
Name | Breed | Age | Owner | Vaccine Status | Species | Actions
```

**Sorting:**
- Name, age, species

**Filtering:**
- By species: Dog, Cat, Rabbit, Other
- By vaccine status: All, Up-to-date, Expiring, Expired
- By owner: search autocomplete

**Inline Actions:**
- 🔍 View detail
- ✏️ Edit
- ❌ Soft-delete

**Vaccine badge:**
- 🟢 Green: up-to-date
- 🟡 Yellow: expiring (≤30 days)
- 🔴 Red: expired
- ⚪ Gray: no records

---

### 6.3 Product Inventory Table

**Columns:**
```
Name | SKU | Stock | Reorder Level | Expiry | Price | Actions
```

**Stock color:**
- 🟢 Green: stock > reorder level
- 🟡 Yellow: stock = reorder level (ORDER NOW badge)
- 🔴 Red: stock ≤ 0 (EMPTY badge)

**Expiry color:**
- 🟢 Green: expiry > 30 days
- 🟡 Yellow: expiry 7-30 days
- 🔴 Red: expiry ≤ 7 days or expired

**Sorting:**
- By name, SKU, stock, expiry date, price

**Filtering:**
- By category
- By stock status: all, low stock, expired
- By species target

**Inline Actions:**
- 🔍 View detail
- ✏️ Edit
- 📊 Adjust stock
- ❌ Soft-delete

---

### 6.4 Transaction History Table

**Columns:**
```
Date | Owner | Type | Items | Total | Payment Method | Status | Actions
```

**Type badges:**
- Service, Product, Mixed (color-coded)

**Status badges:**
- Paid (green), Pending (yellow), Partial (orange), Refunded (gray)

**Sorting:**
- By date (default: newest first), by total, by status

**Filtering:**
- By date range (from/to)
- By type: Service, Product, Mixed
- By payment method: Cash, Transfer, E-Wallet
- By status: Paid, Pending, Partial, Refunded

**Inline Actions:**
- 🔍 View detail (receipt, items, payment history)
- 📧 Email receipt / 📱 Share WhatsApp
- 🔄 Refund (if Paid status)

---

## 7. Notifications & Alerts

### 7.1 Appointment Confirmation

**Toast (bottom-right, auto-dismiss 3s):**
```
✓ Appointment berhasil dibuat. ID: #APT-12345
[Lihat Detail] [Kirim WhatsApp]
```

**Email option (if enabled):**
- Pre-filled email template to owner

**WhatsApp option:**
- wa.me link with pre-filled appointment summary

---

### 7.2 Vaccination Expiry Alerts

**Dashboard Widget:**
```
⚠️ Vaksinasi akan expired: 5
🔴 Sudah expired: 2
```

**Vaccination Alerts Page:**
- Grouped by urgency: Sudah Expired | 7 hari | 30 hari
- Color-coded: red, orange, yellow
- Per-item [Kirim Reminder WA] button
- Batch [Kirim Semua] button

**WhatsApp message template:**
```
Halo [OWNER_NAME],

Vaksinasi [VACCINE_NAME] untuk [PET_NAME] akan expired pada [EXPIRY_DATE].

Silakan jadwalkan booster segera untuk menjaga kesehatan hewan peliharaan Anda.

Hubungi kami: [SHOP_PHONE] atau kunjungi [SHOP_ADDRESS]

Terima kasih,
PetKasih Grooming & Pet Shop
```

---

### 7.3 Stock Reorder Alerts

**Dashboard Widget:**
```
⚠️ Stok Menipis: 3 produk
[Lihat Detail] [Export untuk supplier]
```

**Product Detail Page:**
- Inline warning: "Stok ≤ reorder level. [Order sekarang]"

**Color in table:**
- 🟡 Yellow row highlight for low stock

---

### 7.4 Payment Status Alerts

**Transaction status indicator (inline in table/detail):**
- 🟢 Paid: "Lunas" green badge
- 🟡 Pending: "Menunggu pembayaran" yellow badge
- 🟠 Partial: "Sebagian dibayar" orange badge
- ⚪ Refunded: "Dikembalikan" gray badge

**Toast on payment:**
```
✓ Pembayaran dicatat: Rp 150.000
Status: Partial (Rp 50.000 sisa)
```

---

### 7.5 Error Messages (User-friendly Indonesia)

**Field validation errors (below each field):**
- "Nama wajib diisi"
- "Format telepon tidak valid. Gunakan 08xx atau +62xx"
- "Email sudah terdaftar"
- "Stok tidak cukup untuk produk ini"
- "Tanggal tidak bisa lebih besar dari hari ini"
- "File terlalu besar (max 5MB)"

**Form submission errors (alert banner):**
```
⚠️ Gagal menyimpan data
[Detail error from server]
[Coba Lagi]
```

**Server errors (generic):**
```
❌ Terjadi kesalahan. Periksa koneksi internet Anda dan coba lagi.
[Coba Lagi]
```

**Conflict errors (409):**
```
⚠️ Nomor telepon sudah terdaftar atas nama Siti Aminah.
Apakah ingin membuat duplikat? [Ya] [Tidak]
```

**Permission errors (403):**
```
🔒 Anda tidak memiliki akses ke halaman ini.
[Kembali ke Dashboard]
```

---

## 8. Navigation & Information Architecture

### 8.1 Sidebar Navigation (Main Layout)

**Desktop (always visible):**
```
[🏠 PetKasih Logo]

👤 Staff Name
─────────────────

🏠 Dashboard
👥 Owner & Pets
  └─ 👥 Owners
  └─ 🐕 Pets (search)
📅 Jadwal
  └─ 📅 Calendar
  └─ 📋 Appointments
🧴 Grooming
  └─ 📝 Grooming Notes
  └─ 📊 Session History
💉 Vaksinasi
  └─ ⚠️ Alerts
📦 Inventori
  └─ 📦 Produk
  └─ 🔄 Stock Adjustments
💰 POS
  └─ 🛒 Checkout
  └─ 📜 Transaksi
📊 Laporan (Admin only)
  └─ 💵 Pendapatan
  └─ 📈 Layanan
  └─ 📦 Inventori
⚙️ Pengaturan (Admin only)
  └─ 👤 User Management
  └─ 💇 Groomer Management
  └─ 🏪 Toko Settings

[Logout]
─────────────────
User: ani@petshop.id | Admin
```

**Mobile (collapsible hamburger):**
- Icon + label visible on toggle
- Hamburger menu collapses sidebar
- Overlay navigation drawer

---

### 8.2 Header Bar

**Left side:**
- Hamburger (mobile only) | Breadcrumb (desktop)
- Current page title

**Right side:**
- Global search: [🔍 Cari owner/pet/produk...]
- Notifications bell: Dropdown with recent alerts
  - Stok menipis (count badge)
  - Vaksinasi expired (count badge)
  - Appointment hari ini (count badge)
- User profile menu: [User name ▼]
  - Profile
  - Settings
  - Logout

---

### 8.3 Breadcrumbs

**Example navigation:**
- Dashboard: (no breadcrumb)
- /owners: Dashboard > Owners
- /owners/123: Dashboard > Owners > Budi Santoso
- /owners/123/edit: Dashboard > Owners > Budi Santoso > Edit
- /pets/456: Dashboard > Owners > Budi Santoso > Buddy
- /pets/456/edit: Dashboard > Owners > Budi Santoso > Buddy > Edit

**Interaction:**
- Clickable links: navigate to each level
- Last item: not clickable (current page)

---

### 8.4 Search & Global Navigation

**Global Search Bar (header):**
- Placeholder: "Cari owner, pet, produk..."
- Debounce: 300ms
- Results:
  - Owners (name, phone)
  - Pets (name, breed, owner)
  - Products (name, SKU)
  - Appointments (pet, date)
- Max 10 results per category
- "Lihat semua hasil →" link
- Keyboard shortcut: Ctrl+K (future enhancement)

---

### 8.5 Quick Access (Dashboard Shortcuts)

**5 most-used actions:**
1. [➕ Booking Baru] → /appointments/new
2. [🛒 POS] → /pos
3. [🔍 Cari Pet] → opens search modal (filter pets)
4. [📅 Jadwal] → /calendar
5. [⚠️ Alert] → /vaccinations/alerts

**Implementation:**
- Button bar below dashboard stats
- Mobile: sticky bar at bottom (if space allows)

---

## 9. Responsive Design Notes

### 9.1 Breakpoints (Tailwind CSS v4)

```
Mobile:   320px - 767px   (sm: 640px)
Tablet:   768px - 1023px  (md: 768px, lg: 1024px)
Desktop:  1024px+         (xl: 1280px, 2xl: 1536px)
```

### 9.2 Desktop (1920x1080 - Salon workstation)

- Sidebar always visible, ~200px wide
- Main content: max-width 1280px, padded
- Tables: horizontal scroll if needed, min-width columns
- Forms: 2-column layout if ≥1200px (labels left, inputs right)
- Charts: full-width or side-by-side

### 9.3 Tablet (768px - 1023px)

- Sidebar collapsible (hamburger icon)
- Main content: single column, padded
- Tables: horizontal scroll on overflow, compact rows
- Forms: single-column layout
- Cards: 2-column grid on medium+

### 9.4 Mobile (320px - 767px)

- Sidebar: drawer/overlay (hamburger menu)
- Header: compact, essential info only
- Main content: full width, vertical stack
- Tables: convert to card-based layout (one card per row)
  - Column names as labels inside card
  - Swipe to reveal actions (or slide-out menu)
- Forms: full-width inputs, stacked vertically
- Buttons: larger touch targets (min 44px height)
- Modals: fullscreen or near-fullscreen

**Example: Mobile Table Conversion**
```
┌──────────────────────┐
│ 🐕 Buddy             │
│ Spesies: Anjing      │
│ Owner: Budi          │
│ Vaccine: 🟢 OK       │
│ [Lihat] [Edit] [Del] │
└──────────────────────┘

┌──────────────────────┐
│ 🐕 Milo              │
│ Spesies: Anjing      │
│ Owner: Siti          │
│ Vaccine: 🟡 7 hari   │
│ [Lihat] [Edit] [Del] │
└──────────────────────┘
```

---

## 10. Accessibility Checklist

### 10.1 Color & Contrast

- [x] All text ≥ 4.5:1 contrast ratio (WCAG AA)
- [x] Status indicators use icon + color + text (not color alone)
  - Example: 🟢 Green circle + "Up-to-date" text
- [x] Color blindness-safe palette:
  - Red/green pairing avoided; use red + pattern, green + checkmark
  - Yellow + red + blue are safe
- [x] Background colors tested in both light & dark mode (future)

### 10.2 Keyboard Navigation

- [x] All interactive elements focusable via Tab
- [x] Focus order logical: left-to-right, top-to-bottom
- [x] Focus indicator visible: 2px solid #3b82f6 outline
- [x] Form submission: Enter key on last field
- [x] Dismissable modals: Escape key closes
- [x] Dropdown menus: Arrow keys to navigate options, Enter to select
- [x] Buttons: Space or Enter to activate

### 10.3 Form Labels & Inputs

- [x] Every input has associated `<label>` element (not placeholder)
- [x] Required fields marked with `*` (asterisk + aria-label)
- [x] Error messages linked to input via `aria-describedby`
- [x] Form validation errors announced to screen readers (aria-live)

### 10.4 ARIA Labels & Roles

- [x] Buttons with icon only have aria-label:
  ```html
  <button aria-label="Tambah pet baru">
    <IconPlus />
  </button>
  ```
- [x] Modal dialogs:
  ```html
  <div role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <h2 id="modal-title">Hapus pet?</h2>
  </div>
  ```
- [x] Tables: `<caption>` or aria-label per table
- [x] Status badges: aria-label for color-blind users
  ```html
  <span class="bg-green-500 rounded-full" aria-label="Vaksinasi up-to-date">
    🟢
  </span>
  ```

### 10.5 Typography

- [x] Font size base: 16px (mobile), 18px (desktop)
- [x] Line height: ≥1.5 for body text
- [x] Line length: ≤80 characters (optimal readability)
- [x] Heading hierarchy: H1 → H6, proper nesting (no skipped levels)
- [x] Emphasis: bold + `<strong>` tag (not `<b>`)

### 10.6 Loading States & Animations

- [x] Loading indicators: spinners + descriptive text
- [x] No auto-playing animations (user control)
- [x] Animation duration ≥0.2s (perceptible), ≤3s (not annoying)
- [x] Reduced motion option (prefers-reduced-motion media query)

### 10.7 Error Prevention & Recovery

- [x] Validation on submit + real-time field validation
- [x] Error messages specific & actionable (not "Error: invalid input")
- [x] Confirmation dialogs before destructive actions (delete, cancel)
- [x] Undo capability (soft-delete, allow recovery)

### 10.8 Images & Alternative Text

- [x] Pet photos: alt text "Foto [Pet name] - [Breed]"
- [x] Icons: aria-label or hidden from screen readers if decorative
- [x] Charts: data table alternative or text summary

### 10.9 Language & Localization

- [x] UI language: Bahasa Indonesia (100%)
- [x] Currency: Rupiah (Rp format with proper thousand separators)
- [x] Date format: DD-MM-YYYY HH:MM WIB
- [x] Phone format: Indonesian (08xx, +62xx validation)

### 10.10 Screen Reader Testing

- [x] Page structure navigable via headings (H1 → H6)
- [x] List items in `<ul>` / `<ol>` (not divs pretending to be lists)
- [x] Table headers: `<th scope="col">` or `<th scope="row">`
- [x] Form instructions announced before inputs
- [x] Dynamic content updates announced via `aria-live="polite"` (toast, alerts)

---

## 11. Component Library Choices (Nuxt UI v4)

### 11.1 Why Nuxt UI v4?

| Feature | Benefit |
|---------|---------|
| **Headless UI** | Full control over styling via Tailwind CSS. No style conflicts. |
| **Accessible defaults** | Built-in ARIA labels, keyboard nav, focus management. |
| **Tailwind integration** | Consistent design tokens, responsive utilities, easy customization. |
| **Minimal dependencies** | Lightweight bundle, fast load time. |
| **Form validation** | Built-in error handling, form composables. |
| **Icons** | Heroicons integration for common icons. |
| **Documentation** | Well-maintained, extensive examples. |

### 11.2 Core Components Used

| Component | Why | Alternatives |
|-----------|-----|-------------|
| **UCard** | Container with shadow, padding, rounded corners. Simple, reusable. | None (built-in Nuxt UI). |
| **UButton** | Accessible, multiple variants (solid, soft, ghost). | `<button>` HTML (reinvent wheel). |
| **UInput** | Text input with validation error display, placeholder, label support. | Native `<input>` (no validation UI). |
| **USelect** | Dropdown with search, keyboard nav, ARIA support. | `<select>` HTML (limited styling). |
| **UTable** | Sortable, paginated table with conditional rendering. | TanStack Table (overkill for MVP). |
| **UForm / UFormGroup** | Form wrapper + field wrapper with labels, errors, hints. | Manual form markup (error-prone). |
| **UModal** | Accessible dialog with focus trap, Escape key handling. | Manual div overlay (reinvent). |
| **UBadge** | Pill-shaped label, color variants, icons. | Simple span (limited styling). |
| **UIcon** | Heroicons integration, size control. | Inline SVG (repetitive). |
| **UTabs** | Tab navigation with lazy loading, keyboard support. | Custom component (complexity). |
| **UAlert** | Dismissible alert banner, color variants (red/yellow/green/blue). | Custom div (no close button). |
| **UCheckbox / URadio** | Accessible checkbox/radio with labels, validation state. | Native `<input type="checkbox">` (limited styling). |
| **UDatePicker** | Calendar picker with validation, date range support. | HTML5 `<input type="date">` (limited styling, inconsistent mobile). |
| **UPagination** | Pagination controls, page size selector. | Manual buttons (complexity). |
| **UDivider** | Horizontal line separator. | `<hr>` HTML (minimal styling). |
| **UTextarea** | Multi-line input with auto-grow, placeholder, validation. | Native `<textarea>` (limited). |
| **UFileInput** | File upload with drag-and-drop, validation feedback. | Native file input (poor UX). |
| **UNotification / Toast** | Auto-dismissing notification system. | Manual toast implementation (state management). |
| **USkeleton** | Skeleton loader for loading states. | Gray boxes (basic). |
| **UAvatar** | Profile image with fallback initial. | Img + fallback (manual). |
| **UMenu / UDropdown** | Context menu, action menu with keyboard support. | Custom component (complex). |
| **UProgress** | Progress bar for percentage display. | `<progress>` HTML (limited styling). |
| **UBreadcrumb** | Breadcrumb navigation. | Manual links + separators. |
| **ULink** | Semantic link with hover state. | `<a>` tag (manual styling). |
| **UChip** | Small tag/badge with close button. | Span + button (manual). |

### 11.3 Theming & Customization

**Tailwind CSS v4 + Nuxt UI:**
- Use Tailwind utility classes for fine-grained control
- CSS variables for brand colors (future dark mode support)
- Shadow, spacing, radius tokens via Tailwind config

**Example: Custom button style**
```vue
<UButton class="bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg">
  Booking Baru
</UButton>
```

### 11.4 Browser Support

- **Chrome/Edge:** Latest 2 versions
- **Firefox:** Latest 2 versions
- **Safari:** Latest 2 versions (13+)
- **Mobile:** iOS 12+, Android 5+

---

## 12. Design Tokens & Branding

### 12.1 Color Palette

| Token | Color | Usage |
|-------|-------|-------|
| **Primary** | `#3b82f6` (Blue-500) | Main CTA, active states, links |
| **Success** | `#10b981` (Green-500) | Confirm, OK, paid status |
| **Warning** | `#f59e0b` (Amber-500) | Caution, expiring soon, pending |
| **Danger** | `#ef4444` (Red-500) | Delete, error, expired |
| **Info** | `#06b6d4` (Cyan-500) | Info alerts, upcoming |
| **Gray** | `#6b7280` (Gray-500) | Disabled, inactive, secondary |
| **Background** | `#ffffff` (White) | Main background |
| **Neutral** | `#f3f4f6` (Gray-100) | Section backgrounds, borders |

### 12.2 Typography

| Type | Font | Size | Weight |
|------|------|------|--------|
| **H1** | Inter | 32px | 700 (bold) |
| **H2** | Inter | 24px | 700 (bold) |
| **H3** | Inter | 20px | 600 (semibold) |
| **Body** | Inter | 16px | 400 (regular) |
| **Small** | Inter | 14px | 400 (regular) |
| **Monospace** | IBM Plex Mono | 12px | 400 | Prices, IDs |

### 12.3 Spacing

- **Base unit:** 4px
- **Common:** 8px, 12px, 16px, 24px, 32px, 48px

### 12.4 Shadows

- **Subtle:** `0 1px 2px 0 rgba(0,0,0,0.05)`
- **Small:** `0 1px 3px 0 rgba(0,0,0,0.1)`
- **Medium:** `0 4px 6px -1px rgba(0,0,0,0.1)`
- **Large:** `0 10px 15px -3px rgba(0,0,0,0.1)`

---

## 13. Design Considerations & Future

### 13.1 Current MVP Scope

- Single-tenant, web-only
- Desktop-first (1920x1080 workstation optimized)
- Mobile-responsive (secondary priority)
- Light mode only
- Manual WhatsApp links (no auto-sending)
- No real-time WebSocket updates

### 13.2 Phase 2 Enhancements

- Dark mode support
- PWA installation capability
- Real-time appointment sync (WebSocket or polling)
- Online customer portal (booking, history, repeat appointment)
- Email notifications (alongside WhatsApp)
- WhatsApp Business API integration (auto-sending)
- Mobile native app (React Native / Flutter)
- Advanced reporting (dashboards, exports)

---

## 14. Accessibility Auto-Test Checklist

Before each release, run:

```bash
# Axe DevTools chrome extension (manual)
# - Run audit on each page
# - Fix critical/serious issues

# Wave browser extension (manual)
# - Check for errors, warnings, contrast issues

# Lighthouse audit (in Chrome DevTools)
# - Accessibility score ≥ 90
# - Best Practices ≥ 90

# Manual keyboard navigation
# - Tab through all interactive elements
# - Verify focus visible
# - Test form submission, modal close (Escape)

# Screen reader test (manual)
# - Use NVDA (Windows) or JAWS
# - Read page from top, verify structure
# - Test form submission feedback

# Mobile accessibility (manual)
# - iOS VoiceOver: Settings > Accessibility > VoiceOver
# - Android TalkBack: Settings > Accessibility > TalkBack
# - Verify touch targets ≥ 44x44px
```

---

**END OF UI-UX-DESIGN.md**

---

## Document Usage

This document is a **text-based design spec** for developers to code from directly. It includes:

1. **Design Principles:** Values guiding decisions (simplicity, pet-centric, efficiency, accessibility, Indonesia context).
2. **ASCII Wireframes:** Structure and layout for 10 key pages. Not pixel-perfect mockups, but clear enough to code.
3. **Component Breakdown:** Which Nuxt UI v4 components to use per page, with props/justification.
4. **User Flows:** Diagram showing workflow step-by-step (booking, POS, vaccination alerts).
5. **Form Design:** Fields, validation rules, error messages, success feedback for each form.
6. **Tables:** Column definitions, sorting, filtering, inline actions, color coding rules.
7. **Notifications & Alerts:** Toast, modal, banner designs with examples.
8. **Navigation:** Sidebar, header, breadcrumbs, search architecture.
9. **Responsive Design:** Breakpoints, mobile/tablet/desktop layouts, touch targets.
10. **Accessibility:** WCAG AA checklist (contrast, keyboard nav, labels, ARIA, screen readers).
11. **Component Library:** Why Nuxt UI v4, core components, theming.
12. **Design Tokens:** Colors, typography, spacing, shadows.

**Next steps for developers:**
- Convert wireframes to Vue components using Nuxt UI v4
- Implement forms with Zod validation (already in ARCHITECTURE.md)
- Test responsive layout on 320px, 768px, 1024px, 1920px viewports
- Run accessibility audits (Axe, Wave, Lighthouse, screen reader testing)
- Use this spec as single source of truth for UI consistency across all pages
