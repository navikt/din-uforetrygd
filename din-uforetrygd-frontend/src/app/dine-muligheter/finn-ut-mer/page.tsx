import { Alert, VStack } from '@navikt/ds-react'
import { hentHarMottattVarsel } from '@/api/hentHarMottattVarsel'
import FinnUtMer from '@/sections/DineMuligheter/FinnUtMer'
import { isEnabled } from '@/utils/unleash'

const DineMuligheterFinnUtMerPage = async () => {
  const dineMuligheterIsEnabled = await isEnabled('din-uforetrygd.dine-muligheter')

  if (dineMuligheterIsEnabled) {
    const harMottattVarsel = await hentHarMottattVarsel()

    if (harMottattVarsel) {
      return <FinnUtMer />
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

export default DineMuligheterFinnUtMerPage
