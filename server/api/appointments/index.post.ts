import { z } from 'zod'

const createAppointmentSchema = z.object({
  ownerId: z.number(),
  petId: z.number(),
  groomerId: z.number(),
  scheduledAt: z.string(), // ISO string e.g. 2026-10-16T10:00:00
  estimatedDurationMin: z.number().default(60),
  totalPrice: z.number().min(0),
  notes: z.string().optional(),
  serviceIds: z.array(z.number()).min(1)
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, createAppointmentSchema.parse)
  const db = useDb()

  const appointment = db.insert(schema.appointments).values({
    ownerId: body.ownerId,
    petId: body.petId,
    groomerId: body.groomerId,
    scheduledAt: body.scheduledAt,
    estimatedDurationMin: body.estimatedDurationMin,
    totalPrice: body.totalPrice,
    notes: body.notes || null,
    status: 'Confirmed'
  }).returning().get()

  // Insert appointment services
  for (const sId of body.serviceIds) {
    const s = db.select().from(schema.services).where(eq(schema.services.id, sId)).get()
    if (s) {
      db.insert(schema.appointmentServices).values({
        appointmentId: appointment.id,
        serviceId: s.id,
        quantity: 1,
        unitPrice: s.basePrice
      }).run()
    }
  }

  return { success: true, appointment }
})
