import React from 'react'
import { isEnabled } from '@/utils/unleash'
import { Box } from '@navikt/ds-react'
import { ForsideBehandling } from '@/sections/Behandling/behandlingUtil'

interface BehandlingProps {
  behandling: ForsideBehandling | undefined
}

export const Behandling: React.FC<BehandlingProps> = async ({ behandling }) => {
  const visBehandling = await isEnabled('din.uforetrygd.forside.behandling')

  return (
    visBehandling && behandling && (
      <section aria-label="Behandling">
        <Box padding="space-16" borderWidth="1" borderColor="neutral-subtleA" borderRadius="12">
          { behandling.tittel } - {behandling.statusTekst}
        </Box>
      </section>
    )
  )
}
