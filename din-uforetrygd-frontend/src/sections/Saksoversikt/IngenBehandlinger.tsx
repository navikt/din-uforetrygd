'use client'

import { BodyShort } from '@navikt/ds-react'
import styles from './saksoversikt.module.css'
import { EnvelopeOpenIcon } from '@navikt/aksel-icons'


type IngenBehandlingerProps = {
  aktiv: boolean
}

export function IngenBehandlinger({ aktiv }: IngenBehandlingerProps) {
  return (
    <div className={styles.ingenBehandlinger}>
      <EnvelopeOpenIcon />
      <BodyShort>{aktiv ? "Du har ingen aktive behandlinger" : "Du har ingen avsluttede behandlinger"}</BodyShort>
    </div>
  )
}