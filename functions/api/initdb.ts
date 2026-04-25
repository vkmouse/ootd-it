// GET /api/initdb — 初始化資料庫表格（建立 clothes table）並執行 migration
export async function onRequestGet(context: EventContext<Env, string, unknown>): Promise<Response> {
  await context.env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS clothes (
      id             TEXT PRIMARY KEY,
      owner_email    TEXT NOT NULL,
      name           TEXT NOT NULL,
      category       TEXT NOT NULL,
      color          TEXT,
      color_note     TEXT,
      size           TEXT,
      acquired_date  TEXT,
      acquired_price REAL,
      image_url      TEXT,
      created_at     TEXT NOT NULL
    )`
  ).run()

  return Response.json({ ok: true, message: 'clothes table initialized' })
}
