import { ShowMore } from '@/components/ShowMore'
import { BodyShort, Heading, Link, List, VStack } from '@navikt/ds-react'
import { ListItem } from '@navikt/ds-react/List'
import { format, parseISO } from 'date-fns'
import styles from './DittVedtak.module.css'
import { formatInntekt } from '@/utils/formatter/formatter'
import { getUrl } from '@/utils/getUrl'
import { components } from '@/api/api'

interface IDittVedtak {
  pid?: string
  hasIverksattVedtak: boolean
  dittUforevedtak?: components['schemas']['DittUforevedtak']
}

export const DittVedtak: React.FC<IDittVedtak> = async ({ pid, hasIverksattVedtak, dittUforevedtak }) => {
  if (!hasIverksattVedtak) {
    return null
  }

  const linkInntektsplanlegger = await getUrl({ urlFromEnv: 'LINK_INNTEKTSPLANLEGGER', pid: pid })
  const uforegrad = dittUforevedtak?.uforegrad ?? 0
  const uforetidspunkt =
    dittUforevedtak?.uforetidspunkt && format(parseISO(dittUforevedtak.uforetidspunkt), 'dd.MM.yyyy')
  const uforetrygdInnvilget = dittUforevedtak?.virkFom && format(parseISO(dittUforevedtak.virkFom), 'dd.MM.yyyy')
  const inntektsgrense = formatInntekt(dittUforevedtak?.inntektsgrense) ?? 0
  const sumAvForventedeInntekter = formatInntekt(dittUforevedtak?.sumAvForventedeInntekter) ?? 0
  const hasVarigTilrettelagtArbeid = dittUforevedtak?.hasVarigTilrettelagtArbeid ?? false
  const hasBarnetilleggFellesBarn = dittUforevedtak?.hasBarnetilleggFellesBarn ?? false
  const hasBarnetilleggSaerkullsbarn = dittUforevedtak?.hasBarnetilleggSaerkullsbarn ?? false
  const hasGjenlevendeTillegg = dittUforevedtak?.hasGjenlevendeTillegg ?? false
  const currentYear = new Date().getFullYear()

  const shouldShowTilleggTilUforetrygd =
    hasBarnetilleggFellesBarn || hasBarnetilleggSaerkullsbarn || hasGjenlevendeTillegg

  return (
    <div className={styles.dittVedtakWrapper}>
      <section className={styles.dittVedtak}>
        <ShowMore
          heading="Ditt uførevedtak, registrert inntekt og inntektsgrenser"
          aria-labelledby="info-heading"
          collapsedHeight="10rem"
          scrollBackOnCollapse={false}
          variant="subtle"
          as="section"
          headingSize="medium"
          headingLevel="2"
        >
          <VStack gap="6">
            <List>
              <ListItem>Uføregrad {uforegrad} prosent</ListItem>
              {uforetidspunkt && <ListItem>Uføretidspunkt {uforetidspunkt}</ListItem>}
              {uforetrygdInnvilget && <ListItem>Uføretrygd innvilget {uforetrygdInnvilget}</ListItem>}
              {hasVarigTilrettelagtArbeid && <ListItem>Du har tiltaket Varig tilrettelagt arbeid</ListItem>}
            </List>
            {shouldShowTilleggTilUforetrygd && (
              <div>
                <List title="Tillegg til uføretrygden">
                  {hasBarnetilleggFellesBarn && <ListItem>Barnetillegg for fellesbarn</ListItem>}
                  {hasBarnetilleggSaerkullsbarn && <ListItem>Barnetillegg for særkullsbarn</ListItem>}
                  {hasGjenlevendeTillegg && <ListItem>Gjenlevendetillegg</ListItem>}
                </List>
              </div>
            )}
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
                Din registrerte forventede inntekt i {currentYear}: {sumAvForventedeInntekter}&nbsp;kr
              </Heading>
              <BodyShort>
                Forventet inntekt kan komme fra dine tidligere registreringer, eller i noen tilfeller fra opplysninger
                vi har hentet. Du kan endre registrert forventet inntekt i{' '}
                <Link href={linkInntektsplanlegger}>inntektsplanleggeren</Link>.
              </BodyShort>
            </VStack>
          </VStack>
        </ShowMore>
      </section>
    </div>
  )
}
