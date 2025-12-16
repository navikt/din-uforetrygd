'use client'

import { ExpansionCard } from '@navikt/ds-react/ExpansionCard'
import { BehandlingType } from '@/sections/Saksoversikt/saksoversiktType'
import { formatterDatoTekst } from '@/utils/formatter/formatter'
import styles from './saksoversikt.module.css'

interface Props {
  behandling: BehandlingType
}

export function Behandling({ behandling }: Props) {
  return (
    <ExpansionCard aria-label={behandling.visningstittel}>
      <ExpansionCard.Header>
        <ExpansionCard.Title>{behandling.visningstittel}</ExpansionCard.Title>
        <ExpansionCard.Description className={styles.behandlingDato}>
          {formatterDatoTekst(behandling.mottattDato)}
        </ExpansionCard.Description>
      </ExpansionCard.Header>
      <ExpansionCard.Content>{behandling.status}</ExpansionCard.Content>
    </ExpansionCard>
  )
}
