import { Heading, HelpText, HGrid, HStack, Link } from '@navikt/ds-react'
import React from 'react'
import { ForsideBehandlingHeader } from '@/sections/ForsideBehandling/ForsideBehandlingHeader'
import Divider from '@/sections/ForsideBehandling/Divider'
import { components } from '@/api/api'
import { beregning, forsideKortTitler, lenker, statusTekst } from '@/sections/ForsideBehandling/tekster'

interface Props {
  behandling: components['schemas']['Behandling']
}

export const SøknadInnvilget = ({ behandling }: Props) => {
  return (
    <>
      <ForsideBehandlingHeader
        tittel={forsideKortTitler[behandling.type] + ' er innvilget'}
        statusTekst={statusTekst[behandling.status]}
        dato={behandling.ferdigstiltDato!!}
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
      {beregning(behandling).map((beregning) => (
        <HStack gap={'space-16'}>
          <span>{beregning.label}:</span>
          <span style={{ fontWeight: '600' }}>{beregning.verdi}</span>
        </HStack>
      ))}

      <Divider />
      <HGrid gap="space-16" columns={{ xs: 1, md: 2 }}>
        {lenker(behandling.type).map((lenke) => (
          <Link target="_blank" href={lenke.href}>
            {lenke.visningstekst}
          </Link>
        ))}
      </HGrid>
    </>
  )
}
