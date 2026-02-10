'use client'

import { ExpansionCard } from '@navikt/ds-react/ExpansionCard'
import { BehandlingType } from '@/sections/Saksoversikt/saksoversiktType'
import { formatterDatoTekst } from '@/utils/formatter/formatter'
import styles from './saksoversikt.module.css'
import { BodyShort, Process, VStack } from '@navikt/ds-react'
import { CheckmarkHeavyIcon } from '@navikt/aksel-icons'
import { Etteroppgjor } from '@/sections/Saksoversikt/Etteroppgjor'
import React from 'react'

interface Props {
  behandling: BehandlingType
  aktiv: boolean
}

export function Behandling({ behandling, aktiv }: Props) {
  return (
    <ExpansionCard aria-label={behandling.tittel} className={styles.behandlingCard}>
      <ExpansionCard.Header>
        <ExpansionCard.Title>{behandling.tittel}</ExpansionCard.Title>
        <ExpansionCard.Description className={`${aktiv ? '' : styles.behandlingDato}`}>
          <VStack gap="space-8">
            <BodyShort>
              {aktiv
                ? `Mottatt: ${formatterDatoTekst(behandling.mottattDato)}`
                : `Ferdig behandlet: ${formatterDatoTekst(behandling.ferdigstiltDato!)}`}
            </BodyShort>
            {behandling.avslattForutgaendeMedlemskap && (
              <BodyShort>
                <b>Viktig! Hvis du i stedet for vedtaksbrev har fått et informasjonsbrev, gjelder ikke dette avslaget.</b> I så fall
                vil du få et vedtak når vi har fått nødvendige opplysninger fra utlandet.
              </BodyShort>
            )}
          </VStack>
        </ExpansionCard.Description>
      </ExpansionCard.Header>
      <ExpansionCard.Content>
        {behandling.etteroppgjor ? (
          <Etteroppgjor etteroppgjor={behandling.etteroppgjor}></Etteroppgjor>
        ) : (
          <Process>
            {behandling.steg.map((steg) => (
              <Process.Event
                key={`${behandling.vedtakId}-${steg.tittel}`}
                status={steg.aktiv ? 'active' : steg.utfort ? 'completed' : undefined}
                title={steg.tittel}
                timestamp={steg.aktiv || steg.utfort ? formatterDatoTekst(behandling.ferdigstiltDato) : undefined}
                bullet={steg.aktiv || steg.utfort ? <CheckmarkHeavyIcon /> : undefined}
              >
                {steg.undertekst}
              </Process.Event>
            ))}
          </Process>
        )}
      </ExpansionCard.Content>
    </ExpansionCard>
  )
}
