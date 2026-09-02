'use client'

import { BodyShort, Chips, HGrid, InfoCard, Label, LinkCard, VStack } from '@navikt/ds-react'
import { useState } from 'react'
import InntektSimuleringGraf from '@/sections/DineMuligheter/InntektSimuleringGraf'
import { formatInntekt } from '@/utils/formatter/formatter'
import styles from './dineMuligheter.module.css'

interface Uføretrygdendring {
  uføretrygdFør: number
  uføretrygdEtter: number
}

interface Props {
  pid?: string
  inntektsplanleggerLenke: string
}

const lagForklaringAvGraf = (valgtInntekt: number, valgt: Uføretrygdendring) => {
  if (valgtInntekt === 0) {
    return (
      <>
        Hvis Kim ikke har inntekt, får Kim <strong>{formatInntekt(valgt.uføretrygdEtter)}&nbsp;kr</strong> i uføretrygd
        i året.
      </>
    )
  }

  const uføretrygdForskjell = Math.abs(valgt.uføretrygdEtter - valgt.uføretrygdFør)
  const sumÅrligUtbetaling = valgt.uføretrygdEtter + valgtInntekt
  const sumEkstra = valgtInntekt - uføretrygdForskjell

  const reduksjonsTekst =
    uføretrygdForskjell === 0 ? (
      'reduseres ikke uføretrygden.'
    ) : (
      <>
        reduseres uføretrygden med <strong>{formatInntekt(uføretrygdForskjell)}&nbsp;kr</strong>.
      </>
    )

  return (
    <>
      Hvis Kim har <strong>{formatInntekt(valgtInntekt)}&nbsp;kr</strong> i årlig inntekt, {reduksjonsTekst} Kim får{' '}
      <strong>{formatInntekt(sumEkstra)}&nbsp;kr</strong> ekstra. Uføretrygd og inntekt blir til sammen{' '}
      <strong>{formatInntekt(sumÅrligUtbetaling)}&nbsp;kr</strong> i året.
    </>
  )
}

export default function InntektSimulering({ pid, inntektsplanleggerLenke }: Props) {
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
  const forklaringAvGraf = lagForklaringAvGraf(valgtInntekt, valgt)
  const grafIntroId = 'inntekt-simulering-graf-intro'

  return (
    <HGrid gap="space-36">
      <VStack gap="space-16" justify="start">
        <BodyShort id={grafIntroId} size="small" className={styles.srOnly}>
          Grafen viser summen av Kims inntekt og uforetrygd uten inntekt og med valgt inntekt.
        </BodyShort>
        <InntektSimuleringGraf
          inntektTall={[0, valgtInntekt]}
          uføretrygdTall={[valgt.uføretrygdFør, valgt.uføretrygdEtter]}
          descriptionId={grafIntroId}
        />
        <InfoCard key={valgtInntekt} className={`${styles.forklaringOppdatert}`} data-color="info" size="small">
          <InfoCard.Message icon="">
            <BodyShort size="small">{forklaringAvGraf}</BodyShort>
          </InfoCard.Message>
        </InfoCard>
      </VStack>
      <VStack gap={{ xs: 'space-24', md: 'space-36' }} className={styles.chipsKolonne}>
        <VStack gap="space-16">
          <Label>Klikk på inntektene</Label>
          <Chips className={styles.inntektSimuleringChips}>
            <HGrid columns={2} gap="space-12">
              {Array.from(valgmuligheterMap, ([key, value]) => (
                <Chips.Toggle
                  key={key}
                  selected={valgtInntekt === key}
                  onClick={() => {
                    if (valgtInntekt === key) {
                      return
                    }
                    setValgtInntekt(key)
                    setValgt(value)
                  }}
                  style={{ justifyContent: 'start' }}
                >{`${formatInntekt(key)} kr`}</Chips.Toggle>
              ))}
            </HGrid>
          </Chips>
        </VStack>
        <div className={styles.srOnly} role="status" aria-live="assertive" aria-atomic="true">
          {forklaringAvGraf}
        </div>
        <LinkCard>
          <LinkCard.Title>
            <LinkCard.Anchor href={`${inntektsplanleggerLenke}${pid ? `?pid=${pid}` : ``}`}>
              Se dine tall i inntektsplanleggeren
            </LinkCard.Anchor>
          </LinkCard.Title>
        </LinkCard>
      </VStack>
    </HGrid>
  )
}
