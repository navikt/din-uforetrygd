import type { components } from '@/api/api'
import { Vedtaksdetaljer } from '@/sections/DittVedtak/Vedtaksdetaljer'
import { getUrl } from '@/utils/getUrl/getUrl'

interface IDittVedtak {
  pid?: string
  hasIverksattVedtak: boolean
  dittUforevedtak?: components['schemas']['DittUforevedtak']
  sakId?: string
}

export const DittVedtak: React.FC<IDittVedtak> = async ({ pid, hasIverksattVedtak, dittUforevedtak, sakId }) => {
  if (!hasIverksattVedtak) {
    return null
  }
  const linkInntektsplanlegger = await getUrl({ urlFromEnv: 'LINK_INNTEKTSPLANLEGGER', pid: pid })

  return (
    <section aria-label="Detaljer om saken din">
      <Vedtaksdetaljer
        dittUforevedtak={dittUforevedtak!}
        sakId={sakId}
        linkInntektsplanlegger={linkInntektsplanlegger}
        arstall={new Date().getFullYear()}
      />
    </section>
  )
}
