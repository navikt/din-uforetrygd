import getEnv from '@/utils/env'
import { getAzureUserPayload } from '@/utils/getAzureUserPayload'

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
  | 'LINK_SAKSBEHANDLINGSTIDER_UFORETRYGD'
  | 'LINK_DITT_LOKALE_NAV_KONTOR'

export const getUrl = async (urlFromEnv: EnvUrl, pid = '') => {
  if (getEnv('MODE') === 'veileder' && pid) {
    const parse = await getAzureUserPayload()
    return getEnv(urlFromEnv)?.replace('PID', pid).replace('USER', parse.name)
  }
  return getEnv(urlFromEnv)
}
