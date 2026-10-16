import { eq, sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!id) {
    throw createError({ statusCode: 400, message: 'Invalid ID' })
  }

  const db = useDb()
  const owner = await db.query.owners.findFirst({
    where: and(eq(schema.owners.id, id), sql`deleted_at IS NULL`),
    with: {
      pets: {
        where: sql`deleted_at IS NULL`,
        with: {
          vaccinations: true,
          appointments: {
            limit: 5,
            orderBy: [sql`scheduled_at DESC`]
          }
        }
      },
      transactions: {
        limit: 10,
        orderBy: [sql`created_at DESC`]
      }
    }
  })

  if (!owner) {
    throw createError({ statusCode: 404, message: 'Owner tidak ditemukan' })
  }

  return { owner }
})
