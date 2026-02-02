import React from 'react'
import { isEnabled } from '@/utils/unleash'
import { Box, VStack } from '@navikt/ds-react'
import { ForsideBehandling } from '@/sections/Behandling/behandlingUtil'
import { SøknadAvslått } from '@/sections/Behandling/SøknadAvslått'
import { SøknadMottatt } from '@/sections/Behandling/SøknadMottatt'

interface BehandlingProps {
  behandling: ForsideBehandling | undefined
}

export const Behandling: React.FC<BehandlingProps> = async ({ behandling }) => {
  const visBehandling = await isEnabled('din.uforetrygd.forside.behandling')
  if (!visBehandling || !behandling) return null

  return (
    <section aria-label="Behandling">
      <Box padding="space-16" borderWidth="1" borderColor="neutral-subtleA" borderRadius="12">
        <VStack gap="space-16">
          {behandling.status == 'AVSLAG' && <SøknadAvslått tittel={behandling.tittel + ' er avslått'} />}
          {behandling.status == 'INNVILGET' && <SøknadMottatt behandling={behandling} />}
        </VStack>
      </Box>
    </section>
  )
}
