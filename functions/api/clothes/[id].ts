// GET /api/clothes/:id — 取得單一衣物
// PATCH /api/clothes/:id — 更新衣物欄位（不包含圖片）
import type { AuthContext } from '../../types'

export async function onRequestGet(
  context: EventContext<Env, 'id', AuthContext>
): Promise<Response> {
  const ownerEmail = context.data.email
  const id = context.params.id

  const row = await context.env.DB.prepare(
    'SELECT * FROM clothes WHERE id = ? AND owner_email = ?'
  )
    .bind(id, ownerEmail)
    .first()

  if (!row) {
    return Response.json({ error: 'not found' }, { status: 404 })
  }

  return Response.json(row)
}

export async function onRequestPatch(
  context: EventContext<Env, 'id', AuthContext>
): Promise<Response> {
  const ownerEmail = context.data.email
  const id = context.params.id

  const body = await context.request.json<{
    name?: string
    category?: string
    color?: string | null
    color_note?: string | null
    size?: string | null
    acquired_date?: string | null
    acquired_price?: number | null
  }>()

  const fields: string[] = []
  const values: unknown[] = []

  if (body.name !== undefined) { fields.push('name = ?'); values.push(body.name) }
  if (body.category !== undefined) { fields.push('category = ?'); values.push(body.category) }
  if ('color' in body) { fields.push('color = ?'); values.push(body.color ?? null) }
  if ('color_note' in body) { fields.push('color_note = ?'); values.push(body.color_note ?? null) }
  if ('size' in body) { fields.push('size = ?'); values.push(body.size ?? null) }
  if ('acquired_date' in body) { fields.push('acquired_date = ?'); values.push(body.acquired_date ?? null) }
  if ('acquired_price' in body) { fields.push('acquired_price = ?'); values.push(body.acquired_price ?? null) }

  if (fields.length === 0) {
    return Response.json({ error: 'no fields to update' }, { status: 400 })
  }

  values.push(id, ownerEmail)

  await context.env.DB.prepare(
    `UPDATE clothes SET ${fields.join(', ')} WHERE id = ? AND owner_email = ?`
  )
    .bind(...values)
    .run()

  return Response.json({ ok: true })
}

export async function onRequestDelete(
  context: EventContext<Env, 'id', AuthContext>
): Promise<Response> {
  const ownerEmail = context.data.email
  const id = context.params.id

  const row = await context.env.DB.prepare(
    'SELECT image_url FROM clothes WHERE id = ? AND owner_email = ?'
  )
    .bind(id, ownerEmail)
    .first<{ image_url: string | null }>()

  if (!row) {
    return Response.json({ error: 'not found' }, { status: 404 })
  }

  if (row.image_url) {
    const imageId = row.image_url.split('/').pop()
    if (imageId) {
      await context.env.IMAGES.delete(`clothes/${ownerEmail}/${imageId}`)
    }
  }

  await context.env.DB.prepare(
    'DELETE FROM clothes WHERE id = ? AND owner_email = ?'
  )
    .bind(id, ownerEmail)
    .run()

  return Response.json({ ok: true })
}
