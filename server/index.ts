// Cloudflare Workers 後端入口
// 處理 /api/clothes 的 GET 與 POST 請求
// 驗證：從 Cloudflare Access header 取得使用者 email，本地開發 fallback demo@example.com

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    if (!url.pathname.startsWith('/api/')) {
      return new Response(null, { status: 404 })
    }

    // 取得目前使用者的 email（Cloudflare Access 注入，本地無此 header 時 fallback）
    const ownerEmail =
      request.headers.get('cf-access-authenticated-user-email') ?? 'demo@example.com'

    // GET /api/initdb — 初始化資料庫表格（建立 clothes table）
    if (url.pathname === '/api/initdb' && request.method === 'GET') {
      await env.DB.prepare(
        `CREATE TABLE IF NOT EXISTS clothes (
          id                TEXT PRIMARY KEY,
          owner_email       TEXT NOT NULL,
          name              TEXT NOT NULL,
          category          TEXT NOT NULL,
          color             TEXT,
          size              TEXT,
          acquired_occasion TEXT,
          acquired_price    REAL,
          image_url         TEXT,
          created_at        TEXT NOT NULL
        )`
      ).run()

      return Response.json({ ok: true, message: 'clothes table initialized' })
    }

    // GET /api/clothes — 列出該使用者的所有衣物（依建立時間倒序）
    if (url.pathname === '/api/clothes' && request.method === 'GET') {
      const { results } = await env.DB.prepare(
        'SELECT * FROM clothes WHERE owner_email = ? ORDER BY created_at DESC'
      )
        .bind(ownerEmail)
        .all()

      return Response.json(results)
    }

    // POST /api/clothes — 新增一件衣物
    if (url.pathname === '/api/clothes' && request.method === 'POST') {
      const body = await request.json<{
        name: string
        category: string
        color: string | null
        size: string | null
        acquired_occasion: string | null
        acquired_price: number | null
      }>()

      const id = crypto.randomUUID()
      const createdAt = new Date().toISOString()

      await env.DB.prepare(
        `INSERT INTO clothes (id, owner_email, name, category, color, size, acquired_occasion, acquired_price, image_url, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL, ?)`
      )
        .bind(
          id,
          ownerEmail,
          body.name,
          body.category,
          body.color,
          body.size,
          body.acquired_occasion,
          body.acquired_price,
          createdAt
        )
        .run()

      return Response.json({ id }, { status: 201 })
    }

    return Response.json({ error: 'Not found' }, { status: 404 })
  },
} satisfies ExportedHandler<Env>
