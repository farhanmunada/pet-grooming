import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, message: 'Invalid ID' })

  const db = useDb()
  // Soft delete
  db.update(schema.owners)
    .set({ deletedAt: new Date().toISOString() })
    .where(eq(schema.owners.id, id))
    .run()

  return { success: true }
})
