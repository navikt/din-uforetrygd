package no.nav.dinuforetrygd.uforetrygd

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.async
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withContext
import no.nav.dinuforetrygd.fullmakt.RepresentasjonClient
import no.nav.dinuforetrygd.fullmakt.RepresentasjonClient.Companion.VALID_VERGE_TYPER
import no.nav.dinuforetrygd.inntektskomponenten.InntektskomponentenService
import no.nav.dinuforetrygd.journalpost.Journalpost
import no.nav.dinuforetrygd.journalpost.JournalpostService
import no.nav.dinuforetrygd.pensjon.pen.*
import no.nav.dinuforetrygd.security.RequestContextAsyncContext
import no.nav.dinuforetrygd.security.SecurityContextUtil
import no.nav.dinuforetrygd.security.SecurityCoroutineContext
import no.nav.dinuforetrygd.security.TokenService
import no.nav.dinuforetrygd.util.erRelevant
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class ForsideService(
    private val penService: PenService,
    private val tokenService: TokenService,
    private val representasjonClient: RepresentasjonClient,
    private val journalpostService: JournalpostService,
    private val inntektskomponentenService: InntektskomponentenService,
    private val penClient: PenClient
) {
    private val logger: Logger = LoggerFactory.getLogger(ForsideService::class.java)

    fun hentForsideData(pid: String): UforetrygdResponse = runBlocking {
        withContext(Dispatchers.IO + SecurityCoroutineContext() + RequestContextAsyncContext()) {

            val uforeSak = penService.getSaker(pid).velgSak()
            if (uforeSak == null) return@withContext lagUforetrygdResponse(
                pid = pid,
                sak = uforeSak,
                isVerge = isUforetrygdVerge(pid))


            val vedtakssammendragResponseDeferred = async { penService.getVedtakssammendrag(pid) }
            val sumAvForventedeInntekterDeferred = async { penService.getSumAvForventedeInntekter(pid) }

            val forsideDataDeferred = async {
                try {
                    penClient.hentForsideData(pid, uforeSak.sakId)
                } catch (e: Exception) {
                    logger.warn("Feilet mot forside-data, sak " + uforeSak.sakId, e)
                    null
                }
            }

            val journalposterDeferred = async {
                uforeSak.let {
                    journalpostService.getJournalPostliste(pid, it.sakId.toString())
                        .filter { journalpost -> journalpost.dokumenter.isNotEmpty() }
                }
            }

            val isVergeDeferred = async { isUforetrygdVerge(pid) }

            val vedtakssammendragResponse = vedtakssammendragResponseDeferred.await()
            val sumAvForventedeInntekter = sumAvForventedeInntekterDeferred.await()
            val forsideData = forsideDataDeferred.await()
            val journalposter = journalposterDeferred.await()
            val isVerge = isVergeDeferred.await()

            var inntektFraSkatt = 0.0

            if (vedtakssammendragResponse.hasIverksattVedtak) {
                try {
                    inntektFraSkatt = inntektskomponentenService.getAretsInntektFraSkatt(pid)
                } catch (e: Exception) {
                    logger.warn("Feilet i henting av inntekt for sak: " + uforeSak.sakId + " status: " + uforeSak.status, e)
                }
            }

            return@withContext lagUforetrygdResponse(
                pid = pid,
                sak = uforeSak,
                hasIverksattVedtak = vedtakssammendragResponse.hasIverksattVedtak,
                uforevedtak = vedtakssammendragResponse.vedtakssammendrag?.toDittUforeVedtak(sumAvForventedeInntekter, inntektFraSkatt),
                behandling = forsideData?.let { finnAktivBehandling(forsideData.apentKrav, forsideData.vedtakIverksattSiste7Dager) },
                journalposter = journalposter,
                isVerge = isVerge
            )
        }
    }

    fun finnAktivBehandling(åpentKrav: Krav?, vedtakIverksattSiste7Dager: List<Vedtak>): Behandling? {
        val relevantÅpentKrav: Krav? = åpentKrav?.takeIf { it.erRelevant() }

        val relevantVedtak: Vedtak? = vedtakIverksattSiste7Dager
            .filter { it.erRelevant() }
            .maxByOrNull { it.vedtaksdato }
            .takeIf { relevantÅpentKrav == null }

        if (relevantÅpentKrav == null && relevantVedtak == null) return null

        return relevantÅpentKrav?.let { Behandling.fraKrav(it) }
            ?: Behandling.fraVedtak(relevantVedtak!!)
    }


    private fun List<Sak>.velgSak() = this.minByOrNull { it.status.prioritet }


    private fun lagUforetrygdResponse(
        pid: String,
        sak: Sak?,
        hasIverksattVedtak: Boolean = false,
        uforevedtak: DittUforevedtak? = null,
        behandling: Behandling? = null,
        journalposter: List<Journalpost> = emptyList(),
        isVerge: Boolean
    ) = UforetrygdResponse(
        pid = pid,
        loggetInnSom = tokenService.determineLoggedInUser(),
        sak = sak,
        innloggingstype = tokenService.getInnloggingstype(),
        hasIverksattVedtak = hasIverksattVedtak,
        uforevedtak = uforevedtak,
        journalposter = journalposter,
        behandling = behandling,
        isVerge = isVerge
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

    suspend private fun isUforetrygdVerge(pid: String): Boolean =
        !SecurityContextUtil.isFullmakt() && representasjonClient.harRepresentasjonsforhold(pid, VALID_VERGE_TYPER)?.value ?: false
}