import { BodyShort, Button, Link } from '@navikt/ds-react'
import React from 'react'
import { ForsideBehandlingHeader } from '@/sections/Behandling/ForsideBehandlingHeader'
import Divider from '@/sections/Behandling/Divider'
import { ForsideBehandling } from '@/sections/Behandling/behandlingUtil'

interface Props {
  behandling: ForsideBehandling
}

export const SøknadMottatt = ({ behandling }: Props) => {
  return (
    <>
      <ForsideBehandlingHeader
        tittel={behandling.tittel + ' er mottatt'}
        statusTekst={behandling.statusTekst}
        dato={behandling.dato}
        statusFarge="info"
      />

      <Divider />

      <BodyShort>Søknaden din venter på behandling.</BodyShort>
      {behandling.lenker.map((lenke) => (
        <Link href={lenke.href} target="_blank">
          {lenke.visningstekst}
        </Link>
      ))}

      <Divider />

      <BodyShort>Trenger du å sende oss dokumentasjon, kan du gjøre det her.</BodyShort>
      <div>
        <Button as="a" href="https://www.nav.no/ettersende#uforetrygd">
          Last opp dokumentasjon
        </Button>
      </div>
    </>
  )
}
