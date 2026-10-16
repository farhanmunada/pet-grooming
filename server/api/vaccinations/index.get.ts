import { sql, eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const petId = query.petId ? Number(query.petId) : null
  const db = useDb()

  const list = await db.query.vaccinations.findMany({
    where: petId ? eq(schema.vaccinations.petId, petId) : undefined,
    with: {
      pet: {
        with: {
          owner: true
        }
      }
    },
    orderBy: [sql`expiry_date ASC`]
  })

  return { vaccinations: list }
})
