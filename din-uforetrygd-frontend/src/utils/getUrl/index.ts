import getEnv from '@/utils/env'
import { getToken, parseAzureUserToken } from '@navikt/oasis'
import { headers } from 'next/headers'

type EnvUrl =
  | 'LINK_SOKNAD_GRADERT_UFORE'
  | 'LINK_SOKNAD_UFORE'
  | 'LINK_SOKNAD_BARNETILLEGG'
  | 'LINK_LES_MER_OM_UFORETRYGD'
  | 'LINK_ENDRE_KONTONUMMER'
  | 'LINK_PERSONOPPLYSNINGER'
  | 'LINK_OKONOMISKE_TILLEGG'
  | 'LINK_KLAGE'
  | 'LINK_UTBETALINGER'
  | 'LINK_BREV'
  | 'LINK_INNTEKTSPLANLEGGER'
  | 'LINK_SAKER'
  | 'LINK_SKATTETREKK'
  | 'LINK_FAMILIEFORHOLD'
  | 'LINK_FULLMAKTER'
  | 'LINK_ETTERSENDE'
  | 'LINK_MELD_FRA_OM_ENDRINGER'

export const getUrl = async (urlFromEnv: EnvUrl, pid: string | undefined) => {
  if (getEnv('MODE') === 'veileder') {
    const clientHeaders = await headers()
    const token = getToken(clientHeaders)
    const parse = parseAzureUserToken(token as string)
    if (parse.ok && pid) {
      return getEnv(urlFromEnv)?.replace('PID', pid).replace('USER', parse.name)
    }
  }
  return getEnv(urlFromEnv)
}
