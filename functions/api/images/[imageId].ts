// GET /api/images/:imageId — 從 R2 讀取圖片二進位，附上瀏覽器快取標頭
import type { AuthContext } from '../../types'

export async function onRequestGet(
  context: EventContext<Env, 'imageId', AuthContext>
): Promise<Response> {
  const imageId = context.params.imageId
  const key = `clothes/${imageId}/photo`

  const object = await context.env.IMAGES.get(key)

  if (!object) {
    return new Response(null, { status: 404 })
  }

  const headers = new Headers()
  object.writeHttpMetadata(headers)
  headers.set('etag', object.httpEtag)
  headers.set('Cache-Control', 'private, max-age=86400')

  return new Response(object.body, { headers })
}
