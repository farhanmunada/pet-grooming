import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema.ts'

const sqlite = new Database('sqlite.db')
const db = drizzle(sqlite, { schema })

async function seed() {
  console.log('Seeding PetKasih database...')

  // 1. Seed Users (Admin: admin@petkasih.com / admin123)
  // Simple SHA-256 for password hash or plaintext demo hash
  // In Nuxt, we can use crypto.subtle or simple crypto for password hashing
  const existingUser = db.select().from(schema.users).all()
  if (existingUser.length === 0) {
    db.insert(schema.users).values({
      name: 'Owner Admin',
      email: 'admin@petkasih.com',
      passwordHash: 'admin123', // In demo/local
      role: 'Admin',
      isActive: true
    }).run()
    console.log('Admin user seeded')
  }

  // 2. Seed Breeds
  const existingBreeds = db.select().from(schema.breeds).all()
  if (existingBreeds.length === 0) {
    db.insert(schema.breeds).values([
      { name: 'Persian', species: 'Cat', description: 'Long coat Persian cat' },
      { name: 'Domestic Short Hair', species: 'Cat', description: 'Kucing domestik / kampung' },
      { name: 'British Shorthair', species: 'Cat', description: 'Dense coat medium cat' },
      { name: 'Poodle (Toy/Mini)', species: 'Dog', description: 'Curly hair dog' },
      { name: 'Golden Retriever', species: 'Dog', description: 'Large long coat dog' },
      { name: 'Shih Tzu', species: 'Dog', description: 'Small long coat companion dog' },
      { name: 'Pomeranian', species: 'Dog', description: 'Small double coated dog' },
      { name: 'Holland Lop', species: 'Rabbit', description: 'Lop eared rabbit' }
    ]).run()
    console.log('Breeds seeded')
  }

  // 3. Seed Groomers
  const existingGroomers = db.select().from(schema.groomers).all()
  if (existingGroomers.length === 0) {
    db.insert(schema.groomers).values([
      { name: 'Rian Pratama', phone: '081234567891', specialties: 'Dog Styling, Deshedding', commissionRate: 0.2, isActive: true },
      { name: 'Dewi Lestari', phone: '081234567892', specialties: 'Cat Grooming, Sensitive Skin', commissionRate: 0.2, isActive: true }
    ]).run()
    console.log('Groomers seeded')
  }

  // 4. Seed Services
  const existingServices = db.select().from(schema.services).all()
  if (existingServices.length === 0) {
    db.insert(schema.services).values([
      { name: 'Mandi Sehat (Basic Bath)', category: 'Grooming', basePrice: 65000, baseDurationMin: 45, isAddOn: false, isActive: true, description: 'Mandi shampo premium, blow dry, bersihkan telinga, potong kuku' },
      { name: 'Mandi Obat (Kutu/Jamur)', category: 'Grooming', basePrice: 90000, baseDurationMin: 60, isAddOn: false, isActive: true, description: 'Treatment shampo anti-jamur / anti-kutu medicated' },
      { name: 'Full Grooming (Mandi + Styling)', category: 'Grooming', basePrice: 150000, baseDurationMin: 90, isAddOn: false, isActive: true, description: 'Mandi lengkap + trimming/cukur model rapi' },
      { name: 'Potong Kuku Saja', category: 'Add-on', basePrice: 25000, baseDurationMin: 15, isAddOn: true, isActive: true, description: 'Potong kuku & kikir halus' },
      { name: 'Sikat Gigi & Bersih Karang Ringan', category: 'Add-on', basePrice: 35000, baseDurationMin: 20, isAddOn: true, isActive: true, description: 'Oral care spray & sikat gigi rasa daging' },
      { name: 'Spa & Creambath Bulu', category: 'Add-on', basePrice: 50000, baseDurationMin: 30, isAddOn: true, isActive: true, description: 'Conditioner detangling & aroma therapy' }
    ]).run()
    console.log('Services seeded')
  }

  // 5. Seed Products
  const existingProducts = db.select().from(schema.products).all()
  if (existingProducts.length === 0) {
    db.insert(schema.products).values([
      { name: 'Royal Canin Hair & Skin 2kg', sku: 'RC-HS-2KG', barcode: '8991001001', category: 'Makanan Kucing', brand: 'Royal Canin', unitPrice: 310000, costPrice: 270000, stockQuantity: 15, reorderLevel: 5, speciesTarget: 'Cat', isActive: true },
      { name: 'Pro Plan Adult Dog Chicken 2.5kg', sku: 'PP-AD-2.5', barcode: '8991001002', category: 'Makanan Anjing', brand: 'Pro Plan', unitPrice: 285000, costPrice: 245000, stockQuantity: 8, reorderLevel: 4, speciesTarget: 'Dog', isActive: true },
      { name: 'Shampoo Bioline Medicated 250ml', sku: 'BIO-MED-250', barcode: '8991001003', category: 'Perawatan & Obat', brand: 'Bioline', unitPrice: 75000, costPrice: 55000, stockQuantity: 20, reorderLevel: 6, speciesTarget: 'All', isActive: true },
      { name: 'Bravecto Spot-On Kutu Kucing', sku: 'BRAV-CAT-SO', barcode: '8991001004', category: 'Obat Hewan', brand: 'Bravecto', unitPrice: 240000, costPrice: 205000, stockQuantity: 4, reorderLevel: 5, speciesTarget: 'Cat', isRestrictedMedicine: true, isActive: true },
      { name: 'Sisir Slicker Grooming Handle Kayu', sku: 'ACC-SLICK-01', barcode: '8991001005', category: 'Aksesoris & Grooming', brand: 'PetClean', unitPrice: 45000, costPrice: 28000, stockQuantity: 12, reorderLevel: 3, speciesTarget: 'All', isActive: true },
      { name: 'Ciao Churu Snack Kucing Tuna 4x14g', sku: 'CHURU-TN-4', barcode: '8991001006', category: 'Snack & Treat', brand: 'Inaba Ciao', unitPrice: 28000, costPrice: 21000, stockQuantity: 35, reorderLevel: 10, speciesTarget: 'Cat', isActive: true },
      { name: 'Pasir Kucing Bentonite Coffee 10L', sku: 'LIT-BENT-10L', barcode: '8991001007', category: 'Perlengkapan', brand: 'Markotops', unitPrice: 60000, costPrice: 47000, stockQuantity: 18, reorderLevel: 8, speciesTarget: 'Cat', isActive: true }
    ]).run()
    console.log('Products seeded')
  }

  // 6. Seed Sample Owners & Pets
  const existingOwners = db.select().from(schema.owners).all()
  if (existingOwners.length === 0) {
    const owner1 = db.insert(schema.owners).values({
      name: 'Anisa Rahmawati',
      phone: '081298765432',
      email: 'anisa.rahma@gmail.com',
      address: 'Jl. Melati No. 14, Jakarta Selatan',
      communicationPref: 'WhatsApp',
      loyaltyPoints: 120,
      notes: 'Pet ramah, suka grooming pagi'
    }).returning().get()

    const owner2 = db.insert(schema.owners).values({
      name: 'Hendra Wijaya',
      phone: '081387654321',
      email: 'hendra.w@yahoo.com',
      address: 'Komplek Permata Hijau B3/12',
      communicationPref: 'WhatsApp',
      loyaltyPoints: 50,
      notes: 'Anjing agak waspada sama suara hair dryer kencang'
    }).returning().get()

    if (owner1 && owner2) {
      const pet1 = db.insert(schema.pets).values({
        ownerId: owner1.id,
        name: 'Mochi',
        species: 'Cat',
        breedNotes: 'Persian White Longhair',
        gender: 'Female',
        dateOfBirth: '2023-04-10',
        weight: 3.8,
        color: 'Putih Bersih',
        temperament: 'Tenang, suka dielus dagunya',
        allergies: 'Tidak ada',
        medicalNotes: 'Kulit sensitif di area leher',
        isNeutered: true
      }).returning().get()

      const pet2 = db.insert(schema.pets).values({
        ownerId: owner2.id,
        name: 'Rocky',
        species: 'Dog',
        breedNotes: 'Golden Retriever',
        gender: 'Male',
        dateOfBirth: '2022-08-15',
        weight: 28.5,
        color: 'Golden Cream',
        temperament: 'Aktif, butuh groomer sabar saat blow dry',
        allergies: 'Alergi shampo parfum pekat',
        medicalNotes: 'Telinga rentan lembab, perlu dibersihkan tuntas',
        isNeutered: true
      }).returning().get()

      if (pet1 && pet2) {
        // Sample vaccinations
        db.insert(schema.vaccinations).values([
          {
            petId: pet1.id,
            vaccineName: 'Tricat (FVRCP)',
            vaccineType: 'Core',
            dateAdministered: '2025-11-10',
            expiryDate: '2026-11-10',
            administeredBy: 'drh. Fitri (Klinik Sahabat Satwa)',
            batchNumber: 'TC-2025-998',
            notes: 'Vaksin tahunan kucing'
          },
          {
            petId: pet1.id,
            vaccineName: 'Rabies Kucing',
            vaccineType: 'Core',
            dateAdministered: '2025-11-10',
            expiryDate: '2026-11-10',
            administeredBy: 'drh. Fitri',
            batchNumber: 'RB-CAT-112',
            notes: 'Wajib regulasi DKI/Depok'
          },
          {
            petId: pet2.id,
            vaccineName: 'DHPP / Parvo-Distemper',
            vaccineType: 'Core',
            dateAdministered: '2025-05-15',
            expiryDate: '2026-05-15',
            administeredBy: 'drh. Aditya',
            batchNumber: 'DHPP-5512',
            notes: 'Booster tahunan anjing'
          },
          {
            petId: pet2.id,
            vaccineName: 'Rabies Anjing',
            vaccineType: 'Core',
            dateAdministered: '2025-05-15',
            expiryDate: '2026-05-15',
            administeredBy: 'drh. Aditya',
            batchNumber: 'RB-DOG-784'
          }
        ]).run()

        // Sample appointments
        const todayStr = new Date().toISOString().split('T')[0]
        db.insert(schema.appointments).values([
          {
            ownerId: owner1.id,
            petId: pet1.id,
            groomerId: 2, // Dewi
            status: 'Confirmed',
            scheduledAt: `${todayStr}T10:00:00`,
            estimatedDurationMin: 60,
            totalPrice: 90000,
            notes: 'Mandi jamur rutin bulanan'
          },
          {
            ownerId: owner2.id,
            petId: pet2.id,
            groomerId: 1, // Rian
            status: 'InProgress',
            scheduledAt: `${todayStr}T13:30:00`,
            estimatedDurationMin: 90,
            totalPrice: 150000,
            notes: 'Full grooming rapihin bulu ekor dan telapak kaki'
          }
        ]).run()
      }
    }
    console.log('Owners, Pets, Vaccinations & Appointments seeded')
  }

  console.log('Seeding finished successfully!')
}

seed()
