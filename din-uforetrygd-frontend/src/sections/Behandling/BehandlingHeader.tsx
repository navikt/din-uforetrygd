import { Heading, Stack, Tag } from '@navikt/ds-react'
import React from 'react'
import { AkselColor } from '@navikt/ds-react/types/theme'

interface Props {
  tittel: string
  statusTekst: string
  statusFarge: AkselColor
}

export const BehandlingHeader = ({ tittel, statusTekst, statusFarge }: Props) => {
  return (
    <Stack
      gap="space-16"
      direction={{ xs: 'column-reverse', md: 'row' }}
      align={{ xs: 'start', md: 'center' }}
      justify="space-between"
    >
      <Heading size="medium">{tittel}</Heading>
      <Tag data-color={statusFarge}>{statusTekst}</Tag>
    </Stack>
  )
}
