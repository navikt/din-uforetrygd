import { BodyLong, Heading, Link, VStack } from '@navikt/ds-react'
import Brødsmulesti from '@/components/Brødsmulesti/Brødsmulesti'
import getEnv from '@/utils/env'

const UtbetalingMaiPage = () => {
  const mode = getEnv('MODE')

  return (
    <section style={{ paddingBottom: '4rem' }}>
      <VStack gap="space-24">
        <Brødsmulesti mode={mode} />
        <Heading size="large" level="2">
          Informasjon om kommende utbetalinger
        </Heading>
        <VStack>
          <Heading size="medium" level="3">
            Utbetaling mai
          </Heading>
          <BodyLong size="medium">
            Utbetalingen kommer 13. mai, det er litt tidligere enn vanlig på grunn av nasjonaldagen 17. mai.
          </BodyLong>
        </VStack>
        <VStack>
          <Heading size="medium" level="3">
            Utbetaling juni
          </Heading>
          <BodyLong size="medium">
            Utbetalingen kommer den 19. juni. Det er ikke skattetrekk på denne utbetalingen. Etterbetaling etter
            justeringen av grunnbeløpet kommer som hovedregel på utbetalingen i juni, og vil inneholde etterbetaling fra
            mai. Det trekkes skatt av etterbetalingen.
          </BodyLong>
        </VStack>
        <VStack>
          <Heading size="medium" level="3">
            Justering av grunnbeløpet (G)
          </Heading>
          <BodyLong size="medium">
            Grunnbeløpet (G) justeres med virkning fra 1. mai hvert år. Justeringen pleier å følge lønnsveksten. Nytt
            grunnbeløp blir bestemt i trygdeoppgjøret som er forventet rundt den 20. mai. Du kan normalt se kommende
            utbetaling omtrent en uke før utbetalingsdato på{' '}
            <Link href={'http://nav.no/utbetalingsoversikt'}>nav.no/utbetalingsoversikt</Link>
          </BodyLong>
        </VStack>
      </VStack>
    </section>
  )
}

export default UtbetalingMaiPage
