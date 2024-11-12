import getEnv from '@/utils/env'
import getOboToken from '@/api/getOboToken'
import { parseAzureUserToken } from '@navikt/oasis'

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

/*export const getUrl = async (urlFromEnv: EnvUrl, pid: string | undefined) => {
  if (getEnv('MODE') === 'veileder') {
    const oboToken = await getOboToken()
    const parse = parseAzureUserToken(oboToken as string)
    if (parse.ok && pid) {
      return getEnv(urlFromEnv)?.replace('PID', pid).replace('USER', parse.name)
    }
  }
  return getEnv(urlFromEnv)
}*/

export const getUrl = (urlFromEnv: EnvUrl, pid: string | undefined) => {
  if (getEnv('MODE') === 'veileder') {
    getOboToken()
      .then((token) => parseAzureUserToken(token as string))
      .then((parse) => {
        if (parse.ok && pid) {
          const link = getEnv(urlFromEnv)?.replace('PID', pid).replace('USER', parse.name)
          console.log(link) // TODO REMOVE_ME
          return link
        }
      })
  }
  return getEnv(urlFromEnv)
}
