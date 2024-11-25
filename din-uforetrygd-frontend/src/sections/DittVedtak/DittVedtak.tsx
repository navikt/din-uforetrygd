import { Visningskriterier } from '@/const'
import { ShowMore } from '@/components/ShowMore'
import { BodyShort, Heading, Link, List, VStack } from '@navikt/ds-react'
import { ListItem } from '@navikt/ds-react/List'
import { dittUforevedtak } from '@/api/endpoints'
import { format, parseISO } from 'date-fns'
import styles from './DittVedtak.module.css'
import { formatInntekt } from '@/utils/formatter/formatter'
import { getUrl } from '@/utils/getUrl'

interface IDittVedtak {
  visningskriterier: Visningskriterier[]
  pid?: string
}

export const DittVedtak: React.FC<IDittVedtak> = async ({ visningskriterier, pid }) => {
  if (visningskriterier.includes(Visningskriterier.Uforetrygd)) {
    const linkInntektsplanlegger = await getUrl({ urlFromEnv: 'LINK_INNTEKTSPLANLEGGER', pid: pid })
    const dittUforevedtakData = await dittUforevedtak(pid)
    const uforegrad = dittUforevedtakData?.uforegrad ?? 0
    const uforetidspunkt = format(parseISO(dittUforevedtakData?.uforetidspunkt ?? ''), 'dd.MM.yyyy')
    const uforetrygdInnvilget = format(parseISO(dittUforevedtakData?.virkFom ?? ''), 'dd.MM.yyyy')
    const inntektsgrense = formatInntekt(dittUforevedtakData?.inntektsgrense) ?? 0
    const sumAvForventedeInntekter = formatInntekt(dittUforevedtakData?.sumAvForventedeInntekter) ?? 0
    const hasVarigTilrettelagtArbeid = dittUforevedtakData?.hasVarigTilrettelagtArbeid ?? false
    const hasBarnetilleggFellesBarn = dittUforevedtakData?.hasBarnetilleggFellesBarn ?? false
    const hasBarnetilleggSaerkullsbarn = dittUforevedtakData?.hasBarnetilleggSaerkullsbarn ?? false
    const hasGjenlevendeTillegg = dittUforevedtakData?.hasGjenlevendeTillegg ?? false
    const currentYear = new Date().getFullYear()

    return (
      <div className={styles.dittVedtakWrapper}>
        <section className={styles.dittVedtak}>
          <ShowMore
            heading="Ditt uførevedtak, inntekt og inntektsgrenser"
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
            <Heading level="3" size="small">
              Tillegg til uføretrygden
            </Heading>
            <List>
              {hasBarnetilleggFellesBarn && <ListItem>Barnetillegg for fellesbarn</ListItem>}
              {hasBarnetilleggSaerkullsbarn && <ListItem>Barnetillegg for særkullsbarn</ListItem>}
              {hasGjenlevendeTillegg && <ListItem>Gjenlevendetillegg</ListItem>}
            </List>
            <VStack gap="6">
              <VStack>
                <Heading level="3" size="small">
                  Din inntektsgrense: {inntektsgrense}&nbsp;kr
                </Heading>
                <BodyShort>
                  Tjener du mer enn dette, vil du få lavere utbetaling av uføretrygd. Vi reduserer uføretrygden din av
                  beløpet du tjener over inntektsgrensen. Beløpet opp til inntektsgrensen blir du aldri trukket for.
                  Bruk <Link href={linkInntektsplanlegger}>inntektsplanleggeren</Link> for å se hvordan inntekt påvirker
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
}
