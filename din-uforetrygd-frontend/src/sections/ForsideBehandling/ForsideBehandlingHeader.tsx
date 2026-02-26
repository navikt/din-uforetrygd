import { BodyShort, Heading, Stack, Tag, VStack } from '@navikt/ds-react'
import type { AkselColor } from '@navikt/ds-react/types/theme'
import React from 'react'
import { formatterDatoTekst } from '@/utils/formatter/formatter'

interface Props {
  tittel: string
  statusTekst: string
  dato: string
  statusFarge: AkselColor
}

export const ForsideBehandlingHeader = ({ tittel, statusTekst, dato, statusFarge }: Props) => {
  return (
    <VStack gap="space-4">
      <Stack
        gap="space-16"
        direction={{ xs: 'column-reverse', md: 'row' }}
        align={{ xs: 'start', md: 'center' }}
        justify="space-between"
      >
        <Heading size="medium">{tittel}</Heading>
        <Tag data-color={statusFarge}>{statusTekst}</Tag>
      </Stack>
      <BodyShort>{formatterDatoTekst(dato)}</BodyShort>
    </VStack>
  )
}
