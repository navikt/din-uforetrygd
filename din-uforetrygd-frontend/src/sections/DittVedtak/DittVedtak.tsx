import type { DittUforevedtak } from '@/api/hentDittUforevedtak'
import { Vedtaksdetaljer } from '@/sections/DittVedtak/Vedtaksdetaljer'
import { leggTilPidHvisVeileder } from '@/utils/getUrl/getUrl'
import { serverEnv } from '@/env'

interface IDittVedtak {
  pid?: string
  hasIverksattVedtak: boolean
  uforevedtakPromise: Promise<DittUforevedtak | null>
  sakId?: string
}

export const DittVedtak: React.FC<IDittVedtak> = async ({ pid, hasIverksattVedtak, uforevedtakPromise, sakId }) => {
  if (!hasIverksattVedtak) {
    return null
  }

  return (
    <section aria-label="Detaljer om saken din">
      <Vedtaksdetaljer
        dittUforevedtakPromise={uforevedtakPromise}
        sakId={sakId}
        linkInntektsplanlegger={leggTilPidHvisVeileder(serverEnv.LINK_INNTEKTSPLANLEGGER, pid)}
        arstall={new Date().getFullYear()}
      />
    </section>
  )
}
