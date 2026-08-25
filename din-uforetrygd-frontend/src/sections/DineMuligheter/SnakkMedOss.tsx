'use client'

import {
  ArrowLeftIcon,
  Chat2FillIcon,
  EnvelopeClosedFillIcon,
  HandShakeHeartFillIcon,
  MobileFillIcon,
  PersonSuitFillIcon,
} from '@navikt/aksel-icons'
import { BodyShort, Button, Dialog, Heading, HGrid, HStack, LinkCard, List, VStack } from '@navikt/ds-react'
import { openChatbot } from '@navikt/nav-dekoratoren-moduler'
import ExpansionCardMedIkon from '@/components/ExpansionCardMedIkon/ExpansionCardMedIkon'
import Divider from '@/sections/ForsideBehandling/Divider'
import useIsFullmakt from '@/hooks/useIsFullmakt'
import getEnv from '@/utils/env'

interface Props {
  pid?: string | undefined
  mode: 'veileder' | 'borger'
}

const SnakkMedOss = ({ pid, mode }: Props) => {
  const erFullmakt = useIsFullmakt()
  // biome-ignore lint/style/noNonNullAssertion: Finnes
  const skrivTilOssLenke = getEnv('LINK_SKRIV_TIL_OSS')!
  // biome-ignore lint/style/noNonNullAssertion: Finnes
  const startArbeidsoppfølgingLenke = getEnv('LINK_START_ARBEIDSOPPFOLGING')!

  return (
    <section style={{ paddingBottom: '4rem' }}>
      <VStack gap="space-24" align={'start'}>
        <HStack gap={'space-12'} align="center">
          <HandShakeHeartFillIcon color={'#7342B6'} fontSize={'3rem'} />
          <Heading size="large" level="2">
            Dine muligheter
          </Heading>
        </HStack>
        <BodyShort weight="semibold" size="large">
          Kontakt oss for en uforpliktende prat om mulighetene dine. Du beholder retten til uføretrygd.
        </BodyShort>
        <HGrid gap={'space-12'} columns={{ md: 2 }}>
          <ExpansionCardMedIkon
            ikon={<MobileFillIcon color={'#7342B6'} fontSize={'3rem'} />}
            tittel="Ring oss"
            undertittel="Hverdager 09–15"
          >
            <HStack align="center" justify="space-between" gap="space-24">
              <VStack maxWidth="55%" gap="space-8" align="start">
                <Heading size="medium">55 55 33 30</Heading>
                <BodyShort>Du kommer direkte til en veileder som kan uføretrygd</BodyShort>
              </VStack>
              <VStack justify="end">
                <Button as="a" href="tel:55 55 33 30">
                  Ring nå
                </Button>
              </VStack>
            </HStack>
          </ExpansionCardMedIkon>
          <ExpansionCardMedIkon
            ikon={<Chat2FillIcon color={'#7342B6'} fontSize={'3rem'} />}
            tittel="Chat med oss"
            undertittel="Døgnåpen"
          >
            <VStack gap={'space-24'} align="start">
              <BodyShort>
                Du kan velge om du vil snakke med NavBot (døgnåpen) eller en veileder (kl. 9–15 på hverdager).
              </BodyShort>
              <Button onClick={() => openChatbot()}>Start chatten</Button>
            </VStack>
          </ExpansionCardMedIkon>
          <LinkCard aria-label="Skriv til oss" size={'small'}>
            <LinkCard.Icon>
              <EnvelopeClosedFillIcon color={'#7342B6'} fontSize={'3rem'} />
            </LinkCard.Icon>
            <LinkCard.Title>
              <LinkCard.Anchor href={skrivTilOssLenke} data-fullmakt-modal={true}>
                Skriv til oss
              </LinkCard.Anchor>
            </LinkCard.Title>
            <LinkCard.Description>Du får svar innen 1–2 dager</LinkCard.Description>
          </LinkCard>
          {!erFullmakt && (
            <ExpansionCardMedIkon
              ikon={<PersonSuitFillIcon color={'#7342B6'} fontSize={'3rem'} />}
              tittel="Start uforpliktende oppfølging"
              undertittel="Med en veileder på ditt lokale Nav-kontor"
            >
              <VStack gap="space-24" align="start">
                <List>
                  <List.Item>
                    En veileder på ditt lokale Nav-kontor kontakter deg så raskt som mulig for å bli kjent med din
                    situasjon og dine behov.
                  </List.Item>
                  <List.Item>Dere kan møtes digitalt, på telefon eller på Nav-kontoret.</List.Item>
                  <List.Item>Du kan når som helst avslutte oppfølgingen.</List.Item>
                </List>
                <Dialog>
                  <Dialog.Trigger>
                    <Button>Start oppfølging</Button>
                  </Dialog.Trigger>
                  <Dialog.Popup position="center">
                    <Dialog.Header>
                      <Dialog.Title>Bekreft at du vil starte oppfølging</Dialog.Title>
                      <Dialog.Description style={{ marginTop: '1rem' }}>
                        Trykker du "Ja, start nå" blir du kontaktet av en veileder og starter det vi kaller
                        arbeidsrettet oppfølging. Du forplikter deg ikke til noe ved å starte oppfølging.
                      </Dialog.Description>
                    </Dialog.Header>
                    <Divider style={{ margin: '1rem 0' }} />
                    <Dialog.Body>
                      <Heading size="xsmall" spacing>
                        Start oppfølging hvis du vil
                      </Heading>
                      <BodyShort spacing>
                        Det forplikter deg ikke til noe bestemt – du trenger ikke å vite hva du vil eller hva som er
                        mulig for deg.
                      </BodyShort>
                      <Heading size="xsmall" spacing>
                        Vi henter personopplysninger
                      </Heading>
                      <BodyShort spacing>
                        Når du starter oppfølgingen, samtykker du til at vi henter opplysninger om din alder, adresse og
                        oppholdsstatus fra Folkeregisteret.
                      </BodyShort>
                    </Dialog.Body>
                    <Dialog.Footer>
                      <Dialog.CloseTrigger>
                        <Button variant="secondary">Avbryt</Button>
                      </Dialog.CloseTrigger>
                      <Button variant="primary" as="a" href={startArbeidsoppfølgingLenke} arbeidsrettet-oppfolging>
                        Ja, start nå
                      </Button>
                    </Dialog.Footer>
                  </Dialog.Popup>
                </Dialog>
              </VStack>
            </ExpansionCardMedIkon>
          )}
        </HGrid>
        <Button
          icon={<ArrowLeftIcon />}
          as="a"
          variant="secondary"
          href={`/uforetrygd/selvbetjening/dine-muligheter${mode === 'veileder' ? `?pid=${pid}` : ''}`}
        >
          Gå tilbake
        </Button>
      </VStack>
    </section>
  )
}

export default SnakkMedOss
