import { getToken, parseAzureUserToken } from '@navikt/oasis'
import { headers } from 'next/headers'

type AzurePayload = {
  NAVident: string
  name: string
  preferred_username: string
}

export const getAzureUserPayload = () =>
  new Promise<AzurePayload>(async (resolve, reject) => {
    if (process.env.NODE_ENV !== 'production') {
      return resolve({
        NAVident: 'NAVident',
        name: 'name',
        preferred_username: 'preferred_username',
      })
    }

    const clientHeaders = await headers()
    const token = getToken(clientHeaders)
    const parse = parseAzureUserToken(token as string)
    if (parse.ok) {
      return resolve(parse)
    } else {
      return reject(parse.error)
    }
  })
