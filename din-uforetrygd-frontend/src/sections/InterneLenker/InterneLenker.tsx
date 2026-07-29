import { FilesIcon } from '@navikt/aksel-icons'
import { Box, Hide, LinkCard, VStack } from '@navikt/ds-react'
import { LinkCardAnchor, LinkCardDescription, LinkCardIcon, LinkCardTitle } from '@navikt/ds-react/LinkCard'
import { Suspense } from 'react'
import type React from 'react'
import { Dokumenter } from '@/components/Dokumenter/Dokumenter'
import { Visningskriterier } from '@/const'
import getEnv from '@/utils/env'
import { matchSome } from '@/utils/filterShowFor/filterShowFor'
import styles from './interneLenker.module.css'
import { ExpansionCard } from '@navikt/ds-react/ExpansionCard'

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
            <Suspense fallback="TODO: skeleton eller noe">
              <Dokumenter pid={pid} />
            </Suspense>
          </VStack>
        </section>
      )}
    </>
  )
}
