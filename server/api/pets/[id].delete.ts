import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, message: 'Invalid ID' })

  const db = useDb()
  db.update(schema.pets)
    .set({ deletedAt: new Date().toISOString() })
    .where(eq(schema.pets.id, id))
    .run()

  return { success: true }
})
