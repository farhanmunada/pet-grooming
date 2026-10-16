import { z } from 'zod'

const createPetSchema = z.object({
  ownerId: z.number(),
  name: z.string().min(1),
  species: z.enum(['Dog', 'Cat', 'Rabbit', 'Other']),
  breedNotes: z.string().optional(),
  gender: z.enum(['Male', 'Female']).optional(),
  dateOfBirth: z.string().optional(),
  weight: z.number().optional(),
  color: z.string().optional(),
  temperament: z.string().optional(),
  allergies: z.string().optional(),
  medicalNotes: z.string().optional(),
  isNeutered: z.boolean().default(false)
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, createPetSchema.parse)
  const db = useDb()

  const newPet = db.insert(schema.pets).values({
    ownerId: body.ownerId,
    name: body.name,
    species: body.species,
    breedNotes: body.breedNotes || null,
    gender: body.gender || null,
    dateOfBirth: body.dateOfBirth || null,
    weight: body.weight || null,
    color: body.color || null,
    temperament: body.temperament || null,
    allergies: body.allergies || null,
    medicalNotes: body.medicalNotes || null,
    isNeutered: body.isNeutered
  }).returning().get()

  return { success: true, pet: newPet }
})
