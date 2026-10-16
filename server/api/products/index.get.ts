import { sql, like, or, eq, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const search = typeof query.search === 'string' ? query.search.trim() : ''
  const category = typeof query.category === 'string' ? query.category : ''
  const lowStock = query.lowStock === 'true'
  const db = useDb()

  const list = db.select().from(schema.products)
    .where(and(
      eq(schema.products.isActive, true),
      category ? eq(schema.products.category, category) : undefined,
      lowStock ? sql`stock_quantity <= reorder_level` : undefined,
      search ? or(
        like(schema.products.name, `%${search}%`),
        like(schema.products.sku, `%${search}%`),
        like(schema.products.barcode, `%${search}%`)
      ) : undefined
    ))
    .orderBy(sql`name ASC`)
    .all()

  return { products: list }
})
