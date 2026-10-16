import { sql, like, or, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const search = typeof query.search === 'string' ? query.search.trim() : ''
  const db = useDb()

  const ownersList = await db.query.owners.findMany({
    where: and(
      sql`deleted_at IS NULL`,
      search ? or(like(schema.owners.name, `%${search}%`), like(schema.owners.phone, `%${search}%`)) : undefined
    ),
    with: {
      pets: {
        where: sql`deleted_at IS NULL`
      }
    },
    orderBy: [sql`created_at DESC`]
  })

  return {
    owners: ownersList
  }
})
