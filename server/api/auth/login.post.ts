import { eq } from 'drizzle-orm'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, loginSchema.parse)
  const db = useDb()

  const user = db.select().from(schema.users).where(eq(schema.users.email, body.email)).get()
  if (!user || user.passwordHash !== body.password) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Email atau password salah'
    })
  }

  if (!user.isActive) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Akun dinonaktifkan'
    })
  }

  // Update lastLoginAt
  db.update(schema.users)
    .set({ lastLoginAt: new Date().toISOString() })
    .where(eq(schema.users.id, user.id))
    .run()

  await setUserSession(event, {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  })

  return {
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  }
})
