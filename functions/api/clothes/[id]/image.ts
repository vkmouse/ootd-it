// POST /api/clothes/:id/image — 上傳衣物圖片至 R2
// GET  /api/clothes/:id/image — 從 R2 讀取圖片二進位

function getOwnerEmail(request: Request): string {
  return request.headers.get('cf-access-authenticated-user-email') ?? 'demo@example.com'
}

export async function onRequestPost(
  context: EventContext<Env, 'id', unknown>
): Promise<Response> {
  const ownerEmail = getOwnerEmail(context.request)
  const id = context.params.id

  // 確認衣物屬於該使用者
  const row = await context.env.DB.prepare(
    'SELECT id FROM clothes WHERE id = ? AND owner_email = ?'
  )
    .bind(id, ownerEmail)
    .first()

  if (!row) {
    return Response.json({ error: 'not found' }, { status: 404 })
  }

  const formData = await context.request.formData()
  const file = formData.get('image') as File | null

  if (!file) {
    return Response.json({ error: 'missing image field' }, { status: 400 })
  }

  const key = `clothes/${id}/photo`
  await context.env.IMAGES.put(key, file.stream(), {
    httpMetadata: { contentType: file.type || 'application/octet-stream' },
  })

  await context.env.DB.prepare(
    'UPDATE clothes SET image_url = ? WHERE id = ? AND owner_email = ?'
  )
    .bind(key, id, ownerEmail)
    .run()

  return Response.json({ ok: true })
}

export async function onRequestGet(
  context: EventContext<Env, 'id', unknown>
): Promise<Response> {
  const ownerEmail = getOwnerEmail(context.request)
  const id = context.params.id

  // 確認衣物屬於該使用者
  const row = await context.env.DB.prepare(
    'SELECT image_url FROM clothes WHERE id = ? AND owner_email = ?'
  )
    .bind(id, ownerEmail)
    .first<{ image_url: string | null }>()

  if (!row || !row.image_url) {
    return new Response(null, { status: 404 })
  }

  const object = await context.env.IMAGES.get(row.image_url)

  if (!object) {
    return new Response(null, { status: 404 })
  }

  const headers = new Headers()
  object.writeHttpMetadata(headers)
  headers.set('etag', object.httpEtag)

  return new Response(object.body, { headers })
}
