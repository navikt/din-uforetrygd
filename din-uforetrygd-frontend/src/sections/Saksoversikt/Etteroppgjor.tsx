'use client'

import { EtteroppgjorType } from '@/sections/Saksoversikt/saksoversiktType'
import { BodyShort, HStack, Link, VStack } from '@navikt/ds-react'
import { formatInntekt } from '@/utils/formatter/formatter'

interface Props {
  etteroppgjor: EtteroppgjorType
}

export function Etteroppgjor({ etteroppgjor }: Props) {
  return (
    <VStack gap="space-24">
      <BodyShort>
        Etteroppgjøret viser en beregning av om du har fått for mye eller for lite utbetalt i uføretrygd.
      </BodyShort>
      <VStack gap="space-8">
        <HStack gap="space-16">
          <BodyShort>Du må betale tilbake:</BodyShort>
          <BodyShort>
            <strong>{formatInntekt(etteroppgjor.tilbakekreving)} kroner</strong>
          </BodyShort>
        </HStack>
        <HStack gap="space-16">
          <BodyShort>Du får tilbake fra oss:</BodyShort>
          <BodyShort>
            <strong>{formatInntekt(etteroppgjor.etterbetaling)} kroner</strong>
          </BodyShort>
        </HStack>
        <Link href="https://www.nav.no/uforetrygd#etteroppgjor" target="_blank">
          Her finner du informasjon om etteroppgjøret og hvordan du kan betale tilbake (åpnes i ny fane)
        </Link>
      </VStack>
    </VStack>
  )
}
