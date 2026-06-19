'use client'

import {
  EarthFillIcon,
  HandShakeHeartFillIcon,
  HatSchoolFillIcon,
  PersonGroupFillIcon,
  PiggybankFillIcon,
} from '@navikt/aksel-icons'
import { BodyLong, BodyShort, Button, Heading, HGrid, HStack, Link, List, VStack } from '@navikt/ds-react'
import Brødsmulesti from '@/components/Brødsmulesti/Brødsmulesti'
import ExpansionCardMedIkon from '@/components/ExpansionCardMedIkon/ExpansionCardMedIkon'
import getEnv from '@/utils/env'
import styles from './dineMuligheter.module.css'

const DineMuligheter = () => {
  const mode = getEnv('MODE')

  return (
    <VStack className={styles.dineMuligheterWrapper} gap="space-48">
      <VStack gap="space-12" maxWidth={'678px'}>
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
      <div>
        <div className={styles.fargeContainer + ' ' + styles.graContainer}>
          <HGrid gap="space-24" columns={{ md: 2 }} className={styles.fargeContainerContent}>
            <ExpansionCardMedIkon
              tittel="Vi kan hjelpe deg"
              ikon={<PersonGroupFillIcon color={'#7342B6'} fontSize={'3rem'} />}
            >
              <VStack gap="space-12">
                <BodyShort weight="semibold">Snakk med en veileder</BodyShort>
                <List>
                  <List.Item>om dine behov og ønsker</List.Item>
                  <List.Item>på telefon, videosamtale eller på ditt lokale kontor</List.Item>
                  <List.Item>om å samarbeide med helsetjenester, barnevern og skole</List.Item>
                </List>
              </VStack>
            </ExpansionCardMedIkon>
            <ExpansionCardMedIkon
              ikon={<HatSchoolFillIcon color={'#7342B6'} fontSize={'3rem'} />}
              tittel="Jobb, studier og kompetanse"
            >
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
            </ExpansionCardMedIkon>
            <ExpansionCardMedIkon
              ikon={<PiggybankFillIcon color={'#7342B6'} fontSize={'3rem'} />}
              tittel="Økonomisk rådgivning"
            >
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
            </ExpansionCardMedIkon>
            <ExpansionCardMedIkon
              ikon={<EarthFillIcon color={'#7342B6'} fontSize={'3rem'} />}
              tittel="
                  Du kan ordne ting selv
            "
            >
              <VStack gap="space-12">
                <BodyShort>
                  Du trenger ikke kontakte oss om du ønsker å jobbe eller studere. Her finner du nyttig informasjon som
                  kan hjelpe deg på veien:
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
                    <Link href="https://www.husbanken.no/person/startlaan/soke-startlaan-og-tilskudd/" target="_blank">
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
            </ExpansionCardMedIkon>
            <Button variant={'primary'} as="a" href="dine-muligheter/finn-ut-mer">
              Snakk med oss
            </Button>
          </HGrid>
        </div>
        <div className={styles.fargeContainer + ' ' + styles.rosaContainer}>
          <VStack gap="space-12" className={styles.fargeContainerContent}>
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
        </div>
      </div>
      <Heading size="large" level="3">
        Velg ulik inntekt for å se hvordan det kan påvirke uføretrygden til Sara
      </Heading>
      <div className={styles.fargeContainer + ' ' + styles.rosaContainer}>
        <HGrid
          gap={{ xs: 'space-24', md: 'space-48', lg: 'space-64' }}
          className={styles.fargeContainerContent}
          columns={{ md: 2 }}
        >
          <VStack gap="space-12">
            <Heading size="large" level="3">
              Vi kan hjelpe deg med å utforske mulighetene dine.
            </Heading>
            <BodyShort>
              Ta kontakt med en veileder, det er uforpliktende og du beholder retten til uføretrygd.{' '}
            </BodyShort>
          </VStack>
          <VStack gap="space-12" justify="center">
            <Button as="a" href="/finn-ut-mer">
              Snakk med oss
            </Button>
          </VStack>
        </HGrid>
      </div>
    </VStack>
  )
}

export default DineMuligheter
