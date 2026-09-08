import { Alert, VStack } from '@navikt/ds-react'
import { hentHarMottattVarsel } from '@/api/hentHarMottattVarsel'
import SnakkMedOss from '@/sections/DineMuligheter/SnakkMedOss'
import { isEnabled } from '@/utils/unleash'
import { env } from '@/env'

interface Props {
  searchParams: Promise<{ pid?: string }>
}

const DineMuligheterSnakkMedOssPage = async ({ searchParams }: Props) => {
  const params = await searchParams
  const dineMuligheterIsEnabled = await isEnabled('din-uforetrygd.dine-muligheter')

  if (dineMuligheterIsEnabled) {
    const harMottattVarsel = await hentHarMottattVarsel()

    if (harMottattVarsel) {
      return (
        <SnakkMedOss
          pid={params.pid}
          mode={env().MODE}
          skrivTilOssLenke={env().LINK_SKRIV_TIL_OSS}
          startArbeidsoppfølgingLenke={env().LINK_START_ARBEIDSOPPFOLGING}
        />
      )
    }
  }
  return (
    <VStack width="100%" paddingBlock="space-48">
      <Alert variant="info">
        Hei! Så fint at du er interessert i hva du kan gjøre ved siden av uføretrygden. Du har dessverre ikke tilgang
        til dette området, men du kan lese mer på nav.no om hvilke muligheter du har.
      </Alert>
    </VStack>
  )
}

export default DineMuligheterSnakkMedOssPage
