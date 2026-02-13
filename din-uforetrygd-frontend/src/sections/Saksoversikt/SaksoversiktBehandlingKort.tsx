'use client'

import { ExpansionCard } from '@navikt/ds-react/ExpansionCard'
import { SaksoversiktBehandling } from '@/sections/Saksoversikt/saksoversiktType'
import { formatterDatoTekst } from '@/utils/formatter/formatter'
import styles from './saksoversikt.module.css'
import { BodyShort, VStack } from '@navikt/ds-react'
import { Etteroppgjor } from '@/sections/Saksoversikt/Etteroppgjor'
import React from 'react'
import { TilBehandlingStegvisning } from '@/sections/Saksoversikt/TilBehandlingStegvisning'
import { FerdigBehandletStegvisning } from '@/sections/Saksoversikt/FerdigBehandletStegvisning'

interface Props {
  behandling: SaksoversiktBehandling
  ferdigBehandlet: boolean
}

export function SaksoversiktBehandlingKort({ behandling, ferdigBehandlet }: Props) {
  const finnStatusTekst = () => {
    if (ferdigBehandlet && behandling.avslag)
      return `Søknad avslått: ${formatterDatoTekst(behandling.ferdigstiltDato!)}`
    if (ferdigBehandlet && behandling.tittel.includes('Søknad'))
      return `Søknad innvilget: ${formatterDatoTekst(behandling.ferdigstiltDato!)}`
    if (ferdigBehandlet) return `Ferdig behandlet: ${formatterDatoTekst(behandling.ferdigstiltDato!)}`
    return `Mottatt: ${formatterDatoTekst(behandling.mottattDato)}`
  }

  return (
    <ExpansionCard aria-label={behandling.tittel} className={styles.behandlingCard}>
      <ExpansionCard.Header>
        <ExpansionCard.Title>{behandling.tittel}</ExpansionCard.Title>
        <ExpansionCard.Description className={`${ferdigBehandlet ? '' : styles.behandlingDato}`}>
          <VStack gap="space-8">
            <BodyShort>{finnStatusTekst()}</BodyShort>
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
        {behandling.etteroppgjør ? (
          <Etteroppgjor etteroppgjor={behandling.etteroppgjør} />
        ) : ferdigBehandlet ? (
          <FerdigBehandletStegvisning steg={behandling.steg} />
        ) : (
          <TilBehandlingStegvisning steg={behandling.steg} />
        )}
      </ExpansionCard.Content>
    </ExpansionCard>
  )
}
