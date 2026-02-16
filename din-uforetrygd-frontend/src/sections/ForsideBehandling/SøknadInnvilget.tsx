import { Heading, HelpText, HGrid, HStack, Link } from '@navikt/ds-react'
import React from 'react'
import { ForsideBehandlingHeader } from '@/sections/ForsideBehandling/ForsideBehandlingHeader'
import Divider from '@/sections/ForsideBehandling/Divider'
import { ForsideBehandling } from '@/sections/ForsideBehandling/forsideBehandlingUtil'

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
      <HStack gap={'space-12'}>
        <Heading size="small">Ny månedlig beregning før skatt</Heading>
        <HelpText>
          Dette er ikke beløpet du får utbetalt på konto. Det trekkes skatt, eventuelle lønnstrekk og andre trekk før du
          får det utbetalt.
        </HelpText>
      </HStack>
      {behandling.beregninger.map((beregning) => (
        <HStack gap={'space-16'}>
          <span>{beregning.label}:</span>
          <span style={{ fontWeight: '600' }}>{beregning.verdi}</span>
        </HStack>
      ))}

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
