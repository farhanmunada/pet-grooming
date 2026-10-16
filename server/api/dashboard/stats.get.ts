import { sql, eq, and, gte, lte } from 'drizzle-orm'

export default defineEventHandler(async () => {
  const db = useDb()

  const todayStr = new Date().toISOString().split('T')[0]
  const thirtyDaysLater = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  // 1. Total pets & owners
  const totalPets = db.select({ count: sql<number>`count(*)` }).from(schema.pets).where(sql`deleted_at IS NULL`).get()?.count || 0
  const totalOwners = db.select({ count: sql<number>`count(*)` }).from(schema.owners).where(sql`deleted_at IS NULL`).get()?.count || 0

  // 2. Today's appointments
  const todayAppointments = await db.query.appointments.findMany({
    where: sql`date(scheduled_at) = ${todayStr}`,
    with: {
      owner: true,
      pet: true,
      groomer: true
    },
    orderBy: [sql`scheduled_at ASC`]
  })

  // 3. Today's revenue
  const todayRevenue = db.select({
    total: sql<number>`coalesce(sum(total), 0)`
  }).from(schema.transactions).where(sql`date(created_at) = ${todayStr}`).get()?.total || 0

  // 4. Low stock products
  const lowStockProducts = db.select().from(schema.products)
    .where(and(
      eq(schema.products.isActive, true),
      sql`stock_quantity <= reorder_level`
    ))
    .all()

  // 5. Expiring vaccines (within 30 days or already expired)
  const expiringVaccines = await db.query.vaccinations.findMany({
    where: sql`expiry_date <= ${thirtyDaysLater}`,
    with: {
      pet: {
        with: {
          owner: true
        }
      }
    },
    orderBy: [sql`expiry_date ASC`],
    limit: 10
  })

  return {
    todayStr,
    stats: {
      totalPets,
      totalOwners,
      todayAppointmentsCount: todayAppointments.length,
      todayRevenue,
      lowStockCount: lowStockProducts.length,
      expiringVaccinesCount: expiringVaccines.length
    },
    todayAppointments,
    lowStockProducts,
    expiringVaccines
  }
})
