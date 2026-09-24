import { HGrid } from '@navikt/ds-react'
import type React from 'react'
import { MinIdDokumentModal } from '@/components/MidIdDokumentModal/MinIdDokumentModal'
import type { Innloggingstype, Visningskriterier } from '@/const'
import filterShowFor from '@/utils/filterShowFor/filterShowFor'
import { Lenkekort } from '@/components/SnarveiPanel/Lenkekort'

interface ISnarveiPanelProps {
  links: ILink[]
  visningskriterier: Visningskriterier[]
  pid: string | undefined
  innloggingstype: Innloggingstype
}

interface ILink {
  href: string | undefined
  title: string
  description: string
  icon: React.ReactNode
  showFor: ((visningskriterier: Visningskriterier[]) => boolean) | boolean
  showFullmaktWarning?: boolean
  visInnloggingsModal?: boolean
  disabled?: boolean
}

export const SnarveiPanel: React.FC<ISnarveiPanelProps> = async (props) => {
  const relevantLinks = filterShowFor(props.visningskriterier, props.links)

  return (
    <>
      {relevantLinks.length > 0 && (
        <HGrid gap="space-24" columns={{ md: 2 }}>
          {relevantLinks.map((link) => (
            <Lenkekort
              key={link.title}
              tittel={link.title}
              undertittel={link.description}
              icon={link.icon}
              innloggingstype={props.innloggingstype}
              href={link.href}
              visFullmaktmodal={link.showFullmaktWarning}
              visInnloggingsmodal={link.visInnloggingsModal}
              disabled={link.disabled}
            />
          ))}

          <MinIdDokumentModal innloggingstype={props.innloggingstype} />
        </HGrid>
      )}
    </>
  )
}
