import { BodyShort, Button, Heading, List, VStack } from '@navikt/ds-react'
import { ListItem } from '@navikt/ds-react/List'
import { isEnabled } from '@/utils/unleash'
import { notFound } from 'next/navigation'

const MeldeFraOmInntektNesteÅr = async () => {
  const skalVise = await isEnabled('din-uforetrygd.informasjon.inntekt-neste-ar')

  if (!skalVise) return notFound()

  return (
    <div style={{ marginBottom: '56px' }}>
      <VStack gap="space-24">
        <section>
          <Heading level="2" size="large" spacing>
            Nå bør du melde fra om inntekt til neste år
          </Heading>
          <BodyShort spacing>
            Har du hatt inntekt ved siden av uføretrygden i år, eller forventer du å ha inntekt neste år? Da bør du
            melde fra til oss hva du forventer å tjene allerede nå, så blir utbetaling av uføretrygden riktig fra
            januar.
          </BodyShort>
          <BodyShort spacing>
            Har du aldri hatt inntekt ved siden av uføretrygden og heller ikke har planer om å ha det, trenger du ikke å
            gjøre noe.
          </BodyShort>
          <BodyShort spacing>
            Du kan bruke inntektsplanleggeren til å melde fra til oss om forventet inntekt. Du kan også bruke
            inntektsplanleggeren som en kalkulator for å få se hvordan inntekten din påvirker utbetalingen av
            uføretrygd.
          </BodyShort>
          <List as="ul" style={{ marginBottom: '12px' }}>
            <ListItem>
              Skal du ha inntekt i tillegg til uføretrygden? Da legger du inn det beløpet du tror du kommer til å tjene
              ved siden av uføretrygden i inntektsplanleggeren. Du bør også gjøre det hvis du ikke har en endring i
              inntekten din. Du kan endre hva du forventer i inntekt så ofte du trenger.
            </ListItem>
            <ListItem>
              Skal du ikke ha inntekt til neste år lenger? Da registrerer du 0 kroner som forventet inntekt.
            </ListItem>
          </List>
          <Button>Gå til inntektsplanleggeren</Button>
        </section>
        <section>
          <Heading level="3" size="medium" spacing>
            Derfor er det viktig å melde inntekt for neste år
          </Heading>
          <BodyShort spacing>
            Hvis du ikke melder fra om forventet inntekt, tar vi utgangspunkt i inntekten du hadde i år og oppjusterer
            den automatisk fra og med januar neste år. Dette kan føre til at vi legger feil inntekt til grunn når vi
            beregner utbetalingen din. Derfor er det viktig at du melder fra til oss om inntekten du forventer å ha.
          </BodyShort>
        </section>
        <section>
          <Heading level="3" size="medium" spacing>
            Dette skjer hvis du ikke melder fra
          </Heading>
          <BodyShort spacing>
            Hvis du ikke melder fra om inntekt får du et brev fra oss 2. desember. Der ser du beregningen for
            utbetalingen din i januar, hvor den oppjusterte inntekten er lagt til grunn.
          </BodyShort>
          <BodyShort spacing>
            Når du får brevet, har du fortsatt mulighet til å gi oss beskjed eller gjøre endringer i inntekten i
            inntektsplanleggeren. Du kan melde fra om riktig inntekt til og med 31. Desember. Hvis vi ikke får beskjed
            fra deg om en annen inntekt, vil vi beregne uføretrygden etter den inntekten som står i brevet.
          </BodyShort>
        </section>
        <section>
          <VStack gap="space-12">
            <Heading level="3" size="medium" spacing>
              Se video: Inntektsplanleggeren
            </Heading>
            <iframe
              className="video"
              title="Inntektsplanleggeren"
              src="https://play2.qbrick.com/qplayer/index.html?accountId=763558&mediaId=9bd4d650-a724-45ea-bd41-0d0f1fe20adf&configId=Enterprise"
              allowFullScreen={true}
            />
          </VStack>
        </section>
      </VStack>
    </div>
  )
}
export default MeldeFraOmInntektNesteÅr
