import type { DittUforevedtak } from '@/api/hentDittUforevedtak'
import { getUrl } from '@/utils/getUrl/getUrl'
import { isEnabled } from '@/utils/unleash'
import { Suspense } from 'react'
import { Vedtaksdetaljer } from '@/sections/DittVedtak/Vedtaksdetaljer'

interface IDittVedtak {
  pid?: string
  hasIverksattVedtak: boolean
  uforevedtakPromise: Promise<DittUforevedtak | null>
  sakId?: string
}

export const DittVedtak: React.FC<IDittVedtak> = async ({ pid, hasIverksattVedtak, uforevedtakPromise, sakId }) => {
  const regelverksendringerJuli2026 = await isEnabled('inntektsplanleggeren.regelverksendringer.tekst')

  if (!hasIverksattVedtak) {
    return null
  }
  const linkInntektsplanlegger = await getUrl({ urlFromEnv: 'LINK_INNTEKTSPLANLEGGER', pid: pid })

  return (
    <section aria-label="Detaljer om saken din">
      {/*<Suspense fallback={null}>*/}
      <Vedtaksdetaljer
        dittUforevedtakPromise={uforevedtakPromise}
        sakId={sakId}
        linkInntektsplanlegger={linkInntektsplanlegger}
        arstall={new Date().getFullYear()}
        regelverksendringerJuli2026={regelverksendringerJuli2026}
      />
      {/*</Suspense>*/}
    </section>
  )
}
