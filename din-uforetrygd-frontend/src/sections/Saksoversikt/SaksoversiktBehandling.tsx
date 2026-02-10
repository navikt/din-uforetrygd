'use client'

import { ExpansionCard } from '@navikt/ds-react/ExpansionCard'
import { BehandlingType } from '@/sections/Saksoversikt/saksoversiktType'
import { formatterDatoTekst } from '@/utils/formatter/formatter'
import styles from './saksoversikt.module.css'
import { BodyShort, VStack } from '@navikt/ds-react'
import { Etteroppgjor } from '@/sections/Saksoversikt/Etteroppgjor'
import React from 'react'
import { TilBehandlingStegvisning } from '@/sections/Saksoversikt/TilBehandlingStegvisning'
import { FerdigBehandletStegvisning } from '@/sections/Saksoversikt/FerdigBehandletStegvisning'

interface Props {
  behandling: BehandlingType
  ferdigBehandlet: boolean
}

export function SaksoversiktBehandling({ behandling, ferdigBehandlet }: Props) {
  return (
    <ExpansionCard aria-label={behandling.tittel} className={styles.behandlingCard}>
      <ExpansionCard.Header>
        <ExpansionCard.Title>{behandling.tittel}</ExpansionCard.Title>
        <ExpansionCard.Description className={`${ferdigBehandlet ? '' : styles.behandlingDato}`}>
          <VStack gap="space-8">
            <BodyShort>
              {ferdigBehandlet
                ? `Ferdig behandlet: ${formatterDatoTekst(behandling.ferdigstiltDato!)}`
                : `Mottatt: ${formatterDatoTekst(behandling.mottattDato)}`}
            </BodyShort>
            {behandling.avslattForutgaendeMedlemskap && (
              <BodyShort weight={'semibold'}>
                Viktig! Hvis du i stedet for vedtaksbrev har fått et informasjonsbrev, gjelder ikke dette avslaget. I så
                fall vil du få et vedtak når vi har fått nødvendige opplysninger fra utlandet.
              </BodyShort>
            )}
          </VStack>
        </ExpansionCard.Description>
      </ExpansionCard.Header>
      <ExpansionCard.Content>
        {behandling.etteroppgjor ? (
          <Etteroppgjor etteroppgjor={behandling.etteroppgjor} />
        ) : ferdigBehandlet ? (
          <FerdigBehandletStegvisning steg={behandling.steg} />
        ) : (
          <TilBehandlingStegvisning steg={behandling.steg} />
        )}
      </ExpansionCard.Content>
    </ExpansionCard>
  )
}
