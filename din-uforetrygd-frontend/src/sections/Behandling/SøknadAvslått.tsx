import { BodyShort, Link } from '@navikt/ds-react'
import React from 'react'
import { ForsideBehandlingHeader } from '@/sections/Behandling/ForsideBehandlingHeader'
import Divider from '@/sections/Behandling/Divider'
import { ForsideBehandling } from '@/sections/Behandling/behandlingUtil'

interface Props {
  behandling: ForsideBehandling
  visAvslåttForutgåendeMedlemskap: boolean
}

export const SøknadAvslått = ({ behandling, visAvslåttForutgåendeMedlemskap }: Props) => {
  return (
    <>
      <ForsideBehandlingHeader tittel={behandling.tittel + " er avslått"} statusTekst="Søknad avslått" dato={behandling.dato} statusFarge="warning" />
      <Divider />
      <BodyShort>
        I vedtaksbrevet ditt kan du lese hvorfor. Har du spørsmål kan du kontakte oss. I vedtaksbrevet ditt finner du
        informasjon om hvordan du kan klage.
      </BodyShort>
      {visAvslåttForutgåendeMedlemskap && (
        <BodyShort weight="semibold">
          Viktig! Hvis du i stedet har fått et informasjonsbrev, ikke et vedtak, kan du se bort fra dette. I så fall vil
          du få et vedtak når nødvendige opplysninger er mottatt fra utlandet.
        </BodyShort>
      )}
      <Divider />
      <Link href="https://klage.nav.no/nb/klage/UFORETRYGD">Klag på vedtaket her (åpnes i ny fane)</Link>
      <Link href="https://www.nav.no/kontaktoss">Kontakt oss (åpnes i ny fane)</Link>
    </>
  )
}
