import React from 'react'
import { isEnabled } from '@/utils/unleash'
import { BodyShort, Box, Button, Heading, Link, Stack, Tag, VStack } from '@navikt/ds-react'
import { ForsideBehandling, Status } from '@/sections/Behandling/behandlingUtil'
import { SøknadAvslått } from '@/sections/Behandling/SøknadAvslått'
import { BehandlingHeader } from '@/sections/Behandling/BehandlingHeader'
import Divider from '@/sections/Behandling/Divider'

interface BehandlingProps {
  behandling: ForsideBehandling | undefined
}

export const Behandling: React.FC<BehandlingProps> = async ({ behandling }) => {
  const visBehandling = await isEnabled('din.uforetrygd.forside.behandling')
  if (!visBehandling || !behandling) return null

  const dokumentasjonTekst = 'Trenger du å sende oss dokumentasjon, kan du gjøre det her.'
  const lastOppDokumentasjonTekst = 'Last opp dokumentasjon'
  const lastOppDokumentasjonHref = 'https://www.ansatt.dev.nav.no/ettersende#uforetrygd'

  if (behandling.status == 'AVSLAG') {
    return <SøknadAvslått tittel={behandling.tittel + ' er avslått'} />
  }

  return (
    <section aria-label="Behandling">
      <Box padding="space-16" borderWidth="1" borderColor="neutral-subtleA" borderRadius="12">
        <VStack gap="space-16">
          <BehandlingHeader
            tittel={behandling.tittel}
            statusTekst={behandling?.statusTekst}
            statusType={behandling?.status}
          />

          <span style={{ borderBottom: '1px solid var(--ax-border-neutral-subtleA)' }} />

          <Divider />

          <BodyShort>Søknaden din venter på behandling.</BodyShort>
          {behandling.lenker.map((lenke) => (
            <Link href={lenke.href}>{lenke.visningstekst}</Link>
          ))}

          <Divider />

          <BodyShort>{dokumentasjonTekst}</BodyShort>
          <div>
            <Button as="a" href={lastOppDokumentasjonHref}>
              {lastOppDokumentasjonTekst}
            </Button>
          </div>
        </VStack>
      </Box>
    </section>
  )
}
