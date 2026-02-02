import { BodyShort, Link } from '@navikt/ds-react'
import React from 'react'
import { BehandlingHeader } from '@/sections/Behandling/BehandlingHeader'
import Divider from '@/sections/Behandling/Divider'
import { ForsideBehandling } from '@/sections/Behandling/behandlingUtil'

interface Props {
  behandling: ForsideBehandling
}

export const SøknadAvslått = ({ behandling }: Props) => {
  return (
    <>
      <BehandlingHeader tittel={behandling.tittel} statusTekst={behandling.statusTekst} statusFarge="warning" />
      <Divider />
      <BodyShort>{behandling.beskrivelse}</BodyShort>
      <Divider />
      {behandling.lenker.map((lenke, index) => (
        <Link key={index} href={lenke.href}>{lenke.visningstekst}</Link>
      ))}
    </>
  )
}
