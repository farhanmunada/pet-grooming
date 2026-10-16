import { z } from 'zod'

const createOwnerSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(8),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().optional(),
  communicationPref: z.enum(['Email', 'SMS', 'WhatsApp']).default('WhatsApp'),
  notes: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, createOwnerSchema.parse)
  const db = useDb()

  const newOwner = db.insert(schema.owners).values({
    name: body.name,
    phone: body.phone,
    email: body.email || null,
    address: body.address || null,
    communicationPref: body.communicationPref,
    notes: body.notes || null
  }).returning().get()

  return {
    success: true,
    owner: newOwner
  }
})
