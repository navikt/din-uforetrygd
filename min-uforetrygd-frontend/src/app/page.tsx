import {Alert, Heading, VStack} from '@navikt/ds-react'
import {RelevanteSoknader} from '@/sections/RelevanteSoknader'
import {Innloggingstype, Visningskriterier} from '@/const'
import {KanVaereAktueltForDeg} from '@/sections/KanVaereAktueltForDeg'
import {InformasjonOgRegistreringer} from '@/sections/InformasjonOgRegistreringer'
import DittVedtak from '@/sections/DittVedtak/index'
import {MeldeFra} from '@/sections/MeldeFra'
import {getVisningskriterier} from '@/utils/getVisningskriterier'
import {initate} from '@/api/endpoints'
import {VeilederBorgerinformasjon} from '@/components/VeilederBorgerinformasjon'
import {resolveErrorText} from '@/utils/resolveErrorText'
import {TaskAnalytics} from '../components/TaskAnalytics'
import getEnv from '@/utils/env'
import Hendelser from '@/sections/Hendelser'
import {Dokumenter} from '@/sections/Dokumenter'
import './module.layout.css'
import EventProvider from "@/utils/dataContextProvider/EventContextProvider";
import UforestatusGuidePanel from "@/sections/UforeStatusGuidePanel"
import {mapSakCodeToSak} from "@/utils/mapSakCodeToSak";


interface IHomeProps {
  searchParams: Promise<{ pid?: string }>
}

const Home: React.FC<IHomeProps> = async ({searchParams}) => {
  const params = await searchParams
  const initResponse = await initate(params.pid)
  const uforetrygdResponse = initResponse.uforetrygdResponse

  if (uforetrygdResponse) {
    const visningskriterier: Visningskriterier[] = getVisningskriterier(uforetrygdResponse)
    const mode = getEnv('MODE')
    const uforesak = uforetrygdResponse.saker?.[0] ?? null
    console.log(uforesak)
    console.log(uforesak?.type)
    const sakstype = uforesak?.type ? (mapSakCodeToSak(uforesak.type.toString()) ?? 'ukjent') : 'ukjent'


    return (
      <>
        <TaskAnalytics id="03419" shouldRun={mode === 'borger'}/>
        <VeilederBorgerinformasjon pid={params.pid}/>
        <EventProvider>
          <main className="main-content" id="maincontent" tabIndex={-1}>
            <Heading size="xlarge" level="1">
              Din uføretrygd
            </Heading>
            <UforestatusGuidePanel visningskriterier={visningskriterier}/>
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
            <MeldeFra visningskriterier={visningskriterier}/>
            <section className="wide">
              <VStack gap="6">
                <Hendelser hendelser={uforetrygdResponse.hendelser!} sakstype={sakstype}/>
                <Dokumenter pid={params.pid} journalposter={uforetrygdResponse.journalposter!}/>
              </VStack>
            </section>
            <RelevanteSoknader
              visningskriterier={visningskriterier}
              innloggingstype={uforetrygdResponse.innloggingstype!}
            />
            <KanVaereAktueltForDeg visningskriterier={visningskriterier}/>

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
