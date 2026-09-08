import type { DittUforevedtak } from '@/api/hentDittUforevedtak'
import { env } from '@/env'
import { Vedtaksdetaljer } from '@/sections/DittVedtak/Vedtaksdetaljer'
import { leggTilPidHvisVeileder } from '@/utils/getUrl/getUrl'

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
        linkInntektsplanlegger={leggTilPidHvisVeileder(env().LINK_INNTEKTSPLANLEGGER, pid)}
        arstall={new Date().getFullYear()}
      />
    </section>
  )
}
