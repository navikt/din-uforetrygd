'use client'

import { EtteroppgjorType } from '@/sections/Saksoversikt/saksoversiktType'
import { BodyShort, HStack, Link, VStack } from '@navikt/ds-react'

interface Props {
  etteroppgjor: EtteroppgjorType
}

export function Etteroppgjor({ etteroppgjor }: Props) {
  return (
    <VStack gap="space-24">
      <BodyShort>
        Etteroppgjøret viser en foreløpig beregning av om du har fått for mye eller for lite utbetalt i uføretrygd i
        fjor.
      </BodyShort>
      <VStack gap="space-8">
        <HStack justify="space-between">
          <BodyShort>Du må betale tilbake:</BodyShort>
          <BodyShort>
            <strong>{etteroppgjor.tilbakekreving}</strong>
          </BodyShort>
        </HStack>
        <HStack justify="space-between">
          <BodyShort>Du får tilbake fra oss:</BodyShort>
          <BodyShort>
            <strong>{etteroppgjor.etterbetaling}</strong>
          </BodyShort>
        </HStack>
        <Link>Her finner du informasjon om etteroppgjøret og hvordan du kan betale tilbake (åpnes i ny fane)</Link>
      </VStack>
    </VStack>
  )
}
