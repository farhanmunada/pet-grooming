import { eq } from 'drizzle-orm'
import { z } from 'zod'

const updateOwnerSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().min(8).optional(),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().optional(),
  communicationPref: z.enum(['Email', 'SMS', 'WhatsApp']).optional(),
  notes: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, message: 'Invalid ID' })

  const body = await readValidatedBody(event, updateOwnerSchema.parse)
  const db = useDb()

  const updated = db.update(schema.owners)
    .set({
      ...body,
      updatedAt: new Date().toISOString()
    })
    .where(eq(schema.owners.id, id))
    .returning()
    .get()

  return { success: true, owner: updated }
})
