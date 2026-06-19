'use client'

import {
  ArrowLeftIcon,
  Chat2FillIcon,
  EnvelopeClosedFillIcon,
  HandShakeHeartFillIcon,
  MobileFillIcon,
  PersonSuitFillIcon,
} from '@navikt/aksel-icons'
import { BodyShort, Button, Heading, HStack, LinkCard, List, VStack } from '@navikt/ds-react'
import { openChatbot } from '@navikt/nav-dekoratoren-moduler'
import Brødsmulesti from '@/components/Brødsmulesti/Brødsmulesti'
import ExpansionCardMedIkon from '@/components/ExpansionCardMedIkon/ExpansionCardMedIkon'
import getEnv from '@/utils/env'

const FinnUtMer = () => {
  const mode = getEnv('MODE')

  return (
    <section style={{ paddingBottom: '4rem' }}>
      <VStack gap="space-24" align={'start'}>
        <Brødsmulesti mode={mode} />
        <HStack gap={'space-12'} align="center">
          <HandShakeHeartFillIcon color={'#7342B6'} fontSize={'3rem'} />
          <Heading size="large" level="2">
            Dine muligheter
          </Heading>
        </HStack>
        {/*<BodyShort weight="semibold">*/}
        {/*  I tillegg til uføretrygden kan du jobbe, studere eller gjøre andre*/}
        {/*  aktiviteter hvis du har mulighet.*/}
        {/*</BodyShort>*/}
        <VStack gap={'space-12'}>
          <ExpansionCardMedIkon
            ikon={<PersonSuitFillIcon color={'#7342B6'} fontSize={'3rem'} />}
            tittel="Få oppfølging på lokalt Nav-kontor"
            undertittel="Du beholder retten til uføretrygd."
          >
            <VStack gap="space-24" align={'start'}>
              <List>
                <List.Item>En veileder kontakter deg for å bli kjent med din situasjon og dine behov</List.Item>
                <List.Item>Dere kan møtes digitalt, på telefon eller på lokalt Nav-kontor</List.Item>
                <List.Item>Veileder vurderer ditt behov for oppfølging og hva du har rett til</List.Item>
                <List.Item>Sammen med veileder lager du en aktivitetsplan</List.Item>
                <List.Item>Du kan når som helst avslutte oppfølgingen</List.Item>
              </List>
              <Button variant={'secondary'} as="a" href="/" arbeidsrettet-oppfolging>
                Les om arbeidsrettet oppfølging
              </Button>
            </VStack>
          </ExpansionCardMedIkon>
          <Heading size="medium" level="3">
            Kontakt oss for en uforpliktende prat om dine muligheter
          </Heading>
          <ExpansionCardMedIkon
            ikon={<Chat2FillIcon color={'#7342B6'} fontSize={'3rem'} />}
            tittel="Chat med oss"
            undertittel="Døgnåpen"
          >
            <VStack gap={'space-24'} align="start">
              <BodyShort>
                Du møter først chatbot Frida som har døgnåpent. Fra kl. 9 til 15 på hverdager kan du be Frida om å få
                chatte med en veileder.
              </BodyShort>
              <Button variant={'secondary'} onClick={() => openChatbot()}>
                Start chatten
              </Button>
            </VStack>
          </ExpansionCardMedIkon>
          <LinkCard aria-label="Skriv til oss" size={'small'}>
            <LinkCard.Icon>
              <EnvelopeClosedFillIcon color={'#7342B6'} fontSize={'3rem'} />
            </LinkCard.Icon>
            <LinkCard.Title>Skriv til oss</LinkCard.Title>
            <LinkCard.Description>Svar innen 1–2 dager</LinkCard.Description>
          </LinkCard>
          <ExpansionCardMedIkon
            ikon={<MobileFillIcon color={'#7342B6'} fontSize={'3rem'} />}
            tittel="Ring oss"
            undertittel="Hverdager 09–15"
          >
            <HStack justify={'space-between'} align="center">
              <VStack>
                <Heading size="medium">55 55 33 33</Heading>
                <BodyShort size="medium">Hverdager 09-15</BodyShort>
              </VStack>
              <Button variant={'secondary'} as="a" href="tel:55 55 33 33">
                Ring nå
              </Button>
            </HStack>
          </ExpansionCardMedIkon>
        </VStack>
        <Button
          icon={<ArrowLeftIcon />}
          variant={'secondary'}
          onClick={() => {
            window.history.back()
          }}
        >
          Gå tilbake
        </Button>
      </VStack>
    </section>
  )
}

export default FinnUtMer
