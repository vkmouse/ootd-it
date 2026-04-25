import type { AuthContext } from './types'
import { jwtVerify, createRemoteJWKSet } from 'jose'

async function verifyCloudflareAccessToken(
  token: string,
  env: Env,
): Promise<string | null> {
  // 環境變數未設定時（本地開發）跳過驗證
  if (!env.POLICY_AUD || !env.TEAM_DOMAIN) {
    return null
  }

  try {
    const JWKS = createRemoteJWKSet(
      new URL(`${env.TEAM_DOMAIN}/cdn-cgi/access/certs`),
    )

    const { payload } = await jwtVerify(token, JWKS, {
      issuer: env.TEAM_DOMAIN,
      audience: env.POLICY_AUD,
    })

    return (payload.email as string) || null
  } catch {
    return null
  }
}

export const onRequest: PagesFunction<Env, string, AuthContext> = async (
  context,
) => {
  let email = 'demo@example.com'

  const jwtHeader = context.request.headers.get('Cf-Access-Jwt-Assertion')
  if (jwtHeader) {
    const verifiedEmail = await verifyCloudflareAccessToken(
      jwtHeader,
      context.env,
    )
    if (verifiedEmail) {
      email = verifiedEmail
    }
  }

  context.data.email = email

  return await context.next()
}
