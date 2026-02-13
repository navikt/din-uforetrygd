import React from 'react'
import { Box, VStack } from '@navikt/ds-react'
import { ForsideBehandling, Status } from '@/sections/ForsideBehandling/forsideBehandlingUtil'
import { SøknadAvslått } from '@/sections/ForsideBehandling/SøknadAvslått'
import { SøknadMottatt } from '@/sections/ForsideBehandling/SøknadMottatt'
import { SøknadInnvilget } from '@/sections/ForsideBehandling/SøknadInnvilget'
import { Visningskriterier } from '@/const'
import { IngenUføretrygd } from '@/sections/ForsideBehandling/IngenUføretrygd'

interface BehandlingProps {
  behandling: ForsideBehandling | null
  visningskriterier: Visningskriterier[]
}

export const ForsideBehandlingKort: React.FC<BehandlingProps> = async ({ behandling, visningskriterier }) => {
  if (
    !behandling &&
    (visningskriterier.includes(Visningskriterier.IngenUforesak) ||
      visningskriterier.includes(Visningskriterier.AvsluttetUforetrygdSak))
  ) {
    return <IngenUføretrygd />
  }

  if (!behandling) return null

  return (
    <section aria-label="Status på søknad">
      <Box padding="space-16" borderWidth="1" borderColor="neutral-subtleA" borderRadius="12">
        <VStack gap="space-16">
          {behandling.status == Status.AVSLAG && (
            <SøknadAvslått
              behandling={behandling}
              visAvslåttForutgåendeMedlemskap={behandling.avslattForutgaendeMedlemskap}
            />
          )}
          {behandling.status == Status.MOTTATT && <SøknadMottatt behandling={behandling} />}
          {behandling.status == Status.INNVILGET && <SøknadInnvilget behandling={behandling} />}
        </VStack>
      </Box>
    </section>
  )
}
