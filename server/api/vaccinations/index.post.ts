import { z } from 'zod'

const createVaccinationSchema = z.object({
  petId: z.number(),
  vaccineName: z.string().min(1),
  vaccineType: z.enum(['Core', 'NonCore']),
  dateAdministered: z.string(), // YYYY-MM-DD
  expiryDate: z.string(), // YYYY-MM-DD
  administeredBy: z.string().optional(),
  batchNumber: z.string().optional(),
  notes: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, createVaccinationSchema.parse)
  const db = useDb()

  const vaccination = db.insert(schema.vaccinations).values({
    petId: body.petId,
    vaccineName: body.vaccineName,
    vaccineType: body.vaccineType,
    dateAdministered: body.dateAdministered,
    expiryDate: body.expiryDate,
    administeredBy: body.administeredBy || null,
    batchNumber: body.batchNumber || null,
    notes: body.notes || null
  }).returning().get()

  return { success: true, vaccination }
})
