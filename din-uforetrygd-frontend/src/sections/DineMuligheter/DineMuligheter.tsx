'use client'

import {
  HandShakeHeartFillIcon,
  HatSchoolFillIcon,
  PersonGroupFillIcon,
  PersonPencilFillIcon,
  PiggybankFillIcon,
} from '@navikt/aksel-icons'
import { BodyShort, Button, Heading, HGrid, HStack, Link, List, VStack } from '@navikt/ds-react'
import ExpansionCardMedIkon from '@/components/ExpansionCardMedIkon/ExpansionCardMedIkon'
import InntektSimulering from '@/sections/DineMuligheter/InntektSimulering'
import styles from './dineMuligheter.module.css'

interface Props {
  pid?: string | undefined
  mode: 'veileder' | 'borger'
  inntektsplanleggerLenke: string
}

const DineMuligheter = ({ pid, mode, inntektsplanleggerLenke }: Props) => {
  return (
    <VStack className={styles.dineMuligheterWrapper} gap={{ xs: 'space-32', md: 'space-48' }}>
      <VStack gap="space-12">
        <HStack gap={'space-12'} align="center">
          <HandShakeHeartFillIcon color={'#7342B6'} fontSize={'3rem'} />
          <Heading size="large" level="2">
            Dine muligheter
          </Heading>
        </HStack>
        <BodyShort>
          I tillegg til uføretrygden kan du jobbe, ta utdanning eller gjøre andre aktiviteter hvis du har mulighet. Du
          beholder retten til uføretrygd.
        </BodyShort>
      </VStack>
      <div className={`${styles.fargeContainer} ${styles.graContainer}`}>
        <VStack gap={{ xs: 'space-32', md: 'space-40' }} className={styles.fargeContainerContent}>
          <VStack gap={{ xs: 'space-12', md: 'space-24' }}>
            <ExpansionCardMedIkon
              tittel="Veiledning"
              ikon={<PersonGroupFillIcon color={'#7342B6'} fontSize={'3rem'} />}
            >
              <VStack gap="space-12">
                <BodyShort weight="semibold">Du kan få veiledning</BodyShort>
                <List>
                  <List.Item>om arbeidsrettet oppfølging</List.Item>
                  <List.Item>om det du trenger</List.Item>
                  <List.Item>om det du har lyst til å få til</List.Item>
                  <List.Item>på telefon, videosamtale eller på ditt lokale Nav kontor</List.Item>
                </List>
              </VStack>
            </ExpansionCardMedIkon>
            <ExpansionCardMedIkon
              ikon={<HatSchoolFillIcon color={'#7342B6'} fontSize={'3rem'} />}
              tittel="Snakk med oss om jobb, utdanning og muligheter"
            >
              <HGrid gap="space-12" columns={{ xs: 1, md: 2 }}>
                <VStack gap="space-12">
                  <BodyShort weight="semibold">Utdanning</BodyShort>
                  <List>
                    <List.Item>videregående skole</List.Item>
                    <List.Item>få tilrettelegging på studiested</List.Item>
                    <List.Item>finn et studie du har lyst til å begynne på</List.Item>
                  </List>
                </VStack>
                <VStack gap="space-12">
                  <BodyShort weight="semibold">Jobb og muligheter</BodyShort>
                  <List>
                    <List.Item>CV, søknad intervju, finne jobb</List.Item>
                    <List.Item>få tilrettelegging på jobb</List.Item>
                    <List.Item>starte egen bedrift</List.Item>
                    <List.Item>kurs, førerkort, frivillig arbeid</List.Item>
                  </List>
                </VStack>
              </HGrid>
            </ExpansionCardMedIkon>
            <ExpansionCardMedIkon
              ikon={<PiggybankFillIcon color={'#7342B6'} fontSize={'3rem'} />}
              tittel="Snakk med oss om økonomi"
            >
              <HGrid gap="space-8" columns={{ xs: 1, md: 2 }}>
                <List>
                  <List.Item>inntekt og uføretrygd</List.Item>
                  <List.Item>budsjett og utgifter</List.Item>
                  <List.Item>bolig og depositum</List.Item>
                </List>
                <List>
                  <List.Item>startlån og bostøtte fra Husbanken</List.Item>
                  <List.Item>økonomisk sosialhjelp</List.Item>
                  <List.Item>gjeld, namsmann og gjeldsordning</List.Item>
                </List>
              </HGrid>
            </ExpansionCardMedIkon>
            <ExpansionCardMedIkon
              ikon={<PersonPencilFillIcon color={'#7342B6'} fontSize={'3rem'} />}
              tittel="Du kan ordne ting selv"
            >
              <VStack gap="space-12">
                <BodyShort>
                  Vi hjelper deg gjerne, men du trenger ikke kontakte oss om du ønsker å jobbe eller ta utdanning. Her
                  finner du nyttig informasjon som kan hjelpe deg på veien:
                </BodyShort>
                <HGrid columns={{ xs: 1, md: 2 }}>
                  <VStack gap="space-12">
                    <BodyShort weight="semibold">Utdanning</BodyShort>
                    <List>
                      <List.Item>
                        <Link href="https://utdanning.no/interessevelgeren/" target="_blank">
                          utforsk utdanning
                        </Link>
                      </List.Item>
                      <List.Item>
                        <Link href="https://lanekassen.no/nb-NO/stipend-og-lan" target="_blank">
                          søk om studiestøtte fra Lånekassen
                        </Link>
                      </List.Item>
                    </List>
                    <BodyShort weight="semibold">Jobb</BodyShort>
                    <List>
                      <List.Item>
                        <Link href="https://arbeidsplassen.nav.no/ung" target="_blank">
                          jobb for deg som er ung
                        </Link>
                      </List.Item>
                      <List.Item>
                        <Link href="https://karriereveiledning.no/karrierevalg/verktoy-soke-jobb" target="_blank">
                          verktøy for å finne jobb
                        </Link>
                      </List.Item>
                    </List>
                  </VStack>
                  <VStack gap="space-12">
                    <BodyShort weight="semibold">Økonomi</BodyShort>
                    <List>
                      <List.Item>
                        <Link href="https://www.nav.no/okonomi-gjeld" target="_blank">
                          økonomisk rådgiving fra Nav (gratis)
                        </Link>
                      </List.Item>
                      <List.Item>
                        <Link href="https://lanekassen.no/nb-NO/gjeld-og-betaling/ufor" target="_blank">
                          søk om å slette studiegjeld
                        </Link>
                      </List.Item>
                      <List.Item>
                        <Link href="https://www.husbanken.no/person/bostotte/" target="_blank">
                          søk Husbanken om bostøtte
                        </Link>
                      </List.Item>
                      <List.Item>
                        <Link
                          href="https://www.husbanken.no/person/startlaan/soke-startlaan-og-tilskudd/"
                          target="_blank"
                        >
                          startlån fra Husbanken
                        </Link>
                      </List.Item>
                      <List.Item>
                        <Link href="https://info.altinn.no/starte-og-drive/" target="_blank">
                          starte egen bedrift
                        </Link>
                      </List.Item>
                      <List.Item>
                        <Link
                          href="https://www.skatteetaten.no/person/skatt/hjelp-til-riktig-skatt/arbeid-trygd-og-pensjon/pensjon-og-uforetrygd/uforetrygd/uforetrygd-og-skatt---sporsmal-og-svar/"
                          target="_blank"
                        >
                          uføretrygd og skatt
                        </Link>
                      </List.Item>
                    </List>
                  </VStack>
                </HGrid>
              </VStack>
            </ExpansionCardMedIkon>
          </VStack>
          <VStack>
            <Button
              variant={'primary'}
              as="a"
              href={`dine-muligheter/snakk-med-oss${mode === 'veileder' ? `?pid=${pid}` : ''}`}
            >
              Snakk med oss
            </Button>
          </VStack>
        </VStack>
      </div>
      <VStack gap={{ xs: 'space-16', md: 'space-48' }}>
        <Heading size="large" level="3" className={styles.headingKolonne}>
          Se hvordan Kims inntekt kan påvirke uføretrygden
        </Heading>
        <InntektSimulering
          pid={mode === 'veileder' ? pid : undefined}
          inntektsplanleggerLenke={inntektsplanleggerLenke}
        />
      </VStack>

      <div className={`${styles.fargeContainer} ${styles.rosaContainer}`}>
        <VStack gap="space-36" className={styles.fargeContainerContent}>
          <Heading size="large" level="3">
            Snakk med oss om dine muligheter
          </Heading>
          <BodyShort>
            Få hjelp av en veileder til å utforske mulighetene dine. Det er uforpliktende og du beholder retten til
            uføretrygd.
          </BodyShort>
          <Button
            as="a"
            href={`dine-muligheter/snakk-med-oss${mode === 'veileder' ? `?pid=${pid}` : ''}`}
            style={{ width: '100%' }}
          >
            Snakk med oss
          </Button>
        </VStack>
      </div>
    </VStack>
  )
}

export default DineMuligheter
