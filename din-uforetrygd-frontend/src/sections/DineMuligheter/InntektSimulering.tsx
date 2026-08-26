'use client'

import { BodyShort, Chips, HGrid, InfoCard, Label, LinkCard, VStack } from '@navikt/ds-react'
import { useState } from 'react'
import InntektSimuleringGraf from '@/sections/DineMuligheter/InntektSimuleringGraf'
import getEnv from '@/utils/env'
import { formatInntekt } from '@/utils/formatter/formatter'
import styles from './dineMuligheter.module.css'

interface Uføretrygdendring {
  uføretrygdFør: number
  uføretrygdEtter: number
}

interface Props {
  pid?: string
}

export default function InntektSimulering({ pid }: Props) {
  const uføretrygdFør = 300000
  const defaultMulighet = { uføretrygdFør, uføretrygdEtter: 300000 }
  const valgmuligheterMap = new Map<number, Uføretrygdendring>([
    [0, defaultMulighet],
    [50000, { uføretrygdFør, uføretrygdEtter: 300000 }],
    [150000, { uføretrygdFør, uføretrygdEtter: 290000 }],
    [200000, { uføretrygdFør, uføretrygdEtter: 255000 }],
  ])

  const [valgtInntekt, setValgtInntekt] = useState(0)
  const [valgt, setValgt] = useState<Uføretrygdendring>(defaultMulighet)

  const forklaringAvGraf = () => {
    if (valgtInntekt === 0)
      return `Hvis Kim ikke har inntekt, får Kim ${formatInntekt(valgt.uføretrygdEtter)} kr i uføretrygd i året.`

    const uføretrygdForskjell = Math.abs(valgt.uføretrygdEtter - valgt.uføretrygdFør)
    const sumÅrligUtbetaling = valgt.uføretrygdEtter + valgtInntekt
    const sumEkstra = valgtInntekt - uføretrygdForskjell

    const reduksjonsTekst =
      uføretrygdForskjell === 0
        ? 'reduseres ikke uføretrygden.'
        : `reduseres uføretrygden med ${formatInntekt(uføretrygdForskjell)} kr.`

    return (
      `Hvis Kim har ${formatInntekt(valgtInntekt)} kr i årlig inntekt, ${reduksjonsTekst} ` +
      `Kim får ${formatInntekt(sumEkstra)} kr ekstra. ` +
      `Uføretrygd og inntekt blir til sammen ${formatInntekt(sumÅrligUtbetaling)} kr i året.`
    )
  }

  return (
    <HGrid columns={{ md: 2 }} gap="space-36">
      <VStack gap="space-16" justify="start">
        <InntektSimuleringGraf
          inntektTall={[0, valgtInntekt]}
          uføretrygdTall={[valgt.uføretrygdFør, valgt.uføretrygdEtter]}
        />
        <InfoCard data-color="info" size="small">
          <InfoCard.Message icon="">
            <BodyShort size="small">{forklaringAvGraf()}</BodyShort>
          </InfoCard.Message>
        </InfoCard>
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
        <LinkCard>
          <LinkCard.Title>
            <LinkCard.Anchor href={`${getEnv('LINK_INNTEKTSPLANLEGGER')}${pid && `?pid=${pid}`}`}>
              Se dine tall i inntektsplanleggeren
            </LinkCard.Anchor>
          </LinkCard.Title>
        </LinkCard>
      </VStack>
    </HGrid>
  )
}
