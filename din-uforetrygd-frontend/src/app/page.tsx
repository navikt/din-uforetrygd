import { Alert, BodyLong, Heading, VStack } from '@navikt/ds-react'
import { RelevanteSoknader } from '@/sections/RelevanteSoknader/RelevanteSoknader'
import { Innloggingstype, Visningskriterier } from '@/const'
import { KanVaereAktueltForDeg } from '@/sections/KanVaereAktueltForDeg/KanVaereAktueltForDeg'
import { MeldeFra } from '@/sections/MeldeFra/MeldeFra'
import { getVisningskriterier } from '@/utils/getVisningskriterier/getVisningskriterier'
import { initate } from '@/api/endpoints'
import { VeilederBorgerinformasjon } from '@/components/VeilederBorgerinformasjon/VeilederBorgerinformasjon'
import { resolveErrorText } from '@/utils/resolveErrorText/resolveErrorText'
import { TaskAnalytics } from '@/components/TaskAnalytics/TaskAnalytics'
import getEnv from '@/utils/env'
import './layout.css'
import EventProvider from '@/utils/dataContextProvider/EventContextProvider'
import UforestatusGuidePanel from '@/sections/UforeStatusGuidePanel/UforestatusGuidePanel'
import Brødsmulesti from '@/components/Brødsmulesti/Brødsmulesti'
import React from 'react'
import { InntektSnarveier } from '@/sections/InntektSnarveier/InntektSnarveier'
import { Snarveier } from '@/sections/Snarveier/Snarveier'
import { InterneLenker } from '@/sections/InterneLenker/InterneLenker'
import { LukkbarAlert } from '@/components/Alert/LukkbarAlert'
import { Behandling } from '@/sections/Behandling/Behandling'
import { toForsideBehandling } from '@/sections/Behandling/behandlingUtil'
import { isEnabled } from '@/utils/unleash'
import { DittVedtak } from '@/sections/DittVedtak/DittVedtak'

interface IHomeProps {
  searchParams: Promise<{ pid?: string }>
}

const Home: React.FC<IHomeProps> = async ({ searchParams }) => {
  const params = await searchParams
  const initResponse = await initate(params.pid)
  const uforetrygdResponse = initResponse.uforetrygdResponse
  const visBehandling = await isEnabled('din.uforetrygd.forside.behandling')

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
            <Brødsmulesti brødsmuler={[{ tittel: 'Din uføretrygd', url: '/uforetrygd/selvbetjening' }]} />
            <Heading size="xlarge" level="1">
              Din uføretrygd
            </Heading>
          </VStack>
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
          {visBehandling ? (
            <Behandling
              behandling={
                initResponse.uforetrygdResponse.behandling
                  ? toForsideBehandling(initResponse.uforetrygdResponse.behandling)
                  : null
              }
              visningskriterier={visningskriterier}
            />
          ) : (
            <UforestatusGuidePanel visningskriterier={visningskriterier} />
          )}
          <InntektSnarveier
            visningskriterier={visningskriterier}
            pid={params.pid}
            innloggingstype={uforetrygdResponse.innloggingstype as Innloggingstype}
          ></InntektSnarveier>
          <DittVedtak
            pid={params.pid}
            hasIverksattVedtak={uforetrygdResponse.hasIverksattVedtak!}
            dittUforevedtak={uforetrygdResponse.uforevedtak}
            sakId={uforesak?.sakId?.toString()}
          />
          <InterneLenker
            visningskriterier={visningskriterier}
            sakId={uforesak?.sakId?.toString()}
            pid={params.pid}
            journalposter={uforetrygdResponse.journalposter!}
          ></InterneLenker>
          <Snarveier visningskriterier={visningskriterier} pid={params.pid} uforetrygdResponse={uforetrygdResponse} />
          <MeldeFra visningskriterier={visningskriterier} />
          <RelevanteSoknader
            visningskriterier={visningskriterier}
            innloggingstype={uforetrygdResponse.innloggingstype!}
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
