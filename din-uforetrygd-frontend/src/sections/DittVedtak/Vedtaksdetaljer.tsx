'use client'

import { BodyShort, Box, Heading, HelpText, HGrid, HStack, Link, List, Table, VStack } from '@navikt/ds-react'
import { Events } from '@navikt/nav-dekoratoren-moduler'
import React from 'react'
import type { DittUforevedtak } from '@/api/hentDittUforevedtak'
import styles from '@/sections/DittVedtak/dittvedtak.module.css'
import { SkeletonLoader } from '@/sections/DittVedtak/SkeletonLoader'
import { getManedligBeregnetYtelseTekst, getTilleggsoppsummeringTekst } from '@/sections/DittVedtak/utils'
import { formatDate, formatInntekt } from '@/utils/formatter/formatter'
import { umami } from '@/utils/umami'

interface VedtaksdetaljerProps {
  dittUforevedtakPromise: Promise<DittUforevedtak | null>
  sakId?: string
  linkInntektsplanlegger: string | undefined
  arstall: number
}

export function Vedtaksdetaljer({
  dittUforevedtakPromise,
  sakId,
  linkInntektsplanlegger,
  arstall,
}: VedtaksdetaljerProps) {
  const promise = dittUforevedtakPromise

  return (
    <Box>
      <HGrid gap={{ xs: 'space-32', md: 'space-0 space-40' }} columns={{ md: 2 }}>
        <VStack>
          <Heading size="medium">Om saken din</Heading>
          <Table>
            <Table.Body>
              <Table.Row shadeOnHover={false}>
                <Table.DataCell>Saksnummer</Table.DataCell>
                <Table.DataCell className={styles.dittVedtakTableSecondColumn} align="right">
                  {sakId}
                </Table.DataCell>
              </Table.Row>
              <Table.Row shadeOnHover={false}>
                <Table.DataCell>Uføregrad</Table.DataCell>
                <Table.DataCell className={styles.dittVedtakTableSecondColumn} align="right">
                  <SkeletonLoader promise={promise} render={(verdi) => verdi?.uforegrad} /> prosent
                </Table.DataCell>
              </Table.Row>
              <SkeletonLoader
                promise={promise}
                fallback={<></>}
                render={(verdi) =>
                  (verdi?.hasGjenlevendeTillegg ||
                    verdi?.hasBarnetilleggFellesBarn ||
                    verdi?.hasBarnetilleggSaerkullsbarn) && (
                    <Table.Row shadeOnHover={false}>
                      <Table.DataCell>Tillegg</Table.DataCell>
                      <Table.DataCell className={styles.dittVedtakTableSecondColumn} align="right">
                        {getTilleggsoppsummeringTekst(
                          verdi.hasGjenlevendeTillegg,
                          verdi.hasBarnetilleggFellesBarn,
                          verdi.hasBarnetilleggSaerkullsbarn
                        )}
                      </Table.DataCell>
                    </Table.Row>
                  )
                }
              />
              <Table.Row shadeOnHover={false}>
                <Table.DataCell>Uføretidspunkt</Table.DataCell>
                <Table.DataCell className={styles.dittVedtakTableSecondColumn} align="right">
                  <SkeletonLoader
                    promise={promise}
                    render={(verdi) => verdi?.uforetidspunkt && formatDate(verdi.uforetidspunkt)}
                  />
                </Table.DataCell>
              </Table.Row>
              <Table.Row shadeOnHover={false}>
                <Table.DataCell>Innvilget fra</Table.DataCell>
                <Table.DataCell className={styles.dittVedtakTableSecondColumn} align="right">
                  <SkeletonLoader promise={promise} render={(verdi) => verdi?.virkFom && formatDate(verdi.virkFom)} />
                </Table.DataCell>
              </Table.Row>
              <SkeletonLoader
                promise={promise}
                fallback={<></>}
                render={(verdi) =>
                  verdi?.hasVarigTilrettelagtArbeid && (
                    <Table.Row shadeOnHover={false}>
                      <Table.DataCell>Tiltak</Table.DataCell>
                      <Table.DataCell className={styles.dittVedtakTableSecondColumn} align="right">
                        <BodyShort>Varig tilrettelagt arbeid</BodyShort>
                      </Table.DataCell>
                    </Table.Row>
                  )
                }
              />
            </Table.Body>
          </Table>
        </VStack>
        <VStack>
          <Heading size="medium">Nøkkeltall</Heading>
          <Table className={styles.dittVedtakUforetrygdTable}>
            <colgroup>
              <col style={{ width: '65%' }} />
              <col style={{ width: '35%' }} />
            </colgroup>
            <Table.Body>
              <Table.Row shadeOnHover={false}>
                <Table.DataCell>
                  <SkeletonLoader
                    width="10rem"
                    promise={promise}
                    render={(verdi) =>
                      getManedligBeregnetYtelseTekst(
                        verdi?.hasGjenlevendeTillegg,
                        verdi?.hasBarnetilleggFellesBarn || verdi?.hasBarnetilleggSaerkullsbarn
                      )
                    }
                  />
                </Table.DataCell>
                <Table.DataCell className={styles.dittVedtakTableSecondColumn} align="right">
                  <SkeletonLoader promise={promise} render={(verdi) => formatInntekt(verdi?.nettoUtbetalingMnd)} /> kr
                </Table.DataCell>
              </Table.Row>
              <Table.Row shadeOnHover={false}>
                <Table.DataCell>Registrert inntekt hos Skatteetaten hittil i år</Table.DataCell>
                <Table.DataCell className={styles.dittVedtakTableSecondColumn} align="right">
                  <SkeletonLoader promise={promise} render={(verdi) => formatInntekt(verdi?.inntektFraSkatt)} /> kr
                </Table.DataCell>
              </Table.Row>
              <Table.Row shadeOnHover={false}>
                <Table.DataCell>
                  <HStack gap="space-4">
                    <BodyShort>Registrert forventet inntekt i {arstall}</BodyShort>
                    <HelpText
                      title="Hvor kommer registrert forventet inntekt fra?"
                      onClick={() => umami(Events.HELPTEXT_VIST, { tekst: 'Registrert forventet inntekt' })}
                    >
                      Forventet inntekt kommer fra dine tidligere registreringer, eller i noen tilfeller fra
                      opplysninger vi har hentet. Har du nylig meldt inn inntekt, vil den ikke vises her før den har
                      blitt behandlet hos oss. Du kan endre registrert forventet inntekt i{' '}
                      <Link href={linkInntektsplanlegger} className={styles.link}>
                        inntektsplanleggeren
                      </Link>
                      .
                    </HelpText>
                  </HStack>
                </Table.DataCell>
                <Table.DataCell className={styles.dittVedtakTableSecondColumn} align="right">
                  <SkeletonLoader
                    promise={promise}
                    render={(verdi) => formatInntekt(verdi?.sumAvForventedeInntekter)}
                  />{' '}
                  kr
                </Table.DataCell>
              </Table.Row>
              <Table.Row shadeOnHover={false}>
                <Table.DataCell>
                  <HStack gap="space-4">
                    <BodyShort>Inntektsgrense</BodyShort>
                    <HelpText
                      title="Hva er inntektsgrense?"
                      onClick={() => umami(Events.HELPTEXT_VIST, { tekst: 'Inntektsgrense' })}
                    >
                      Den årlige inntekten du kan ha, før vi reduserer uføretrygden din
                    </HelpText>
                  </HStack>
                </Table.DataCell>
                <Table.DataCell className={styles.dittVedtakTableSecondColumn} align="right">
                  <SkeletonLoader promise={promise} render={(verdi) => formatInntekt(verdi?.inntektsgrense)} /> kr
                </Table.DataCell>
              </Table.Row>
              <Table.Row shadeOnHover={false}>
                <Table.DataCell>
                  <HStack gap="space-4">
                    <BodyShort>Reduksjonsprosent</BodyShort>
                    <HelpText
                      title="Hva er reduksjonsprosent?"
                      onClick={() => umami(Events.HELPTEXT_VIST, { tekst: 'reduksjonsprosent' })}
                    >
                      <BodyShort spacing>
                        Vi trekker en prosent lik reduksjonsprosenten fra uføretrygden av hver krone du tjener over
                        inntektsgrensen din.
                      </BodyShort>

                      <BodyShort spacing>Eksempel:</BodyShort>
                      <List>
                        <List.Item>Kim har en reduksjonsprosent på 70 prosent.</List.Item>
                        <List.Item>
                          For hver krone Kim tjener over inntektsgrensen, trekker vi 70 øre fra uføretrygden til Kim.
                        </List.Item>
                        <List.Item>Hvis Kim tjener 10 000 kroner, trekkes 7 000 kroner fra uføretrygden.</List.Item>
                        <List.Item>
                          Kim beholder lønnen sin på 10 000 kroner, i tillegg til 3 000 kroner i uføretrygden.
                        </List.Item>
                      </List>
                    </HelpText>
                  </HStack>
                </Table.DataCell>
                <Table.DataCell className={styles.dittVedtakTableSecondColumn} align="right">
                  <SkeletonLoader promise={promise} render={(verdi) => verdi?.kompensasjonsgrad} /> prosent
                </Table.DataCell>
              </Table.Row>
              <Table.Row shadeOnHover={false}>
                <Table.DataCell>
                  <HStack gap="space-4">
                    <BodyShort>Inntektstak i {arstall}</BodyShort>{' '}
                    <HelpText
                      title="Hva er inntektstak?"
                      onClick={() => umami(Events.HELPTEXT_VIST, { tekst: 'Inntektstak' })}
                    >
                      Den årlige inntekten du kan ha, før du ikke lenger får utbetalt uføretrygd det aktuelle året.
                      Inntektstaket er 80 prosent av inntekten du hadde før uførhet, oppjustert til dagens verdi.
                    </HelpText>
                  </HStack>
                </Table.DataCell>
                <Table.DataCell className={styles.dittVedtakTableSecondColumn} align="right">
                  <SkeletonLoader promise={promise} render={(verdi) => formatInntekt(verdi?.inntektstak)} /> kr
                </Table.DataCell>
              </Table.Row>
            </Table.Body>
          </Table>
        </VStack>
      </HGrid>
    </Box>
  )
}
