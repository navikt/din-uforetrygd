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
import { VeilederBorgerinformasjon } from '@/components/VeilederBorgerinformasjon'

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
        <VeilederBorgerinformasjon pid={params.pid} />
        <main className="main-content" id="maincontent" tabIndex={-1}>
          <Heading size="xlarge" level="1">
            Din uføretrygd
          </Heading>
          <UforestatusGuidePanel visningskriterier={visningskriterier} pid={params.pid} />
          <DineSaker visningskriterier={visningskriterier} pid={params.pid} />
          <DittVedtak
            pid={params.pid}
            hasIverksattVedtak={initResponse.hasIverksattVedtak!}
            dittUforevedtak={initResponse.uforevedtak}
          />
          <InformasjonOgRegistreringer visningskriterier={visningskriterier} pid={params.pid} />
          <MeldeFra visningskriterier={visningskriterier} />
          <RelevanteSoknader visningskriterier={visningskriterier} innloggingstype={initResponse.innloggingstype!} />
          <KanVaereAktueltForDeg visningskriterier={visningskriterier} />
        </main>
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
