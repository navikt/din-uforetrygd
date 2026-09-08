import { evaluateFlags, flagsClient, getDefinitions } from '@unleash/nextjs'
import { cookies } from 'next/headers'
import { after } from 'next/server'
import type { ClientFeaturesResponse } from 'unleash-client'
import { serverEnv } from '@/env'

export const isEnabled = async (toggle: string): Promise<boolean> => {
  /* const isDev = serverEnv.NODE_ENV !== 'production'
   if (isDev) {
     return _localToggles[toggle] ?? false
   }*/

  const cookieStore = await cookies()
  const sessionId = cookieStore.get(unleashSessionIdKey)?.value

  let definitions: ClientFeaturesResponse
  try {
    definitions = await getDefinitions({
      url: `${serverEnv.UNLEASH_SERVER_API_URL}/api/client/features`,
      fetchOptions: {
        next: { revalidate: 15 }, // cache i 15 sek
        signal: AbortSignal.timeout(3000),
      },
    })
  } catch (e) {
    console.error('Henting av feature toggles fra Unleash feilet', e)
    return false
  }

  const { toggles } = evaluateFlags(definitions, {
    sessionId,
  })
  const flags = flagsClient(toggles, { url: `${serverEnv.UNLEASH_SERVER_API_URL}/api` })
  const isEnabled = flags.isEnabled(toggle)

  // Ikke blokkerende rapportering tilbake til Unleash
  after(async () => flags.sendMetrics())

  return isEnabled
}

export const unleashSessionIdKey = 'unleash-session-id'

type LocalToggles = Record<string, boolean>
const _localToggles: LocalToggles = {
  'test-toggle': true,
}
