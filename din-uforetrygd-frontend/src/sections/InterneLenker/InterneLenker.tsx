import { Visningskriterier } from '@/const'
import React from 'react'
import { Box, Hide, LinkCard, VStack } from '@navikt/ds-react'
import { LinkCardAnchor, LinkCardDescription, LinkCardIcon, LinkCardTitle } from '@navikt/ds-react/LinkCard'
import { FilesIcon } from '@navikt/aksel-icons'
import { matchSome } from '@/utils/filterShowFor'
import styles from './interneLenker.module.css'
import { Dokumenter } from '@/components/Dokumenter'
import { components } from '@/api/api'
import { isEnabled } from '@/utils/unleash'

interface InterneLenkerProps {
  visningskriterier: Visningskriterier[]
  sakId: string | undefined
  pid?: string
  journalposter: components['schemas']['Journalpost'][]
}

export const InterneLenker: React.FC<InterneLenkerProps> = async ({ visningskriterier, sakId, pid, journalposter }) => {
  const visSaksoversikt = await isEnabled('din.uforetrygd.saksoversikt')

  return (
    <>
      {matchSome([
        Visningskriterier.SakTilBehandling,
        Visningskriterier.Uforetrygd,
        Visningskriterier.AvsluttetUforetrygdSak,
      ])(visningskriterier) && (
        <section aria-label="Interne lenker til saksoversikt og dokumentoversikt">
          <VStack gap="space-24">
            {visSaksoversikt && (
              <LinkCard>
                <Hide below="sm" asChild>
                  <Box asChild borderRadius="12" padding="space-8" className={styles.iconBox}>
                    <LinkCardIcon>
                      <FilesIcon className={styles.snarveiIcon} fontSize="2rem" />
                    </LinkCardIcon>
                  </Box>
                </Hide>
                <LinkCardTitle>
                  <LinkCardAnchor href={`/uforetrygd/selvbetjening/saksoversikt?saksid=${sakId?.toString()}`}>
                    Saksoversikt
                  </LinkCardAnchor>
                </LinkCardTitle>
                <LinkCardDescription>Behandlinger knyttet til saken din</LinkCardDescription>
              </LinkCard>
            )}
            <Dokumenter pid={pid} journalposter={journalposter!} />
          </VStack>
        </section>
      )}
    </>
  )
}
