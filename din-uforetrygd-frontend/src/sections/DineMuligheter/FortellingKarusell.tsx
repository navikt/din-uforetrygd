'use client'

import { BodyShort, Box, Pagination, VStack } from '@navikt/ds-react'
import Image from 'next/image'
import { useState } from 'react'
import Bilde1 from './Bilde1.svg'
import Bilde2 from './Bilde2.svg'
import Bilde3 from './Bilde3.svg'
import Bilde4 from './Bilde4.svg'

export default function FortellingKarusell() {
  const [pageState, setPageState] = useState(1)

  return (
    <VStack gap="space-16" justify="center" align={'center'}>
      <Box background={'meta-purple-soft'} width={'100%'}>
        {pageState === 1 && (
          <Box>
            <Image src={Bilde1} alt="Illustrasjon: Kim og et hus" />
            <BodyShort size={'large'} weight={'semibold'}>
              Kim (23) har uføretrygd og har hatt sommerjobb i butikk.
            </BodyShort>
          </Box>
        )}
        {pageState === 2 && (
          <Box>
            <Image src={Bilde2} alt="Illustrasjon: Kim snakker med sjefen sin" />
            <BodyShort size={'large'} weight={'semibold'}>
              Nå spør sjefen til Kim om Kim kan fortsette å jobbe litt utover høsten.
            </BodyShort>
          </Box>
        )}
        {pageState === 3 && (
          <Box>
            <Image src={Bilde3} alt="Illustrasjon: Kim ser usikker ut og tenker på penger" />
            <BodyShort size={'large'} weight={'semibold'}>
              Kim har lyst til å jobbe, men er usikker på hvordan inntekt vil påvirke uføretrygden.
            </BodyShort>
          </Box>
        )}
        {pageState === 4 && (
          <Box>
            <Image src={Bilde4} alt="Illustrasjon: Fornøyd Kim og et søylediagram" />
            <BodyShort size={'large'} weight={'semibold'}>
              Under kan du trykke på ulike inntekter og se hvordan de påvirker Kims uføretrygd.
            </BodyShort>
          </Box>
        )}
      </Box>
      <Pagination page={pageState} count={4} onPageChange={(page) => setPageState(page)} />
    </VStack>
  )
}
