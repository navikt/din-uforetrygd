package no.nav.dinuforetrygd.uforetrygd

import no.nav.dinuforetrygd.fullmakt.FullmaktClient
import no.nav.dinuforetrygd.inntektskomponenten.InntektskomponentenService
import no.nav.dinuforetrygd.journalpost.JournalpostService
import no.nav.dinuforetrygd.pensjon.pen.*
import no.nav.dinuforetrygd.security.SecurityContextUtil
import no.nav.dinuforetrygd.security.TokenService
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class ForsideService(
    private val penService: PenService,
    private val tokenService: TokenService,
    private val fullmaktClient: FullmaktClient,
    private val journalpostService: JournalpostService,
    private val inntektskomponentenService: InntektskomponentenService,
    private val penClient: PenClient
) {
    private val logger: Logger = LoggerFactory.getLogger(ForsideService::class.java)

    fun hentForsideData(pid: String): UforetrygdResponse {
        val uforeSak = penService.getSaker(pid).velgSak()
        if (uforeSak == null) return lagUforetrygdResponse(pid, uforeSak)

            val vedtakssammendragResponse = penService.getVedtakssammendrag(pid)
            val sumAvForventedeInntekter = penService.getSumAvForventedeInntekter(pid)
            var inntektFraSkatt = 0.0
            if (vedtakssammendragResponse.hasIverksattVedtak) {
                try {
                    inntektFraSkatt = inntektskomponentenService.getAretsInntektFraSkatt(pid)
                } catch (e: Exception) {
                    logger.warn("Feilet i henting av inntekt for sak: " + uforeSak.sakId + " status: " + uforeSak.status, e)
                }
            }
            val forsideData = try {
                penClient.hentForsideData(pid, uforeSak.sakId)
            }
            catch (e: Exception) {
                logger.warn("Feilet mot forside-data, sak " + uforeSak.sakId, e)
                null
            }

            return lagUforetrygdResponse(
                pid = pid,
                sak = uforeSak,
                hasIverksattVedtak = vedtakssammendragResponse.hasIverksattVedtak,
                uforevedtak = vedtakssammendragResponse.vedtakssammendrag?.toDittUforeVedtak(sumAvForventedeInntekter, inntektFraSkatt),
                behandling = forsideData?.let { lagBehandling(forsideData.apentKrav, forsideData.vedtakIverksattSiste7Dager) }
            )
    }


    private fun List<Sak>.velgSak() = this.minByOrNull { it.status.prioritet }


    private fun lagUforetrygdResponse(
        pid: String,
        sak: Sak?,
        hasIverksattVedtak: Boolean = false,
        uforevedtak: DittUforevedtak? = null,
        behandling: ForsideBehandling? = null
    ) = UforetrygdResponse(
        pid = pid,
        loggetInnSom = tokenService.determineLoggedInUser(),
        sak = sak,
        innloggingstype = tokenService.getInnloggingstype(),
        harGammelFullmaktmottaker = harGammelFullmaktEllerVeilder(pid, tokenService.getInnloggingstype()),
        hasIverksattVedtak = hasIverksattVedtak,
        uforevedtak = uforevedtak,
        journalposter = sak?.let {
            journalpostService.getJournalPostliste(pid, it.sakId.toString())
                .filter { journalpost -> journalpost.dokumenter.isNotEmpty() }
        } ?: emptyList(),
        behandling = behandling
    )

    private fun Vedtakssammendrag.toDittUforeVedtak(sumAvForventedeInntekter: Long?, inntektFraSkatt: Double): DittUforevedtak =
        DittUforevedtak(
            uforegrad = this.uforegrad,
            virkFom = this.virkFom,
            uforetidspunkt = this.uforetidspunkt,
            inntektsgrense = this.inntektsgrense,
            inntektstak = this.inntektstak,
            inntektFraSkatt = inntektFraSkatt,
            kompensasjonsgrad = this.kompensasjonsgrad,
            nettoUtbetalingMnd = this.nettoUtbetalingMnd,
            sumAvForventedeInntekter = sumAvForventedeInntekter,
            hasBarnetilleggFellesBarn = this.hasBarnetilleggFellesBarn,
            hasBarnetilleggSaerkullsbarn = this.hasBarnetilleggSaerkullsbarn,
            hasGjenlevendeTillegg = this.hasGjenlevendeTillegg,
            hasVarigTilrettelagtArbeid = this.hasVarigTilrettelagtArbeid,
        )

    private fun harGammelFullmaktEllerVeilder(pid: String, innloggingstype: Innloggingstype): Boolean =
        if (SecurityContextUtil.isFullmakt() || innloggingstype == Innloggingstype.NAV || innloggingstype == Innloggingstype.SYSTEM)
            false // Kaller ikke fullmakt dersom fullmaktscenario eller saksbehandler
        else
            fullmaktClient.harBprofFullmaktmottager(pid)?.value ?: false
}