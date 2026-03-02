import { getToken, requestOboToken, validateToken } from '@navikt/oasis'
import { headers } from 'next/headers'
import getEnv from '@/utils/env'

const getOboToken = async (): Promise<string> => {
  if (process.env.NODE_ENV !== 'production') {
    return process.env.ACCESS_TOKEN!
  }
  const clientHeaders = await headers()
  const token = getToken(clientHeaders)
  if (!token) {
    throw new Error('Missing wonderwall cookie')
  }
  const validation = await validateToken(token)
  if (!validation.ok) {
    throw validation.error
  }
  const obo = await requestOboToken(token, getEnv('DIN_UFORETRYGD_BACKEND_SCOPE')!)

  if (!obo.ok) {
    throw obo.error
  }

  return obo.token
}

export default getOboToken
