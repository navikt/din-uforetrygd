'use client'

import { BodyShort, ExpansionCard, VStack } from '@navikt/ds-react'
import React from 'react'
import { ReadMoreTile } from '@/components/ReadMoreTile'
import { SortablePaginatedList } from '@/components/SortablePaginatedList'
import { DocumentLink } from '@/components/DocumentLink'
import styles from './dokumenterview.module.css'
import {getDocumentProxyLink} from "@/components/Dokumenter/utils";

interface IDokumenterProps {
  pid?: string
  journalposter: {
    tittel: string
    formattedDate: string
    createdBy?: string
    sortDate: string
    id: string
    dokumenter: {
      tittel: string
      dokumentInfoId: string
      filstorrelse?: number
      variant?: string
    }[]
  }[]
}

export const DokumenterView: React.FC<IDokumenterProps> = (props) => {
  return (
    <section className="wide">
      <ExpansionCard aria-label="Dokumenter knyttet til saken din">
        <ExpansionCard.Header>
          <ExpansionCard.Title> Dokumenter knyttet til saken din </ExpansionCard.Title>
        </ExpansionCard.Header>
        <ExpansionCard.Content>
          <SortablePaginatedList
            items={props.journalposter}
            itemsPerPage={6}
            itemTypeName="dokumenter"
            renderItemAction={(journalpost) => {
              const [hoveddokument, ...vedlegg] = journalpost.dokumenter
              return (
                <ReadMoreTile
                  key={journalpost.sortDate}
                  color="surface-subtle"
                  content={
                    <VStack gap="4" className={styles.readMoreOpened}>
                      <DocumentLink
                        href={getDocumentProxyLink(
                          journalpost.id,
                          hoveddokument.dokumentInfoId,
                          hoveddokument.variant,
                          props.pid
                        )}
                        fileSize={hoveddokument.filstorrelse}
                      >
                        Åpne {hoveddokument.tittel.toLowerCase()}
                      </DocumentLink>
                      <VStack gap="2">
                        {vedlegg.length > 0 && (
                          <BodyShort size="medium" weight="semibold">
                            Vedlegg
                          </BodyShort>
                        )}
                        {vedlegg.map((vedlegg) => (
                          <DocumentLink
                            key={vedlegg.dokumentInfoId}
                            href={getDocumentProxyLink(
                              journalpost.id,
                              vedlegg.dokumentInfoId,
                              vedlegg.variant,
                              props.pid
                            )}
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
          ></SortablePaginatedList>
        </ExpansionCard.Content>
      </ExpansionCard>
    </section>
  )
}
