import { cookies } from 'next/headers'
import { evaluateFlags, flagsClient, getDefinitions } from '@unleash/nextjs'
import { after } from 'next/server'

export const isEnabled = async (toggle: string): Promise<boolean> => {
  const isDev = process.env.NODE_ENV !== 'production'
  if (isDev) {
    return localToggles[toggle] ?? false
  }

  const cookieStore = await cookies()
  const sessionId = cookieStore.get(unleashSessionIdKey)?.value

  let definitions
  try {
    definitions = await getDefinitions({
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
  const flags = flagsClient(toggles)

  const isEnabled = flags.isEnabled(toggle)

  // Ikke blokkerende rapportering tilbake til Unleash
  after(async () => flags.sendMetrics())

  return isEnabled
}

export const unleashSessionIdKey = 'unleash-session-id'

type LocalToggles = Record<string, boolean>
const localToggles: LocalToggles = {
  'test-toggle': true,
}
