'use client'

import { BodyShort, Box, Chips, HGrid, HStack, Label, LinkCard, VStack } from '@navikt/ds-react'
import { useState } from 'react'
import InntektSimuleringGraf from '@/sections/DineMuligheter/InntektSimuleringGraf'
import Divider from '@/sections/ForsideBehandling/Divider'
import getEnv from '@/utils/env'
import { formatInntekt } from '@/utils/formatter/formatter'
import { getUrl } from '@/utils/getUrl/getUrl'
import styles from './dineMuligheter.module.css'

interface Uføretrygdendring {
  uføretrygdFør: number
  uføretrygdEtter: number
}

export default function InntektSimulering() {
  const uføretrygdFør = 303143
  const defaultMulighet = { uføretrygdFør, uføretrygdEtter: 303143 }
  const valgmuligheterMap = new Map<number, Uføretrygdendring>([
    [0, defaultMulighet],
    [50000, { uføretrygdFør, uføretrygdEtter: 303143 }],
    [150000, { uføretrygdFør, uføretrygdEtter: 293727 }],
    [200000, { uføretrygdFør, uføretrygdEtter: 258728 }],
  ])

  const [valgtInntekt, setValgtInntekt] = useState(0)
  const [valgt, setValgt] = useState<Uføretrygdendring>(defaultMulighet)

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
        <Box background="neutral-soft" padding="space-16" borderRadius="8">
          <VStack gap="space-16">
            {/*mer space*/}
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
                  size="small"
                >{`-${formatInntekt(Math.abs(valgt.uføretrygdEtter - valgt.uføretrygdFør))} kr`}</BodyShort>
              </VStack>
            </HStack>
            <Divider />

            <HStack justify="space-between">
              <BodyShort weight="semibold">Sum årlig</BodyShort>
              <VStack align="end">
                <BodyShort weight="semibold">{`${formatInntekt(valgt.uføretrygdEtter + valgtInntekt)} kr`}</BodyShort>
                <BodyShort
                  weight="semibold"
                  size="small"
                >{`+${formatInntekt(valgt.uføretrygdEtter + valgtInntekt - valgt.uføretrygdFør)} kr`}</BodyShort>
              </VStack>
            </HStack>
          </VStack>
        </Box>
        <LinkCard>
          <LinkCard.Title>
            {/* TODO: pid må med i veileder-modus. Se InntektSnarveier */}
            <LinkCard.Anchor href={getEnv('LINK_INNTEKTSPLANLEGGER') || ''}>
              Gå til inntektsplanleggeren for å se dine tall
            </LinkCard.Anchor>
          </LinkCard.Title>
        </LinkCard>
      </VStack>
    </HGrid>
  )
}
