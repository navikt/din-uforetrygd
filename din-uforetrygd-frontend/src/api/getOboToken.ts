import { getToken, requestOboToken, validateToken } from '@navikt/oasis'
import { headers } from 'next/headers'
import getEnv from '@/utils/env'

export const getUforeVarslerOboToken = async () => {
  return getOboToken(getEnv('UFORE_VARSLER_SCOPE')!)
}

export const getDinUforetrygdBackendOboToken = async () => {
  return getOboToken(getEnv('DIN_UFORETRYGD_BACKEND_SCOPE')!)
}

const getOboToken = async (scope: string): Promise<string> => {
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
  const obo = await requestOboToken(token, scope)

  if (!obo.ok) {
    throw obo.error
  }

  return obo.token
}

