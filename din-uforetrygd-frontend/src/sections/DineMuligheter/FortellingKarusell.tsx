'use client'

import { BodyShort, Box, Pagination, VStack } from '@navikt/ds-react'
import Image from 'next/image'
import { useRef, useState } from 'react'
import Bilde1 from './Bilde1.svg'
import Bilde2 from './Bilde2.svg'
import Bilde3 from './Bilde3.svg'
import Bilde4 from './Bilde4.svg'
import styles from './dineMuligheter.module.css'

const slides = [
  {
    bilde: Bilde1,
    alt: 'Illustrasjon: Kim og et hus',
    tekst: 'Kim (23) har uføretrygd og har hatt sommerjobb i butikk.',
  },
  {
    bilde: Bilde2,
    alt: 'Illustrasjon: Kim snakker med sjefen sin',
    tekst: 'Nå spør sjefen til Kim om Kim kan fortsette å jobbe litt utover høsten.',
  },
  {
    bilde: Bilde3,
    alt: 'Illustrasjon: Kim ser usikker ut og tenker på penger',
    tekst: 'Kim har lyst til å jobbe, men er usikker på hvordan inntekt vil påvirke uføretrygden.',
  },
  {
    bilde: Bilde4,
    alt: 'Illustrasjon: Fornøyd Kim og et søylediagram',
    tekst: 'Under kan du trykke på ulike inntekter og se hvordan de påvirker Kims uføretrygd.',
  },
]

export default function FortellingKarusell() {
  const [karusellState, setKarusellState] = useState(1)
  const karusellRef = useRef<HTMLDivElement>(null)

  const scrollToPage = (page: number) => {
    const karusell = karusellRef.current
    const slide = karusell?.children.item(page - 1) as HTMLElement | null
    if (!karusell || !slide) return

    karusell.scrollTo({ left: slide.offsetLeft, behavior: 'smooth' })
    setKarusellState(page)
  }

  const oppdaterKarusellState = () => {
    const karusell = karusellRef.current
    if (!karusell || karusell.clientWidth === 0) return

    const page = Math.round(karusell.scrollLeft / karusell.clientWidth) + 1
    setKarusellState(Math.min(Math.max(page, 1), slides.length))
  }

  return (
    <VStack gap="space-16" justify="center" align={'center'}>
      <Box background={'meta-purple-soft'} width={'100%'}>
        <section
          ref={karusellRef}
          className={styles.fortellingKarusell}
          onScroll={oppdaterKarusellState}
          aria-label="Fortelling om Kim"
        >
          {slides.map((slide) => (
            <Box className={styles.fortellingSlide} key={slide.tekst}>
              <Image className={styles.fortellingBilde} src={slide.bilde} alt={slide.alt} />
              <BodyShort size="large" weight="semibold">
                {slide.tekst}
              </BodyShort>
            </Box>
          ))}
        </section>
      </Box>
      <Pagination page={karusellState} count={slides.length} onPageChange={scrollToPage} />
    </VStack>
  )
}
