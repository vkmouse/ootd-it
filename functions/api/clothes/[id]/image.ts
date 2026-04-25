// POST /api/clothes/:id/image — 上傳衣物圖片至 R2
// 每次上傳產生獨立 imageId，image_url 存 /api/images/{imageId}
import type { AuthContext } from '../../../types'

export async function onRequestPost(
  context: EventContext<Env, 'id', AuthContext>
): Promise<Response> {
  const ownerEmail = context.data.email
  const id = context.params.id

  // 確認衣物屬於該使用者，並取得現有 image_url
  const row = await context.env.DB.prepare(
    'SELECT image_url FROM clothes WHERE id = ? AND owner_email = ?'
  )
    .bind(id, ownerEmail)
    .first<{ image_url: string | null }>()

  if (!row) {
    return Response.json({ error: 'not found' }, { status: 404 })
  }

  const formData = await context.request.formData()
  const file = formData.get('image') as File | null

  if (!file) {
    return Response.json({ error: 'missing image field' }, { status: 400 })
  }

  // 若有舊圖，先從 R2 刪除舊物件
  if (row.image_url) {
    const oldImageId = row.image_url.split('/').pop()
    if (oldImageId) {
      await context.env.IMAGES.delete(`clothes/${oldImageId}/photo`)
    }
  }

  // 產生新 imageId，上傳至 R2
  const imageId = crypto.randomUUID()
  const key = `clothes/${imageId}/photo`
  await context.env.IMAGES.put(key, file.stream(), {
    httpMetadata: { contentType: file.type || 'application/octet-stream' },
  })

  const imageUrl = `/api/images/${imageId}`
  await context.env.DB.prepare(
    'UPDATE clothes SET image_url = ? WHERE id = ? AND owner_email = ?'
  )
    .bind(imageUrl, id, ownerEmail)
    .run()

  return Response.json({ ok: true })
}
