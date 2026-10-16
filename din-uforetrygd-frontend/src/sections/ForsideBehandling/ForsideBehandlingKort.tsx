import { Box, VStack } from '@navikt/ds-react'
import type React from 'react'
import { Visningskriterier } from '@/const'
import type { ForsideBehandling } from '@/sections/ForsideBehandling/forsideBehandlingUtil'
import { IngenUføretrygd } from '@/sections/ForsideBehandling/IngenUføretrygd'
import { SøknadAvslått } from '@/sections/ForsideBehandling/SøknadAvslått'
import { SøknadInnvilget } from '@/sections/ForsideBehandling/SøknadInnvilget'
import { SøknadMottatt } from '@/sections/ForsideBehandling/SøknadMottatt'
import { Status } from '@/api/hentSaksoversikt'

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
          {behandling.status === Status.AVSLAG && (
            <SøknadAvslått
              behandling={behandling}
              visAvslåttForutgåendeMedlemskap={behandling.avslattForutgaendeMedlemskap}
            />
          )}
          {behandling.status === Status.MOTTATT && <SøknadMottatt behandling={behandling} />}
          {behandling.status === Status.INNVILGET && <SøknadInnvilget behandling={behandling} />}
        </VStack>
      </Box>
    </section>
  )
}
