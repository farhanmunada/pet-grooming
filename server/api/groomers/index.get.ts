import { eq } from 'drizzle-orm'

export default defineEventHandler(async () => {
  const db = useDb()
  const groomersList = db.select().from(schema.groomers).where(eq(schema.groomers.isActive, true)).all()
  return { groomers: groomersList }
})
