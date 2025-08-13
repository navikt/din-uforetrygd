'use client'

import {BodyShort, Detail, ExpansionCard, Heading, VStack} from '@navikt/ds-react'
import { SortablePaginatedList } from '@/components/SortablePaginatedList'
import styles from './hendelser.module.css'
import React from 'react'

export interface IHendelserProps {
  hendelser: {
    type: string
    description?: string
    createdBy?: string
    formattedDate?: string
    sortDate: string
  }[]
}

export const HendelserView: React.FC<IHendelserProps> = (props) => {

  return (
    <section className="wide">
        <Heading size="medium" level="2" spacing>
            Saksoversikt
        </Heading>
        <ExpansionCard aria-label="Hendelser i saken din">
        <ExpansionCard.Header>
            <ExpansionCard.Title> Dette har skjedd i saken din </ExpansionCard.Title>
        </ExpansionCard.Header>
        <ExpansionCard.Content>
      <SortablePaginatedList
        items={props.hendelser}
        itemsPerPage={6}
        itemTypeName="hendelser"
        renderItemAction={(hendelse) => {
          return (
            <VStack gap="05" className={styles.hendelser} padding="2">
              <Detail>
                {hendelse.formattedDate}
                {hendelse.createdBy && ` - Fra ${hendelse.createdBy}`}
              </Detail>
              <Heading size="xsmall" level="3">
                {hendelse.type}
              </Heading>
              {hendelse.description && <BodyShort>{hendelse.description}</BodyShort>}
            </VStack>
          )
        }}
      />
        </ExpansionCard.Content>
        </ExpansionCard>
    </section>
  )
}
