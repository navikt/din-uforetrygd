'use client'

import { BodyShort } from '@navikt/ds-react'
import styles from './saksoversikt.module.css'
import { EnvelopeOpenIcon } from '@navikt/aksel-icons'


export function IngenSaker() {
  return (
    <div className={styles.ingenSaker}>
      <EnvelopeOpenIcon />
      <BodyShort>Du har ingen saker til behandling</BodyShort>
    </div>
  )
}