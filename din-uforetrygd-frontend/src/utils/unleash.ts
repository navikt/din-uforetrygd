import { cookies } from 'next/headers'
import { unleash } from '../../server/initializeUnleash'

export const isEnabled = async (toggle: string): Promise<boolean> => {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(unleashSessionIdKey)?.value
  return unleash.isEnabled(toggle, { sessionId })
}

export const unleashSessionIdKey = 'unleash-session-id'
