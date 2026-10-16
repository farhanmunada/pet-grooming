import { sqliteTable, integer, text, real, uniqueIndex, index } from 'drizzle-orm/sqlite-core'
import { sql, relations } from 'drizzle-orm'

// ============================================================
// AUTH & USERS
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
    updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`)
  },
  table => [
    uniqueIndex('idx_users_email').on(table.email)
  ]
)

// ============================================================
// OWNER & PETS
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
    deletedAt: text('deleted_at')
  },
  table => [
    uniqueIndex('idx_owners_phone').on(table.phone),
    index('idx_owners_name').on(table.name),
    index('idx_owners_deleted_at').on(table.deletedAt)
  ]
)

export const breeds = sqliteTable(
  'breeds',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    species: text('species', { enum: ['Dog', 'Cat', 'Rabbit', 'Other'] }).notNull(),
    description: text('description')
  }
)

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
    deletedAt: text('deleted_at')
  },
  table => [
    index('idx_pets_owner_id').on(table.ownerId),
    index('idx_pets_species').on(table.species),
    index('idx_pets_name').on(table.name)
  ]
)

// ============================================================
// GROOMER & SERVICES
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
    updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`)
  }
)

export const services = sqliteTable(
  'services',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    description: text('description'),
    category: text('category').notNull(), // 'Grooming', 'Add-on', etc.
    baseDurationMin: integer('base_duration_min').notNull().default(60),
    basePrice: integer('base_price').notNull(), // in Rupiah
    isAddOn: integer('is_add_on', { mode: 'boolean' }).notNull().default(false),
    isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
    createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`)
  }
)

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
    durationMin: integer('duration_min')
  },
  table => [
    index('idx_service_pricings_service_id').on(table.serviceId),
    uniqueIndex('idx_service_pricings_unique').on(table.serviceId, table.sizeCategory, table.breedId)
  ]
)

// ============================================================
// APPOINTMENT & GROOMING NOTES
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
    parentAppointmentId: integer('parent_appointment_id'),
    createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`)
  },
  table => [
    index('idx_appointments_owner_id').on(table.ownerId),
    index('idx_appointments_petId').on(table.petId),
    index('idx_appointments_groomer_id').on(table.groomerId),
    index('idx_appointments_scheduled_at').on(table.scheduledAt),
    index('idx_appointments_status').on(table.status)
  ]
)

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
    unitPrice: integer('unit_price').notNull()
  }
)

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
    updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`)
  },
  table => [
    uniqueIndex('idx_grooming_notes_appointment_id').on(table.appointmentId),
    index('idx_grooming_notes_pet_id').on(table.petId)
  ]
)

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
    updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`)
  },
  table => [
    index('idx_vaccinations_pet_id').on(table.petId),
    index('idx_vaccinations_expiry_date').on(table.expiryDate)
  ]
)

// ============================================================
// PRODUCT & INVENTORY
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
    updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`)
  },
  table => [
    uniqueIndex('idx_products_sku').on(table.sku),
    index('idx_products_name').on(table.name),
    index('idx_products_expiry_date').on(table.expiryDate),
    index('idx_products_stock_quantity').on(table.stockQuantity)
  ]
)

export const inventoryAdjustments = sqliteTable(
  'inventory_adjustments',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    productId: integer('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    adjustment: integer('adjustment').notNull(),
    reason: text('reason', {
      enum: ['Damaged', 'Lost', 'Return', 'StockOpname', 'InternalUse']
    }).notNull(),
    notes: text('notes'),
    adjustedBy: integer('adjusted_by').references(() => users.id),
    createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`)
  },
  table => [
    index('idx_inventory_adjustments_product_id').on(table.productId)
  ]
)

// ============================================================
// TRANSACTIONS & PAYMENTS
// ============================================================

export const transactions = sqliteTable(
  'transactions',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    invoiceNumber: text('invoice_number').notNull().unique(),
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
    updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`)
  },
  table => [
    uniqueIndex('idx_transactions_invoice').on(table.invoiceNumber),
    index('idx_transactions_owner_id').on(table.ownerId),
    index('idx_transactions_appointment_id').on(table.appointmentId),
    index('idx_transactions_created_at').on(table.createdAt),
    index('idx_transactions_payment_status').on(table.paymentStatus)
  ]
)

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
    name: text('name').notNull(),
    quantity: integer('quantity').notNull().default(1),
    unitPrice: integer('unit_price').notNull(),
    discount: integer('discount').default(0),
    total: integer('total').notNull()
  },
  table => [
    index('idx_transaction_items_transaction_id').on(table.transactionId)
  ]
)

export const settings = sqliteTable(
  'settings',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    key: text('key').notNull().unique(),
    value: text('value'),
    updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`)
  }
)

// ============================================================
// DRIZZLE RELATIONS
// ============================================================

export const ownersRelations = relations(owners, ({ many }) => ({
  pets: many(pets),
  appointments: many(appointments),
  transactions: many(transactions)
}))

export const petsRelations = relations(pets, ({ one, many }) => ({
  owner: one(owners, {
    fields: [pets.ownerId],
    references: [owners.id]
  }),
  breed: one(breeds, {
    fields: [pets.breedId],
    references: [breeds.id]
  }),
  appointments: many(appointments),
  vaccinations: many(vaccinations),
  groomingNotes: many(groomingNotes)
}))

export const appointmentsRelations = relations(appointments, ({ one, many }) => ({
  owner: one(owners, {
    fields: [appointments.ownerId],
    references: [owners.id]
  }),
  pet: one(pets, {
    fields: [appointments.petId],
    references: [pets.id]
  }),
  groomer: one(groomers, {
    fields: [appointments.groomerId],
    references: [groomers.id]
  }),
  services: many(appointmentServices),
  groomingNote: one(groomingNotes)
}))

export const appointmentServicesRelations = relations(appointmentServices, ({ one }) => ({
  appointment: one(appointments, {
    fields: [appointmentServices.appointmentId],
    references: [appointments.id]
  }),
  service: one(services, {
    fields: [appointmentServices.serviceId],
    references: [services.id]
  })
}))

export const groomingNotesRelations = relations(groomingNotes, ({ one }) => ({
  appointment: one(appointments, {
    fields: [groomingNotes.appointmentId],
    references: [appointments.id]
  }),
  pet: one(pets, {
    fields: [groomingNotes.petId],
    references: [pets.id]
  })
}))

export const vaccinationsRelations = relations(vaccinations, ({ one }) => ({
  pet: one(pets, {
    fields: [vaccinations.petId],
    references: [pets.id]
  })
}))

export const transactionsRelations = relations(transactions, ({ one, many }) => ({
  owner: one(owners, {
    fields: [transactions.ownerId],
    references: [owners.id]
  }),
  appointment: one(appointments, {
    fields: [transactions.appointmentId],
    references: [appointments.id]
  }),
  items: many(transactionItems)
}))

export const transactionItemsRelations = relations(transactionItems, ({ one }) => ({
  transaction: one(transactions, {
    fields: [transactionItems.transactionId],
    references: [transactions.id]
  }),
  service: one(services, {
    fields: [transactionItems.serviceId],
    references: [services.id]
  }),
  product: one(products, {
    fields: [transactionItems.productId],
    references: [products.id]
  })
}))
