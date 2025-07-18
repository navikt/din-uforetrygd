'use client'

import { BodyShort, Detail, Heading, VStack } from '@navikt/ds-react'
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
        Dette har skjedd i saken din
      </Heading>
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
    </section>
  )
}
