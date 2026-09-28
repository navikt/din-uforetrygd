import { Alert, Heading } from '@navikt/ds-react'
import { TaskAnalytics } from '@/components/TaskAnalytics/TaskAnalytics'
import { KanVaereAktueltForDeg } from '@/sections/KanVaereAktueltForDeg/KanVaereAktueltForDeg'
import { MeldeFra } from '@/sections/MeldeFra/MeldeFra'
import { RelevanteSoknader } from '@/sections/RelevanteSoknader/RelevanteSoknader'
import { getVisningskriterier } from '@/utils/getVisningskriterier/getVisningskriterier'
import { resolveErrorText } from '@/utils/resolveErrorText/resolveErrorText'
import type React from 'react'
import { hentDittUforevedtak } from '@/api/hentDittUforevedtak'
import { hentHarMottattVarsel } from '@/api/hentHarMottattVarsel'
import { initate } from '@/api/initiate'
import { env } from '@/env'
import { ForsideBehandlingKort } from '@/sections/ForsideBehandling/ForsideBehandlingKort'
import { toForsideBehandling } from '@/sections/ForsideBehandling/forsideBehandlingUtil'
import { InntektSnarveier } from '@/sections/InntektSnarveier/InntektSnarveier'
import { InterneLenker } from '@/sections/InterneLenker/InterneLenker'
import { Snarveier } from '@/sections/Snarveier/Snarveier'
import { isEnabled } from '@/utils/unleash'
import { sjekkOmErVerge } from '@/api/sjekkOmErVerge'
import { Vedtaksdetaljer } from '@/sections/DittVedtak/Vedtaksdetaljer'
import { leggTilPidHvisVeileder } from '@/utils/getUrl/getUrl'
import { MinIdDokumentModal } from '@/components/MidIdDokumentModal/MinIdDokumentModal'

interface Props {
  searchParams: Promise<{ pid?: string }>
}

const Home: React.FC<Props> = async ({ searchParams }) => {
  const { pid } = await searchParams
  const uforevedtakPromise = hentDittUforevedtak(pid)
  const erVergePromise = sjekkOmErVerge(pid || '')
  const [initiateResponse, harMottattVarsel, dineMuligheterIsEnabled, barnetilleggIsEnabled, uforegradIsEnabled] =
    await Promise.all([
      initate(pid),
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
      <InntektSnarveier visningskriterier={visningskriterier} pid={pid} />
      {uforetrygdResponse.hasIverksattVedtak && (
        <Vedtaksdetaljer
          dittUforevedtakPromise={uforevedtakPromise}
          sakId={uforetrygdResponse.sak?.sakId}
          linkInntektsplanlegger={leggTilPidHvisVeileder(env('LINK_INNTEKTSPLANLEGGER'), pid)}
          arstall={new Date().getFullYear()}
        />
      )}
      <InterneLenker visningskriterier={visningskriterier} sakId={uforetrygdResponse.sak?.sakId} pid={pid} />
      <Snarveier
        visningskriterier={visningskriterier}
        pid={pid}
        skalViseDineMuligheter={dineMuligheterIsEnabled && harMottattVarsel}
        erVergePromise={erVergePromise}
      />
      <MeldeFra visningskriterier={visningskriterier} />
      <RelevanteSoknader visningskriterier={visningskriterier} innloggingstype={uforetrygdResponse.innloggingstype} />
      <KanVaereAktueltForDeg visningskriterier={visningskriterier} />
      <div className={'ux-signals-container'}>
        <div data-uxsignals-embed={'panel-u5y48zl9t7'} className={'ux-signals'} suppressHydrationWarning></div>
      </div>
      <MinIdDokumentModal innloggingstype={uforetrygdResponse.innloggingstype} />
    </>
  )
}

export default Home
