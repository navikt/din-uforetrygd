import { Alert, Heading } from '@navikt/ds-react'
import { RelevanteSoknader } from '@/sections/RelevanteSoknader'
import { Innloggingstype, Visningskriterier } from '@/const'
import { KanVaereAktueltForDeg } from '@/sections/KanVaereAktueltForDeg'
import { InformasjonOgRegistreringer } from '@/sections/InformasjonOgRegistreringer'
import DittVedtak from '@/sections/DittVedtak/index'
import { MeldeFra } from '@/sections/MeldeFra'
import { getVisningskriterier } from '@/utils/getVisningskriterier'
import { initate } from '@/api/endpoints'
import { VeilederBorgerinformasjon } from '@/components/VeilederBorgerinformasjon'
import { resolveErrorText } from '@/utils/resolveErrorText'
import { TaskAnalytics } from '../components/TaskAnalytics'
import getEnv from '@/utils/env'
import './layout.css'
import EventProvider from '@/utils/dataContextProvider/EventContextProvider'
import UforestatusGuidePanel from '@/sections/UforeStatusGuidePanel'
import { mapSakCodeToSak } from '@/utils/mapSakCodeToSak'
import { Saksoversikt } from '@/sections/Saksoversikt'

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
    const uforesak = uforetrygdResponse.sak

    return (
      <>
        <TaskAnalytics id="03419" shouldRun={mode === 'borger'} />
        <VeilederBorgerinformasjon pid={uforetrygdResponse.pid} />
        <EventProvider>
          <main className="main-content" id="maincontent" tabIndex={-1}>
            {mode === 'borger' && <Alert contentMaxWidth={false} variant="info" style={{ width: '992px' }}>Nav sender nå uføretrygd til banken 2-3 dager senere enn før, og utbetalingen din blir derfor synlig her 2-3 dager senere enn du er vant til. Pengene kommer likevel på konto til samme tid som før.</Alert>}
            <Heading size="xlarge" level="1">
              Din uføretrygd
            </Heading>
            <UforestatusGuidePanel visningskriterier={visningskriterier} />
            <DittVedtak
              pid={params.pid}
              hasIverksattVedtak={uforetrygdResponse.hasIverksattVedtak!}
              dittUforevedtak={uforetrygdResponse.uforevedtak}
              sakId={uforesak?.sakId?.toString()}
            />
            <InformasjonOgRegistreringer
              visningskriterier={visningskriterier}
              pid={params.pid}
              bprofFullmakt={uforetrygdResponse.harGammelFullmaktmottaker!}
              innloggingstype={uforetrygdResponse.innloggingstype as Innloggingstype}
            />
            <MeldeFra visningskriterier={visningskriterier} />
            <Saksoversikt
              visningskriterier={visningskriterier}
              pid={params.pid}
              journalposter={uforetrygdResponse.journalposter!}
              hendelser={uforetrygdResponse.hendelser!}
            ></Saksoversikt>
            <RelevanteSoknader
              visningskriterier={visningskriterier}
              innloggingstype={uforetrygdResponse.innloggingstype!}
            />
            <KanVaereAktueltForDeg visningskriterier={visningskriterier} />
            <div className="ux-signals-container">
              <div data-uxsignals-embed="panel-u5y48zl9t7" className="ux-signals"></div>
            </div>
          </main>
        </EventProvider>
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
