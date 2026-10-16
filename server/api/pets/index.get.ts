import { sql, like, or } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const search = typeof query.search === 'string' ? query.search.trim() : ''
  const species = typeof query.species === 'string' ? query.species : ''
  const ownerId = query.ownerId ? Number(query.ownerId) : null
  const db = useDb()

  const petsList = await db.query.pets.findMany({
    where: and(
      sql`deleted_at IS NULL`,
      search ? or(like(schema.pets.name, `%${search}%`), like(schema.pets.breedNotes, `%${search}%`)) : undefined,
      species ? eq(schema.pets.species, species as any) : undefined,
      ownerId ? eq(schema.pets.ownerId, ownerId) : undefined
    ),
    with: {
      owner: true,
      vaccinations: {
        orderBy: [sql`expiry_date ASC`]
      },
      appointments: {
        limit: 1,
        orderBy: [sql`scheduled_at DESC`]
      }
    },
    orderBy: [sql`created_at DESC`]
  })

  return { pets: petsList }
})
