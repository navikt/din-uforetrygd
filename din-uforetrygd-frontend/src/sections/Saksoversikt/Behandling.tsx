'use client'

import { ExpansionCard } from '@navikt/ds-react/ExpansionCard'
import { BehandlingType } from '@/sections/Saksoversikt/saksoversiktType'
import { formatterDatoTekst } from '@/utils/formatter/formatter'
import styles from './saksoversikt.module.css'
import { Process } from '@navikt/ds-react'
import { CheckmarkHeavyIcon } from '@navikt/aksel-icons'
import { Etteroppgjor } from '@/sections/Saksoversikt/Etteroppgjor'

interface Props {
  behandling: BehandlingType
  aktiv: boolean
}

export function Behandling({ behandling, aktiv }: Props) {
  return (
    <ExpansionCard aria-label={behandling.visningstittel} style={{ marginBottom: '1rem' }}>
      <ExpansionCard.Header>
        <ExpansionCard.Title>{behandling.visningstittel}</ExpansionCard.Title>
        <ExpansionCard.Description className={`${aktiv ? '' : styles.behandlingDato}`}>
          {aktiv ? 'Under behandling' : formatterDatoTekst(behandling.mottattDato)}
        </ExpansionCard.Description>
      </ExpansionCard.Header>
      <ExpansionCard.Content>
        {behandling.etteroppgjor ?
          <Etteroppgjor etteroppgjor={behandling.etteroppgjor}></Etteroppgjor>
          : (aktiv ?
        <Process>
          <Process.Event
            status="active"
            title="Søknad er mottatt og ligger i behandlingskø"
            timestamp={formatterDatoTekst(behandling.mottattDato)}
            bullet={<CheckmarkHeavyIcon />}
          />
          <Process.Event title="Søknad er ferdig behandlet"></Process.Event>
        </Process>
          :
          <Process>
            <Process.Event
              status="completed"
              title="Søknad er mottatt og ligger i behandlingskø"
              timestamp={formatterDatoTekst(behandling.mottattDato)}
              bullet={<CheckmarkHeavyIcon />}
            />
            <Process.Event
              status="completed"
              title="Søknad er ferdig behandlet"
              timestamp={behandling.ferdigstiltDato ? formatterDatoTekst(behandling.ferdigstiltDato) : ''}
              bullet={<CheckmarkHeavyIcon />}
            />
          </Process>)
        }
      </ExpansionCard.Content>
    </ExpansionCard>
  )
}
