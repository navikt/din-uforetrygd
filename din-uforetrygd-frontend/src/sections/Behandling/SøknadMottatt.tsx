import { BodyShort, Button, Link } from '@navikt/ds-react'
import React from 'react'
import { BehandlingHeader } from '@/sections/Behandling/BehandlingHeader'
import Divider from '@/sections/Behandling/Divider'
import { ForsideBehandling } from '@/sections/Behandling/behandlingUtil'

interface Props {
  behandling: ForsideBehandling
}

export const SøknadMottatt = ({ behandling }: Props) => {
  return (
    <>
      <BehandlingHeader
        tittel={behandling.tittel}
        statusTekst={behandling.statusTekst}
        statusFarge='info'
      />

      <Divider />

      <BodyShort>{behandling.beskrivelse}</BodyShort>
      {behandling.lenker.map((lenke, index) => (
        <Link key={index} href={lenke.href}>{lenke.visningstekst}</Link>
      ))}

      <Divider />

      <BodyShort>Trenger du å sende oss dokumentasjon, kan du gjøre det her.</BodyShort>
      <div>
        <Button as="a" href='https://www.ansatt.dev.nav.no/ettersende#uforetrygd'>
          Last opp dokumentasjon
        </Button>
      </div>
    </>
  )
}
