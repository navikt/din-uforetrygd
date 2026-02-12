import { Heading, HelpText, HGrid, HStack, Link, VStack } from '@navikt/ds-react'
import React from 'react'
import { ForsideBehandlingHeader } from '@/sections/Behandling/ForsideBehandlingHeader'
import Divider from '@/sections/Behandling/Divider'
import { ForsideBehandling } from '@/sections/Behandling/behandlingUtil'

interface Props {
  behandling: ForsideBehandling
}

export const SøknadInnvilget = ({ behandling }: Props) => {
  return (
    <>
      <ForsideBehandlingHeader
        tittel={behandling.tittel + ' er innvilget'}
        statusTekst={behandling.statusTekst}
        dato={behandling.dato}
        statusFarge="success"
      />

      <Divider />
      <VStack gap={'space-8'}>
        <HStack gap={'space-12'}>
          <Heading size="small">Ny månedlig beregning før skatt</Heading>
          <HelpText>
            Dette er ikke beløpet du får utbetalt på konto. Det trekkes skatt, eventuelle lønnstrekk og andre trekk før
            du får det utbetalt.
          </HelpText>
        </HStack>
        {behandling.beregninger.map((beregning) => (
          <HStack gap={'space-16'}>
            <span>{beregning.label}:</span>
            <span style={{ fontWeight: '600' }}>{beregning.verdi}</span>
          </HStack>
        ))}
      </VStack>
      <Divider />
      <HGrid gap="space-16" columns={{ xs: 1, md: 2 }}>
        {behandling.lenker.map((lenke) => (
          <Link target="_blank" href={lenke.href}>
            {lenke.visningstekst}
          </Link>
        ))}
      </HGrid>
    </>
  )
}
