import { eq } from 'drizzle-orm'
import { z } from 'zod'

const updateProductSchema = z.object({
  name: z.string().min(2).optional(),
  barcode: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  description: z.string().optional(),
  unitPrice: z.number().min(0).optional(),
  costPrice: z.number().optional(),
  stockQuantity: z.number().optional(),
  reorderLevel: z.number().optional(),
  speciesTarget: z.enum(['Dog', 'Cat', 'All']).optional(),
  isRestrictedMedicine: z.boolean().optional(),
  isActive: z.boolean().optional()
})

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, message: 'Invalid ID' })

  const body = await readValidatedBody(event, updateProductSchema.parse)
  const db = useDb()

  const updated = db.update(schema.products)
    .set({
      ...body,
      updatedAt: new Date().toISOString()
    })
    .where(eq(schema.products.id, id))
    .returning()
    .get()

  return { success: true, product: updated }
})
