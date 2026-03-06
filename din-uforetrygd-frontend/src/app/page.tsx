import { Alert, BodyLong, Heading, VStack } from '@navikt/ds-react'
import { initate } from '@/api/endpoints'
import { TaskAnalytics } from '@/components/TaskAnalytics/TaskAnalytics'
import { VeilederBorgerinformasjon } from '@/components/VeilederBorgerinformasjon/VeilederBorgerinformasjon'
import type { Innloggingstype, Visningskriterier } from '@/const'
import { KanVaereAktueltForDeg } from '@/sections/KanVaereAktueltForDeg/KanVaereAktueltForDeg'
import { MeldeFra } from '@/sections/MeldeFra/MeldeFra'
import { RelevanteSoknader } from '@/sections/RelevanteSoknader/RelevanteSoknader'
import getEnv from '@/utils/env'
import { getVisningskriterier } from '@/utils/getVisningskriterier/getVisningskriterier'
import { resolveErrorText } from '@/utils/resolveErrorText/resolveErrorText'
import './layout.css'
import type React from 'react'
import { LukkbarAlert } from '@/components/Alert/LukkbarAlert'
import Brødsmulesti from '@/components/Brødsmulesti/Brødsmulesti'
import { DittVedtak } from '@/sections/DittVedtak/DittVedtak'
import { ForsideBehandlingKort } from '@/sections/ForsideBehandling/ForsideBehandlingKort'
import { toForsideBehandling } from '@/sections/ForsideBehandling/forsideBehandlingUtil'
import { InntektSnarveier } from '@/sections/InntektSnarveier/InntektSnarveier'
import { InterneLenker } from '@/sections/InterneLenker/InterneLenker'
import { Snarveier } from '@/sections/Snarveier/Snarveier'
import EventProvider from '@/utils/dataContextProvider/EventContextProvider'

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
          <VStack gap="space-12" className={'tittel-wrapper'}>
            <Brødsmulesti mode={mode} />
            <Heading size="xlarge" level="1">
              Din uføretrygd
            </Heading>
          </VStack>
          <ForsideBehandlingKort
            behandling={
              initResponse.uforetrygdResponse.behandling
                ? toForsideBehandling(initResponse.uforetrygdResponse.behandling)
                : null
            }
            visningskriterier={visningskriterier}
          />
          <InntektSnarveier
            visningskriterier={visningskriterier}
            pid={params.pid}
            innloggingstype={uforetrygdResponse.innloggingstype as Innloggingstype}
          ></InntektSnarveier>
          <DittVedtak
            pid={params.pid}
            hasIverksattVedtak={uforetrygdResponse.hasIverksattVedtak}
            dittUforevedtak={uforetrygdResponse.uforevedtak}
            sakId={uforesak?.sakId?.toString()}
          />
          <InterneLenker
            visningskriterier={visningskriterier}
            sakId={uforesak?.sakId?.toString()}
            pid={params.pid}
            journalposter={uforetrygdResponse.journalposter}
          ></InterneLenker>
          <Snarveier visningskriterier={visningskriterier} pid={params.pid} uforetrygdResponse={uforetrygdResponse} />
          <MeldeFra visningskriterier={visningskriterier} />
          <RelevanteSoknader
            visningskriterier={visningskriterier}
            innloggingstype={uforetrygdResponse.innloggingstype}
          />
          <KanVaereAktueltForDeg visningskriterier={visningskriterier} />
          <div className={'ux-signals-container'}>
            <div data-uxsignals-embed={'panel-u5y48zl9t7'} className={'ux-signals'}></div>
          </div>
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
