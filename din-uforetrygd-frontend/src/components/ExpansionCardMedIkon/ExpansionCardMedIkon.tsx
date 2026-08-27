'use client'

import { HStack } from '@navikt/ds-react'
import { ExpansionCard } from '@navikt/ds-react/ExpansionCard'
import type { ReactNode } from 'react'

interface Props {
  ikon: ReactNode
  tittel: string
  undertittel?: string
  children: ReactNode
}
export default function ExpansionCardMedIkon({ ikon, tittel, undertittel = '', children }: Props) {
  const ariaLabel = undertittel ? `${tittel}. ${undertittel}` : tittel

  return (
    <ExpansionCard aria-label={ariaLabel} size="small">
      <ExpansionCard.Header>
        <HStack wrap={false} gap="space-16" align="center">
          <div>{ikon}</div>
          <div>
            <ExpansionCard.Title as="h4" size="small">
              {tittel}
            </ExpansionCard.Title>
            {undertittel && <ExpansionCard.Description>{undertittel}</ExpansionCard.Description>}
          </div>
        </HStack>
      </ExpansionCard.Header>
      <ExpansionCard.Content>{children}</ExpansionCard.Content>
    </ExpansionCard>
  )
}
