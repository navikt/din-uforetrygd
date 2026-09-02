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
import useIsFullmakt from '@/hooks/useIsFullmakt'
import Divider from '@/sections/ForsideBehandling/Divider'
import styles from './dineMuligheter.module.css'

interface Props {
  pid?: string | undefined
  mode: 'veileder' | 'borger'
  skrivTilOssLenke: string
  startArbeidsoppfølgingLenke: string
}

const SnakkMedOss = ({ pid, mode, skrivTilOssLenke, startArbeidsoppfølgingLenke }: Props) => {
  const erFullmakt = useIsFullmakt()

  return (
    <VStack className={styles.snakkMedOssWrapper} gap={{ xs: 'space-32', md: 'space-48' }}>
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
        <div className={`${styles.fargeContainer} ${styles.graContainer}`}>
          <VStack gap="space-44" className={styles.fargeContainerContent}>
            <VStack gap={{ xs: 'space-12', md: 'space-24' }}>
              <ExpansionCardMedIkon
                ikon={<MobileFillIcon color={'#7342B6'} fontSize={'3rem'} />}
                tittel="Ring oss"
                undertittel="Hverdager 09–15"
              >
                <HGrid align="center" gap="space-24" columns={{ xs: 2, md: 1 }}>
                  <VStack gap="space-8" align="start">
                    <Heading size="medium">55 55 33 30</Heading>
                    <BodyShort>Du kommer direkte til en veileder som kan uføretrygd</BodyShort>
                  </VStack>
                  <VStack justify="center" className={styles.ringKnappWrapper}>
                    <Button as="a" href="tel:55 55 33 30" style={{ maxWidth: 'fit-content' }}>
                      Ring nå
                    </Button>
                  </VStack>
                </HGrid>
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
                      {erFullmakt ? (
                        <>
                          <Dialog.Header>
                            <Dialog.Title>Du kan ikke starte arbeidsrettet oppfølging på vegne av andre</Dialog.Title>
                          </Dialog.Header>
                          <Dialog.Footer>
                            <Dialog.CloseTrigger>
                              <Button variant="primary">Lukk</Button>
                            </Dialog.CloseTrigger>
                          </Dialog.Footer>
                        </>
                      ) : (
                        <>
                          <Dialog.Header>
                            <Dialog.Title>Bekreft at du vil starte oppfølging</Dialog.Title>
                            <Dialog.Description style={{ marginTop: '1rem' }}>
                              Trykker du "Ja” blir du kontaktet av en veileder og starter det vi kaller arbeidsrettet
                              oppfølging. Du forplikter deg ikke til noe ved å starte oppfølging.
                            </Dialog.Description>
                          </Dialog.Header>
                          <Divider style={{ margin: '1rem 0' }} />
                          <Dialog.Body>
                            <Heading size="xsmall" spacing>
                              Uforpliktende veiledning
                            </Heading>
                            <BodyShort spacing>
                              Du forplikter deg ikke til noe bestemt – du trenger ikke å vite hva du vil eller hva som
                              er mulig for deg.
                            </BodyShort>
                            <Heading size="xsmall" spacing>
                              Vi henter personopplysninger
                            </Heading>
                            <BodyShort spacing>
                              Når du starter oppfølging samtykker du til at vi henter opplysninger om alderen din,
                              adresse og oppholdsstatus fra Folkeregisteret.
                            </BodyShort>
                          </Dialog.Body>
                          <Dialog.Footer>
                            <Dialog.CloseTrigger>
                              <Button variant="secondary">Avbryt</Button>
                            </Dialog.CloseTrigger>
                            <Button
                              variant="primary"
                              as="a"
                              href={startArbeidsoppfølgingLenke}
                              arbeidsrettet-oppfolging
                            >
                              Ja, start nå
                            </Button>
                          </Dialog.Footer>
                        </>
                      )}
                    </Dialog.Popup>
                  </Dialog>
                </VStack>
              </ExpansionCardMedIkon>
            </VStack>
            <Button
              icon={<ArrowLeftIcon />}
              as="a"
              variant="secondary"
              href={`/uforetrygd/selvbetjening/dine-muligheter${mode === 'veileder' ? `?pid=${pid}` : ''}`}
            >
              Gå tilbake
            </Button>
          </VStack>
        </div>
      </VStack>
    </VStack>
  )
}

export default SnakkMedOss
