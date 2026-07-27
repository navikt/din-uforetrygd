import { getToken, parseAzureUserToken } from '@navikt/oasis'
import { headers } from 'next/headers'

type AzurePayload = {
  NAVident: string
  name: string
  preferred_username: string
}

export const getAzureUserPayload = async (): Promise<AzurePayload> => {
  if (process.env.NODE_ENV !== 'production') {
    return {
      NAVident: 'NAVident',
      name: 'Saksbehandler',
      preferred_username: 'preferred_username',
    }
  }

  const clientHeaders = await headers()
  const token = getToken(clientHeaders)
  const parse = parseAzureUserToken(token as string)
  if (parse.ok) {
    return parse
  }
  throw parse.error
}
