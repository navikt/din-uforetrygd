import { headers } from 'next/headers'
import { getToken, requestOboToken, validateToken } from '@navikt/oasis'
import getEnv from '@/utils/env'

const getOboToken = async () => {
  return new Promise(async (resolve, reject) => {
    if (process.env.NODE_ENV !== 'production') {
      resolve('mock-token')
    }
    const clientHeaders = await headers()
    const token = getToken(clientHeaders)
    if (!token) {
      return reject('Missing wonderwall cookie')
    }
    const validation = await validateToken(token)
    if (!validation.ok) {
      return reject(`Validation failed: ${validation.error}`)
    }
    const obo = await requestOboToken(token, getEnv('DIN_UFORETRYGD_BACKEND_SCOPE')!)

    if (!obo.ok) {
      return reject(`OBO Exchange failed: ${obo.error}`)
    }

    resolve(obo.token)
  })
}

export default getOboToken
