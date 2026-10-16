import { z } from 'zod'

const createServiceSchema = z.object({
  name: z.string().min(2),
  category: z.string().default('Grooming'),
  basePrice: z.number().min(0),
  baseDurationMin: z.number().default(60),
  description: z.string().optional(),
  isAddOn: z.boolean().default(false)
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, createServiceSchema.parse)
  const db = useDb()

  const service = db.insert(schema.services).values({
    name: body.name,
    category: body.category,
    basePrice: body.basePrice,
    baseDurationMin: body.baseDurationMin,
    description: body.description || null,
    isAddOn: body.isAddOn
  }).returning().get()

  return { success: true, service }
})
