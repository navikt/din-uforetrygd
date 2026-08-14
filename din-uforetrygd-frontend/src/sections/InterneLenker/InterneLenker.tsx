import { FilesIcon, FolderFileIcon } from '@navikt/aksel-icons'
import { Box, Hide, LinkCard, VStack } from '@navikt/ds-react'
import { LinkCardAnchor, LinkCardDescription, LinkCardIcon, LinkCardTitle } from '@navikt/ds-react/LinkCard'
import type React from 'react'
import { Visningskriterier } from '@/const'
import getEnv from '@/utils/env'
import { matchSome } from '@/utils/filterShowFor/filterShowFor'
import styles from './interneLenker.module.css'

interface InterneLenkerProps {
  visningskriterier: Visningskriterier[]
  sakId: string | undefined
  pid?: string
}

export const InterneLenker: React.FC<InterneLenkerProps> = async ({ visningskriterier, sakId, pid }) => {
  const mode = getEnv('MODE')

  return (
    <>
      {matchSome([
        Visningskriterier.SakTilBehandling,
        Visningskriterier.Uforetrygd,
        Visningskriterier.AvsluttetUforetrygdSak,
      ])(visningskriterier) && (
        <section aria-label="Interne lenker til saksoversikt og dokumentoversikt">
          <VStack gap="space-24">
            <LinkCard>
              <Hide below="sm" asChild>
                <Box asChild borderRadius="12" padding="space-8" className={styles.iconBox}>
                  <LinkCardIcon>
                    <FilesIcon className={styles.snarveiIcon} fontSize="2rem" />
                  </LinkCardIcon>
                </Box>
              </Hide>
              <LinkCardTitle>
                <LinkCardAnchor
                  href={`/uforetrygd/selvbetjening/saksoversikt?saksid=${sakId?.toString()}${mode === 'veileder' ? `&pid=${pid}` : ''}`}
                >
                  Saksoversikt
                </LinkCardAnchor>
              </LinkCardTitle>
              <LinkCardDescription>Behandlinger knyttet til saken din</LinkCardDescription>
            </LinkCard>
            <LinkCard>
              <Hide below="sm" asChild>
                <Box asChild borderRadius="12" padding="space-8" className={styles.iconBox}>
                  <LinkCardIcon>
                    <FolderFileIcon className={styles.snarveiIcon} fontSize="2rem" />
                  </LinkCardIcon>
                </Box>
              </Hide>
              <LinkCardTitle>
                <LinkCardAnchor
                  href={`/uforetrygd/selvbetjening/dokumenter${mode === 'veileder' ? `?pid=${pid}` : ''}`}
                >
                  Dokumenter knyttet til saken din
                </LinkCardAnchor>
              </LinkCardTitle>
              <LinkCardDescription>Brev og informasjon om din uføretrygd</LinkCardDescription>
            </LinkCard>
          </VStack>
        </section>
      )}
    </>
  )
}
