import { Alert, BodyLong, Heading } from '@navikt/ds-react'
import { RelevanteSoknader } from '@/sections/RelevanteSoknader'
import { Innloggingstype, Visningskriterier } from '@/const'
import { KanVaereAktueltForDeg } from '@/sections/KanVaereAktueltForDeg'
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
import React from 'react'
import { InntektSnarveier } from '@/sections/InntektSnarveier'
import { Snarveier } from '@/sections/Snarveier'
import { InterneLenker } from '@/sections/InterneLenker'
import { LukkbarAlert } from '@/components/Alert/LukkbarAlert'

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
            <Heading size="xlarge" level="1">
              Din uføretrygd
            </Heading>
            {mode === 'borger' && (
              <LukkbarAlert variant="info" cookieNavn="regelendring-2026-alert">
                <Heading size="small">Nye regler for uføretrygd i 2026</Heading>
                <BodyLong size="medium">
                  Det kommer nye regler for uføretrygd i 2026, blant annet endring av inntektsgrensen. Vi informerer deg
                  så snart vi vet mer. Nav.no, Din uføretrygd og inntektsplanleggeren vil bli oppdatert. De som får
                  endring i uføretrygden sin på grunn av regelendringene, vil få brev om dette.
                </BodyLong>
              </LukkbarAlert>
            )}
            <InntektSnarveier
              visningskriterier={visningskriterier}
              pid={params.pid}
              innloggingstype={uforetrygdResponse.innloggingstype as Innloggingstype}></InntektSnarveier>
            <UforestatusGuidePanel visningskriterier={visningskriterier} />
            <DittVedtak
              pid={params.pid}
              hasIverksattVedtak={uforetrygdResponse.hasIverksattVedtak!}
              dittUforevedtak={uforetrygdResponse.uforevedtak}
              sakId={uforesak?.sakId?.toString()}
            />
            <InterneLenker visningskriterier={visningskriterier} sakId={uforesak?.sakId?.toString()}></InterneLenker>
            <Snarveier
              visningskriterier={visningskriterier}
              pid={params.pid}
              uforetrygdResponse={uforetrygdResponse}
            />
            <MeldeFra visningskriterier={visningskriterier} />
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
