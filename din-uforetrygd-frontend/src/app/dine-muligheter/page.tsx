import { redirect } from 'next/navigation'
import { hentHarMottattVarsel } from '@/api/endpoints'
import DineMuligheter from '@/sections/DineMuligheter/DineMuligheter'
import { isEnabled } from '@/utils/unleash'

const DineMuligheterPage = async () => {
  const dineMuligheterIsEnabled = await isEnabled('din-uforetrygd.dine-muligheter')
  const harMottattVarsel = await hentHarMottattVarsel()

  if (dineMuligheterIsEnabled && harMottattVarsel) {
    return <DineMuligheter />
  }
  // TODO: Vise noe informasjon til brukere som ikke har fått varsel?
  redirect('/')
}

export default DineMuligheterPage
