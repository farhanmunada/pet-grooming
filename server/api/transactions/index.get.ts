import { sql, eq, and, desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const date = typeof query.date === 'string' ? query.date : ''
  const paymentStatus = typeof query.paymentStatus === 'string' ? query.paymentStatus : ''
  const db = useDb()

  const list = await db.query.transactions.findMany({
    where: and(
      date ? sql`date(created_at) = ${date}` : undefined,
      paymentStatus ? eq(schema.transactions.paymentStatus, paymentStatus as any) : undefined
    ),
    with: {
      owner: true,
      appointment: {
        with: {
          pet: true,
          groomer: true
        }
      },
      items: true
    },
    orderBy: [desc(schema.transactions.createdAt)]
  })

  return { transactions: list }
})
