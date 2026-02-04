import { Box, HGrid, Hide, LinkCard } from '@navikt/ds-react'

import { Innloggingstype, Visningskriterier } from '@/const'
import filterShowFor from '@/utils/filterShowFor/filterShowFor'
import { MinIdDokumentModal } from '@/components/MidIdDokumentModal/MinIdDokumentModal'
import { LinkCardAnchor, LinkCardDescription, LinkCardIcon, LinkCardTitle } from '@navikt/ds-react/LinkCard'
import React from 'react'
import { getFullmaktProps } from '@/utils/fullmakt'
import { showMinIdModal } from '@/utils/showMinIdModal/showMinIdModal'
import styles from './snarveiPanel.module.css'

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
  showFullmaktWarning: boolean
  visInnloggingsModal: boolean
}

export const SnarveiPanel: React.FC<ISnarveiPanelProps> = async (props) => {
  const relevantLinks = filterShowFor(props.visningskriterier, props.links)
  return (
    <>
      {relevantLinks.length > 0 && (
        <HGrid gap="space-24" columns={{ md: 2 }}>
          {relevantLinks.map((link) => (
            <LinkCard key={link.title}>
              <Hide below="sm" asChild>
                <Box asChild className={styles.iconBox} borderRadius="8" padding="space-8">
                  <LinkCardIcon>{link.icon}</LinkCardIcon>
                </Box>
              </Hide>
              <LinkCardTitle>
                <LinkCardAnchor
                  href={link.href!}
                  {...getFullmaktProps(link.showFullmaktWarning)}
                  {...showMinIdModal(props.innloggingstype, link.visInnloggingsModal)}
                >
                  {link.title}
                </LinkCardAnchor>
              </LinkCardTitle>
              <LinkCardDescription>{link.description}</LinkCardDescription>
            </LinkCard>
          ))}
          <MinIdDokumentModal innloggingstype={props.innloggingstype} />
        </HGrid>
      )}
    </>
  )
}
