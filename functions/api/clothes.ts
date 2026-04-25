// GET /api/clothes — 列出該使用者的所有衣物（依建立時間倒序）
// POST /api/clothes — 新增一件衣物
import type { AuthContext } from '../types'

export async function onRequestGet(context: EventContext<Env, string, AuthContext>): Promise<Response> {
  const ownerEmail = context.data.email

  const { results } = await context.env.DB.prepare(
    'SELECT * FROM clothes WHERE owner_email = ? ORDER BY created_at DESC'
  )
    .bind(ownerEmail)
    .all()

  return Response.json(results)
}

export async function onRequestPost(context: EventContext<Env, string, AuthContext>): Promise<Response> {
  const ownerEmail = context.data.email

  const body = await context.request.json<{
    name: string
    category: string
    color: string | null
    color_note: string | null
    size: string | null
    acquired_date: string | null
    acquired_price: number | null
  }>()

  const id = crypto.randomUUID()
  const createdAt = new Date().toISOString()

  await context.env.DB.prepare(
    `INSERT INTO clothes (id, owner_email, name, category, color, color_note, size, acquired_date, acquired_price, image_url, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?)`
  )
    .bind(
      id,
      ownerEmail,
      body.name,
      body.category,
      body.color,
      body.color_note,
      body.size,
      body.acquired_date,
      body.acquired_price,
      createdAt
    )
    .run()

  return Response.json({ id }, { status: 201 })
}
