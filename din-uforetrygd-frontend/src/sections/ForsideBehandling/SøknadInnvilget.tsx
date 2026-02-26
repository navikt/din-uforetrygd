'use client'

import { Heading, HelpText, HGrid, HStack, Link } from '@navikt/ds-react'
import Divider from '@/sections/ForsideBehandling/Divider'
import { ForsideBehandlingHeader } from '@/sections/ForsideBehandling/ForsideBehandlingHeader'
import type { ForsideBehandling } from '@/sections/ForsideBehandling/forsideBehandlingUtil'
import { umami } from '@/utils/umami'

interface Props {
  behandling: ForsideBehandling
}

export const SøknadInnvilget = ({ behandling }: Props) => {
  return (
    <>
      <ForsideBehandlingHeader
        tittel={`${behandling.tittel} er innvilget`}
        statusTekst={behandling.statusTekst}
        dato={behandling.dato}
        statusFarge="success"
      />

      <Divider />
      <HStack gap={'space-12'}>
        <Heading size="small">Ny månedlig beregning før skatt</Heading>
        <HelpText
          title={'Om månedlig beregning'}
          onClick={() => umami('hjelpetekst klikket', { tekst: 'Månedlig beregning' })}
        >
          Dette er ikke beløpet du får utbetalt på konto. Det trekkes skatt, eventuelle lønnstrekk og andre trekk før du
          får det utbetalt.
        </HelpText>
      </HStack>
      {behandling.beregninger.map((beregning) => (
        <HStack key={beregning.label} gap={'space-16'}>
          <span>{beregning.label}:</span>
          <span style={{ fontWeight: '600' }}>{beregning.verdi}</span>
        </HStack>
      ))}

      <Divider />
      <HGrid gap="space-16" columns={{ xs: 1, md: 2 }}>
        {behandling.lenker.map((lenke) => (
          <Link key={lenke.href} target="_blank" href={lenke.href}>
            {lenke.visningstekst}
          </Link>
        ))}
      </HGrid>
    </>
  )
}
