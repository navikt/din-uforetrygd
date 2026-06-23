'use client'

import { BodyShort, Box, Chips, HGrid, HStack, Label, LinkCard, VStack } from '@navikt/ds-react'
import { useState } from 'react'
import InntektSimuleringGraf from '@/sections/DineMuligheter/InntektSimuleringGraf'
import Divider from '@/sections/ForsideBehandling/Divider'
import { formatInntekt } from '@/utils/formatter/formatter'
import styles from './dineMuligheter.module.css'

interface Uføretrygdendring {
  uføretrygdFør: number
  uføretrygdEtter: number
}

export default function InntektSimulering() {
  const valgmuligheterMap = new Map<number, Uføretrygdendring>([
    [0, { uføretrygdFør: 303143, uføretrygdEtter: 303143 }],
    [50000, { uføretrygdFør: 303143, uføretrygdEtter: 303143 }],
    [150000, { uføretrygdFør: 303143, uføretrygdEtter: 293727 }],
    [200000, { uføretrygdFør: 303143, uføretrygdEtter: 258728 }],
  ])

  const [valgtInntekt, setValgtInntekt] = useState(0)
  const [valgt, setValgt] = useState<Uføretrygdendring>({ uføretrygdFør: 303143, uføretrygdEtter: 303143 })

  const finnSumÅrlig = () => valgt.uføretrygdEtter + valgtInntekt
  const finnForskjellUføretrygd = () => valgt.uføretrygdEtter - valgt.uføretrygdFør
  const finnForskjellSumÅrlig = () => valgt.uføretrygdEtter + valgtInntekt - valgt.uføretrygdFør

  return (
    <HGrid columns={{ md: 2 }} gap="space-36">
      <VStack gap="space-12" justify="start">
        <InntektSimuleringGraf
          inntektTall={[0, valgtInntekt]}
          uføretrygdTall={[valgt.uføretrygdFør, valgt.uføretrygdEtter]}
        />

        <Label>Klikk på inntektene</Label>
        <Chips className={styles.inntektSimuleringChips}>
          <HGrid columns={2} gap="space-12">
            {Array.from(valgmuligheterMap, ([key, value]) => (
              <Chips.Toggle
                key={key}
                selected={valgtInntekt === key}
                onClick={() => {
                  setValgtInntekt(key)
                  setValgt(value)
                }}
                style={{ justifyContent: 'start' }}
              >{`${formatInntekt(key)} kr`}</Chips.Toggle>
            ))}
          </HGrid>
        </Chips>
      </VStack>
      <VStack gap="space-36">
        <Box background="neutral-soft" padding="space-12" borderRadius="8" width="100%">
          <VStack gap="space-8">
            <HStack justify="space-between">
              <BodyShort>Saras ekstrainntekt</BodyShort>
              <BodyShort weight="semibold">{`${formatInntekt(valgtInntekt)} kr`}</BodyShort>
            </HStack>
            <Divider />
            <HStack justify="space-between">
              <BodyShort>Saras uføretrygd (100%)</BodyShort>
              <VStack align="end">
                <BodyShort weight="semibold">{`${formatInntekt(valgt.uføretrygdEtter)} kr`}</BodyShort>
                <BodyShort
                  weight="semibold"
                  style={{ fontSize: '16px' }}
                >{`-${formatInntekt(Math.abs(finnForskjellUføretrygd()))} kr`}</BodyShort>
              </VStack>
            </HStack>
            <Divider />

            <HStack justify="space-between">
              <BodyShort weight="semibold">Sum årlig</BodyShort>
              <VStack align="end">
                <BodyShort weight="semibold">{`${formatInntekt(finnSumÅrlig())} kr`}</BodyShort>
                <BodyShort
                  weight="semibold"
                  style={{ fontSize: '16px' }}
                >{`+${formatInntekt(finnForskjellSumÅrlig())} kr`}</BodyShort>
              </VStack>
            </HStack>
          </VStack>
        </Box>
        <LinkCard>
          <LinkCard.Title>
            <LinkCard.Anchor href="inntektsplanleggeren">
              Gå til inntektsplanleggeren for å se dine tall
            </LinkCard.Anchor>
          </LinkCard.Title>
        </LinkCard>
      </VStack>
    </HGrid>
  )
}
