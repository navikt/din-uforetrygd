import { Alert, Heading } from '@navikt/ds-react'
import { RelevanteSoknader } from '@/sections/RelevanteSoknader'
import { Visningskriterier } from '@/const'
import { KanVaereAktueltForDeg } from '@/sections/KanVaereAktueltForDeg'
import { InformasjonOgRegistreringer } from '@/sections/InformasjonOgRegistreringer'
import { UforestatusGuidePanel } from '@/sections/UforeStatusGuidePanel'
import { DittVedtak } from '@/sections/DittVedtak'
import { MeldeFra } from '@/sections/MeldeFra'
import { DineSaker } from '@/sections/DineSaker'
import { getVisningskriterier } from '@/utils/getVisningskriterier'
import { initate } from '@/api/endpoints'

interface IHomeProps {
  searchParams: Promise<{ pid?: string }>
}
const Home: React.FC<IHomeProps> = async ({ searchParams }) => {
  const params = await searchParams
  const initResponse = await initate(params.pid)

  if (initResponse) {
    const visningskriterier: Visningskriterier[] = getVisningskriterier(initResponse)
    return (
      <>
        <Heading size="xlarge" level="1">
          Uføretrygd
        </Heading>
        <UforestatusGuidePanel visningskriterier={visningskriterier} />
        <DineSaker visningskriterier={visningskriterier} />
        <DittVedtak visningskriterier={visningskriterier} pid={params.pid} />
        <InformasjonOgRegistreringer visningskriterier={visningskriterier} />
        <MeldeFra visningskriterier={visningskriterier} />
        <RelevanteSoknader visningskriterier={visningskriterier} />
        <KanVaereAktueltForDeg visningskriterier={visningskriterier} />
      </>
    )
  } else {
    return (
      <Alert variant="error" role="alert">
        Noe gikk galt. Prøv igjen senere.
      </Alert>
    )
  }
}

export default Home
