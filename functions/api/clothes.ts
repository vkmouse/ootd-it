// GET /api/clothes — 列出該使用者的所有衣物（依建立時間倒序）
// POST /api/clothes — 新增一件衣物
// 驗證：從 Cloudflare Access header 取得使用者 email，本地開發 fallback demo@example.com

function getOwnerEmail(request: Request): string {
  return request.headers.get('cf-access-authenticated-user-email') ?? 'demo@example.com'
}

export async function onRequestGet(context: EventContext<Env, string, unknown>): Promise<Response> {
  const ownerEmail = getOwnerEmail(context.request)

  const { results } = await context.env.DB.prepare(
    'SELECT * FROM clothes WHERE owner_email = ? ORDER BY created_at DESC'
  )
    .bind(ownerEmail)
    .all()

  return Response.json(results)
}

export async function onRequestPost(context: EventContext<Env, string, unknown>): Promise<Response> {
  const ownerEmail = getOwnerEmail(context.request)

  const body = await context.request.json<{
    name: string
    category: string
    color: string | null
    size: string | null
    acquired_date: string | null
    acquired_price: number | null
  }>()

  const id = crypto.randomUUID()
  const createdAt = new Date().toISOString()

  await context.env.DB.prepare(
    `INSERT INTO clothes (id, owner_email, name, category, color, size, acquired_date, acquired_price, image_url, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL, ?)`
  )
    .bind(
      id,
      ownerEmail,
      body.name,
      body.category,
      body.color,
      body.size,
      body.acquired_date,
      body.acquired_price,
      createdAt
    )
    .run()

  return Response.json({ id }, { status: 201 })
}
