import { Visningskriterier } from '@/const'
import { UforestatusGuidePanelView } from './UforestatusGuidePanelView'
import { getUrl } from '@/utils/getUrl'
import { isEnabled } from '@/utils/unleash'

interface IUforestatusGuideProps {
  visningskriterier: Visningskriterier[]
}

const UforestatusGuidePanel: React.FC<IUforestatusGuideProps> = async (props) => {
  const dittLokaleNavKontorLenke = await getUrl({ urlFromEnv: 'LINK_DITT_LOKALE_NAV_KONTOR' })
  const saksbehandlingstiderLenke = await getUrl({ urlFromEnv: 'LINK_SAKSBEHANDLINGSTIDER_UFORETRYGD' })
  const visBehandling = await isEnabled('din.uforetrygd.forside.behandling')

  return (
    !visBehandling && (
      <UforestatusGuidePanelView
        visningskriterier={props.visningskriterier}
        dittLokaleNavKontorLenke={dittLokaleNavKontorLenke}
        saksbehandlingstiderLenke={saksbehandlingstiderLenke}
      />
    )
  )
}

export default UforestatusGuidePanel
