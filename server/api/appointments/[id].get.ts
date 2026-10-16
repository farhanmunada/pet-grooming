import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, message: 'Invalid ID' })

  const db = useDb()
  const appointment = await db.query.appointments.findFirst({
    where: eq(schema.appointments.id, id),
    with: {
      owner: true,
      pet: true,
      groomer: true,
      services: {
        with: {
          service: true
        }
      },
      groomingNote: true
    }
  })

  if (!appointment) throw createError({ statusCode: 404, message: 'Appointment not found' })

  return { appointment }
})
