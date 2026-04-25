// 擴充全域 Env 介面，加入 Cloudflare Access 所需的環境變數
declare global {
  interface Env {
    POLICY_AUD: string
    TEAM_DOMAIN: string
  }
}

// middleware 注入至 context.data 的驗證結果
export interface AuthContext {
  email: string
  [key: string]: unknown
}
