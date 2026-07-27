import { FilesIcon } from '@navikt/aksel-icons'
import { Box, Hide, LinkCard, VStack } from '@navikt/ds-react'
import { LinkCardAnchor, LinkCardDescription, LinkCardIcon, LinkCardTitle } from '@navikt/ds-react/LinkCard'
import type React from 'react'
import type { Journalpost } from '@/api/initiate'
import { Dokumenter } from '@/components/Dokumenter/Dokumenter'
import { Visningskriterier } from '@/const'
import getEnv from '@/utils/env'
import { matchSome } from '@/utils/filterShowFor/filterShowFor'
import styles from './interneLenker.module.css'

interface InterneLenkerProps {
  visningskriterier: Visningskriterier[]
  sakId: string | undefined
  pid?: string
  journalposter: Journalpost[]
}

export const InterneLenker: React.FC<InterneLenkerProps> = async ({ visningskriterier, sakId, pid, journalposter }) => {
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
            <Dokumenter pid={pid} journalposter={journalposter!} />
          </VStack>
        </section>
      )}
    </>
  )
}
