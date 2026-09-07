import { evaluateFlags, flagsClient, getDefinitions } from '@unleash/nextjs'
import { cookies } from 'next/headers'
import { after } from 'next/server'
import type { ClientFeaturesResponse } from 'unleash-client'

export const isEnabled = async (toggle: string): Promise<boolean> => {
  const isMock = process.env.ENABLE_MSW === 'true'

  const cookieStore = await cookies()
  const sessionId = cookieStore.get(unleashSessionIdKey)?.value

  let definitions: ClientFeaturesResponse
  try {
    definitions = await getDefinitions({
      url: `${process.env.UNLEASH_SERVER_API_URL}/api/client/features`,
      fetchOptions: isMock
        ? {
            cache: 'no-store', // Ikke cache med mock
            signal: AbortSignal.timeout(3000),
          }
        : {
            next: { revalidate: 15 }, // Cache i 15 sek
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
  const flags = flagsClient(toggles, { url: `${process.env.UNLEASH_SERVER_API_URL}/api` })
  const isEnabled = flags.isEnabled(toggle)

  // Ikke blokkerende rapportering tilbake til Unleash
  after(async () => flags.sendMetrics())

  return isEnabled
}

export const unleashSessionIdKey = 'unleash-session-id'
