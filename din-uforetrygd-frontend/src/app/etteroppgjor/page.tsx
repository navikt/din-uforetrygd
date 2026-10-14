import { BodyShort, Button, Heading, Link, List, VStack } from '@navikt/ds-react'
import { ListItem } from '@navikt/ds-react/List'
import styles from './etteroppgjor.module.css'
import { isEnabled } from '@/utils/unleash'

const InformasjonOmEtteroppgjor = async () => {
  const skalVise = await isEnabled('din-uforetrygd.etteroppgjor-informasjon')

  if (!skalVise) return null

  return (
    <div className={styles.etteroppgjorContent}>
      <VStack gap="space-24">
        <section>
          <Heading level="2" size="large" spacing>
            Informasjon om etteroppgjøret
          </Heading>
          <BodyShort spacing>
            Hver høst sjekker vi inntektsopplysningene i skatteoppgjøret ditt for å se om du har fått utbetalt riktig
            beløp i uføretrygd året før.{' '}
          </BodyShort>
          <BodyShort spacing>
            Har du hatt en annen inntekt enn den vi brukte da vi beregnet uføretrygden din, beregner vi uføretrygden din
            for det aktuelle året på ny. Dette kalles etteroppgjør.
          </BodyShort>
          <BodyShort spacing>Etteroppgjøret har mange likheter med skatteoppgjøret:</BodyShort>
          <List as="ul" className={styles.etteroppgjorList}>
            <ListItem>Har du fått utbetalt for lite, får du penger tilbake fra oss.</ListItem>
            <ListItem>Har du fått utbetalt for mye, må du betale tilbake.</ListItem>
            <ListItem>
              Har du fått utbetalt riktig beløp hører du ikke fra oss, og du trenger ikke å gjøre noe.
            </ListItem>
          </List>
        </section>
        <section>
          <Heading level="3" size="medium" spacing>
            Vi varsler deg hvis du får etteroppgjør
          </Heading>
          <BodyShort spacing>
            Vi jobber med etteroppgjøret over noen måneder hver høst. Derfor får ikke alle etteroppgjør samtidig. Får du
            et varsel fra oss om etteroppgjør er det viktig at du ser over at beregningen vi har gjort stemmer. Finner
            du feil eller inntekter som skal holdes utenfor må du gi oss beskjed, så vi kan beregne på nytt.
          </BodyShort>
        </section>
        <section>
          <Heading level="3" size="medium" spacing>
            Disse inntektene regnes ikke med i etteroppgjøret
          </Heading>
          <BodyShort spacing>
            Hvis du har fått utbetalt penger etter at du ble ufør, fra arbeid eller hendelser fra før du ble ufør, skal
            de normalt ikke gi deg lavere uføretrygd. Eksempler på inntekter som ikke skal regnes med:
          </BodyShort>
          <Heading level="4" size="small" spacing>
            Erstatning for inntektstap
          </Heading>
          <BodyShort spacing>
            Har du fått erstatning for inntektstap (for eksempel voldsoffererstatning, pasientskade eller yrkesskade),
            skal dette ikke regnes med. Du må sende inn dokumentasjon på hva du har fått utbetalt i erstatning.
          </BodyShort>
          <Button
            variant="secondary"
            className={styles.etteroppgjorKnapp}
            as="a"
            href="https://www.nav.no/fyllut-ettersending/lospost?tema=UFO"
          >
            Send dokumentasjon
          </Button>

          <Heading level="4" size="small" spacing>
            Feriepenger
          </Heading>
          <BodyShort spacing>
            Feriepenger du tjente opp før du fikk innvilget uføretrygd, eller endret uføregrad, skal ikke påvirke
            etteroppgjøret. Du trenger ikke sende dokumentasjon på feriepenger, det holder å skrive eller ringe til oss
            og fortelle oss hvor mye feriepenger du har opptjent.
          </BodyShort>
          <Button variant="secondary" className={styles.etteroppgjorKnapp} as="a" href="https://www.nav.no/kontaktoss">
            Kontakt oss
          </Button>
        </section>
        <section>
          <VStack gap="space-12">
            <Heading level="3" size="medium" spacing>
              Se video om etteroppgjøret
            </Heading>
            <iframe
              className={styles.video}
              title="Vi vil gjerne prate med deg"
              src="https://play2.qbrick.com/qplayer/index.html?accountId=763558&mediaId=9bd4d650-a724-45ea-bd41-0d0f1fe20adf&configId=Enterprise"
              allowFullScreen={true}
            />
            <Link href="https://www.nav.no/uforetrygd#etteroppgjor">Du kan lese mer om etteroppgjøret her.</Link>
          </VStack>
        </section>
      </VStack>
    </div>
  )
}
export default InformasjonOmEtteroppgjor
