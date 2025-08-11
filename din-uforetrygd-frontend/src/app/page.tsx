import {Alert, Heading, VStack} from '@navikt/ds-react'
import { RelevanteSoknader } from '@/sections/RelevanteSoknader'
import { Visningskriterier } from '@/const'
import { KanVaereAktueltForDeg } from '@/sections/KanVaereAktueltForDeg'
import { InformasjonOgRegistreringer } from '@/sections/InformasjonOgRegistreringer'
import { UforestatusGuidePanel } from '@/sections/UforeStatusGuidePanel'
import  DittVedtak  from '@/sections/DittVedtak/index'
import { MeldeFra } from '@/sections/MeldeFra'
import { DineSaker } from '@/sections/DineSaker'
import { getVisningskriterier } from '@/utils/getVisningskriterier'
import { initate } from '@/api/endpoints'
import { VeilederBorgerinformasjon } from '@/components/VeilederBorgerinformasjon'
import { resolveErrorText } from '@/utils/resolveErrorText'
import { TaskAnalytics } from '../components/TaskAnalytics'
import getEnv from '@/utils/env'
import Hendelser from '@/sections/Hendelser'
import { Dokumenter } from '@/sections/Dokumenter'

interface IHomeProps {
  searchParams: Promise<{ pid?: string }>
}

const Home: React.FC<IHomeProps> = async ({ searchParams }) => {
  const params = await searchParams
  const initResponse = await initate(params.pid)
  const uforetrygdResponse = initResponse.uforetrygdResponse

  if (uforetrygdResponse) {
    const visningskriterier: Visningskriterier[] = getVisningskriterier(uforetrygdResponse)
    const mode = getEnv('MODE')

    return (
      <>
        <TaskAnalytics id="03419" shouldRun={mode === 'borger'} />
        <VeilederBorgerinformasjon pid={params.pid} />
        <main className="main-content" id="maincontent" tabIndex={-1}>
          <Heading size="xlarge" level="1">
            Din uføretrygd
          </Heading>
          <UforestatusGuidePanel visningskriterier={visningskriterier} pid={params.pid} />
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
          <DineSaker visningskriterier={visningskriterier} pid={params.pid} />
          <section className="wide">
            <VStack gap="6">
              <Hendelser hendelser={uforetrygdResponse.hendelser!} sakstype="UFOREP" />
              <Dokumenter pid={params.pid} journalposter={uforetrygdResponse.journalposter!} />
            </VStack>
          </section>
          <RelevanteSoknader
            visningskriterier={visningskriterier}
            innloggingstype={uforetrygdResponse.innloggingstype!}
          />
          <div className="ux-signals-container">
            <div data-uxsignals-embed="panel-u5y48zl9t7" className="ux-signals"></div>
          </div>
          <KanVaereAktueltForDeg visningskriterier={visningskriterier} />
        </main>
      </>
    )
  } else {
    return (
      <section className="main-content">
        <Alert variant="error" role="alert">
          {resolveErrorText(initResponse.backendError?.message)}
        </Alert>
      </section>
    )
  }
}

export default Home
