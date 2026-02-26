'use client'

import { EnvelopeOpenIcon } from '@navikt/aksel-icons'
import { BodyShort } from '@navikt/ds-react'
import styles from './saksoversikt.module.css'

type IngenBehandlingerProps = {
  aktiv: boolean
}

export function IngenBehandlinger({ aktiv }: IngenBehandlingerProps) {
  return (
    <div className={styles.ingenBehandlinger}>
      <EnvelopeOpenIcon />
      <BodyShort>
        {aktiv ? 'Du har ingen saker til behandling' : 'Du har ingen saker som er ferdig behandlet'}
      </BodyShort>
    </div>
  )
}
