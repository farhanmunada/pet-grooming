import { eq } from 'drizzle-orm'
import { z } from 'zod'

const updatePetSchema = z.object({
  name: z.string().min(1).optional(),
  species: z.enum(['Dog', 'Cat', 'Rabbit', 'Other']).optional(),
  breedNotes: z.string().optional(),
  gender: z.enum(['Male', 'Female']).optional(),
  dateOfBirth: z.string().optional(),
  weight: z.number().optional(),
  color: z.string().optional(),
  temperament: z.string().optional(),
  allergies: z.string().optional(),
  medicalNotes: z.string().optional(),
  isNeutered: z.boolean().optional()
})

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, message: 'Invalid ID' })

  const body = await readValidatedBody(event, updatePetSchema.parse)
  const db = useDb()

  const updated = db.update(schema.pets)
    .set({
      ...body,
      updatedAt: new Date().toISOString()
    })
    .where(eq(schema.pets.id, id))
    .returning()
    .get()

  return { success: true, pet: updated }
})
