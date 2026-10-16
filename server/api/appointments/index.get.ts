import { sql, eq, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const date = typeof query.date === 'string' ? query.date : ''
  const status = typeof query.status === 'string' ? query.status : ''
  const groomerId = query.groomerId ? Number(query.groomerId) : null
  const petId = query.petId ? Number(query.petId) : null
  const db = useDb()

  const list = await db.query.appointments.findMany({
    where: and(
      date ? sql`date(scheduled_at) = ${date}` : undefined,
      status ? eq(schema.appointments.status, status as any) : undefined,
      groomerId ? eq(schema.appointments.groomerId, groomerId) : undefined,
      petId ? eq(schema.appointments.petId, petId) : undefined
    ),
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
    },
    orderBy: [sql`scheduled_at ASC`]
  })

  return { appointments: list }
})
