import { BodyLong, Link, ReadMore, VStack } from '@navikt/ds-react'
import {
  ExpansionCard,
  ExpansionCardContent,
  ExpansionCardHeader,
  ExpansionCardTitle,
} from '@navikt/ds-react/ExpansionCard'
import { format, parseISO } from 'date-fns'
import styles from './dittvedtak.module.css'
import { formatInntekt } from '@/utils/formatter/formatter'
import { getUrl } from '@/utils/getUrl'
import { components } from '@/api/api'
import { getTilleggsoppsummeringTekst } from '@/sections/DittVedtak/utils'

interface IDittVedtak {
  pid?: string
  hasIverksattVedtak: boolean
  dittUforevedtak?: components['schemas']['DittUforevedtak']
  sakId?: string
}

export const DittVedtak: React.FC<IDittVedtak> = async ({ pid, hasIverksattVedtak, dittUforevedtak, sakId }) => {
  if (!hasIverksattVedtak) {
    return null
  }

  const linkInntektsplanlegger = await getUrl({ urlFromEnv: 'LINK_INNTEKTSPLANLEGGER', pid: pid })
  const uforegrad = dittUforevedtak?.uforegrad ?? 0
  const uforesakId = sakId
  const uforetidspunkt =
    dittUforevedtak?.uforetidspunkt && format(parseISO(dittUforevedtak.uforetidspunkt), 'dd.MM.yyyy')
  const uforetrygdInnvilget = dittUforevedtak?.virkFom && format(parseISO(dittUforevedtak.virkFom), 'dd.MM.yyyy')
  const inntektsgrense = formatInntekt(dittUforevedtak?.inntektsgrense) ?? 0
  const sumAvForventedeInntekter = formatInntekt(dittUforevedtak?.sumAvForventedeInntekter) ?? 0
  const hasVarigTilrettelagtArbeid = dittUforevedtak?.hasVarigTilrettelagtArbeid ?? false
  const hasBarnetilleggFellesBarn = dittUforevedtak?.hasBarnetilleggFellesBarn ?? false
  const hasBarnetilleggSaerkullsbarn = dittUforevedtak?.hasBarnetilleggSaerkullsbarn ?? false
  const hasGjenlevendeTillegg = dittUforevedtak?.hasGjenlevendeTillegg ?? false

  const shouldShowTilleggTilUforetrygd =
    hasBarnetilleggFellesBarn || hasBarnetilleggSaerkullsbarn || hasGjenlevendeTillegg

  return (
    <div className={styles.dittVedtakWrapper}>
      <section className={styles.dittVedtak}>
        <ExpansionCard aria-label='Saken din' defaultOpen={true} >
          <ExpansionCardHeader>
            <ExpansionCardTitle>Kort om saken din</ExpansionCardTitle>
          </ExpansionCardHeader>
          <ExpansionCardContent>
            {uforesakId && (
              <BodyLong>
                <strong> Saksnummer: </strong> {uforesakId}{' '}
              </BodyLong>
            )}
            {shouldShowTilleggTilUforetrygd && (
              <BodyLong>
                <strong> Tillegg: </strong>{' '}
                {getTilleggsoppsummeringTekst(
                  hasGjenlevendeTillegg,
                  hasBarnetilleggFellesBarn,
                  hasBarnetilleggSaerkullsbarn
                )}{' '}
              </BodyLong>
            )}
            <BodyLong>
              <strong> Uføregrad: </strong> {uforegrad + ' prosent'}{' '}
            </BodyLong>
            {uforetidspunkt && (
              <BodyLong>
                {' '}
                <strong> Uføretidspunkt: </strong> {uforetidspunkt}{' '}
              </BodyLong>
            )}
            {uforetrygdInnvilget && (
              <BodyLong>
                <strong> Uføretrygd innvilget fra: </strong> {uforetrygdInnvilget}{' '}
              </BodyLong>
            )}
            {hasVarigTilrettelagtArbeid && <>Du har tiltaket Varig tilrettelagt arbeid</>}
            <BodyLong>
              <strong> Registrert forventet inntekt: </strong> {sumAvForventedeInntekter + ' kr'}{' '}
            </BodyLong>

            <VStack gap={'2'}>
              <BodyLong>
                <strong> Inntektsgrense: </strong> {inntektsgrense}&nbsp;kr{' '}
              </BodyLong>

              <ReadMore header={'Hvor kommer registrert forventet inntekt fra?'}>
                <BodyLong>
                  Forventet inntekt kan komme fra dine tidligere registreringer, eller i noen tilfeller fra opplysninger
                  vi har hentet. Forventet inntekt inkluderer arbeidsinntekt, andre ytelser og pensjoner du mottar. Du
                  kan endre registrert forventet inntekt i{' '}
                  <Link href={linkInntektsplanlegger} className={styles.link}>
                    inntektsplanleggeren
                  </Link>
                  .
                </BodyLong>
              </ReadMore>

              <ReadMore header={'Hva er inntektsgrense?'}>
                <BodyLong>
                  Vi reduserer uføretrygden din kun for den delen av inntekten din som overstiger {inntektsgrense}
                  &nbsp;kroner. Bruk{' '}
                  <Link href={linkInntektsplanlegger} className={styles.link}>
                    inntektsplanleggeren
                  </Link>{' '}
                  for å se hvordan inntekt påvirker utbetalingen av uføretrygden din.
                </BodyLong>
              </ReadMore>
            </VStack>
          </ExpansionCardContent>
        </ExpansionCard>
      </section>
    </div>
  )
}
