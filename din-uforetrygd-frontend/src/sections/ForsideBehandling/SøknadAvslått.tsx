import { BodyShort, Link } from '@navikt/ds-react'
import React from 'react'
import { ForsideBehandlingHeader } from '@/sections/ForsideBehandling/ForsideBehandlingHeader'
import Divider from '@/sections/ForsideBehandling/Divider'
import { ForsideBehandling } from '@/sections/ForsideBehandling/forsideBehandlingUtil'

interface Props {
  behandling: ForsideBehandling
  visAvslåttForutgåendeMedlemskap: boolean
}

export const SøknadAvslått = ({ behandling, visAvslåttForutgåendeMedlemskap }: Props) => {
  return (
    <>
      <ForsideBehandlingHeader
        tittel={behandling.tittel + ' er avslått'}
        statusTekst="Søknad avslått"
        dato={behandling.dato}
        statusFarge="warning"
      />
      <Divider />
      <BodyShort>
        I vedtaksbrevet ditt kan du lese hvorfor. Har du spørsmål kan du kontakte oss. I vedtaksbrevet ditt finner du
        informasjon om hvordan du kan klage.
      </BodyShort>
      {visAvslåttForutgåendeMedlemskap && (
        <BodyShort weight={'semibold'}>
          Viktig! Hvis du i stedet for vedtaksbrev har fått et informasjonsbrev, gjelder ikke dette avslaget. I så fall
          vil du få et vedtak når vi har fått nødvendige opplysninger fra utlandet.
        </BodyShort>
      )}
      <Divider />
      <Link href="https://klage.nav.no/nb/klage/UFORETRYGD">Klag på vedtaket her (åpnes i ny fane)</Link>
      <Link href="https://www.nav.no/kontaktoss">Kontakt oss (åpnes i ny fane)</Link>
    </>
  )
}
