import type React from 'react'
import { Box, Hide, LinkCard } from '@navikt/ds-react'
import styles from '@/components/Lenkekort/lenkekort.module.css'
import { LinkCardAnchor, LinkCardDescription, LinkCardIcon, LinkCardTitle } from '@navikt/ds-react/LinkCard'
import { getFullmaktProps } from '@/utils/fullmakt'
import { showMinIdModal } from '@/components/MidIdDokumentModal/showMinIdModal'

interface Props {
  tittel: string
  undertittel: string
  href?: string
  icon: React.ReactNode
  visFullmaktmodal?: boolean
  visInnloggingsmodal?: boolean
  disabled?: boolean
}

export const Lenkekort: React.FC<Props> = ({
  tittel,
  undertittel,
  href,
  icon,
  visFullmaktmodal = false,
  visInnloggingsmodal = false,
  disabled = false,
}) => {
  return (
    <LinkCard className={disabled ? styles.disabled : undefined}>
      <Hide below="sm" asChild>
        <Box asChild className={styles.iconBox} borderRadius="8" padding="space-8">
          <LinkCardIcon className={styles.icon}>{icon}</LinkCardIcon>
        </Box>
      </Hide>
      <LinkCardTitle>
        {disabled ? (
          tittel
        ) : (
          <LinkCardAnchor
            href={href || ''}
            {...getFullmaktProps(visFullmaktmodal)}
            {...showMinIdModal(visInnloggingsmodal)}
          >
            {tittel}
          </LinkCardAnchor>
        )}
      </LinkCardTitle>
      <LinkCardDescription>{undertittel}</LinkCardDescription>
    </LinkCard>
  )
}
