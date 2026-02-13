import { BodyShort, Button, Link } from '@navikt/ds-react'
import React from 'react'
import { ForsideBehandlingHeader } from '@/sections/ForsideBehandling/ForsideBehandlingHeader'
import Divider from '@/sections/ForsideBehandling/Divider'
import { Status } from '@/sections/ForsideBehandling/forsideBehandlingUtil'
import { components } from '@/api/api'
import { forsideKortTitler, lenker, statusTekst } from '@/sections/ForsideBehandling/tekster'

interface Props {
  behandling: components['schemas']['Behandling']
}

export const SøknadMottatt = ({ behandling }: Props) => {
  return (
    <>
      <ForsideBehandlingHeader
        tittel={forsideKortTitler[behandling.type] + ' er mottatt'}
        statusTekst={statusTekst[behandling.status]}
        dato={behandling.mottattDato}
        statusFarge="info"
      />

      <Divider />

      <BodyShort>Søknaden din venter på behandling.</BodyShort>
      {lenker(behandling.type).map((lenke) => (
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
