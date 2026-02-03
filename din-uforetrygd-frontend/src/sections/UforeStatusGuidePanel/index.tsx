import { Visningskriterier } from '@/const'
import { UforestatusGuidePanelView } from './UforestatusGuidePanelView'
import { getUrl } from '@/utils/getUrl'

interface IUforestatusGuideProps {
  visningskriterier: Visningskriterier[]
}

const UforestatusGuidePanel: React.FC<IUforestatusGuideProps> = async (props) => {
  const dittLokaleNavKontorLenke = await getUrl({ urlFromEnv: 'LINK_DITT_LOKALE_NAV_KONTOR' })
  const saksbehandlingstiderLenke = await getUrl({ urlFromEnv: 'LINK_SAKSBEHANDLINGSTIDER_UFORETRYGD' })

  return (
    <UforestatusGuidePanelView
      visningskriterier={props.visningskriterier}
      dittLokaleNavKontorLenke={dittLokaleNavKontorLenke}
      saksbehandlingstiderLenke={saksbehandlingstiderLenke}
    />
  )
}

export default UforestatusGuidePanel
