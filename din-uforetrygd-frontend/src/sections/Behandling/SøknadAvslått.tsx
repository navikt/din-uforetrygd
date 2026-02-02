import { BodyShort, Box, Link, VStack } from '@navikt/ds-react'
import React from 'react'
import { BehandlingHeader } from '@/sections/Behandling/BehandlingHeader'
import { Status } from '@/sections/Behandling/behandlingUtil'
import Divider from '@/sections/Behandling/Divider'

interface Props {
  tittel: string
}

export const SøknadAvslått = ({ tittel }: Props) => {
  return (
    <section>
      <Box padding="space-16" borderWidth="1" borderColor="neutral-subtleA" borderRadius="12">
        <VStack gap="space-16">
          <BehandlingHeader tittel={tittel} statusTekst="Søknad avslått" statusType={Status.AVSLAG} />
          <Divider />
          <BodyShort>
            I vedtaksbrevet ditt kan du lese hvorfor. Har du spørsmål kan du kontakte oss. I vedtaksbrevet ditt finner
            du informasjon om hvordan du kan klage.
          </BodyShort>
          <Divider />
          <Link href="https://www.nav.no/klage#uforetrygd">Klag på vedtaket her (åpnes i ny fane)</Link>
          <Link href="TODO">Kontakt oss (åpnes i ny fane)</Link>
        </VStack>
      </Box>
    </section>
  )
}
