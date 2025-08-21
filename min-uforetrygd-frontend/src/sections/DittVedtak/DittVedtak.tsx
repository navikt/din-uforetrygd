import {BodyLong, Heading, Link, ReadMore, VStack} from '@navikt/ds-react'
import {ExpansionCard, ExpansionCardContent, ExpansionCardHeader, ExpansionCardTitle} from '@navikt/ds-react/ExpansionCard'
import {format, parseISO} from 'date-fns'
import styles from './dittvedtak.module.css'
import {formatInntekt} from '@/utils/formatter/formatter'
import {getUrl} from '@/utils/getUrl'
import {components} from '@/api/api'

interface IDittVedtak {
  pid?: string
  hasIverksattVedtak: boolean
  dittUforevedtak?: components['schemas']['DittUforevedtak'],
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


  function getTilleggsoppsummeringTekst(): string {

    let tilleggsoppsummering: string = ""

    if (hasGjenlevendeTillegg) {
      tilleggsoppsummering += "gjenlevendetillegg"
    }

    if (hasBarnetilleggSaerkullsbarn) {
      if (tilleggsoppsummering.length === 0) {
        tilleggsoppsummering += "barnetillegg for særkullsbarn"
      } else {
        tilleggsoppsummering += ", barnetillegg for særkullsbarn"
      }
    }

    if (hasBarnetilleggFellesBarn) {
      if (tilleggsoppsummering.length === 0) {
        tilleggsoppsummering += "barnetillegg for fellesbarn"
      } else {
        tilleggsoppsummering += ", barnetillegg for fellesbarn"
      }
    }

    return tilleggsoppsummering ? tilleggsoppsummering : "Ingen"
  }

  return (
    <div className={styles.dittVedtakWrapper}>
      <section className={styles.dittVedtak}>
        <ExpansionCard aria-label={"Ditt vedtak"} defaultOpen={true} >
          <ExpansionCardHeader>
            <ExpansionCardTitle> <Heading size={"medium"} level={"3"}> Kort om saken din </Heading></ExpansionCardTitle>
          </ExpansionCardHeader>
          <ExpansionCardContent>


            {uforesakId ?? <BodyLong> <strong> Saksnummer: </strong> {uforesakId} </BodyLong>}
            {shouldShowTilleggTilUforetrygd && <BodyLong> <strong> Tillegg: </strong> {getTilleggsoppsummeringTekst()} </BodyLong>}
            <BodyLong> <strong> Uføregrad: </strong> {uforegrad + " prosent"} </BodyLong>
            {uforetidspunkt && <BodyLong> <strong> Uføretidspunkt: </strong> {uforetidspunkt} </BodyLong>}
            {uforetrygdInnvilget && <BodyLong> <strong> Uføretrygd innvilget: </strong> {uforetrygdInnvilget} </BodyLong>}
            {hasVarigTilrettelagtArbeid && <>Du har tiltaket Varig tilrettelagt arbeid</>}
            <BodyLong> <strong> Forventet registrert inntekt: </strong> {sumAvForventedeInntekter + " kr"} </BodyLong>

            <VStack gap={"2"}>
            <BodyLong> <strong> Inntekstgrense: </strong> {inntektsgrense}&nbsp;kr </BodyLong>


            <ReadMore header={"Hvor kommer forventet registrert inntekt fra?"}>

              <BodyLong>
                Forventet inntekt kan komme fra dine tidligere registreringer, eller i noen tilfeller fra opplysninger vi har hentet.
                Forventet inntekt inkluderer arbeidsinntekt, andre ytelser og pensjoner du mottar.
                Du kan endre registrert forventet inntekt i <Link href={linkInntektsplanlegger}>inntektsplanleggeren</Link>.
              </BodyLong>
            </ReadMore>

            <ReadMore header={"Hva er inntektsgrense?"}>
              <BodyLong>
                Vi reduserer uføretrygden din kun for den delen av inntekten din som overstiger 150 000 kroner.
                Bruk <Link href={linkInntektsplanlegger}>inntektsplanleggeren</Link> for å se hvordan inntekt påvirker utbetalingen av uføretrygden din.
              </BodyLong>

            </ReadMore>
            </VStack>
          </ExpansionCardContent>
        </ExpansionCard>
      </section>
    </div>
  )
}
