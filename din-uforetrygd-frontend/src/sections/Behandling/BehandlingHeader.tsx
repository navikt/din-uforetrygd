import { Heading, Stack, Tag } from '@navikt/ds-react'
import React from 'react'
import { Status } from '@/sections/Behandling/behandlingUtil'
import { AkselColor } from '@navikt/ds-react/types/theme'

interface Props {
  tittel: string
  statusTekst: string
  statusType: Status
}

export const BehandlingHeader = ({ tittel, statusTekst, statusType }: Props) => {
  const statusFarge = (): AkselColor => {
    switch (statusType) {
      case Status.MOTTATT:
        return 'info'
      case Status.INNVILGET:
        return 'success'
      case Status.AVSLAG:
        return 'warning'
    }
  }

  return (
    <Stack
      gap="space-16"
      direction={{ xs: 'column-reverse', md: 'row' }}
      align={{ xs: 'start', md: 'center' }}
      justify="space-between"
    >
      <Heading size="medium">{tittel}</Heading>
      <Tag data-color={statusFarge()}>{statusTekst}</Tag>
    </Stack>
  )
}
