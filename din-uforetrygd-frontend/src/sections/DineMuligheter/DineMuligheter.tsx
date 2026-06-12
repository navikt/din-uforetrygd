'use client'

import {
  EarthFillIcon,
  HandShakeHeartFillIcon,
  HatSchoolFillIcon,
  PersonGroupFillIcon,
  PiggybankFillIcon,
} from '@navikt/aksel-icons'
import { BodyLong, BodyShort, Button, Heading, HStack, Label, List, VStack } from '@navikt/ds-react'
import { ExpansionCard } from '@navikt/ds-react/ExpansionCard'
import Brødsmulesti from '@/components/Brødsmulesti/Brødsmulesti'
import getEnv from '@/utils/env'

const DineMuligheter = () => {
  const mode = getEnv('MODE')

  return (
    <section style={{ paddingBottom: '4rem' }}>
      <VStack gap="space-24">
        <Brødsmulesti mode={mode} />
        <HStack gap={'space-12'} align="center">
          <HandShakeHeartFillIcon color={'#7342B6'} fontSize={'3rem'} />
          <Heading size="large" level="2">
            Dine muligheter
          </Heading>
        </HStack>
        <BodyShort weight="semibold">
          I tillegg til uføretrygden kan du jobbe, studere eller gjøre andre aktiviteter hvis du har mulighet.
        </BodyShort>
        <VStack gap={'space-12'}>
          <ExpansionCard aria-label="Vi kan hjelpe deg">
            <ExpansionCard.Header>
              <ExpansionCard.Title>
                <HStack gap="space-12" align="center">
                  <PersonGroupFillIcon color={'#7342B6'} fontSize={'3rem'} />
                  Vi kan hjelpe deg
                </HStack>
              </ExpansionCard.Title>
            </ExpansionCard.Header>
            <ExpansionCard.Content>
              <BodyShort weight="semibold">Snakk med en veileder</BodyShort>
              <List>
                <List.Item>om dine behov og ønsker</List.Item>
                <List.Item>på telefon, videosamtale eller på ditt lokale kontor</List.Item>
                <List.Item>om å samarbeide med helsetjenester, barnevern og skole</List.Item>
              </List>
            </ExpansionCard.Content>
          </ExpansionCard>
          <ExpansionCard aria-label="Informasjon om jobb, studier og muligheter">
            <ExpansionCard.Header>
              <ExpansionCard.Title>
                <HStack gap={'space-12'} align="center">
                  <HatSchoolFillIcon color={'#7342B6'} fontSize={'3rem'} />
                  Jobb, studier og kompetanse
                </HStack>
              </ExpansionCard.Title>
            </ExpansionCard.Header>
            <ExpansionCard.Content>
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
            </ExpansionCard.Content>
          </ExpansionCard>
          <ExpansionCard aria-label="Økonomisk rådgivning">
            <ExpansionCard.Header>
              <ExpansionCard.Title>
                <HStack gap={'space-12'} align="center">
                  <PiggybankFillIcon color={'#7342B6'} fontSize={'3rem'} />
                  Økonomisk rådgivning
                </HStack>
              </ExpansionCard.Title>
            </ExpansionCard.Header>
            <ExpansionCard.Content>
              <BodyShort size="medium">Vi tilbyr gratis økonomisk rådgivning</BodyShort>
              <BodyShort as="p" spacing>
                Du kan få rådgivning om
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
          <ExpansionCard aria-label="Jobbe eller studere uten å være i kontakt med oss">
            <ExpansionCard.Header>
              <HStack gap="space-12" align="center">
                <ExpansionCard.Title>
                  <HStack gap={'space-12'} align="center">
                    <EarthFillIcon color={'#7342B6'} fontSize={'3rem'} />
                    Du kan ordne ting selv
                  </HStack>
                </ExpansionCard.Title>
              </HStack>
            </ExpansionCard.Header>
            <ExpansionCard.Content>
              <BodyShort size="medium">
                Du trenger ikke kontakte oss om du ønsker å jobbe eller studere. Her finner du nyttig informasjon som
                kan hjelpe deg på veien:
              </BodyShort>
              <Label as="p" spacing>
                Studier
              </Label>
              <List>
                <List.Item>finne et studie</List.Item>
                <List.Item>søk om studiestøtte fra Lånekassen</List.Item>
              </List>
              <Heading size="medium" level="3">
                Jobb
              </Heading>
              <List>
                <List.Item>jobb for deg som er ung</List.Item>
                <List.Item>verktøy for å finne jobb</List.Item>
              </List>
              <Heading size="medium" level="3">
                Økonomi
              </Heading>
              <List>
                <List.Item>søk om å slette studiegjeld</List.Item>
                <List.Item>søk Husbanken om bostøtte</List.Item>
                <List.Item>se hvordan inntekt påvirker uføretrygd</List.Item>
                <List.Item>starte egen bedrift</List.Item>
                <List.Item>uføretrygd og skatt</List.Item>
              </List>
            </ExpansionCard.Content>
          </ExpansionCard>
          <Button variant={'primary'} as="a" href="/finn-ut-mer">
            Finn ut mer
          </Button>
        </VStack>
        <VStack>
          <Heading size="large" level="3">
            Sara (24) fikk hjelp til å finne jobb
          </Heading>
          <BodyLong size="medium">
            Historie fra virkeligheten: slik fikk uføre Sara hjelp til å finne deltidsjobb
          </BodyLong>
          {/*<video controls>*/}
          {/*  <source src="/videos/sara-jobb.mp4" type="video/mp4" />*/}
          {/*</video>*/}
          <Heading size={'large'} level="3">
            Velg ulik inntekt for å se hvordan det kan påvirke uføretrygden til Sara
          </Heading>
        </VStack>
      </VStack>
    </section>
  )
}

export default DineMuligheter
