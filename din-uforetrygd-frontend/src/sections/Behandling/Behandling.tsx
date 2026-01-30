import React from 'react'
import { isEnabled } from '@/utils/unleash'
import { BodyShort, Box, Button, Heading, HStack, Link, Stack, Tag, VStack } from '@navikt/ds-react'
import { ForsideBehandling } from '@/sections/Behandling/behandlingUtil'

interface BehandlingProps {
  behandling: ForsideBehandling | undefined
}

export const Behandling: React.FC<BehandlingProps> = async ({ behandling }) => {
  const visBehandling = await isEnabled('din.uforetrygd.forside.behandling')

  const søknadTekst = lagSøknadTekst()
  const lenkeHref = 'http://nav.no/saksbehandlingstider#uforetrygd'
  const lenkeTekst = 'Les mer om saksbehandlingstid (åpnes i ny fane).'
  const dokumentasjonTekst = 'Trenger du å sende oss dokumentasjon, kan du gjøre det her.'
  const lastOppDokumentasjonTekst = 'Last opp dokumentasjon'
  const lastOppDokumentasjonHref = 'https://www.ansatt.dev.nav.no/ettersende#uforetrygd'

  return (
    visBehandling &&
    behandling && (
      <section aria-label="Behandling">
        <Box padding="space-16" borderWidth="1" borderColor="neutral-subtleA" borderRadius="12">
          <VStack gap="space-16">
            <Stack
              gap="space-16"
              direction={{ xs: 'column-reverse', md: 'row' }}
              align={{ xs: 'start', md: 'center' }}
              justify="space-between"
            >
              <Heading size="medium">{behandling.tittel}</Heading>
              <Tag data-color="info">{behandling.statusTekst}</Tag>
            </Stack>

            <span style={{ borderBottom: '1px solid var(--ax-border-neutral-subtleA)' }} />

            <BodyShort>{søknadTekst}</BodyShort>
            <Link href={lenkeHref}>{lenkeTekst}</Link>

            <span style={{ borderBottom: '1px solid var(--ax-border-neutral-subtleA)' }} />

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
  )
}

function lagSøknadTekst(): string {
  return 'Søknaden din om uføretrygd venter på behandling.'
}
