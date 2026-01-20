import { Visningskriterier } from '@/const'
import React from 'react'
import { Box, LinkCard, VStack } from '@navikt/ds-react'
import { LinkCardAnchor, LinkCardDescription, LinkCardIcon, LinkCardTitle } from '@navikt/ds-react/LinkCard'
import { FilesIcon, FolderFileIcon } from '@navikt/aksel-icons'
import { matchSome } from '@/utils/filterShowFor'
import styles from './interneLenker.module.css'

interface InterneLenkerProps {
  visningskriterier: Visningskriterier[]
  sakId: string | undefined
}

export const InterneLenker: React.FC<InterneLenkerProps> = async ({ visningskriterier, sakId }) => {
  return (
    <>
      {matchSome([
        Visningskriterier.SakTilBehandling,
        Visningskriterier.Uforetrygd,
        Visningskriterier.AvsluttetUforetrygdSak,
      ])(visningskriterier) && (
        <section aria-label="Interne lenker til saksoversikt og dokumentoversikt">
          <VStack gap="6">
            <LinkCard>
              <Box
                asChild
                borderRadius="12"
                padding="space-8"
                className={styles.iconBox}
              >
                <LinkCardIcon>
                  <FilesIcon className={styles.snarveiIcon} fontSize="2rem" />
                </LinkCardIcon>
              </Box>
              <LinkCardTitle>
                <LinkCardAnchor href={`/uforetrygd/selvbetjening/saksoversikt?saksid=${sakId?.toString()}`}>
                  Saksoversikt
                </LinkCardAnchor>
              </LinkCardTitle>
              <LinkCardDescription>Hendelser knyttet til saken din</LinkCardDescription>
            </LinkCard>
            <LinkCard>
              <Box
                asChild
                borderRadius="12"
                padding="space-8"
                className={styles.iconBox}
              >
                <LinkCardIcon>
                  <FolderFileIcon className={styles.snarveiIcon} fontSize="2rem" />
                </LinkCardIcon>
              </Box>
              <LinkCardTitle>
                <LinkCardAnchor href={`/uforetrygd/selvbetjening/saksoversikt?saksid=${sakId?.toString()}`}>
                  Dokumenter knyttet til saken
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
