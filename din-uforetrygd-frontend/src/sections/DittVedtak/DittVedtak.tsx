import { ShowMore } from '@/components/ShowMore'
import { BodyShort, Heading, Link, List, VStack } from '@navikt/ds-react'
import { ListItem } from '@navikt/ds-react/List'
import { dittUforevedtak } from '@/api/endpoints'
import { format, parseISO } from 'date-fns'
import styles from './DittVedtak.module.css'
import { formatInntekt } from '@/utils/formatter/formatter'
import { getUrl } from '@/utils/getUrl'

interface IDittVedtak {
  pid?: string
}

export const DittVedtak: React.FC<IDittVedtak> = async ({ pid }) => {
  const dittUforevedtakData = await dittUforevedtak(pid)

  if (dittUforevedtakData?.hasIverksattVedtak === false) {
    return null
  }

  const dittVedtak = dittUforevedtakData?.dittUforevedtak
  const linkInntektsplanlegger = await getUrl({ urlFromEnv: 'LINK_INNTEKTSPLANLEGGER', pid: pid })
  const uforegrad = dittVedtak?.uforegrad ?? 0
  const uforetidspunkt = format(parseISO(dittVedtak?.uforetidspunkt ?? ''), 'dd.MM.yyyy')
  const uforetrygdInnvilget = format(parseISO(dittVedtak?.virkFom ?? ''), 'dd.MM.yyyy')
  const inntektsgrense = formatInntekt(dittVedtak?.inntektsgrense) ?? 0
  const sumAvForventedeInntekter = formatInntekt(dittVedtak?.sumAvForventedeInntekter) ?? 0
  const hasVarigTilrettelagtArbeid = dittVedtak?.hasVarigTilrettelagtArbeid ?? false
  const hasBarnetilleggFellesBarn = dittVedtak?.hasBarnetilleggFellesBarn ?? false
  const hasBarnetilleggSaerkullsbarn = dittVedtak?.hasBarnetilleggSaerkullsbarn ?? false
  const hasGjenlevendeTillegg = dittVedtak?.hasGjenlevendeTillegg ?? false
  const currentYear = new Date().getFullYear()

  const shouldShowTilleggTilUforetrygd =
    hasBarnetilleggFellesBarn || hasBarnetilleggSaerkullsbarn || hasGjenlevendeTillegg

  return (
    <div className={styles.dittVedtakWrapper}>
      <section className={styles.dittVedtak}>
        <ShowMore
          heading="Ditt uførevedtak, registrertinntekt og inntektsgrenser"
          aria-labelledby="info-heading"
          collapsedHeight="10rem"
          scrollBackOnCollapse={false}
          variant="subtle"
          as="section"
          headingSize="medium"
          headingLevel="2"
        >
          <List>
            <ListItem>Uføregrad {uforegrad} prosent</ListItem>
            <ListItem>Uføretidspunkt {uforetidspunkt}</ListItem>
            <ListItem>Uføretrygd innvilget {uforetrygdInnvilget}</ListItem>
            {hasVarigTilrettelagtArbeid && <ListItem>Du har tiltaket Varig tilrettelagt arbeid</ListItem>}
          </List>
          {shouldShowTilleggTilUforetrygd && (
            <>
              <Heading level="3" size="small">
                Tillegg til uføretrygden
              </Heading>
              <List>
                {hasBarnetilleggFellesBarn && <ListItem>Barnetillegg for fellesbarn</ListItem>}
                {hasBarnetilleggSaerkullsbarn && <ListItem>Barnetillegg for særkullsbarn</ListItem>}
                {hasGjenlevendeTillegg && <ListItem>Gjenlevendetillegg</ListItem>}
              </List>
            </>
          )}
          <VStack gap="6">
            <VStack>
              <Heading level="3" size="small">
                Din inntektsgrense: {inntektsgrense}&nbsp;kr
              </Heading>
              <BodyShort>
                Tjener du mer enn dette, vil du få lavere utbetaling av uføretrygd. Vi reduserer uføretrygden din av
                beløpet du tjener over inntektsgrensen. Beløpet opp til inntektsgrensen blir du aldri trukket for. Bruk
                <Link href={linkInntektsplanlegger}>inntektsplanleggeren</Link> for å se hvordan inntekt påvirker
                utbetalingen av uføretrygden din.
              </BodyShort>
            </VStack>
            <VStack>
              <Heading level="3" size="small">
                Din registrerte inntekt i {currentYear}: {sumAvForventedeInntekter}&nbsp;kr
              </Heading>
              <BodyShort>
                Forventet inntekt kan komme fra dine tidligere registreringer, eller i noen tilfeller fra opplysninger
                vi har hentet. Du kan endre registrert inntekt i{' '}
                <Link href={linkInntektsplanlegger}>inntektsplanleggeren</Link>.
              </BodyShort>
            </VStack>
          </VStack>
        </ShowMore>
      </section>
    </div>
  )
}
