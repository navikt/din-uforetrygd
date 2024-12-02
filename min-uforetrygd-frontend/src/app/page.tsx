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
  const uforetrygdResponse = initResponse.uforetrygdResponse

  if (uforetrygdResponse) {
    const visningskriterier: Visningskriterier[] = getVisningskriterier(uforetrygdResponse)

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
            hasIverksattVedtak={uforetrygdResponse.hasIverksattVedtak!}
            dittUforevedtak={uforetrygdResponse.uforevedtak}
          />
          <InformasjonOgRegistreringer
            visningskriterier={visningskriterier}
            pid={params.pid}
            bprofFullmakt={uforetrygdResponse.harGammelFullmaktmottaker!}
          />
          <MeldeFra visningskriterier={visningskriterier} />
          <RelevanteSoknader
            visningskriterier={visningskriterier}
            innloggingstype={uforetrygdResponse.innloggingstype!}
          />
          <KanVaereAktueltForDeg visningskriterier={visningskriterier} />
        </main>
      </>
    )
  } else {
    switch (initResponse.backendError.message) {
      case 'LOGIN_LEVEL_TOO_LOW':
        return (
          <Alert variant="error" role="alert">
            Du må logge inn med et høyere sikkerhetsnivå for å få tilgang til denne siden. Du kan for eksempel bruke
            BankID.
          </Alert>
        )
      default:
        return (
          <Alert variant="error" role="alert">
            Noe gikk galt. Prøv igjen senere
          </Alert>
        )
    }
  }
}

export default Home
