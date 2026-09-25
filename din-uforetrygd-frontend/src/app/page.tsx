import { Alert, Heading, VStack } from '@navikt/ds-react'
import { TaskAnalytics } from '@/components/TaskAnalytics/TaskAnalytics'
import type { Visningskriterier } from '@/const'
import { KanVaereAktueltForDeg } from '@/sections/KanVaereAktueltForDeg/KanVaereAktueltForDeg'
import { MeldeFra } from '@/sections/MeldeFra/MeldeFra'
import { RelevanteSoknader } from '@/sections/RelevanteSoknader/RelevanteSoknader'
import { getVisningskriterier } from '@/utils/getVisningskriterier/getVisningskriterier'
import { resolveErrorText } from '@/utils/resolveErrorText/resolveErrorText'
import './layout.css'
import type React from 'react'
import { hentDittUforevedtak } from '@/api/hentDittUforevedtak'
import { hentHarMottattVarsel } from '@/api/hentHarMottattVarsel'
import { initate } from '@/api/initiate'
import { env } from '@/env'
import { DittVedtak } from '@/sections/DittVedtak/DittVedtak'
import { ForsideBehandlingKort } from '@/sections/ForsideBehandling/ForsideBehandlingKort'
import { toForsideBehandling } from '@/sections/ForsideBehandling/forsideBehandlingUtil'
import { InntektSnarveier } from '@/sections/InntektSnarveier/InntektSnarveier'
import { InterneLenker } from '@/sections/InterneLenker/InterneLenker'
import { Snarveier } from '@/sections/Snarveier/Snarveier'
import { isEnabled } from '@/utils/unleash'
import { sjekkOmErVerge } from '@/api/sjekkOmErVerge'

interface IHomeProps {
  searchParams: Promise<{ pid?: string }>
}

const Home: React.FC<IHomeProps> = async ({ searchParams }) => {
  const params = await searchParams
  const uforevedtakPromise = hentDittUforevedtak(params.pid)
  const erVergePromise = sjekkOmErVerge(params.pid || '')
  const [initiateResponse, harMottattVarsel, dineMuligheterIsEnabled, barnetilleggIsEnabled, uforegradIsEnabled] =
    await Promise.all([
      initate(params.pid),
      hentHarMottattVarsel(),
      isEnabled('din-uforetrygd.dine-muligheter'),
      isEnabled('din-uforetrygd.barnetillegg'),
      isEnabled('din-uforetrygd.statusUforegrad'),
    ])

  if (initiateResponse.backendError) {
    return (
      <Alert variant="error" role="alert">
        {resolveErrorText(initiateResponse.backendError?.message)}
      </Alert>
    )
  }

  const uforetrygdResponse = initiateResponse.uforetrygdResponse
  const visningskriterier = getVisningskriterier(uforetrygdResponse)

  return (
    <>
      <TaskAnalytics id="03419" shouldRun={env('MODE') === 'borger'} />
      <Heading size="xlarge" level="1">
        Din uføretrygd
      </Heading>

      <ForsideBehandlingKort
        behandling={
          uforetrygdResponse.behandling
            ? toForsideBehandling(uforetrygdResponse.behandling, barnetilleggIsEnabled, uforegradIsEnabled)
            : null
        }
        visningskriterier={visningskriterier}
      />
      <InntektSnarveier
        visningskriterier={visningskriterier}
        innloggingstype={uforetrygdResponse.innloggingstype}
        pid={params.pid}
      />
      <DittVedtak
        pid={params.pid}
        hasIverksattVedtak={uforetrygdResponse.hasIverksattVedtak}
        uforevedtakPromise={uforevedtakPromise}
        sakId={uforetrygdResponse.sak?.sakId}
      />
      <InterneLenker visningskriterier={visningskriterier} sakId={uforetrygdResponse.sak?.sakId} pid={params.pid} />
      <Snarveier
        visningskriterier={visningskriterier}
        pid={params.pid}
        innloggingstype={uforetrygdResponse.innloggingstype}
        skalViseDineMuligheter={dineMuligheterIsEnabled && harMottattVarsel}
        erVergePromise={erVergePromise}
      />
      <MeldeFra visningskriterier={visningskriterier} />
      <RelevanteSoknader visningskriterier={visningskriterier} innloggingstype={uforetrygdResponse.innloggingstype} />
      <KanVaereAktueltForDeg visningskriterier={visningskriterier} />
      <div className={'ux-signals-container'}>
        <div data-uxsignals-embed={'panel-u5y48zl9t7'} className={'ux-signals'} suppressHydrationWarning></div>
      </div>
    </>
  )
}

export default Home
