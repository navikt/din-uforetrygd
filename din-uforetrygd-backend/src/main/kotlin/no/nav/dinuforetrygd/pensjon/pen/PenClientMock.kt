package no.nav.dinuforetrygd.pensjon.pen

import no.nav.dinuforetrygd.mock.MockDataLoader
import no.nav.dinuforetrygd.mock.MockScenario
import org.springframework.context.annotation.Profile
import org.springframework.stereotype.Component

/**
 * Mock av PenClient for lokal utvikling. Scenario-navnene speiler "default"/"avsluttet"/
 * "gradert"/"ingen-uforesak"/"barnetillegg" i din-uforetrygd-frontend sine MSW-mocker
 * (mock/mockData.ts, mockUforevedtakData.ts), slik at man kan sette samme ?scenario=-parameter
 * i nettleseren og få konsistent data fra hele stacken (frontend + denne mocken).
 *
 * Selve dataene ligger i src/main/resources/mock/pen/[scenario].json (én fil per scenario,
 * se PenMockData og MockDataLoader) - ingen restart av backend nødvendig for å redigere data.
 *
 * apentKrav/vedtakIverksattSiste7Dager (brukt av hentForsideData/hentBehandlinger) driver
 * "behandling" via ForsideService.finnAktivBehandling/SaksoversiktService og MÅ derfor variere
 * per scenario på samme måte som "behandling" varierer i mockData.ts, ellers blir behandling
 * lik (eller fraværende) for alle scenarioer uansett hva saksammendrag/vedtakssammendrag sier.
 */
@Profile("local & !local-q2")
@Component
class PenClientMock(
    private val mockScenario: MockScenario,
    private val mockDataLoader: MockDataLoader,
) : PenClient {

    private fun currentMockData(): PenMockData =
        mockDataLoader.load("pen", mockScenario.current())

    override fun getSaksammendrag(pid: String): List<SakSammendrag> =
        currentMockData().saksammendrag

    override suspend fun getVedtakssammendragResponse(pid: String): VedtakssammendragResponse =
        currentMockData().vedtakssammendrag

    override suspend fun getForventedeInntekterResponse(pid: String): ForventedeInntekterResponse =
        currentMockData().forventedeInntekter

    override suspend fun hentForsideData(pid: String, sakId: Long): HentForsideDataResponse =
        currentMockData().let {
            HentForsideDataResponse(
                apentKrav = it.apentKrav,
                vedtakIverksattSiste7Dager = it.vedtakIverksattSiste7Dager
            )
        }

    override fun hentBehandlinger(pid: String, sakId: Long): HentBehandlingerResponse =
        currentMockData().let {
            HentBehandlingerResponse(
                apentKrav = it.apentKrav,
                vedtak = it.vedtakIverksattSiste7Dager
            )
        }
}

