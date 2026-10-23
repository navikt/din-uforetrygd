package no.nav.dinuforetrygd.pensjon.pen

/**
 * Samler alt mock-data PenClientMock trenger for ett scenario, lest fra én JSON-fil
 * (src/main/resources/mock/pen/[scenario].json) via MockDataLoader. Speiler 1:1 hva
 * PenClientMock faktisk trenger å returnere - endres PenClient-grensesnittet, oppdater
 * denne DTO-en (og alle JSON-filene under mock/pen) tilsvarende.
 *
 * apentKrav/vedtakIverksattSiste7Dager brukes av ForsideService.finnAktivBehandling og
 * SaksoversiktService til å utlede "behandling" - disse må variere per scenario på samme
 * måte som "behandling" varierer per scenario i frontend sine MSW-mocker (mock/mockData.ts),
 * ellers vil alle scenarioer ende opp med samme (eller ingen) behandling uansett.
 */
data class PenMockData(
    val saksammendrag: List<SakSammendrag>,
    val vedtakssammendrag: VedtakssammendragResponse,
    val forventedeInntekter: ForventedeInntekterResponse,
    val apentKrav: Krav? = null,
    val vedtakIverksattSiste7Dager: List<Vedtak> = emptyList(),
)