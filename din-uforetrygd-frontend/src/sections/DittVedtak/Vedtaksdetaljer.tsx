'use client'

import { BodyShort, Box, Heading, HelpText, HGrid, HStack, Link, Table, VStack } from '@navikt/ds-react'
import { components } from '@/api/api'
import { format, parseISO } from 'date-fns'
import { formatInntekt } from '@/utils/formatter/formatter'
import { getManedligBeregnetYtelseTekst, getTilleggsoppsummeringTekst } from '@/sections/DittVedtak/utils'
import styles from '@/sections/DittVedtak/dittvedtak.module.css'
import React from 'react'

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
  const inntektFraSkatt = formatInntekt(dittUforevedtak.inntektFraSkatt)
  const sumAvForventedeInntekter = formatInntekt(dittUforevedtak.sumAvForventedeInntekter) ?? 0
  const hasVarigTilrettelagtArbeid = dittUforevedtak.hasVarigTilrettelagtArbeid
  const hasBarnetilleggFellesBarn = dittUforevedtak.hasBarnetilleggFellesBarn
  const hasBarnetilleggSaerkullsbarn = dittUforevedtak.hasBarnetilleggSaerkullsbarn
  const hasGjenlevendeTillegg = dittUforevedtak.hasGjenlevendeTillegg

  return (
    <>
      <Box>
        <HGrid gap={{xs: "space-32", md: "space-0 space-40"}} columns={{ md: 2 }}>
          <VStack>
            <Heading size="medium">Om saken din</Heading>
            <Table>
              <Table.Body>
                <Table.Row shadeOnHover={false}>
                  <Table.DataCell>Saksnummer</Table.DataCell>
                  <Table.DataCell className={styles.dittVedtakTableSecondColumn} align="right">{sakId}</Table.DataCell>
                </Table.Row>
                <Table.Row shadeOnHover={false}>
                  <Table.DataCell>Uføregrad</Table.DataCell>
                  <Table.DataCell className={styles.dittVedtakTableSecondColumn} align="right">{uforegrad} prosent</Table.DataCell>
                </Table.Row>
                <Table.Row shadeOnHover={false}>
                  <Table.DataCell>Tillegg</Table.DataCell>
                  <Table.DataCell className={styles.dittVedtakTableSecondColumn} align="right">
                    {getTilleggsoppsummeringTekst(
                      hasGjenlevendeTillegg,
                      hasBarnetilleggFellesBarn,
                      hasBarnetilleggSaerkullsbarn
                    )}
                  </Table.DataCell>
                </Table.Row>
                <Table.Row shadeOnHover={false}>
                  <Table.DataCell>Uføretidspunkt</Table.DataCell>
                  <Table.DataCell className={styles.dittVedtakTableSecondColumn} align="right">{uforetidspunkt}</Table.DataCell>
                </Table.Row>
                <Table.Row shadeOnHover={false}>
                  <Table.DataCell>Innvilget fra</Table.DataCell>
                  <Table.DataCell className={styles.dittVedtakTableSecondColumn} align="right">{uforetrygdInnvilget}</Table.DataCell>
                </Table.Row>
                <Table.Row shadeOnHover={false}>
                  <Table.DataCell>Tiltak</Table.DataCell>
                  <Table.DataCell className={styles.dittVedtakTableSecondColumn} align="right">
                    {hasVarigTilrettelagtArbeid ? <BodyShort>Varig tilrettelagt arbeid</BodyShort> : '-'}
                  </Table.DataCell>
                </Table.Row>
              </Table.Body>
            </Table>
          </VStack>
          <VStack>
            <Heading size="medium">Uføretrygd</Heading>
            <Table className={styles.dittVedtakUforetrygdTable}>
              <colgroup>
                <col style={{ width: '65%' }} />
                <col style={{ width: '35%' }} />
              </colgroup>
              <Table.Body>
                <Table.Row shadeOnHover={false}>
                  <Table.DataCell>
                    {getManedligBeregnetYtelseTekst(
                      hasGjenlevendeTillegg,
                      hasBarnetilleggFellesBarn || hasBarnetilleggSaerkullsbarn
                    )}
                  </Table.DataCell>
                  <Table.DataCell className={styles.dittVedtakTableSecondColumn} align="right">{formatInntekt(dittUforevedtak?.nettoUtbetalingMnd)} kr</Table.DataCell>
                </Table.Row>
                <Table.Row shadeOnHover={false}>
                  <Table.DataCell>Registrert inntekt hos Skatteetaten hittil i år</Table.DataCell>
                  <Table.DataCell className={styles.dittVedtakTableSecondColumn} align="right">{inntektFraSkatt} kr</Table.DataCell>
                </Table.Row>
                <Table.Row shadeOnHover={false}>
                  <Table.DataCell>
                    <HStack gap="1">
                      <BodyShort>Registrert forventet inntekt i {arstall}</BodyShort>
                      <HelpText title="Hvor kommer registrert forventet inntekt fra?">
                        Forventet inntekt kan komme fra dine tidligere registreringer, eller i noen tilfeller fra
                        opplysninger vi har hentet. Forventet inntekt inkluderer arbeidsinntekt, andre ytelser og
                        pensjoner du mottar. Du kan endre registrert forventet inntekt i{' '}
                        <Link href={linkInntektsplanlegger} className={styles.link}>
                          inntektsplanleggeren
                        </Link>
                        .
                      </HelpText>
                    </HStack>
                  </Table.DataCell>
                  <Table.DataCell className={styles.dittVedtakTableSecondColumn} align="right">{sumAvForventedeInntekter} kr</Table.DataCell>
                </Table.Row>
                <Table.Row shadeOnHover={false}>
                  <Table.DataCell>
                    <HStack gap="1">
                      <BodyShort>Inntektsgrense</BodyShort>
                      <HelpText title="Hva er inntektsgrense?">
                        Vi reduserer uføretrygden din kun for den delen av inntekten din som overstiger {inntektsgrense}
                        &nbsp;kroner. Bruk{' '}
                        <Link href={linkInntektsplanlegger} className={styles.link}>
                          inntektsplanleggeren
                        </Link>{' '}
                        for å se hvordan inntekt påvirker utbetalingen av uføretrygden din.
                      </HelpText>
                    </HStack>
                  </Table.DataCell>
                  <Table.DataCell className={styles.dittVedtakTableSecondColumn} align="right">{inntektsgrense} kr</Table.DataCell>
                </Table.Row>
                <Table.Row shadeOnHover={false}>
                  <Table.DataCell>Kompensasjonsgrad</Table.DataCell>
                  <Table.DataCell className={styles.dittVedtakTableSecondColumn} align="right">{dittUforevedtak?.kompensasjonsgrad} prosent</Table.DataCell>
                </Table.Row>
                <Table.Row shadeOnHover={false}>
                  <Table.DataCell>Inntektstak i {arstall}</Table.DataCell>
                  <Table.DataCell className={styles.dittVedtakTableSecondColumn} align="right">{inntektstak} kr</Table.DataCell>
                </Table.Row>
              </Table.Body>
            </Table>
          </VStack>
        </HGrid>
      </Box>
    </>
  )
}
