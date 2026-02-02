import { BodyShort, Link } from '@navikt/ds-react'
import React from 'react'
import { BehandlingHeader } from '@/sections/Behandling/BehandlingHeader'
import Divider from '@/sections/Behandling/Divider'

interface Props {
  tittel: string
}

export const SøknadAvslått = ({ tittel }: Props) => {
  return (
    <>
      <BehandlingHeader tittel={tittel} statusTekst="Søknad avslått" statusFarge="warning" />
      <Divider />
      <BodyShort>
        I vedtaksbrevet ditt kan du lese hvorfor. Har du spørsmål kan du kontakte oss. I vedtaksbrevet ditt finner du
        informasjon om hvordan du kan klage.
      </BodyShort>
      <Divider />
      <Link href="https://klage.nav.no/nb/klage/UFORETRYGD">Klag på vedtaket her (åpnes i ny fane)</Link>
      <Link href="https://www.nav.no/kontaktoss">Kontakt oss (åpnes i ny fane)</Link>
    </>
  )
}
