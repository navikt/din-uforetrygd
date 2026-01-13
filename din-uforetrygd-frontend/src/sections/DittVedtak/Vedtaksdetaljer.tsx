'use client'

import { BodyLong, BodyShort, Heading, Link, ReadMore, Table, VStack } from '@navikt/ds-react'
import { components } from '@/api/api'
import { format, parseISO } from 'date-fns'
import { formatInntekt } from '@/utils/formatter/formatter'
import { getTilleggsoppsummeringTekst } from '@/sections/DittVedtak/utils'
import styles from '@/sections/DittVedtak/dittvedtak.module.css'

interface VedtaksdetaljerProps {
  dittUforevedtak: components['schemas']['DittUforevedtak']
  sakId?: string
  linkInntektsplanlegger: string | undefined
}

export function Vedtaksdetaljer({
  dittUforevedtak,
  sakId,
  linkInntektsplanlegger,
}: VedtaksdetaljerProps) {
  const uforegrad = dittUforevedtak.uforegrad
  const uforetidspunkt =
    dittUforevedtak.uforetidspunkt && format(parseISO(dittUforevedtak.uforetidspunkt), 'dd.MM.yyyy')
  const uforetrygdInnvilget = dittUforevedtak.virkFom && format(parseISO(dittUforevedtak.virkFom), 'dd.MM.yyyy')
  const inntektsgrense = formatInntekt(dittUforevedtak.inntektsgrense) ?? 0
  const sumAvForventedeInntekter = formatInntekt(dittUforevedtak.sumAvForventedeInntekter) ?? 0
  const hasVarigTilrettelagtArbeid = dittUforevedtak.hasVarigTilrettelagtArbeid
  const hasBarnetilleggFellesBarn = dittUforevedtak.hasBarnetilleggFellesBarn
  const hasBarnetilleggSaerkullsbarn = dittUforevedtak.hasBarnetilleggSaerkullsbarn
  const hasGjenlevendeTillegg = dittUforevedtak.hasGjenlevendeTillegg

  return (
    <VStack gap="2">
      <Table>
        <Table.Header>
          <Table.Row>
            <Heading size="medium">Om saken din</Heading>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.DataCell>Saksnummer</Table.DataCell>
            <Table.DataCell align="right">{sakId}</Table.DataCell>
          </Table.Row>
          <Table.Row>
            <Table.DataCell>Uføregrad</Table.DataCell>
            <Table.DataCell align="right">{uforegrad} prosent</Table.DataCell>
          </Table.Row>
          <Table.Row>
            <Table.DataCell>Tillegg</Table.DataCell>
            <Table.DataCell align="right">
              {getTilleggsoppsummeringTekst(
                hasGjenlevendeTillegg,
                hasBarnetilleggFellesBarn,
                hasBarnetilleggSaerkullsbarn
              )}
            </Table.DataCell>
          </Table.Row>
          <Table.Row>
            <Table.DataCell>Uføretidspunkt</Table.DataCell>
            <Table.DataCell align="right">{uforetidspunkt}</Table.DataCell>
          </Table.Row>
          <Table.Row>
            <Table.DataCell>Innvilget fra</Table.DataCell>
            <Table.DataCell align="right">{uforetrygdInnvilget}</Table.DataCell>
          </Table.Row>
          <Table.Row>
            <Table.DataCell>Tiltak</Table.DataCell>
            <Table.DataCell align="right">
              {hasVarigTilrettelagtArbeid ? <BodyShort>Varig tilrettelagt arbeid</BodyShort> : '-'}
            </Table.DataCell>
          </Table.Row>
        </Table.Body>
      </Table>
      <Table>
        <Table.Header>
          <Table.Row>
            <Heading size="medium">Uføretrygd</Heading>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.DataCell>Månedlig beregnet uføretrygd og barnetilegg</Table.DataCell>
            <Table.DataCell align="right">{dittUforevedtak?.nettoMndUTOgBT} kr</Table.DataCell>
          </Table.Row>
          <Table.Row>
            <Table.DataCell>Registrert inntekt hos Skatteetaten hittil i år</Table.DataCell>
            <Table.DataCell align="right">-</Table.DataCell>
          </Table.Row>
          <Table.Row>
            <Table.DataCell>Registrert forventet inntekt i {new Date().getFullYear()}</Table.DataCell>
            <Table.DataCell align="right">{sumAvForventedeInntekter} kr</Table.DataCell>
          </Table.Row>
          <Table.Row>
            <Table.DataCell>Fribeløp/bunnfradrag</Table.DataCell>
            <Table.DataCell align="right">- kr</Table.DataCell>
          </Table.Row>
          <Table.Row>
            <Table.DataCell>Kompensasjonsgrad</Table.DataCell>
            <Table.DataCell align="right">{dittUforevedtak?.kompensasjonsgrad} prosent</Table.DataCell>
          </Table.Row>
          <Table.Row>
            <Table.DataCell>Inntektsgrense i  {new Date().getFullYear()}</Table.DataCell>
            <Table.DataCell align="right">{inntektsgrense} kr</Table.DataCell>
          </Table.Row>
        </Table.Body>
      </Table>
      <ReadMore header={'Hvor kommer registrert forventet inntekt fra?'}>
        {' '}
        <BodyLong>
          Forventet inntekt kan komme fra dine tidligere registreringer, eller i noen tilfeller fra opplysninger vi har
          hentet. Forventet inntekt inkluderer arbeidsinntekt, andre ytelser og pensjoner du mottar. Du kan endre
          registrert forventet inntekt i{' '}
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
  )
}
