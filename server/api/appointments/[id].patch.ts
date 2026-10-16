import { eq } from 'drizzle-orm'
import { z } from 'zod'

const patchAppointmentSchema = z.object({
  status: z.enum(['Requested', 'Confirmed', 'InProgress', 'Completed', 'Cancelled', 'NoShow']).optional(),
  checkInAt: z.string().optional(),
  checkOutAt: z.string().optional(),
  cancelReason: z.string().optional(),
  notes: z.string().optional(),
  groomingNote: z.object({
    bladeSize: z.string().optional(),
    shampooUsed: z.string().optional(),
    styleNotes: z.string().optional(),
    behaviorNotes: z.string().optional(),
    skinCondition: z.string().optional()
  }).optional()
})

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, message: 'Invalid ID' })

  const body = await readValidatedBody(event, patchAppointmentSchema.parse)
  const db = useDb()

  const appointment = db.select().from(schema.appointments).where(eq(schema.appointments.id, id)).get()
  if (!appointment) throw createError({ statusCode: 404, message: 'Appointment not found' })

  const updateData: Record<string, any> = { updatedAt: new Date().toISOString() }
  if (body.status) {
    updateData.status = body.status
    if (body.status === 'InProgress' && !appointment.checkInAt) {
      updateData.checkInAt = new Date().toISOString()
    }
    if (body.status === 'Completed' && !appointment.checkOutAt) {
      updateData.checkOutAt = new Date().toISOString()
    }
  }
  if (body.cancelReason) updateData.cancelReason = body.cancelReason
  if (body.notes !== undefined) updateData.notes = body.notes

  const updatedAppointment = db.update(schema.appointments)
    .set(updateData)
    .where(eq(schema.appointments.id, id))
    .returning()
    .get()

  // Save grooming note if provided
  if (body.groomingNote) {
    const existingNote = db.select().from(schema.groomingNotes).where(eq(schema.groomingNotes.appointmentId, id)).get()
    if (existingNote) {
      db.update(schema.groomingNotes)
        .set({
          ...body.groomingNote,
          updatedAt: new Date().toISOString()
        })
        .where(eq(schema.groomingNotes.id, existingNote.id))
        .run()
    } else {
      db.insert(schema.groomingNotes).values({
        appointmentId: id,
        petId: appointment.petId,
        ...body.groomingNote
      }).run()
    }
  }

  return { success: true, appointment: updatedAppointment }
})
