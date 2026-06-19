'use client'

import {
  EarthFillIcon,
  HandShakeHeartFillIcon,
  HatSchoolFillIcon,
  PersonGroupFillIcon,
  PiggybankFillIcon,
} from '@navikt/aksel-icons'
import { BodyLong, BodyShort, Button, Heading, HStack, Link, List, VStack } from '@navikt/ds-react'
import { ExpansionCard } from '@navikt/ds-react/ExpansionCard'
import type { ReactNode } from 'react'
import Brødsmulesti from '@/components/Brødsmulesti/Brødsmulesti'
import getEnv from '@/utils/env'
import styles from './dineMuligheter.module.css'

interface Props {
  ikon: ReactNode
  children: ReactNode
}

const ExpansionCardTittelMedIkon = ({ ikon, children }: Props) => {
  return (
    <HStack wrap={false} gap="space-16" align="center">
      <div>{ikon}</div>
      <div>
        <ExpansionCard.Title as="h4" size="small">
          {children}
        </ExpansionCard.Title>
      </div>
    </HStack>
  )
}

const DineMuligheter = () => {
  const mode = getEnv('MODE')

  return (
    <>
      <section>
        <VStack gap="space-24">
          <VStack gap="space-12">
            <Brødsmulesti mode={mode} />
            <HStack gap={'space-12'} align="center">
              <HandShakeHeartFillIcon color={'#7342B6'} fontSize={'3rem'} />
              <Heading size="large" level="2">
                Dine muligheter
              </Heading>
            </HStack>
            <BodyShort>
              I tillegg til uføretrygden kan du jobbe, studere eller gjøre andre aktiviteter hvis du har mulighet. Du
              beholder retten til uføretrygd.
            </BodyShort>
          </VStack>
          <VStack gap={'space-12'}>
            <ExpansionCard aria-label="Vi kan hjelpe deg" size="small">
              <ExpansionCard.Header>
                <ExpansionCardTittelMedIkon ikon={<PersonGroupFillIcon color={'#7342B6'} fontSize={'3rem'} />}>
                  Vi kan hjelpe deg
                </ExpansionCardTittelMedIkon>
              </ExpansionCard.Header>
              <ExpansionCard.Content>
                <VStack gap="space-12">
                  <BodyShort weight="semibold">Snakk med en veileder</BodyShort>
                  <List>
                    <List.Item>om dine behov og ønsker</List.Item>
                    <List.Item>på telefon, videosamtale eller på ditt lokale kontor</List.Item>
                    <List.Item>om å samarbeide med helsetjenester, barnevern og skole</List.Item>
                  </List>
                </VStack>
              </ExpansionCard.Content>
            </ExpansionCard>
            <ExpansionCard aria-label="Jobb, studier og kompetanse" size="small">
              <ExpansionCard.Header>
                <ExpansionCardTittelMedIkon ikon={<HatSchoolFillIcon color={'#7342B6'} fontSize={'3rem'} />}>
                  Jobb, studier og kompetanse
                </ExpansionCardTittelMedIkon>
              </ExpansionCard.Header>
              <ExpansionCard.Content>
                <VStack gap="space-12">
                  <BodyShort weight="semibold">Studier</BodyShort>
                  <List>
                    <List.Item>fullføre videregående skole</List.Item>
                    <List.Item>få tilrettelegging på studiested</List.Item>
                    <List.Item>finn et studie du har lyst til å begynne på</List.Item>
                  </List>
                  <BodyShort weight="semibold">Jobb og kompetanse</BodyShort>
                  <List>
                    <List.Item>CV, søknad intervju, finne jobb</List.Item>
                    <List.Item>få tilrettelegging på jobb</List.Item>
                    <List.Item>starte egen bedrift</List.Item>
                    <List.Item>kurs, førerkort, frivillig arbeid</List.Item>
                  </List>
                </VStack>
              </ExpansionCard.Content>
            </ExpansionCard>
            <ExpansionCard aria-label="Økonomisk rådgivning" size="small">
              <ExpansionCard.Header>
                <ExpansionCardTittelMedIkon ikon={<PiggybankFillIcon color={'#7342B6'} fontSize={'3rem'} />}>
                  Økonomisk rådgivning
                </ExpansionCardTittelMedIkon>
              </ExpansionCard.Header>
              <ExpansionCard.Content>
                <BodyShort weight="semibold" spacing>
                  Du kan få rådgivning om:
                </BodyShort>
                <List>
                  <List.Item>inntekt og uføretrygd</List.Item>
                  <List.Item>budsjett, lavere utgifter</List.Item>
                  <List.Item>bolig og depositum</List.Item>
                  <List.Item>Husbanken og bostøtte</List.Item>
                  <List.Item>økonomisk sosialhjelp</List.Item>
                  <List.Item>gjeld, namsmann og gjeldsordning</List.Item>
                </List>
              </ExpansionCard.Content>
            </ExpansionCard>
            <ExpansionCard aria-label="Du kan ordne ting selv" size="small">
              <ExpansionCard.Header>
                <ExpansionCardTittelMedIkon ikon={<EarthFillIcon color={'#7342B6'} fontSize={'3rem'} />}>
                  Du kan ordne ting selv
                </ExpansionCardTittelMedIkon>
              </ExpansionCard.Header>
              <ExpansionCard.Content>
                <VStack gap="space-12">
                  <BodyShort>
                    Du trenger ikke kontakte oss om du ønsker å jobbe eller studere. Her finner du nyttig informasjon
                    som kan hjelpe deg på veien:
                  </BodyShort>
                  <BodyShort weight="semibold">Studier</BodyShort>
                  <List>
                    <List.Item>
                      <Link href="https://utdanning.no/interessevelgeren/" target="_blank">
                        finn et studie
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
              </ExpansionCard.Content>
            </ExpansionCard>
          </VStack>
          <Button variant={'primary'} as="a" href="/finn-ut-mer">
            Snakk med oss
          </Button>
        </VStack>
      </section>
      <section className={styles.rosaContainer}>
        <VStack gap="space-12" className={styles.rosaContainerContent}>
          <Heading size="large" level="3">
            Sara (24) fikk hjelp til å finne jobb
          </Heading>
          <BodyLong size="medium">
            Historie fra virkeligheten: slik fikk uføre Sara hjelp til å finne deltidsjobb
          </BodyLong>
          {/*<video controls>*/}
          {/*  <source src="/videos/sara-jobb.mp4" type="video/mp4" />*/}
          {/*</video>*/}
        </VStack>
      </section>
      <section>
        <Heading size="large" level="3">
          Velg ulik inntekt for å se hvordan det kan påvirke uføretrygden til Sara
        </Heading>
      </section>
      <section className={styles.rosaContainer} style={{ paddingBottom: '48px' }}>
        <VStack gap="space-16" className={styles.rosaContainerContent}>
          <Heading size="large" level="3">
            Vi kan hjelpe deg med å utforske mulighetene dine.
          </Heading>
          <Button variant="secondary" as="a" href="/finn-ut-mer">
            Snakk med oss
          </Button>
        </VStack>
      </section>
    </>
  )
}

export default DineMuligheter
