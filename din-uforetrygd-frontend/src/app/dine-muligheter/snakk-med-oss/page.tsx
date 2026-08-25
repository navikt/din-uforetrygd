import { Alert, VStack } from '@navikt/ds-react'
import { hentHarMottattVarsel } from '@/api/hentHarMottattVarsel'
import SnakkMedOss from '@/sections/DineMuligheter/SnakkMedOss'
import getEnv from '@/utils/env'
import { isEnabled } from '@/utils/unleash'

interface Props {
  searchParams: Promise<{ pid?: string }>
}

const DineMuligheterSnakkMedOssPage = async ({ searchParams }: Props) => {
  const params = await searchParams
  const mode = getEnv('MODE') as 'borger' | 'veileder'
  const dineMuligheterIsEnabled = await isEnabled('din-uforetrygd.dine-muligheter')

  if (dineMuligheterIsEnabled) {
    const harMottattVarsel = await hentHarMottattVarsel()

    if (harMottattVarsel) {
      return <SnakkMedOss pid={params.pid} mode={mode} />
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
