import { eq, sql, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, message: 'Invalid ID' })

  const db = useDb()
  const pet = await db.query.pets.findFirst({
    where: and(eq(schema.pets.id, id), sql`deleted_at IS NULL`),
    with: {
      owner: true,
      vaccinations: {
        orderBy: [sql`expiry_date DESC`]
      },
      appointments: {
        with: {
          groomer: true,
          groomingNote: true
        },
        orderBy: [sql`scheduled_at DESC`]
      }
    }
  })

  if (!pet) throw createError({ statusCode: 404, message: 'Pet tidak ditemukan' })

  return { pet }
})
