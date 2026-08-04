'use client'

import { FolderFileIcon } from '@navikt/aksel-icons'
import { BodyShort, Box, ExpansionCard, Hide, HStack, VStack } from '@navikt/ds-react'
import { LinkCardIcon } from '@navikt/ds-react/LinkCard'
import { Events } from '@navikt/nav-dekoratoren-moduler'
import type React from 'react'
import { Suspense, use } from 'react'
import { Journalpost } from '@/api/hentJournalposter'
import { DocumentLink } from '@/components/DocumentLink/DocumentLink'
import { getDocumentProxyLink } from '@/components/Dokumenter/getDocumentProxyLink'
import { ReadMoreTile } from '@/components/ReadMoreTile/ReadMoreTile'
import { SortablePaginatedList } from '@/components/SortablePaginatedList/SortablePaginatedList'
import { formatDate } from '@/utils/formatter/formatter'
import { mapOpprettetAv } from '@/components/Dokumenter/mapOpprettetAv'
import { umami } from '@/utils/umami'
import styles from './dokumenterview.module.css'

interface IDokumenterProps {
  pid?: string
  journalposterPromise: Promise<Journalpost[]>
}

export const DokumenterView: React.FC<IDokumenterProps> = ({ pid, journalposterPromise }) => {
  return (
    <ExpansionCard aria-label="Dokumenter knyttet til saken din">
      <ExpansionCard.Header>
        <HStack>
          <Hide below="sm" asChild>
            <Box asChild borderRadius="12" padding="space-8" className={styles.iconBox}>
              <LinkCardIcon>
                <FolderFileIcon className={styles.snarveiIcon} fontSize="2rem" />
              </LinkCardIcon>
            </Box>
          </Hide>
          <VStack className={styles.noTopPadding}>
            <ExpansionCard.Title
              size="small"
              className={styles.dokumenterCardTitle}
              onClick={() => umami(Events.ACCORDION_APNET, { tittel: 'Dokumenter knyttet til saken din' })}
            >
              Dokumenter knyttet til saken din
            </ExpansionCard.Title>
            <ExpansionCard.Description>Brev og informasjon om din uføretrygd</ExpansionCard.Description>
          </VStack>
        </HStack>
      </ExpansionCard.Header>
      <ExpansionCard.Content>
        <Suspense fallback={null}>
          <DokumenterListe pid={pid} journalposterPromise={journalposterPromise} />
        </Suspense>
      </ExpansionCard.Content>
    </ExpansionCard>
  )
}

const DokumenterListe = ({ pid, journalposterPromise }: IDokumenterProps) => {
  const råJournalposter = use(journalposterPromise)

  const journalposter = råJournalposter.map((journalpost) => {
    const formattedDate = formatDate(journalpost.opprettetDato)
    if (!formattedDate) throw Error('Invalid date')

    return {
      tittel: journalpost.tittel ?? '',
      formattedDate: formattedDate,
      createdBy: mapOpprettetAv(journalpost.opprettetAv),
      sortDate: journalpost.opprettetDato ?? '',
      id: journalpost.id ?? '',
      dokumenter: (journalpost.dokumenter ?? [])
        .filter((d) => d.tittel !== undefined && d.dokumentInfoId !== undefined)
        .map((d) => ({
          tittel: d.tittel as string,
          dokumentInfoId: d.dokumentInfoId as string,
          filstorrelse: d.filstorrelse,
          variant: d.variant as string,
        })),
    }
  })

  return (
    <SortablePaginatedList
      items={journalposter}
      itemsPerPage={6}
      itemTypeName="dokumenter"
      renderItemAction={(journalpost) => {
        const [hoveddokument, ...vedlegg] = journalpost.dokumenter
        return (
          <ReadMoreTile
            key={journalpost.sortDate}
            content={
              <VStack gap="space-16" className={styles.readMoreOpened}>
                <DocumentLink
                  href={getDocumentProxyLink(journalpost.id, hoveddokument.dokumentInfoId, hoveddokument.variant, pid)}
                  fileSize={hoveddokument.filstorrelse}
                >
                  Åpne {hoveddokument.tittel.toLowerCase()}
                </DocumentLink>
                <VStack gap="space-8">
                  {vedlegg.length > 0 && (
                    <BodyShort size="medium" weight="semibold">
                      Vedlegg
                    </BodyShort>
                  )}
                  {vedlegg.map((vedlegg) => (
                    <DocumentLink
                      key={vedlegg.dokumentInfoId}
                      href={getDocumentProxyLink(journalpost.id, vedlegg.dokumentInfoId, vedlegg.variant, pid)}
                      fileSize={vedlegg.filstorrelse}
                    >
                      {vedlegg.tittel}
                    </DocumentLink>
                  ))}
                </VStack>
              </VStack>
            }
          >
            <BodyShort size="medium" weight="semibold">
              {journalpost.tittel}
            </BodyShort>
            <BodyShort size="small">
              {journalpost.formattedDate} {journalpost.createdBy && `- fra ${journalpost.createdBy}`}
            </BodyShort>
          </ReadMoreTile>
        )
      }}
    />
  )
}
