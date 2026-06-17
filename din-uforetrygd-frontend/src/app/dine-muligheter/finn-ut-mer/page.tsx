import { redirect } from 'next/navigation'
import FinnUtMer from '@/sections/DineMuligheter/FinnUtMer'
import { isEnabled } from '@/utils/unleash'

const DineMuligheterFinnUtMerPage = async () => {
  const dineMuligheterIsEnabled = await isEnabled('din-uforetrygd.dine-muligheter')

  // TODO: Sjekk om bruker har fått varsel

  if (dineMuligheterIsEnabled) {
    return <FinnUtMer />
  }
  // TODO: Vise noe informasjon til brukere som ikke har fått varsel?
  redirect('/')
}

export default DineMuligheterFinnUtMerPage
