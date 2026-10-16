import { z } from 'zod'
import { eq, sql } from 'drizzle-orm'

const createTransactionSchema = z.object({
  ownerId: z.number().optional().nullable(),
  appointmentId: z.number().optional().nullable(),
  type: z.enum(['Service', 'Product', 'Mixed']),
  items: z.array(z.object({
    itemType: z.enum(['Service', 'Product']),
    serviceId: z.number().optional().nullable(),
    productId: z.number().optional().nullable(),
    name: z.string(),
    quantity: z.number().min(1),
    unitPrice: z.number().min(0),
    discount: z.number().default(0),
    total: z.number().min(0)
  })).min(1),
  subtotal: z.number().min(0),
  discount: z.number().default(0),
  total: z.number().min(0),
  paymentMethod: z.enum(['Cash', 'Transfer', 'EWallet']),
  amountPaid: z.number().min(0),
  notes: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, createTransactionSchema.parse)
  const db = useDb()

  const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const randomSuffix = Math.floor(1000 + Math.random() * 9000)
  const invoiceNumber = `INV-${todayStr}-${randomSuffix}`

  const transaction = db.insert(schema.transactions).values({
    invoiceNumber,
    ownerId: body.ownerId || null,
    appointmentId: body.appointmentId || null,
    type: body.type,
    subtotal: body.subtotal,
    discount: body.discount,
    total: body.total,
    paymentMethod: body.paymentMethod,
    paymentStatus: 'Paid',
    amountPaid: body.amountPaid,
    notes: body.notes || null
  }).returning().get()

  // Insert items & deduct stock if product
  for (const item of body.items) {
    db.insert(schema.transactionItems).values({
      transactionId: transaction.id,
      itemType: item.itemType,
      serviceId: item.serviceId || null,
      productId: item.productId || null,
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      discount: item.discount,
      total: item.total
    }).run()

    if (item.itemType === 'Product' && item.productId) {
      // Deduct stock
      db.update(schema.products)
        .set({
          stockQuantity: sql`stock_quantity - ${item.quantity}`,
          updatedAt: new Date().toISOString()
        })
        .where(eq(schema.products.id, item.productId))
        .run()
    }
  }

  // If linked to an appointment, mark appointment completed if not already
  if (body.appointmentId) {
    db.update(schema.appointments)
      .set({
        status: 'Completed',
        updatedAt: new Date().toISOString()
      })
      .where(eq(schema.appointments.id, body.appointmentId))
      .run()
  }

  return { success: true, transaction }
})
