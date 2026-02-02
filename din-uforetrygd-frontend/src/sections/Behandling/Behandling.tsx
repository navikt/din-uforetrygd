import React from 'react'
import { isEnabled } from '@/utils/unleash'
import { BodyShort, Box, Button, Heading, HStack, Link, Stack, Tag, VStack } from '@navikt/ds-react'
import { ForsideBehandling } from '@/sections/Behandling/behandlingUtil'

interface BehandlingProps {
  behandling: ForsideBehandling | undefined
}

export const Behandling: React.FC<BehandlingProps> = async ({ behandling }) => {
  const visBehandling = await isEnabled('din.uforetrygd.forside.behandling')

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

            <BodyShort>{lagSøknadTekst(behandling.type)}</BodyShort>
            {lagLenker(behandling.type)}

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

function lagSøknadTekst(type: string): string {
  switch (type) {
    case "SØKNAD_UFØRETRYGD":
      return "Søknaden din om uføretrygd venter på behandling.";
    case "SØKNAD_ENDRING_UFØREGRAD":
      return "Søknaden din om endring av uføregrad venter på behandling.";
    case "SØKNAD_BARNETILLEGG":
      return "Søknaden din om barnetillegg venter på behandling.";
    case "SØKNAD_UNG_UFØR":
      return "Søknaden din om ung ufør venter på behandling.";
    case "SØKNAD_YRKESSKADE":
      return "Søknaden din om yrkesskade venter på behandling.";
    default:
      return "Søknaden din venter på behandling.";
  }
}

function lagLenker(behandlingType: string): React.ReactNode[] {
  const lenker = [<Link href="http://nav.no/saksbehandlingstider#uforetrygd">Les mer om saksbehandlingstid (åpnes i ny fane).</Link>]

  if (behandlingType === "SØKNAD_BARNETILLEGG") {
    return [
      ...lenker,
      <Link href="https://www.nav.no/no/person/familie/barn-og-unnskap/barnetillegg">Viktig informasjon om inntekt og barnetillegg  (åpnes i ny fane).</Link>
    ]
  }

  return lenker
}