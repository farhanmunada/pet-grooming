import { eq } from 'drizzle-orm'

export default defineEventHandler(async () => {
  const db = useDb()
  const servicesList = db.select().from(schema.services).where(eq(schema.services.isActive, true)).all()
  return { services: servicesList }
})
