'use client'

import { FolderFileIcon } from '@navikt/aksel-icons'
import { BodyShort, Box, ExpansionCard, Hide, HStack, VStack } from '@navikt/ds-react'
import { LinkCardIcon } from '@navikt/ds-react/LinkCard'
import type React from 'react'
import { DocumentLink } from '@/components/DocumentLink/DocumentLink'
import { getDocumentProxyLink } from '@/components/Dokumenter/utils'
import { ReadMoreTile } from '@/components/ReadMoreTile/ReadMoreTile'
import { SortablePaginatedList } from '@/components/SortablePaginatedList/SortablePaginatedList'
import { umami } from '@/utils/umami'
import styles from './dokumenterview.module.css'

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
              onClick={() => umami('accordion åpnet', { tekst: 'Dokumenter knyttet til saken din' })}
            >
              Dokumenter knyttet til saken din
            </ExpansionCard.Title>
            <ExpansionCard.Description>Brev og informasjon om din uføretrygd</ExpansionCard.Description>
          </VStack>
        </HStack>
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
                content={
                  <VStack gap="space-16" className={styles.readMoreOpened}>
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
                    <VStack gap="space-8">
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
  )
}
