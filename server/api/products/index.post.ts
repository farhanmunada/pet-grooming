import { z } from 'zod'

const createProductSchema = z.object({
  name: z.string().min(2),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  category: z.string().min(1),
  brand: z.string().optional(),
  description: z.string().optional(),
  unitPrice: z.number().min(0),
  costPrice: z.number().optional(),
  stockQuantity: z.number().default(0),
  reorderLevel: z.number().default(5),
  speciesTarget: z.enum(['Dog', 'Cat', 'All']).default('All'),
  isRestrictedMedicine: z.boolean().default(false)
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, createProductSchema.parse)
  const db = useDb()

  const product = db.insert(schema.products).values({
    name: body.name,
    sku: body.sku || `SKU-${Date.now().toString().slice(-6)}`,
    barcode: body.barcode || null,
    category: body.category,
    brand: body.brand || null,
    description: body.description || null,
    unitPrice: body.unitPrice,
    costPrice: body.costPrice || null,
    stockQuantity: body.stockQuantity,
    reorderLevel: body.reorderLevel,
    speciesTarget: body.speciesTarget,
    isRestrictedMedicine: body.isRestrictedMedicine,
    isActive: true
  }).returning().get()

  return { success: true, product }
})
