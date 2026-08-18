'use client'

import { BodyLong, BodyShort, ExpansionCard, Heading, VStack } from '@navikt/ds-react'
import type { Journalpost } from '@/api/hentJournalposter'
import { DocumentLink } from '@/components/DocumentLink/DocumentLink'
import { readableFileSize } from '@/components/DocumentLink/utils'
import { SortablePaginatedList } from '@/components/SortablePaginatedList/SortablePaginatedList'
import { getDocumentProxyLink } from '@/sections/Dokumentoversikt/getDocumentProxyLink'
import { mapOpprettetAv } from '@/sections/Dokumentoversikt/mapOpprettetAv'
import { formatDate } from '@/utils/formatter/formatter'
import styles from './Dokumentoversikt.module.css'

interface DokumentoversiktProps {
  pid?: string
  raaJournalposter: Journalpost[]
}

export const Dokumentoversikt = ({ pid, raaJournalposter }: DokumentoversiktProps) => {
  const journalposter = raaJournalposter.map((journalpost) => {
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
    <section className={styles.dokumenterContent}>
      <VStack gap="space-36">
        <Heading size="large" level="2">
          Dokumenter knyttet til saken din
        </Heading>
        <VStack gap="space-16">
          <SortablePaginatedList
            items={journalposter}
            itemsPerPage={6}
            itemTypeName="dokumenter"
            renderItemAction={(journalpost) => {
              const [hoveddokument, ...vedlegg] = journalpost.dokumenter
              return (
                <ExpansionCard aria-label="Dokumenter knyttet til saken din">
                  <ExpansionCard.Header>
                    <ExpansionCard.Title as="h2" size="small">
                      {journalpost.tittel}
                    </ExpansionCard.Title>
                    <ExpansionCard.Description>
                      {journalpost.formattedDate} {journalpost.createdBy && `- Fra ${journalpost.createdBy}`}
                    </ExpansionCard.Description>
                  </ExpansionCard.Header>
                  <ExpansionCard.Content>
                    <VStack gap="space-24">
                      <div className={`${styles.document} ${styles.vedtak}`}>
                        <DocumentLink
                          href={getDocumentProxyLink(
                            journalpost.id,
                            hoveddokument.dokumentInfoId,
                            hoveddokument.variant,
                            pid
                          )}
                          fileSize={hoveddokument.filstorrelse}
                        >
                          {hoveddokument.tittel}
                        </DocumentLink>
                        <BodyLong size="small" className={styles.description}>
                          {journalpost.formattedDate} {journalpost.createdBy && `- Fra ${journalpost.createdBy}`}
                        </BodyLong>
                      </div>
                      <div className={styles.vedlegg}>
                        {vedlegg.length > 0 && (
                          <BodyShort size="medium" weight="semibold">
                            Vedlegg
                          </BodyShort>
                        )}
                        {vedlegg.map((vedlegg) => (
                          <div className={styles.document} key={vedlegg.dokumentInfoId}>
                            <DocumentLink
                              key={vedlegg.dokumentInfoId}
                              href={getDocumentProxyLink(journalpost.id, vedlegg.dokumentInfoId, vedlegg.variant, pid)}
                              fileSize={vedlegg.filstorrelse}
                            >
                              {vedlegg.tittel}
                            </DocumentLink>
                            <BodyLong size="small" className={styles.description}>
                              {readableFileSize(vedlegg.filstorrelse ?? 0)}
                            </BodyLong>
                          </div>
                        ))}
                      </div>
                    </VStack>
                  </ExpansionCard.Content>
                </ExpansionCard>
              )
            }}
          />
        </VStack>
      </VStack>
    </section>
  )
}
