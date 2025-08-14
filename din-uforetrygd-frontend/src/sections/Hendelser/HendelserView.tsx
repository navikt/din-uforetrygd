'use client'

import {BodyShort, Detail, ExpansionCard, Heading, VStack} from '@navikt/ds-react'
import {SortablePaginatedList} from '@/components/SortablePaginatedList'
import styles from './hendelser.module.css'
import React, {useContext, useEffect, useRef, useState} from 'react'
import {EventContext} from "@/utils/dataContextProvider/EventContextProvider";

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

  const {openHendelser, setOpenHendelser} = useContext(EventContext)
  const [isExpanded, setIsExpanded] = useState(false)
  const expansionCardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (openHendelser) {
      setIsExpanded(true)
      setOpenHendelser(false)
      expansionCardRef.current?.focus()
    }
  }, [openHendelser, setOpenHendelser])
  
  return (
    <section className="wide">
        <Heading size="medium" level="2" spacing>
            Saksoversikt
        </Heading>
      <ExpansionCard
        aria-label="Hendelser i saken din"
        open={isExpanded}
        onToggle={setIsExpanded}
        ref={expansionCardRef}
        tabIndex={-1}
      >
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
