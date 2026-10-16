# ARCHITECTURE — PetKasih (Pet Grooming & Pet Shop Management)

**Versi:** 1.0  
**Tanggal:** 16 Oktober 2026  
**Stack:** Nuxt 4, Nuxt UI v4, Drizzle ORM, SQLite (better-sqlite3), nuxt-auth-utils, Zod, Tailwind CSS v4, TypeScript

---

## 1. Database Schema (Drizzle ORM)

### 1.1 Enums

```typescript
// server/db/enums.ts
export const AppointmentStatus = {
  REQUESTED: 'Requested',
  CONFIRMED: 'Confirmed',
  IN_PROGRESS: 'InProgress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  NO_SHOW: 'NoShow',
} as const;

export const PaymentMethod = {
  CASH: 'Cash',
  TRANSFER: 'Transfer',
  E_WALLET: 'EWallet',
} as const;

export const PaymentStatus = {
  PENDING: 'Pending',
  PARTIAL: 'Partial',
  PAID: 'Paid',
  REFUNDED: 'Refunded',
} as const;

export const UserRole = {
  ADMIN: 'Admin',
  STAFF: 'Staff',
} as const;

export const PetSpecies = {
  DOG: 'Dog',
  CAT: 'Cat',
  RABBIT: 'Rabbit',
  OTHER: 'Other',
} as const;

export const PetGender = {
  MALE: 'Male',
  FEMALE: 'Female',
} as const;

export const VaccineType = {
  CORE: 'Core',
  NON_CORE: 'NonCore',
} as const;

export const SizeCategory = {
  SMALL: 'Small',
  MEDIUM: 'Medium',
  LARGE: 'Large',
  GIANT: 'Giant',
} as const;

export const TransactionType = {
  SERVICE: 'Service',
  PRODUCT: 'Product',
  MIXED: 'Mixed',
} as const;

export const StockAdjustmentReason = {
  DAMAGED: 'Damaged',
  LOST: 'Lost',
  RETURN: 'Return',
  STOCK_OPNAME: 'StockOpname',
  INTERNAL_USE: 'InternalUse',
} as const;

export const VaccinationStatus = {
  UP_TO_DATE: 'up-to-date',
  EXPIRING: 'expiring',
  EXPIRED: 'expired',
  UNKNOWN: 'unknown',
} as const;
```

### 1.2 Tables

```typescript
// server/db/schema.ts
import { sqliteTable, integer, text, real, primaryKey, uniqueIndex, index, foreignKey } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ============================================================
// AUTH & USER MANAGEMENT
// ============================================================

export const users = sqliteTable(
  'users',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    role: text('role', { enum: ['Admin', 'Staff'] }).notNull().default('Staff'),
    isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
    lastLoginAt: text('last_login_at'),
    createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    emailIdx: uniqueIndex('idx_users_email').on(table.email),
  })
);

// ============================================================
// OWNER & PET MANAGEMENT
// ============================================================

export const owners = sqliteTable(
  'owners',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    phone: text('phone').notNull(),
    email: text('email'),
    address: text('address'),
    communicationPref: text('communication_pref', { enum: ['Email', 'SMS', 'WhatsApp'] }).default('WhatsApp'),
    notes: text('notes'),
    loyaltyPoints: integer('loyalty_points').default(0),
    createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
    deletedAt: text('deleted_at'),
  },
  (table) => ({
    phoneIdx: uniqueIndex('idx_owners_phone').on(table.phone),
    nameIdx: index('idx_owners_name').on(table.name),
    deletedAtIdx: index('idx_owners_deleted_at').on(table.deletedAt),
  })
);

export const breeds = sqliteTable(
  'breeds',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    species: text('species', { enum: ['Dog', 'Cat', 'Rabbit', 'Other'] }).notNull(),
    description: text('description'),
  }
);

export const pets = sqliteTable(
  'pets',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    ownerId: integer('owner_id')
      .notNull()
      .references(() => owners.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    species: text('species', { enum: ['Dog', 'Cat', 'Rabbit', 'Other'] }).notNull(),
    breedId: integer('breed_id').references(() => breeds.id),
    breedNotes: text('breed_notes'),
    gender: text('gender', { enum: ['Male', 'Female'] }),
    dateOfBirth: text('date_of_birth'),
    weight: real('weight'),
    color: text('color'),
    photoUrl: text('photo_url'),
    allergies: text('allergies'),
    medicalNotes: text('medical_notes'),
    temperament: text('temperament'),
    isNeutered: integer('is_neutered', { mode: 'boolean' }).default(false),
    microchipNumber: text('microchip_number'),
    isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
    createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
    deletedAt: text('deleted_at'),
  },
  (table) => ({
    ownerIdIdx: index('idx_pets_owner_id').on(table.ownerId),
    speciesIdx: index('idx_pets_species').on(table.species),
    nameIdx: index('idx_pets_name').on(table.name),
  })
);

// ============================================================
// GROOMER MANAGEMENT
// ============================================================

export const groomers = sqliteTable(
  'groomers',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    phone: text('phone'),
    specialties: text('specialties'),
    commissionRate: real('commission_rate').default(0),
    bio: text('bio'),
    isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
    createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  }
);

// ============================================================
// SERVICE MANAGEMENT
// ============================================================

export const services = sqliteTable(
  'services',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    description: text('description'),
    category: text('category').notNull(), // "Grooming", "Add-on", etc.
    baseDurationMin: integer('base_duration_min').notNull().default(60),
    basePrice: integer('base_price').notNull(), // in Rupiah (integer, no decimal)
    isAddOn: integer('is_add_on', { mode: 'boolean' }).notNull().default(false),
    isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
    createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  }
);

export const servicePricings = sqliteTable(
  'service_pricings',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    serviceId: integer('service_id')
      .notNull()
      .references(() => services.id, { onDelete: 'cascade' }),
    sizeCategory: text('size_category', { enum: ['Small', 'Medium', 'Large', 'Giant'] }).notNull(),
    breedId: integer('breed_id').references(() => breeds.id),
    price: integer('price').notNull(),
    durationMin: integer('duration_min'),
  },
  (table) => ({
    serviceIdIdx: index('idx_service_pricings_service_id').on(table.serviceId),
    pk: primaryKey({ columns: [table.serviceId, table.sizeCategory, table.breedId] }),
  })
);

// ============================================================
// APPOINTMENT MANAGEMENT
// ============================================================

export const appointments = sqliteTable(
  'appointments',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    ownerId: integer('owner_id')
      .notNull()
      .references(() => owners.id, { onDelete: 'cascade' }),
    petId: integer('pet_id')
      .notNull()
      .references(() => pets.id, { onDelete: 'cascade' }),
    groomerId: integer('groomer_id')
      .notNull()
      .references(() => groomers.id),
    status: text('status', { enum: ['Requested', 'Confirmed', 'InProgress', 'Completed', 'Cancelled', 'NoShow'] })
      .notNull()
      .default('Confirmed'),
    scheduledAt: text('scheduled_at').notNull(),
    checkInAt: text('check_in_at'),
    checkOutAt: text('check_out_at'),
    estimatedDurationMin: integer('estimated_duration_min'),
    actualDurationMin: integer('actual_duration_min'),
    totalPrice: integer('total_price').notNull(),
    notes: text('notes'),
    cancelReason: text('cancel_reason'),
    isRecurring: integer('is_recurring', { mode: 'boolean' }).default(false),
    recurrenceWeeks: integer('recurrence_weeks'),
    parentAppointmentId: integer('parent_appointment_id').references(() => appointments.id),
    createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    ownerIdIdx: index('idx_appointments_owner_id').on(table.ownerId),
    petIdIdx: index('idx_appointments_pet_id').on(table.petId),
    groomerIdIdx: index('idx_appointments_groomer_id').on(table.groomerId),
    scheduledAtIdx: index('idx_appointments_scheduled_at').on(table.scheduledAt),
    statusIdx: index('idx_appointments_status').on(table.status),
  })
);

export const appointmentServices = sqliteTable(
  'appointment_services',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    appointmentId: integer('appointment_id')
      .notNull()
      .references(() => appointments.id, { onDelete: 'cascade' }),
    serviceId: integer('service_id')
      .notNull()
      .references(() => services.id),
    quantity: integer('quantity').notNull().default(1),
    unitPrice: integer('unit_price').notNull(),
  }
);

// ============================================================
// GROOMING NOTES
// ============================================================

export const groomingNotes = sqliteTable(
  'grooming_notes',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    appointmentId: integer('appointment_id')
      .notNull()
      .unique()
      .references(() => appointments.id, { onDelete: 'cascade' }),
    petId: integer('pet_id')
      .notNull()
      .references(() => pets.id),
    bladeSize: text('blade_size'),
    shampooUsed: text('shampoo_used'),
    styleNotes: text('style_notes'),
    behaviorNotes: text('behavior_notes'),
    skinCondition: text('skin_condition'),
    beforePhotoUrl: text('before_photo_url'),
    afterPhotoUrl: text('after_photo_url'),
    createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    appointmentIdIdx: uniqueIndex('idx_grooming_notes_appointment_id').on(table.appointmentId),
    petIdIdx: index('idx_grooming_notes_pet_id').on(table.petId),
  })
);

// ============================================================
// VACCINATION MANAGEMENT
// ============================================================

export const vaccinations = sqliteTable(
  'vaccinations',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    petId: integer('pet_id')
      .notNull()
      .references(() => pets.id, { onDelete: 'cascade' }),
    vaccineName: text('vaccine_name').notNull(),
    vaccineType: text('vaccine_type', { enum: ['Core', 'NonCore'] }).notNull(),
    dateAdministered: text('date_administered').notNull(),
    expiryDate: text('expiry_date').notNull(),
    administeredBy: text('administered_by'),
    batchNumber: text('batch_number'),
    documentUrl: text('document_url'),
    notes: text('notes'),
    createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    petIdIdx: index('idx_vaccinations_pet_id').on(table.petId),
    expiryDateIdx: index('idx_vaccinations_expiry_date').on(table.expiryDate),
  })
);

export const vaccineRecords = sqliteTable(
  'vaccine_records',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    petId: integer('pet_id')
      .notNull()
      .references(() => pets.id, { onDelete: 'cascade' }),
    vaccineName: text('vaccine_name').notNull(),
    nextDueDate: text('next_due_date').notNull(),
    lastAdministeredAt: text('last_administered_at'),
  }
);

// ============================================================
// PRODUCT & INVENTORY MANAGEMENT
// ============================================================

export const products = sqliteTable(
  'products',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    sku: text('sku').unique(),
    barcode: text('barcode'),
    category: text('category').notNull(),
    brand: text('brand'),
    description: text('description'),
    unitPrice: integer('unit_price').notNull(), // in Rupiah
    costPrice: integer('cost_price'),
    stockQuantity: integer('stock_quantity').notNull().default(0),
    reorderLevel: integer('reorder_level').default(10),
    expiryDate: text('expiry_date'),
    weight: real('weight'),
    speciesTarget: text('species_target', { enum: ['Dog', 'Cat', 'All'] }).default('All'),
    isRestrictedMedicine: integer('is_restricted_medicine', { mode: 'boolean' }).default(false),
    isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
    createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    skuIdx: uniqueIndex('idx_products_sku').on(table.sku),
    nameIdx: index('idx_products_name').on(table.name),
    expiryDateIdx: index('idx_products_expiry_date').on(table.expiryDate),
    stockQuantityIdx: index('idx_products_stock_quantity').on(table.stockQuantity),
  })
);

export const inventoryAdjustments = sqliteTable(
  'inventory_adjustments',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    productId: integer('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    adjustment: integer('adjustment').notNull(), // positive or negative
    reason: text('reason', {
      enum: ['Damaged', 'Lost', 'Return', 'StockOpname', 'InternalUse'],
    }).notNull(),
    notes: text('notes'),
    adjustedBy: integer('adjusted_by')
      .notNull()
      .references(() => users.id),
    createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    productIdIdx: index('idx_inventory_adjustments_product_id').on(table.productId),
  })
);

// ============================================================
// TRANSACTION MANAGEMENT
// ============================================================

export const transactions = sqliteTable(
  'transactions',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    ownerId: integer('owner_id').references(() => owners.id),
    appointmentId: integer('appointment_id').references(() => appointments.id),
    type: text('type', { enum: ['Service', 'Product', 'Mixed'] }).notNull(),
    subtotal: integer('subtotal').notNull(),
    discount: integer('discount').default(0),
    total: integer('total').notNull(),
    paymentMethod: text('payment_method', { enum: ['Cash', 'Transfer', 'EWallet'] }).notNull(),
    paymentStatus: text('payment_status', { enum: ['Pending', 'Partial', 'Paid', 'Refunded'] })
      .notNull()
      .default('Paid'),
    amountPaid: integer('amount_paid').default(0),
    notes: text('notes'),
    createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    ownerIdIdx: index('idx_transactions_owner_id').on(table.ownerId),
    appointmentIdIdx: index('idx_transactions_appointment_id').on(table.appointmentId),
    createdAtIdx: index('idx_transactions_created_at').on(table.createdAt),
    paymentStatusIdx: index('idx_transactions_payment_status').on(table.paymentStatus),
  })
);

export const transactionItems = sqliteTable(
  'transaction_items',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    transactionId: integer('transaction_id')
      .notNull()
      .references(() => transactions.id, { onDelete: 'cascade' }),
    itemType: text('item_type', { enum: ['Service', 'Product'] }).notNull(),
    serviceId: integer('service_id').references(() => services.id),
    productId: integer('product_id').references(() => products.id),
    quantity: integer('quantity').notNull().default(1),
    unitPrice: integer('unit_price').notNull(),
    discount: integer('discount').default(0),
  },
  (table) => ({
    transactionIdIdx: index('idx_transaction_items_transaction_id').on(table.transactionId),
  })
);

export const transactionPayments = sqliteTable(
  'transaction_payments',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    transactionId: integer('transaction_id')
      .notNull()
      .references(() => transactions.id, { onDelete: 'cascade' }),
    amount: integer('amount').notNull(),
    paymentMethod: text('payment_method', { enum: ['Cash', 'Transfer', 'EWallet'] }).notNull(),
    createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  }
);

export const transactionRefunds = sqliteTable(
  'transaction_refunds',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    transactionId: integer('transaction_id')
      .notNull()
      .references(() => transactions.id, { onDelete: 'cascade' }),
    amount: integer('amount').notNull(),
    reason: text('reason').notNull(),
    createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  }
);

// ============================================================
// SETTINGS
// ============================================================

export const settings = sqliteTable(
  'settings',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    key: text('key').notNull().unique(),
    value: text('value'),
    updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  }
);
```

### 1.3 Key Constraints & Relationships

| From Table | Field | References | Type |
|---|---|---|---|
| `pets` | `owner_id` | `owners.id` | Many-to-One |
| `pets` | `breed_id` | `breeds.id` | Many-to-One (optional) |
| `appointments` | `owner_id` | `owners.id` | Many-to-One |
| `appointments` | `pet_id` | `pets.id` | Many-to-One |
| `appointments` | `groomer_id` | `groomers.id` | Many-to-One |
| `appointmentServices` | `appointment_id` | `appointments.id` | Many-to-One |
| `appointmentServices` | `service_id` | `services.id` | Many-to-One |
| `groomingNotes` | `appointment_id` | `appointments.id` | One-to-One |
| `groomingNotes` | `pet_id` | `pets.id` | Many-to-One |
| `vaccinations` | `pet_id` | `pets.id` | Many-to-One |
| `transactions` | `owner_id` | `owners.id` | Many-to-One (optional) |
| `transactions` | `appointment_id` | `appointments.id` | Many-to-One (optional) |
| `transactionItems` | `transaction_id` | `transactions.id` | Many-to-One |
| `transactionItems` | `service_id` | `services.id` | Many-to-One (optional) |
| `transactionItems` | `product_id` | `products.id` | Many-to-One (optional) |
| `servicePricings` | `service_id` | `services.id` | Many-to-One |
| `servicePricings` | `breed_id` | `breeds.id` | Many-to-One (optional) |
| `inventoryAdjustments` | `product_id` | `products.id` | Many-to-One |
| `inventoryAdjustments` | `adjusted_by` | `users.id` | Many-to-One |

---

## 2. Entity Relationship Diagram (ERD)

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                       │
│  USERS (id, name, email, passwordHash, role, isActive)              │
│     │                                                                 │
│     └─────────────────┐                                              │
│                       │ 1:N                                          │
│                       ├────► INVENTORY_ADJUSTMENTS                   │
│                       │      (id, productId, adjustment, reason)     │
│                       │                                               │
│  OWNERS (id, name, phone, email, address, notes, loyaltyPoints)     │
│     │                                                                 │
│     ├─ 1:N ─────────► PETS (id, ownerId, name, species, breed,     │
│     │                 dateOfBirth, weight, color, photoUrl,          │
│     │                 allergies, medicalNotes, temperament)          │
│     │                      │                                          │
│     │                      ├─ 1:N ──► GROOMING_NOTES                │
│     │                      │          (id, appointmentId, petId,     │
│     │                      │           bladeSize, shampooUsed,       │
│     │                      │           behaviorNotes, photos)        │
│     │                      │                                          │
│     │                      ├─ 1:N ──► VACCINATIONS                  │
│     │                      │          (id, petId, vaccineName,       │
│     │                      │           dateAdministered, expiryDate) │
│     │                      │                                          │
│     │                      ├─ 1:N ──► VACCINE_RECORDS                │
│     │                      │          (tracking next due dates)      │
│     │                      │                                          │
│     │                      └─ 1:N ──► APPOINTMENTS                  │
│     │                                 (id, petId, groomerId,         │
│     │                                  status, scheduledAt)          │
│     │                                      │                         │
│     │                                      ├─ 1:N ──► APPOINTMENT_   │
│     │                                      │           SERVICES      │
│     │                                      │           (linking to   │
│     │                                      │           SERVICES)     │
│     │                                      │                         │
│     │                                      └─ 1:1 ──► GROOMING_NOTES│
│     │                                                                 │
│     └─ 1:N ─────────► TRANSACTIONS (id, ownerId, appointmentId,   │
│                       type, subtotal, discount, total,              │
│                       paymentMethod, paymentStatus)                 │
│                            │                                         │
│                            ├─ 1:N ──► TRANSACTION_ITEMS             │
│                            │          (serviceId or productId)      │
│                            │                                         │
│                            ├─ 1:N ──► TRANSACTION_PAYMENTS          │
│                            │          (payment records)             │
│                            │                                         │
│                            └─ 1:N ──► TRANSACTION_REFUNDS           │
│                                       (refund records)              │
│                                                                      │
│  GROOMERS (id, name, phone, specialties, commissionRate)            │
│     │                                                                │
│     └─ 1:N ─────────► APPOINTMENTS                                 │
│                                                                      │
│  SERVICES (id, name, category, baseDurationMin, basePrice)          │
│     │                                                                │
│     ├─ 1:N ─────────► SERVICE_PRICINGS                             │
│     │                 (sizeCategory, breedId, price)               │
│     │                                                                │
│     └─ 1:N ─────────► APPOINTMENT_SERVICES                         │
│                                                                      │
│  BREEDS (id, name, species) ◄── referenced by PETS & SERVICE_PRICINGS
│                                                                      │
│  PRODUCTS (id, name, sku, category, unitPrice, costPrice,           │
│            stockQuantity, reorderLevel, expiryDate,                 │
│            isRestrictedMedicine)                                    │
│     │                                                                │
│     └─ 1:N ─────────► INVENTORY_ADJUSTMENTS                        │
│                                                                      │
│  SETTINGS (key-value store)                                         │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

Key Cardinality:
- 1:1 = One-to-One
- 1:N = One-to-Many
- All relationships with ON DELETE CASCADE
```

---

## 3. API Endpoints List

### 3.1 Auth Module

```
POST /api/auth/login
  Request:  { email: string, password: string }
  Response: { user: { id, name, email, role } }
  Status:   200, 401 (invalid creds), 429 (rate limit)

POST /api/auth/logout
  Response: {}
  Status:   200

GET /api/auth/session
  Response: { user: { id, name, email, role } }
  Status:   200, 401 (not logged in)
```

### 3.2 Owner Module

```
GET /api/owners
  Query:    ?q=keyword&page=1&limit=20&sort=name&order=asc
  Response: { data: Owner[], meta: { page, limit, total, totalPages } }
  Status:   200, 400 (validation)

POST /api/owners
  Body:     { name*, phone*, email?, address?, communicationPref?, notes? }
  Response: { data: Owner }
  Status:   201, 400 (validation), 409 (duplicate phone)

GET /api/owners/:id
  Response: { data: Owner & { pets: Pet[] } }
  Status:   200, 404

PUT /api/owners/:id
  Body:     { name?, phone?, email?, address?, communicationPref?, notes? }
  Response: { data: Owner }
  Status:   200, 400, 404

DELETE /api/owners/:id
  Response: (204 No Content - soft delete)
  Status:   204, 404
```

### 3.3 Pet Module

```
GET /api/pets
  Query:    ?ownerId=1&q=keyword&species=Dog&page=1&limit=20
  Response: { data: Pet[], meta }
  Status:   200, 400

POST /api/pets
  Body:     { ownerId*, name*, species*, breedId?, gender?, dateOfBirth?, weight?, color?, allergies?, medicalNotes?, temperament?, isNeutered?, microchipNumber? }
  Response: { data: Pet (includes computed age) }
  Status:   201, 400, 404 (owner not found)

GET /api/pets/:id
  Response: { data: Pet & { owner, vaccinations, recentAppointments[], vaccinationStatus, age } }
  Status:   200, 404

PUT /api/pets/:id
  Body:     { name?, species?, breedId?, gender?, dateOfBirth?, weight?, ... (same as POST) }
  Response: { data: Pet }
  Status:   200, 400, 404

DELETE /api/pets/:id
  Response: (204 No Content - soft delete)
  Status:   204, 404

POST /api/pets/:id/photo
  Body:     multipart/form-data { file: image (JPEG/PNG/WebP, max 5MB) }
  Response: { data: { url: string } }
  Status:   200, 400 (invalid file)
```

### 3.4 Breed Module (Reference Data)

```
GET /api/breeds
  Query:    ?species=Dog
  Response: { data: Breed[] }
  Status:   200
```

### 3.5 Service Module

```
GET /api/services
  Query:    ?category=Grooming&isActive=true
  Response: { data: Service[] (includes pricings[]) }
  Status:   200

POST /api/services (Admin only)
  Body:     { name*, description?, category*, baseDurationMin, basePrice*, isAddOn?, pricings?: [...] }
  Response: { data: Service }
  Status:   201, 400, 403 (unauthorized)

PUT /api/services/:id (Admin only)
  Body:     { name?, description?, category?, baseDurationMin?, basePrice?, isAddOn?, ... }
  Response: { data: Service }
  Status:   200, 400, 403, 404

DELETE /api/services/:id (Admin only)
  Response: (204 No Content - soft delete)
  Status:   204, 403, 404
```

### 3.6 Appointment Module

```
GET /api/appointments
  Query:    ?date=2026-10-16&dateFrom=...&dateTo=...&groomerId=1&status=Confirmed&page=1&limit=50
  Response: { data: Appointment[], meta }
  Status:   200, 400

GET /api/appointments/today
  Response: { data: Appointment[] (sorted by scheduledAt) }
  Status:   200

POST /api/appointments
  Body:     { ownerId*, petId*, groomerId*, scheduledAt*, serviceIds*[], notes?, isRecurring?, recurrenceWeeks? }
  Response: { data: Appointment (with estimatedDurationMin, totalPrice) }
  Status:   201, 400 (validation, conflict), 409 (scheduling conflict)

GET /api/appointments/:id
  Response: { data: Appointment & { pet, owner, groomer, services[], groomingNotes?, transaction? } }
  Status:   200, 404

PATCH /api/appointments/:id/status
  Body:     { status*, cancelReason? }
  Response: { data: Appointment }
  Status:   200, 400, 404

DELETE /api/appointments/:id
  Response: (204 No Content - cancel appointment)
  Status:   204, 404
```

### 3.7 Grooming Notes Module

```
GET /api/appointments/:appointmentId/notes
  Response: { data: GroomingNote[] }
  Status:   200, 404

POST /api/appointments/:appointmentId/notes
  Body:     { bladeSize?, shampooUsed?, styleNotes?, behaviorNotes?, skinCondition? }
  Response: { data: GroomingNote }
  Status:   201, 400, 404

POST /api/grooming-notes/:id/photos
  Body:     multipart/form-data { before?: image, after?: image (max 5MB each) }
  Response: { data: { beforePhotoUrl?, afterPhotoUrl? } }
  Status:   200, 400, 404

GET /api/pets/:petId/grooming-history
  Query:    ?page=1&limit=10
  Response: { data: GroomingNote[], meta }
  Status:   200, 404
```

### 3.8 Vaccination Module

```
GET /api/pets/:petId/vaccinations
  Response: { data: Vaccination[] }
  Status:   200, 404

POST /api/pets/:petId/vaccinations
  Body:     { vaccineName*, vaccineType*, dateAdministered*, expiryDate?, administeredBy?, batchNumber?, notes? }
  Response: { data: Vaccination (auto-calculated expiryDate if not provided) }
  Status:   201, 400, 404 (pet not found)

POST /api/vaccinations/:id/document
  Body:     multipart/form-data { file: document (JPEG/PNG/WebP/PDF, max 5MB) }
  Response: { data: { documentUrl: string } }
  Status:   200, 400, 404

GET /api/vaccinations/alerts
  Query:    ?days=30
  Response: { data: [{ pet, owner, vaccination, daysUntilExpiry }] }
  Status:   200

GET /api/vaccinations/alerts/whatsapp/:petId
  Response: { data: { url: string (wa.me link), message: string } }
  Status:   200, 404
```

### 3.9 Product & Inventory Module

```
GET /api/products
  Query:    ?q=keyword&category=Food&speciesTarget=Dog&lowStock=true&expiringSoon=true&page=1&limit=20
  Response: { data: Product[], meta }
  Status:   200

POST /api/products
  Body:     { name*, sku?, barcode?, category*, brand?, description?, unitPrice*, costPrice?, stockQuantity*, reorderLevel?, expiryDate?, weight?, speciesTarget?, isRestrictedMedicine? }
  Response: { data: Product }
  Status:   201, 400, 409 (duplicate sku)

PUT /api/products/:id
  Body:     { name?, sku?, barcode?, ... (same as POST) }
  Response: { data: Product }
  Status:   200, 400, 404

PATCH /api/products/:id/stock
  Body:     { adjustment*, reason* (Damaged|Lost|Return|StockOpname|InternalUse), notes? }
  Response: { data: Product (updated stockQuantity) }
  Status:   200, 400 (negative stock), 404

DELETE /api/products/:id
  Response: (204 No Content - soft delete)
  Status:   204, 404

GET /api/products/low-stock
  Response: { data: Product[] (stockQuantity <= reorderLevel) }
  Status:   200

GET /api/products/expiring
  Query:    ?days=30
  Response: { data: Product[] }
  Status:   200
```

### 3.10 Transaction Module

```
GET /api/transactions
  Query:    ?dateFrom=...&dateTo=...&type=Service|Product|Mixed&paymentMethod=Cash&paymentStatus=Paid&page=1&limit=20
  Response: { data: Transaction[], meta }
  Status:   200

POST /api/transactions
  Body:     { ownerId?, appointmentId?, type*, discount?, paymentMethod*, paymentStatus*, notes?, items*: [{ itemType*, serviceId?, productId?, quantity*, unitPrice*, discount? }] }
  Response: { data: Transaction (auto-calculated subtotal, total) }
  Status:   201, 400 (validation, insufficient stock), 409 (conflict)

GET /api/transactions/:id
  Response: { data: Transaction & { items[], owner?, appointment? } }
  Status:   200, 404

POST /api/transactions/:id/payments
  Body:     { amount*, paymentMethod* }
  Response: { data: Transaction (updated paymentStatus) }
  Status:   200, 400, 404

POST /api/transactions/:id/refund
  Body:     { amount*, reason*, refundItems?: [{ transactionItemId, quantity }] }
  Response: { data: Transaction }
  Status:   200, 400, 404

GET /api/transactions/:id/receipt
  Response: { data: { html: string (printable receipt), whatsappUrl: string } }
  Status:   200, 404
```

### 3.11 Groomer Module

```
GET /api/groomers
  Query:    ?isActive=true
  Response: { data: Groomer[] }
  Status:   200

POST /api/groomers (Admin only)
  Body:     { name*, phone?, specialties?, commissionRate?, bio? }
  Response: { data: Groomer }
  Status:   201, 400, 403

PUT /api/groomers/:id (Admin only)
  Body:     { name?, phone?, specialties?, commissionRate?, bio? }
  Response: { data: Groomer }
  Status:   200, 400, 403, 404

GET /api/groomers/:id/schedule
  Query:    ?date=2026-10-16 or ?dateFrom=...&dateTo=...
  Response: { data: Appointment[] }
  Status:   200, 404
```

### 3.12 Report Module

```
GET /api/reports/revenue (Admin only)
  Query:    ?period=daily|weekly|monthly&dateFrom=...&dateTo=...
  Response: { data: { total, byCategory, byPaymentMethod, transactionCount, trend[] } }
  Status:   200, 400, 403

GET /api/reports/services (Admin only)
  Query:    ?dateFrom=...&dateTo=...
  Response: { data: { byBookingCount[], byRevenue[], avgBookingsPerDay } }
  Status:   200, 400, 403

GET /api/reports/inventory (Admin only)
  Response: { data: { topSellers[], slowMovers[], totalInventoryValue, avgMarginByCategory[] } }
  Status:   200, 403
```

### 3.13 Export Module

```
GET /api/export/:entity (Admin only)
  Path:     entity = owners|pets|transactions|products|appointments
  Query:    ?format=csv|json&dateFrom=...&dateTo=...
  Response: File download (CSV or JSON)
  Status:   200, 400, 403
```

### 3.14 User Management Module

```
GET /api/users (Admin only)
  Response: { data: User[] (no password field) }
  Status:   200, 403

POST /api/users (Admin only)
  Body:     { name*, email*, password*, role* (Admin|Staff) }
  Response: { data: User }
  Status:   201, 400, 403, 409 (duplicate email)

PUT /api/users/:id (Admin only)
  Body:     { name?, email?, role? }
  Response: { data: User }
  Status:   200, 400, 403, 404

PATCH /api/users/:id/password (Admin or self)
  Body:     { currentPassword*, newPassword* }
  Response: {}
  Status:   200, 400 (validation), 403 (unauthorized), 404

DELETE /api/users/:id (Admin only)
  Response: (204 No Content - soft delete)
  Status:   204, 403, 404, 422 (cannot delete last admin or self)
```

### 3.15 Settings Module

```
GET /api/settings (Admin only)
  Response: { data: { shopName, phone, address, timezone, vaccinationBlockBooking } }
  Status:   200, 403

PUT /api/settings (Admin only)
  Body:     { shopName?, phone?, address?, timezone?, vaccinationBlockBooking? }
  Response: { data: Settings }
  Status:   200, 400, 403
```

---

## 4. Module Breakdown

### 4.1 Frontend Pages & Routes (app/pages/)

| Route | Page | Components | Logic |
|---|---|---|---|
| `/login` | LoginPage | FormLogin | Email/password auth; session setup via nuxt-auth-utils |
| `/` | DashboardPage | CardStats, AppointmentList, AlertList | Real-time data from /api; calculated metrics |
| `/owners` | OwnersListPage | TableOwners, SearchBar, Pagination | CRUD owners; phone validation |
| `/owners/new` | OwnerFormPage | FormOwner | Create owner; validate phone format |
| `/owners/:id` | OwnerDetailPage | OwnerProfile, PetsList | Edit owner; manage pets; soft-delete |
| `/owners/:id/edit` | OwnerEditPage | FormOwner | Pre-fill form; update |
| `/pets/:id` | PetDetailPage | PetCard, TabsInfo, GroomingHistory, VaccinationStatus, TransactionHistory | Single-page view; computed age from DOB; vaccine status badge |
| `/pets/:id/edit` | PetEditPage | FormPet | Pre-fill; update with file upload for photo |
| `/calendar` | CalendarPage | CalendarView, AppointmentSidebar | Daily/weekly toggle; click appointment for detail; drag-to-reschedule (future) |
| `/appointments` | AppointmentsListPage | TableAppointments, FilterBar, Pagination | Search, filter by status/groomer/date |
| `/appointments/new` | AppointmentFormPage | FormAppointment | Multi-step: select owner → pet → groomer → service(s) → datetime; validation for conflicts |
| `/appointments/:id` | AppointmentDetailPage | AppointmentDetail, QuickActions | View details; check-in/complete/cancel buttons |
| `/products` | ProductsListPage | TableProducts, SearchBar, Pagination | CRUD products; show reorder level indicator |
| `/products/new` | ProductFormPage | FormProduct | Create with SKU, category, stock; flag restricted medicine |
| `/products/:id` | ProductDetailPage | ProductInfo, StockAdjustmentForm, ActivityLog | View details; adjust stock manually with reason |
| `/products/:id/edit` | ProductEditPage | FormProduct | Pre-fill; update |
| `/pos` | POSPage | CartView, ProductSearch, PaymentForm | Add items (services/products); calculate total; process payment; print receipt |
| `/transactions` | TransactionsListPage | TableTransactions, FilterBar, Pagination | Filter by date/type/payment method/status |
| `/transactions/:id` | TransactionDetailPage | TransactionDetail, ReceiptPreview | View; print receipt; WhatsApp share |
| `/vaccinations/alerts` | VaccinationAlertsPage | AlertsList, WhatsAppButton | Group by expiry urgency (expired/7d/30d); batch WhatsApp send |
| `/reports` | ReportsPage | TabsReports, Menu | Hub to revenue/services/inventory reports |
| `/reports/revenue` | RevenueReportPage | ChartRevenue, TableBreakdown, ExportButton | Period selector; breakdown by category/payment method; CSV export |
| `/reports/services` | ServicesReportPage | ChartServices, TableRanking, ExportButton | Top services by booking count & revenue |
| `/reports/inventory` | InventoryReportPage | TopSellers, SlowMovers, ValueOverview | Product performance; inventory value |
| `/settings` | SettingsPage | FormSettings, TabsSettings | Shop info, user management, groomer management |
| `/settings/users` | UsersManagementPage | TableUsers, FormUser, DeleteConfirm | CRUD users; role assignment; password reset |
| `/settings/groomers` | GroomersManagementPage | TableGroomers, FormGroomer | CRUD groomers; schedule view |

### 4.2 Server Routes (server/api/)

**Structure:**
```
server/
├── api/
│   ├── auth/
│   │   ├── login.post.ts
│   │   ├── logout.post.ts
│   │   └── session.get.ts
│   ├── owners/
│   │   ├── index.get.ts, index.post.ts
│   │   ├── [id].get.ts, [id].put.ts, [id].delete.ts
│   ├── pets/
│   │   ├── index.get.ts, index.post.ts
│   │   ├── [id].get.ts, [id].put.ts, [id].delete.ts
│   │   ├── [id]/photo.post.ts
│   │   ├── [id]/grooming-history.get.ts
│   ├── appointments/
│   │   ├── index.get.ts, index.post.ts
│   │   ├── today.get.ts
│   │   ├── [id].get.ts
│   │   ├── [id]/status.patch.ts
│   │   ├── [id]/delete.delete.ts
│   ├── grooming-notes/
│   │   ├── [appointmentId]/index.get.ts, index.post.ts
│   │   ├── [id]/photos.post.ts
│   ├── vaccinations/
│   │   ├── [petId]/index.get.ts, index.post.ts
│   │   ├── [id]/document.post.ts
│   │   ├── alerts.get.ts
│   │   ├── alerts/[petId]/whatsapp.get.ts
│   ├── products/
│   │   ├── index.get.ts, index.post.ts
│   │   ├── [id].get.ts, [id].put.ts, [id].delete.ts
│   │   ├── [id]/stock.patch.ts
│   │   ├── low-stock.get.ts
│   │   ├── expiring.get.ts
│   ├── transactions/
│   │   ├── index.get.ts, index.post.ts
│   │   ├── [id].get.ts
│   │   ├── [id]/payments.post.ts
│   │   ├── [id]/refund.post.ts
│   │   ├── [id]/receipt.get.ts
│   ├── groomers/
│   │   ├── index.get.ts, index.post.ts
│   │   ├── [id].put.ts
│   │   ├── [id]/schedule.get.ts
│   ├── reports/
│   │   ├── revenue.get.ts
│   │   ├── services.get.ts
│   │   ├── inventory.get.ts
│   ├── export/
│   │   └── [entity].get.ts
│   ├── users/
│   │   ├── index.get.ts, index.post.ts
│   │   ├── [id].put.ts, [id].delete.ts
│   │   ├── [id]/password.patch.ts
│   ├── settings/
│   │   ├── index.get.ts, index.put.ts
│   ├── breeds/
│   │   └── index.get.ts
│   └── services/
│       ├── index.get.ts, index.post.ts
│       ├── [id].put.ts, [id].delete.ts
├── middleware/
│   ├── auth.ts (requireUserSession)
│   └── role.ts (checkRole)
├── utils/
│   ├── db.ts (database connection)
│   ├── validation.ts (Zod schemas)
│   ├── cache.ts (memoization for reports)
│   └── file-upload.ts (image upload handling)
└── db/
    ├── schema.ts (Drizzle tables)
    ├── enums.ts
    └── migrations/ (if using Drizzle migrations)
```

### 4.3 Composables & Utilities (composables/, utils/)

```typescript
composables/
├── useAuth.ts              // Session management (nuxt-auth-utils wrapper)
├── useOwners.ts            // Fetch/CRUD owners
├── usePets.ts              // Fetch/CRUD pets
├── useAppointments.ts      // Fetch/CRUD appointments
├── useVaccinations.ts      // Fetch/calc vaccination status
├── useProducts.ts          // Fetch/CRUD products
├── useTransactions.ts      // Fetch/CRUD transactions
├── useReports.ts           // Fetch report data
├── useNotifications.ts     // Toast, alerts

utils/
├── api.ts                  // $fetch wrapper with error handling
├── validators.ts           // Zod schemas (shared with server)
├── formatters.ts           // Format Rupiah, dates, age calculation
├── whatsapp.ts             // Generate wa.me links
└── export.ts               // CSV/JSON export helpers
```

---

## 5. Data Flow Diagrams

### 5.1 Booking Workflow

```
┌─────────────────────────────────────────────────────────┐
│ Booking Flow: Owner → Pet → Service → Appointment      │
└─────────────────────────────────────────────────────────┘

STEP 1: SELECT OWNER
  Staff → /appointments/new → OwnerSearch
  ↓ (SELECT or CREATE NEW)
  GET /api/owners?q=keyword
  ↓ returns Owner (id, name, phone)

STEP 2: SELECT PET
  OwnerDetailSidebar shows Pets
  ↓
  GET /api/pets?ownerId=123
  ↓ returns Pet[] (includes computed age, vaccinationStatus)
  ↓ (WARNING if vaccine expired)

STEP 3: SELECT GROOMER & SERVICE(S)
  AvailabilityCheck → GET /api/groomers/:id/schedule?date=2026-10-20
  ↓ returns Appointments[]
  ↓
  GroomerCalendarView → highlight free slots
  ↓
  ServiceMultiSelect → GET /api/services?isActive=true
  ↓ returns Service[] (includes pricings[] by size category)
  ↓
  PriceCalculation:
    - Fetch pet size from DOB/weight estimate
    - Match against servicePricings (sizeCategory)
    - Calc totalPrice = sum(servicePricing.price)
    - Calc estimatedDurationMin = sum(servicePricing.durationMin)

STEP 4: CONFIRM APPOINTMENT
  POST /api/appointments
  {
    ownerId, petId, groomerId,
    scheduledAt: "2026-10-20T14:00:00+07:00",
    serviceIds: [1, 3],
    notes: "Anxious, use calm voice"
  }
  ↓ (Validation: check groomer availability, pet vaccination)
  ↓
  Response: Appointment { id, totalPrice, estimatedDurationMin, status: "Confirmed" }
  ↓
  UI: Show confirmation + QuickActions (print receipt, WhatsApp owner)
```

### 5.2 Point of Sale (POS) Flow

```
┌─────────────────────────────────────────────────────────┐
│ POS Flow: Add Items → Calculate → Payment → Receipt    │
└─────────────────────────────────────────────────────────┘

STEP 1: SELECT OWNER (optional)
  POSPage → OwnerSearch
  ↓
  GET /api/owners?q=keyword
  ↓ returns Owner

STEP 2: (OPTIONAL) LINK TO APPOINTMENT
  - If Owner selected, show recent completed appointments
  - Clicking appointment auto-fills service from appointmentServices

STEP 3: ADD ITEMS (Service or Product)
  ItemSearch → ProductSearch
  ↓
  GET /api/products?q=keyword
  GET /api/services?isActive=true
  ↓
  Click item → Add to Cart (qty selector)
  ↓
  Calculate line price: quantity × unitPrice
  ↓
  Check product stock:
    - If insufficient, warning "Stok tidak cukup"

STEP 4: REVIEW CART
  CartSummary:
    - Item 1: Full Groom (L) @ Rp 150.000 × 1
    - Item 2: Shampoo Oatmeal @ Rp 85.000 × 1
    ─────────────────────────────
    Subtotal:      Rp 235.000
    Discount:      Rp 0 (manual input)
    ─────────────────────────────
    Total:         Rp 235.000

STEP 5: SELECT PAYMENT METHOD & PROCESS
  PaymentForm:
    - Method: [Cash] [Transfer] [E-Wallet]
    - Process Payment
  ↓
  POST /api/transactions
  {
    ownerId?, appointmentId?,
    type: "Mixed",
    discount: 0,
    paymentMethod: "Cash",
    paymentStatus: "Paid",
    items: [
      { itemType: "Service", serviceId: 1, quantity: 1, unitPrice: 150000 },
      { itemType: "Product", productId: 2, quantity: 1, unitPrice: 85000 }
    ]
  }
  ↓ (Stock deduction for products, appointment status update if linked)
  ↓
  Response: Transaction { id, subtotal, total, items[], ... }

STEP 6: RECEIPT & SHARE
  ReceiptPreview (printable format)
  ↓
  Options:
    - [Print] → browser print dialog
    - [Share WhatsApp] → GET /api/transactions/:id/receipt
      → response: { html, whatsappUrl: "https://wa.me/62812xxx?text=..." }
      → open whatsappUrl in new tab
```

### 5.3 Vaccination Tracking & Alert Flow

```
┌─────────────────────────────────────────────────────────┐
│ Vaccination Flow: Record → Track → Alert → Reminder    │
└─────────────────────────────────────────────────────────┘

STEP 1: RECORD VACCINATION
  PetDetailPage → "Tambah Vaksinasi"
  ↓
  FormVaccination:
    - vaccineName: "Rabies"
    - vaccineType: "Core"
    - dateAdministered: "2025-10-15"
    - expiryDate: (optional, auto-calc +1 year if empty)
  ↓
  POST /api/pets/:id/vaccinations { ... }
  ↓
  Backend:
    - If expiryDate empty → calculate +1 year from dateAdministered
    - Save Vaccination record
    - Create/update VaccineRecord (tracking next due)

STEP 2: CALCULATE VACCINATION STATUS (on pet view)
  GET /api/pets/:id
  ↓
  Backend calculates vaccinationStatus:
    - all Vaccinations for pet
    - find mandatory vaccines (Rabies)
    - compare expiryDate to today
    ↓
    🟢 GREEN: expiryDate > today + 30 days (up-to-date)
    🟡 YELLOW: expiryDate between today + 7 to +30 days (expiring soon)
    🔴 RED: expiryDate <= today (expired)
    ⚪ GRAY: no vaccination records (unknown)
  ↓
  Response: { vaccinationStatus: "expired"|"expiring"|"up-to-date"|"unknown" }
  ↓
  UI: Display badge on pet card, detail page, and appointment form

STEP 3: BLOCK BOOKING IF VACCINE EXPIRED (optional)
  During appointment creation:
  - GET /api/pets/:id → vaccinationStatus
  - If status === "expired" AND pet.rabiesExpired:
    → Show warning "Vaksinasi Rabies expired. Lanjutkan?"
    → Staff can override with note

STEP 4: DAILY/WEEKLY ALERT CHECK (background)
  System polls vaccinations expiring in next 30 days
  ↓
  GET /api/vaccinations/alerts?days=30
  ↓
  Response: [
    {
      pet: { id, name },
      owner: { id, name, phone },
      vaccination: { vaccineName, expiryDate },
      daysUntilExpiry: 7
    },
    ...
  ]
  ↓
  Dashboard: Show "Vaksinasi akan expired" widget
  ↓
  Dedicated page: /vaccinations/alerts
    - Group by urgency:
      - "Sudah Expired" (🔴 red)
      - "Expired dalam 7 hari" (🟠 orange)
      - "Expired dalam 30 hari" (🟡 yellow)

STEP 5: SEND WHATSAPP REMINDER
  Staff clicks [Kirim Reminder] button
  ↓
  GET /api/vaccinations/alerts/whatsapp/:petId
  ↓
  Response: {
    url: "https://wa.me/6281234567890?text=Halo%20...",
    message: "Halo [Owner], vaksinasi [Vaccine] untuk [Pet] akan expired pada [Date]. Silakan jadwalkan booster. Terima kasih - [ShopName]"
  }
  ↓
  UI: Opens WhatsApp link in new window
  ↓
  Staff sends/reviews message manually (MVP = no auto-sending)
```

---

## 6. Authentication & Security

### 6.1 Login Flow

```typescript
// 1. Client submits credentials
POST /api/auth/login
{
  email: "staff@petshop.id",
  password: "securePassword123"
}

// 2. Server (nuxt-auth-utils):
- Hash & verify password against user.passwordHash (bcrypt)
- If mismatch → return 401 + increment failed attempt counter
- After 5 failed attempts in 15 min → lock account for 30 min
- If success:
  - Create sealed session cookie (h3 cookies)
  - Session includes: userId, email, role, loginAt
  - Expires in 7 days (configurable)
  - Set response headers: Set-Cookie + secure, httpOnly, sameSite=Lax

// 3. Client receives:
{
  user: {
    id: 1,
    name: "Ani Groomer",
    email: "ani@petshop.id",
    role: "Staff"
  }
}

// 4. Session persisted in:
- Browser sealed cookie (httpOnly)
- Accessible via nuxt-auth-utils composable: const { data: session } = await useAuth()
- Auto-refreshed on $fetch calls (middleware checks cookie)
```

### 6.2 Authorization & Role-Based Access

**Roles:**
- `Admin`: Full access (settings, user management, reports)
- `Staff`: CRUD owners/pets/appointments/products/transactions, NO settings/reports

**Implementation:**

```typescript
// server/middleware/auth.ts
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  // Automatically protects any route under server/api/ with auth
})

// server/middleware/role.ts (custom for sensitive routes)
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  
  if (event.node.req.url?.includes('/api/reports') || 
      event.node.req.url?.includes('/api/settings') ||
      event.node.req.url?.includes('/api/users')) {
    if (user.role !== 'Admin') {
      throw createError({ statusCode: 403, message: 'Forbidden' })
    }
  }
})

// Frontend middleware: nuxt/composables/useAuth.ts
export const useRequireAuth = (requiredRole?: string) => {
  const { data: session, status } = useAuth()
  
  watch(() => status.value, (newStatus) => {
    if (newStatus === 'unauthenticated') {
      navigateTo('/login')
    }
    if (requiredRole && session.value?.user?.role !== requiredRole) {
      navigateTo('/')
    }
  }, { immediate: true })
  
  return session
}
```

### 6.3 Session Management

- **Session storage**: Sealed cookie (encrypted by nuxt-auth-utils)
- **Validity period**: 7 days from login
- **Invalidation triggers**:
  - User password changed → all sessions invalidated
  - User deactivated → session invalidated
  - Explicit logout → cookie cleared
- **Reauthentication**: None; user remains logged in for 7 days unless logout

### 6.4 Input Validation & XSS Prevention

```typescript
// All inputs validated server-side with Zod
import { z } from 'zod'

const createOwnerSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().regex(/^(\+62|08)\d{8,13}$/, 'Invalid phone format'),
  email: z.string().email().optional(),
  address: z.string().max(500).optional(),
})

// server/api/owners/index.post.ts
export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, createOwnerSchema.parse)
  // body is now type-safe and validated
  // Vue auto-escapes all template interpolations (no XSS)
})
```

### 6.5 SQL Injection Prevention

- **Drizzle ORM** generates parameterized queries automatically
- No raw SQL; all queries use ORM builders

```typescript
// Safe (parameterized):
const owner = await db.select().from(owners).where(eq(owners.id, ownerId))

// Unsafe (avoided):
// db.execute(`SELECT * FROM owners WHERE id = ${ownerId}`) ← DON'T DO THIS
```

### 6.6 CSRF Protection

- **SameSite cookies**: Set to `Lax` by default (nuxt-auth-utils)
- **Origin validation** on sensitive POST/PUT/PATCH/DELETE endpoints
- Nuxt automatically handles CSRF for form submissions

### 6.7 File Upload Security

```typescript
// server/utils/file-upload.ts
export const validateFileUpload = async (event: H3Event, maxSizeMB = 5) => {
  const files = await readMultipartFormData(event)
  
  for (const file of files) {
    const buffer = Buffer.from(file.data)
    
    // 1. Validate file size
    if (buffer.length > maxSizeMB * 1024 * 1024) {
      throw createError({ statusCode: 400, message: 'File too large' })
    }
    
    // 2. Validate MIME type (image only)
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedMimes.includes(file.type || '')) {
      throw createError({ statusCode: 400, message: 'Invalid file type' })
    }
    
    // 3. Sanitize filename
    const filename = sanitizeFilename(file.filename)
    
    // 4. Store with random prefix to prevent traversal
    const filepath = `/uploads/${Date.now()}_${filename}`
    
    return { filepath, buffer }
  }
}
```

### 6.8 Rate Limiting

```typescript
// server/middleware/rate-limit.ts
import { createMiddleware } from 'h3'

const loginAttempts = new Map<string, { count: number, resetAt: number }>()

export default defineEventHandler(async (event) => {
  if (event.node.req.url?.includes('/api/auth/login')) {
    const ip = getHeader(event, 'x-forwarded-for') || 'unknown'
    const now = Date.now()
    
    const record = loginAttempts.get(ip)
    if (record && record.count >= 5 && now < record.resetAt) {
      throw createError({
        statusCode: 429,
        message: 'Too many login attempts. Try again later.'
      })
    }
    
    // Increment on response (in middleware or after auth check)
  }
})
```

---

## 7. Scalability & Performance

### 7.1 Database Limitations & Optimization

**SQLite Limitations:**
- Single-file database (no built-in sharding)
- Max ~1000 concurrent connections (but single-tenant MVP only needs ~5-10)
- Max DB file size: ~281 TB (practical limit: 10-100 GB for single file)
- Suitable for: ≤ 10.000 owners, ≤ 30.000 pets, ≤ 100.000 transactions

**Optimization Strategy:**

```typescript
// 1. Indexes on frequently queried fields
// (Already defined in schema above)
//   - owners: nameIdx, phoneIdx, deletedAtIdx
//   - pets: ownerIdIdx, speciesIdx, nameIdx
//   - appointments: ownerIdIdx, petIdIdx, groomerIdIdx, scheduledAtIdx, statusIdx
//   - products: skuIdx, nameIdx, expiryDateIdx, stockQuantityIdx
//   - transactions: ownerIdIdx, appointmentIdIdx, createdAtIdx, paymentStatusIdx
//   - vaccinations: petIdIdx, expiryDateIdx

// 2. Pagination (default limit: 20-25 per page)
// server/api/owners/index.get.ts
const limit = Math.min(parseInt(query.limit || '20'), 100)
const page = Math.max(parseInt(query.page || '1'), 1)
const offset = (page - 1) * limit

const [data, total] = await Promise.all([
  db.select().from(owners).limit(limit).offset(offset),
  db.select({ count: count() }).from(owners)
])

return {
  data,
  meta: {
    page,
    limit,
    total: total[0].count,
    totalPages: Math.ceil(total[0].count / limit)
  }
}

// 3. Query optimization: Avoid N+1 queries
// ❌ WRONG: Loop and query per item
// for (const pet of pets) {
//   pet.vaccinations = await db.select().from(vaccinations).where(...)
// }

// ✅ CORRECT: Join or batch fetch
const pets = await db.select().from(pets)
const vaccinations = await db.select().from(vaccinations)
  .where(inArray(vaccinations.petId, pets.map(p => p.id)))
const petVaccMap = groupBy(vaccinations, 'petId')
pets.forEach(p => p.vaccinations = petVaccMap[p.id] || [])

// 4. Caching for reports (computed once per day)
// server/utils/cache.ts
const reportCache = new Map<string, { data: any, expiresAt: number }>()

export const getCachedReport = (key: string, fetcher: () => Promise<any>) => {
  const now = Date.now()
  const cached = reportCache.get(key)
  
  if (cached && cached.expiresAt > now) {
    return cached.data
  }
  
  const data = await fetcher()
  reportCache.set(key, { data, expiresAt: now + 3600000 }) // 1 hour TTL
  return data
}
```

### 7.2 API Response Time Targets

| Operation | Target | Achievable |
|---|---|---|
| Single-entity read (GET /api/pets/:id) | ≤ 200ms | ✅ (indexed lookup + small join) |
| List with pagination (GET /api/owners?page=1) | ≤ 200ms | ✅ (indexed, limit 20) |
| List with join (GET /api/appointments?dateFrom=...&dateTo=...) | ≤ 500ms | ✅ (date index, join to pet/owner) |
| Report generation (GET /api/reports/revenue?period=monthly) | ≤ 1s | ✅ (cached result, aggregate query) |
| CSV export (GET /api/export/transactions?format=csv) | ≤ 5s | ✅ (for ≤ 10.000 records) |

### 7.3 Frontend Performance

```typescript
// 1. Code splitting: routes loaded on-demand
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true, // Server-side rendering for faster TTI
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/login', '/dashboard']
    }
  }
})

// 2. Image optimization via Nuxt Image
<NuxtImg 
  src="/pet-photos/buddy.jpg" 
  width="200" 
  height="200" 
  format="webp"
  placeholder
/>

// 3. Lazy-load composables
const { data: appointments } = await useFetch('/api/appointments/today', {
  lazy: true
})

// 4. Debounce search input
const search = ref('')
const debouncedSearch = useDebounceFn((val: string) => {
  fetchOwners(val)
}, 300)

watch(search, debouncedSearch)
```

### 7.4 Deployment & Infrastructure

- **Runtime**: Node.js 18+ (better-sqlite3 requires native binding)
- **Database**: SQLite file stored on server filesystem
- **Hosting options**:
  - VPS (DigitalOcean, Linode, Vultr)
  - Self-hosted server (AWS EC2, Hetzner)
  - ❌ NOT serverless/edge (SQLite needs persistent filesystem)
  
- **Backup strategy**: Daily SQLite dumps to S3-compatible storage
- **Scaling**: For multi-tenant future, migrate to PostgreSQL (Drizzle supports it)

---

## 8. File & Folder Structure

```
pet-grooming/
├── app/
│   ├── pages/
│   │   ├── login.vue
│   │   ├── index.vue (dashboard)
│   │   ├── owners/
│   │   │   ├── index.vue
│   │   │   ├── new.vue
│   │   │   └── [id]/
│   │   │       ├── index.vue
│   │   │       └── edit.vue
│   │   ├── pets/
│   │   │   └── [id].vue (detail + edit)
│   │   ├── calendar.vue
│   │   ├── appointments/
│   │   ├── products/
│   │   ├── pos.vue
│   │   ├── transactions/
│   │   ├── vaccinations/
│   │   │   └── alerts.vue
│   │   ├── reports/
│   │   └── settings/
│   ├── components/
│   │   ├── forms/ (FormOwner, FormPet, etc.)
│   │   ├── tables/ (TableOwners, TableAppointments, etc.)
│   │   ├── cards/ (PetCard, StatsCard, etc.)
│   │   └── layouts/
│   │       └── AppLayout.vue (sidebar, header)
│   ├── composables/
│   │   ├── useAuth.ts
│   │   ├── useOwners.ts
│   │   ├── usePets.ts
│   │   └── ... (see 4.3)
│   ├── utils/
│   │   ├── validators.ts (Zod schemas)
│   │   ├── formatters.ts (Rupiah, date, age)
│   │   └── ...
│   └── app.vue
├── server/
│   ├── api/
│   │   ├── auth/
│   │   ├── owners/
│   │   ├── pets/
│   │   ├── ... (all endpoints)
│   ├── middleware/
│   │   ├── auth.ts
│   │   └── role.ts
│   ├── utils/
│   │   ├── db.ts
│   │   ├── validation.ts
│   │   ├── file-upload.ts
│   │   └── cache.ts
│   └── db/
│       ├── schema.ts
│       ├── enums.ts
│       └── index.ts (connection export)
├── docs/
│   ├── PRD.md (this document)
│   ├── ARCHITECTURE.md (this document)
│   └── API.md (auto-generated from openapi.yml)
├── public/
│   ├── uploads/ (pet photos, documents)
│   └── favicon.ico
├── nuxt.config.ts
├── package.json
├── tsconfig.json
├── .env.example
├── .env.local (ignored, local secrets)
├── .gitignore
└── README.md
```

---

## 9. Development Workflow & CI/CD

### 9.1 Local Setup

```bash
# Clone repo
git clone <repo>
cd pet-grooming

# Install dependencies
npm install

# Copy .env.example → .env.local and set values
cp .env.example .env.local

# Create SQLite database
npm run db:migrate

# Seed initial data (breeds, services, users)
npm run db:seed

# Start dev server
npm run dev
# http://localhost:3000
```

### 9.2 Build & Deploy

```bash
# Build for production
npm run build

# Test production build locally
npm run preview

# Deploy to VPS (example: Railway, Vercel)
# Vercel CLI: vercel deploy
# Or manually: scp dist/ root@server:/app && ssh root@server "cd /app && npm install && npm run start"
```

---

## 10. Key Design Decisions

| Decision | Reasoning |
|---|---|
| **Drizzle ORM** | Type-safe, minimal runtime, lightweight, easy to migrate from SQLite to PostgreSQL later |
| **SQLite** | Single-tenant MVP, zero DevOps overhead, file-based backup, sufficient for target load |
| **Nuxt 4 + SSR** | Fast TTI, SEO-friendly, unified frontend/backend with Nitro |
| **Sealed cookies** (nuxt-auth-utils) | Simple session management, no need for Redis/session store |
| **Soft deletes** | Maintain audit trail, allow undo, comply with data retention rules |
| **Role-based access** (Admin/Staff only) | Simple enough for MVP; can add granular permissions in phase 2 |
| **WhatsApp links** (wa.me) | No API integration needed, manual sending in MVP phase 1 |
| **Pagination (default 20-25)** | Balance between UX and query performance |
| **Real-time updates** | Polling via `useFetch(..., { watch: true })` instead of WebSocket (simpler, sufficient) |

---

## 11. Future Enhancements (Phase 2+)

- ✅ Online booking portal (customer-facing)
- ✅ WhatsApp Business API integration (auto-sending reminders)
- ✅ Multi-tenant / multi-cabang support
- ✅ Loyalty/membership program
- ✅ Commission & payroll tracking
- ✅ Barcode scanning (hardware scanner support)
- ✅ Mobile native app (PWA or React Native)
- ✅ Payment gateway integration (Midtrans, Xendit)
- ✅ Email notifications (in addition to WhatsApp)
- ✅ Inventory reordering automation

---

**End of ARCHITECTURE.md**
