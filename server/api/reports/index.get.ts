import { sql, desc } from 'drizzle-orm'

export default defineEventHandler(async () => {
  const db = useDb()

  // 1. Total revenue
  const totalRev = db.select({
    total: sql<number>`coalesce(sum(total), 0)`,
    subtotal: sql<number>`coalesce(sum(subtotal), 0)`,
    discount: sql<number>`coalesce(sum(discount), 0)`,
    count: sql<number>`count(*)`
  }).from(schema.transactions).where(sql`payment_status = 'Paid'`).get()

  // 2. Revenue by type (Service vs Product vs Mixed)
  const byType = db.select({
    type: schema.transactions.type,
    total: sql<number>`coalesce(sum(total), 0)`,
    count: sql<number>`count(*)`
  }).from(schema.transactions)
    .where(sql`payment_status = 'Paid'`)
    .groupBy(schema.transactions.type)
    .all()

  // 3. Top selling items
  const topItems = db.select({
    name: schema.transactionItems.name,
    itemType: schema.transactionItems.itemType,
    quantity: sql<number>`coalesce(sum(quantity), 0)`,
    total: sql<number>`coalesce(sum(total), 0)`
  }).from(schema.transactionItems)
    .groupBy(schema.transactionItems.name, schema.transactionItems.itemType)
    .orderBy(desc(sql`sum(total)`))
    .limit(5)
    .all()

  // 4. Groomer stats
  const groomerStats = db.select({
    groomerId: schema.appointments.groomerId,
    name: schema.groomers.name,
    appointmentsCount: sql<number>`count(*)`,
    totalRevenue: sql<number>`coalesce(sum(total_price), 0)`
  }).from(schema.appointments)
    .innerJoin(schema.groomers, sql`${schema.appointments.groomerId} = ${schema.groomers.id}`)
    .where(sql`${schema.appointments.status} = 'Completed'`)
    .groupBy(schema.appointments.groomerId, schema.groomers.name)
    .all()

  return {
    overview: {
      totalRevenue: totalRev?.total || 0,
      totalDiscount: totalRev?.discount || 0,
      totalTransactions: totalRev?.count || 0
    },
    byType,
    topItems,
    groomerStats
  }
})
