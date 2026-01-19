'use client'

import { BodyLong, BodyShort, Box, Heading, HGrid, Link, ReadMore, Table, VStack } from '@navikt/ds-react'
import { components } from '@/api/api'
import { format, parseISO } from 'date-fns'
import { formatInntekt } from '@/utils/formatter/formatter'
import { getTilleggsoppsummeringTekst } from '@/sections/DittVedtak/utils'
import styles from '@/sections/DittVedtak/dittvedtak.module.css'

interface VedtaksdetaljerProps {
  dittUforevedtak: components['schemas']['DittUforevedtak']
  sakId?: string
  linkInntektsplanlegger: string | undefined
  arstall: number
}

export function Vedtaksdetaljer({ dittUforevedtak, sakId, linkInntektsplanlegger, arstall }: VedtaksdetaljerProps) {
  const uforegrad = dittUforevedtak.uforegrad
  const uforetidspunkt =
    dittUforevedtak.uforetidspunkt && format(parseISO(dittUforevedtak.uforetidspunkt), 'dd.MM.yyyy')
  const uforetrygdInnvilget = dittUforevedtak.virkFom && format(parseISO(dittUforevedtak.virkFom), 'dd.MM.yyyy')
  const inntektsgrense = formatInntekt(dittUforevedtak.inntektsgrense) ?? 0
  const inntektstak = formatInntekt(dittUforevedtak.inntektstak) ?? 0
  const sumAvForventedeInntekter = formatInntekt(dittUforevedtak.sumAvForventedeInntekter) ?? 0
  const hasVarigTilrettelagtArbeid = dittUforevedtak.hasVarigTilrettelagtArbeid
  const hasBarnetilleggFellesBarn = dittUforevedtak.hasBarnetilleggFellesBarn
  const hasBarnetilleggSaerkullsbarn = dittUforevedtak.hasBarnetilleggSaerkullsbarn
  const hasGjenlevendeTillegg = dittUforevedtak.hasGjenlevendeTillegg

  return (
    <>
      <Box>
        <HGrid gap="space-0 space-40" columns={{ md: 2}}>
          <VStack>
            <Heading size="medium">Om saken din</Heading>
            <Table>
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
          </VStack>
          <VStack>
            <Heading size="medium">Uføretrygd</Heading>
            <Table>
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
                  <Table.DataCell>Registrert forventet inntekt i {arstall}</Table.DataCell>
                  <Table.DataCell align="right">{sumAvForventedeInntekter} kr</Table.DataCell>
                </Table.Row>
                <Table.Row>
                  <Table.DataCell>Inntektsgrense</Table.DataCell>
                  <Table.DataCell align="right">{inntektsgrense} kr</Table.DataCell>
                </Table.Row>
                <Table.Row>
                  <Table.DataCell>Kompensasjonsgrad</Table.DataCell>
                  <Table.DataCell align="right">{dittUforevedtak?.kompensasjonsgrad} prosent</Table.DataCell>
                </Table.Row>
                <Table.Row>
                  <Table.DataCell>Inntektstak i {arstall}</Table.DataCell>
                  <Table.DataCell align="right">{inntektstak} kr</Table.DataCell>
                </Table.Row>
              </Table.Body>
            </Table>
          </VStack>
        </HGrid>
      </Box>
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
    </>
  )
}
