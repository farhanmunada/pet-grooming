# 🔬 Tech Stack Research — Pet Grooming & Pet Shop Web App

> **Tanggal riset:** 16 Oktober 2026
> **Konteks:** Single-tenant, satu toko. Developer punya pengalaman Next.js + Drizzle + Tailwind + TypeScript. Mau coba Nuxt 3 (Vue).

---

## 1. Nuxt — Versi & Fitur Utama

### Status Terkini (Oktober 2026)

| Versi | Status | Catatan |
|-------|--------|---------|
| **Nuxt 4.x** | ✅ Stable (current `latest` di npm) | Rilis stable Juli 2025 |
| **Nuxt 3.x** | ⚠️ End-of-Life 31 Juli 2026 | Tidak ada bug fix/security patch lagi |
| Nuxt 3.18 | Rilis terakhir minor v3 (Juli 2025) | Backport fitur v4 ke v3 |

### ✅ Rekomendasi: Pakai Nuxt 4

Nuxt 4 sudah stable sejak Juli 2025. Migrasi dari Nuxt 3 dirancang straightforward (ada codemod). Untuk project baru, **langsung pakai Nuxt 4**.

**Fitur utama Nuxt (berlaku v3 dan v4):**
- **File-based routing** — buat file di `pages/`, otomatis jadi route
- **Auto-imports** — component, composable, utility auto-detected
- **Server routes (Nitro)** — fullstack, buat file di `server/api/` langsung jadi API endpoint
- **Universal rendering** (SSR + hydration) — SEO friendly, fast first paint
- **Hybrid rendering** — per-route pilih SSR/SSG/SPA
- **TypeScript first-class** — typed API routes, auto-generated types
- **Vite** — HMR super cepat
- **Link pre-fetching** — navigasi terasa instan

**Perubahan Nuxt 4 dari Nuxt 3:**
- Default `srcDir` jadi `app/` (bukan root) — `components/`, `pages/`, `composables/` masuk dalam `app/`
- `server/`, `nuxt.config.ts`, `public/` tetap di root
- Singleton data fetching layer (shared refs per key)
- Improved TypeScript project references (separate config untuk app/server/shared)
- Codemod tersedia: `npx codemod@latest nuxt/4/migration-recipe`

**Sumber:**
- https://nuxt.com/blog ✅ Verified
- https://nuxt.com/raw/docs/3.x/community/roadmap.md ✅ Verified
- https://nuxt.com/raw/blog/roadmap-v4.md ✅ Verified
- https://www.blueshoe.io/blog/nuxt4-new-features/ ✅ Verified

---

## 2. Auth Module

### Perbandingan

| Fitur | `nuxt-auth-utils` | `@sidebase/nuxt-auth` |
|-------|-------------------|----------------------|
| **Maintainer** | Sébastien Chopin (co-creator Nuxt) | Sidebase community |
| **Approach** | Minimalis, sealed cookie sessions | Wrapper NextAuth.js/Auth.js |
| **OAuth providers** | 40+ built-in | Via NextAuth.js ecosystem |
| **Credentials auth** | ✅ Manual (server route + `setUserSession`) | ✅ Built-in credentials provider |
| **WebAuthn/Passkey** | ✅ | ❌ |
| **Password hashing** | ✅ Built-in | ❌ (manual) |
| **Session storage** | Encrypted sealed cookie | JWT atau database session |
| **Dependencies** | Minimal (UnJS only) | Banyak (NextAuth.js) |
| **SSR support** | ✅ Hybrid rendering | ✅ (SSR only, no `nuxt generate`) |
| **Official Nuxt recommendation** | ✅ (recommended di archived nuxt-community/auth-module) | ✅ (also recommended) |

### ✅ Rekomendasi: `nuxt-auth-utils`

Untuk single-tenant pet shop dengan credential login (admin) + optional OAuth:
- Lebih ringan, fewer dependencies
- Maintained oleh core team Nuxt
- Pattern sederhana: `setUserSession()` / `useUserSession()` / `requireUserSession()`
- Sealed cookie = no database session table needed
- Sudah support password hashing bawaan

**Contoh setup credentials:**
```ts
// server/api/login.post.ts
import { z } from 'zod'

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export default defineEventHandler(async (event) => {
  const { email, password } = await readValidatedBody(event, bodySchema.parse)
  // verify against DB...
  await setUserSession(event, {
    user: { name: 'Admin', email },
    secure: { role: 'admin' }
  })
  return {}
})
```

```vue
<!-- Client side -->
<script setup>
const { loggedIn, user, clear } = useUserSession()
</script>
```

**Setup:**
```bash
npx nuxi@latest module add auth-utils
# .env
NUXT_SESSION_PASSWORD=random-string-at-least-32-characters
```

**Sumber:**
- https://nuxt.com/modules/auth-utils ✅ Verified
- https://nuxt.org.cn/docs/guide/recipes/sessions-and-authentication ✅ Verified
- https://vercel.com/academy/nuxt-on-vercel/auth-setup ✅ Verified
- https://www.telerik.com/blogs/mastering-authentication-nuxt-3-server-side-rendering-minimalist-guide ✅ Verified

---

## 3. Drizzle ORM + Nuxt Server Routes

### ✅ Integrasi Sudah Mature

Drizzle ORM bekerja sangat baik dengan Nuxt server routes. Pattern standard:

**Struktur folder:**
```
server/
├── database/
│   ├── schema.ts        # Drizzle schema definitions
│   └── migrations/      # Generated migrations
├── utils/
│   └── drizzle.ts       # DB connection + useDrizzle() composable
└── api/
    └── pets/
        ├── index.get.ts  # GET /api/pets
        ├── index.post.ts # POST /api/pets
        └── [id].get.ts   # GET /api/pets/:id
```

**DB connection (SQLite dengan better-sqlite3):**
```ts
// server/utils/drizzle.ts
import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import * as schema from '../database/schema'

export { sql, eq, and, or } from 'drizzle-orm'
export const tables = schema

const sqlite = new Database('sqlite.db')
export const db = drizzle(sqlite, { schema })

export type Pet = typeof schema.pets.$inferSelect
```

**DB connection (PostgreSQL):**
```ts
// server/utils/drizzle.ts
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '../database/schema'

const client = postgres(useRuntimeConfig().databaseUrl)
export const db = drizzle(client, { schema })
```

**API route example:**
```ts
// server/api/pets/index.get.ts
export default defineEventHandler(async () => {
  return db.query.pets.findMany({
    orderBy: [desc(tables.pets.createdAt)]
  })
})
```

**Drizzle config:**
```ts
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit'
export default defineConfig({
  dialect: 'sqlite', // atau 'postgresql'
  schema: './server/database/schema.ts',
  out: './server/database/migrations'
})
```

**Penting:**
- File DB hanya di-import di `server/` — JANGAN di client components
- `server/utils/` auto-imported di semua server routes (Nitro convention)
- Pakai `useRuntimeConfig()` untuk credentials, jangan hardcode

**Sumber:**
- https://legacy.hub.nuxt.com/docs/recipes/drizzle ✅ Verified
- https://dev.to/aaronksaunders/drizzle-orm-sqlite-and-nuxt-js-getting-started-374m ✅ Verified
- https://mokkapps.de/blog/connecting-mysql-database-nuxt-drizzle-orm ✅ Verified
- https://terminalskills.io/use-cases/build-vue-dashboard-with-nuxt ✅ Verified

---

## 4. UI Component Library

### Perbandingan

| Fitur | **Nuxt UI v4** | **PrimeVue** |
|-------|---------------|-------------|
| Components | 125+ (termasuk Pro, semua gratis) | 90+ |
| Foundation | Reka UI (55+ primitives) | Custom |
| Styling | Tailwind CSS v4 + Tailwind Variants | Tailwind atau theme sendiri |
| Accessibility | WAI-ARIA compliant, keyboard nav, focus management | Baik |
| TypeScript | Full typed props, slots, events | Typed |
| Nuxt integration | Native module, auto-imports | Via plugin |
| Dark mode | Built-in | Built-in |
| Figma Kit | ✅ Gratis | ✅ (berbayar) |
| License | MIT, fully open source | MIT |
| Templates | Dashboard, SaaS, Landing, Docs, dll | Ada |

### ✅ Rekomendasi: Nuxt UI v4

- **Alasan utama:** Native Nuxt module, zero-config, semua auto-imported
- Built on Tailwind CSS v4 — kamu sudah familiar Tailwind dari Next.js projects
- 125+ components termasuk DataTable, Forms, Dashboard layout — cukup untuk pet shop app
- Dashboard template tersedia langsung
- Gratis dan open source (dulu Nuxt UI Pro berbayar, sekarang unified dan gratis)

**Setup:**
```bash
npx nuxi module add @nuxt/ui
```

**Sumber:**
- https://ui.nuxt.com/docs/getting-started ✅ Verified
- https://ui3.nuxt.com/getting-started ✅ Verified
- https://nuxt.com/modules/ui ✅ Verified
- https://nuxt.com/raw/blog/nuxt-ui-v3.md ✅ Verified

---

## 5. Database: SQLite vs PostgreSQL

### Untuk Single-Tenant Pet Shop

| Aspek | SQLite | PostgreSQL |
|-------|--------|------------|
| Setup | Zero config, single file | Server process, credentials |
| Cost | $0 | $15-50/month managed |
| Concurrent writes | 1 writer at a time | Thousands |
| Backup | Copy file | pg_dump / WAL |
| Latency | Zero (in-process) | Network hop |
| Deployment complexity | Copy 1 file | Server management |
| Scaling | Single server only | Multi-server, replication |

### ✅ Rekomendasi: SQLite (dengan opsi upgrade ke PostgreSQL)

**Alasan:**
- Single-tenant, 1 toko = low concurrency (staff kecil, bukan ribuan concurrent users)
- Read-heavy workload (lihat jadwal grooming, list produk, histori pelanggan)
- Write volume rendah (booking per hari mungkin <100)
- Zero infrastructure cost
- Backup = copy 1 file
- Drizzle ORM support SQLite dan PostgreSQL — bisa switch nanti kalau perlu

**Kapan upgrade ke PostgreSQL:**
- Kalau deploy multi-server (horizontal scaling)
- Kalau butuh >1000 concurrent writes/second
- Kalau pakai fitur advanced (full-text search, PostGIS, materialized views)

**Driver yang dipakai:**
- Development: `better-sqlite3` (Node.js native driver, paling stabil)
- Atau: `@libsql/client` (kalau mau pakai Turso nanti untuk edge deployment)

```bash
npm install drizzle-orm better-sqlite3
npm install -D drizzle-kit @types/better-sqlite3
```

**Sumber:**
- https://sqlagent.app/blog/sqlite-can-handle-your-website ✅ Verified
- https://www.dbpro.app/learn/sqlite/guides/sqlite-vs-postgresql ✅ Verified
- https://sesamedisk.com/sqlite-in-production/ ✅ Verified

---

## 6. File Upload Handling

### Approach: Vanilla Nitro (tanpa NuxtHub)

Untuk pet shop (foto hewan, produk), pakai `readMultipartFormData` bawaan H3/Nitro.

**Server route:**
```ts
// server/api/upload.post.ts
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const files = await readMultipartFormData(event)
  if (!files || files.length === 0) {
    throw createError({ statusCode: 400, message: 'No file uploaded' })
  }

  const file = files.find(f => f.name === 'file')
  if (!file?.data) {
    throw createError({ statusCode: 400, message: 'Invalid file' })
  }

  // Validate
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type || '')) {
    throw createError({ statusCode: 400, message: 'Invalid file type' })
  }
  if (file.data.length > 5 * 1024 * 1024) { // 5MB
    throw createError({ statusCode: 400, message: 'File too large' })
  }

  const uploadDir = join(process.cwd(), 'public/uploads')
  await mkdir(uploadDir, { recursive: true })
  const filename = `${Date.now()}-${file.filename}`
  await writeFile(join(uploadDir, filename), file.data)

  return { url: `/uploads/${filename}` }
})
```

**Client side:**
```vue
<script setup>
async function uploadFile(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  const result = await $fetch('/api/upload', {
    method: 'POST',
    body: formData
  })
  // result.url = '/uploads/1234-photo.jpg'
}
</script>
```

**Catatan penting:**
- `readMultipartFormData` return array of `{ name, filename, type, data: Buffer }`
- Jangan set `Content-Type` header manual saat pakai `$fetch` dengan `FormData` — browser otomatis set boundary
- Untuk production serius, pertimbangkan S3-compatible storage (Cloudflare R2, MinIO)
- Nuxt UI v4 punya `<UFileUpload>` component bawaan untuk UI-nya

**Sumber:**
- https://stackoverflow.com/questions/76191883 ✅ Verified
- https://formspring.io/docs/recipes/nuxt ✅ Verified
- https://filebase.com/docs/frameworks/nuxt ✅ Verified
- https://ui3.nuxt.com/components/file-upload ✅ Verified

---

## 7. Gotchas & Known Issues

### 🔴 Critical: Data Fetching

1. **JANGAN pakai `$fetch` di `<script setup>` untuk load data** — akan fetch 2x (server + client hydration). Selalu pakai `useFetch` atau `useAsyncData`.

   ```ts
   // ❌ BAD — double fetch + hydration mismatch
   const data = await $fetch('/api/pets')

   // ✅ GOOD — single fetch, deduped
   const { data } = await useFetch('/api/pets')
   ```

2. **`useAsyncData` key harus unik per data** — key fixed dengan URL dinamis = cache collision.

   ```ts
   // ❌ BAD — semua pet ID pakai key 'pet'
   const { data } = await useAsyncData('pet', () => $fetch(`/api/pets/${id}`))

   // ✅ GOOD — key unik per ID
   const { data } = await useAsyncData(`pet-${id}`, () => $fetch(`/api/pets/${id}`))
   ```

### 🔴 Hydration Mismatch

3. **Browser-only APIs di SSR** — `localStorage`, `window`, `document` tidak ada di server.

   ```ts
   // ❌ Hydration mismatch
   const theme = localStorage.getItem('theme')

   // ✅ Pakai useCookie atau onMounted
   const theme = useCookie('theme', { default: () => 'light' })
   ```

4. **Client-only libraries** (date pickers, charts yang manipulasi DOM) — wrap dengan `<ClientOnly>`.

### 🟡 Structure & Config

5. **Nuxt 4 directory structure** — `app/` sekarang default `srcDir`. Components, pages, composables masuk `app/`. Server tetap di root.

6. **Server utils auto-import** — file di `server/utils/` otomatis available di semua server routes tanpa import. Jangan taruh file sensitif di luar `server/`.

7. **Runtime config vs build-time** — pakai `useRuntimeConfig()` untuk secrets (DB password, API keys), bukan `process.env` langsung di client code.

### 🟡 Module Compatibility

8. **Cek kompatibilitas module** — beberapa module Nuxt 2 belum support Nuxt 4. Cek di https://nuxt.com/modules sebelum install.

9. **Tailwind CSS v4 breaking changes** — Nuxt UI v4 pakai Tailwind v4 (CSS-first config, bukan `tailwind.config.js`). Kalau familiar Tailwind v3, ada learning curve kecil.

### 🟡 Deployment

10. **`readMultipartFormData` di serverless** — beberapa platform (Netlify) butuh config khusus karena h3-formidable menulis ke disk. Test di target deployment platform.

11. **SQLite di serverless** — SQLite butuh filesystem access. Tidak jalan di Cloudflare Workers / Vercel Edge Functions. Pakai Node.js runtime atau Turso/LibSQL untuk edge.

**Sumber:**
- https://nuxt.com/docs/3.x/guide/best-practices/hydration.md ✅ Verified
- https://nuxt.com/docs/3.x/getting-started/data-fetching ✅ Verified
- https://pkglog.com/en/blog/nuxt-3-complete-guide/ ✅ Verified
- https://github.com/nuxt/nuxt/discussions/33918 ✅ Verified
- https://www.linkedin.com/posts/mismailatlasi_nuxtjs-vuejs-webdevelopment-activity-7411633819252039680-ArDB ✅ Verified

---

## 📦 Recommended Tech Stack Summary

| Layer | Technology | Alasan |
|-------|-----------|--------|
| **Framework** | Nuxt 4 | Stable, fullstack, SSR, auto-imports |
| **UI** | Nuxt UI v4 | 125+ components, Tailwind v4, native module, free |
| **Auth** | nuxt-auth-utils | Minimalis, sealed cookies, core team maintained |
| **ORM** | Drizzle ORM | Kamu sudah familiar, type-safe, works great with Nuxt |
| **Database** | SQLite (better-sqlite3) | Zero infra, perfect for single-tenant |
| **Validation** | Zod | Type inference, works with `readValidatedBody` |
| **File Upload** | Nitro `readMultipartFormData` + local disk | Simple, no external dependency |
| **Styling** | Tailwind CSS v4 (via Nuxt UI) | Kamu sudah familiar |
| **Language** | TypeScript | First-class support di Nuxt |
| **Package Manager** | pnpm | Fastest, disk efficient |

### Install commands (project baru):
```bash
npx nuxi@latest init pet-grooming
cd pet-grooming
npx nuxi module add @nuxt/ui
npx nuxi module add auth-utils
npm install drizzle-orm better-sqlite3 zod
npm install -D drizzle-kit @types/better-sqlite3
```
