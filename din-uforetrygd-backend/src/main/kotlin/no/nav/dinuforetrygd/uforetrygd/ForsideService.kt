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
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class ForsideService(
    private val penService: PenService,
    private val tokenService: TokenService,
    private val representasjonClient: RepresentasjonClient,
    private val inntektskomponentenService: InntektskomponentenService,
    private val penClient: PenClient,
    private val journalpostService: JournalpostService,
) {
    private val logger: Logger = LoggerFactory.getLogger(ForsideService::class.java)

    fun hentForsideData(pid: String): UforetrygdResponse = runBlocking {
        withContext(Dispatchers.IO + SecurityCoroutineContext() + RequestContextAsyncContext()) {

            val uforeSak = penService.getSaker(pid).velgSak()
            if (uforeSak == null) return@withContext lagUforetrygdResponse(
                pid = pid,
                sak = null,
                erVerge = isUforetrygdVerge(pid)
            )

            val vedtakssammendragResponseDeferred = async { penService.getVedtakssammendrag(pid) }
            val forsideDataDeferred = async {
                try {
                    penClient.hentForsideData(pid, uforeSak.sakId)
                } catch (e: Exception) {
                    logger.warn("Feilet mot forside-data, sak " + uforeSak.sakId, e)
                    null
                }
            }
            val erVergeDeferred = async { isUforetrygdVerge(pid) }

            val vedtakssammendragResponse = vedtakssammendragResponseDeferred.await()
            val forsideData = forsideDataDeferred.await()
            val erVerge = erVergeDeferred.await()

            return@withContext lagUforetrygdResponse(
                pid = pid,
                sak = uforeSak,
                hasIverksattVedtak = vedtakssammendragResponse.hasIverksattVedtak,
                uforegrad = vedtakssammendragResponse.vedtakssammendrag?.uforegrad,
                behandling = forsideData?.let { finnAktivBehandling(forsideData.apentKrav, forsideData.vedtakIverksattSiste7Dager) },
                erVerge = erVerge
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
        uforegrad: Int? = null,
        behandling: Behandling? = null,
        erVerge: Boolean
    ) = UforetrygdResponse(
        pid = pid,
        sak = sak,
        innloggingstype = tokenService.getInnloggingstype(),
        hasIverksattVedtak = hasIverksattVedtak,
        uforegrad = uforegrad,
        behandling = behandling,
        erVerge = erVerge
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

    fun hentUforevedtak(pid: String): DittUforevedtak? = runBlocking {
        withContext(Dispatchers.IO + SecurityCoroutineContext() + RequestContextAsyncContext()) {
            val uforeSak = penService.getSaker(pid).velgSak()
                ?: return@withContext null

            val vedtakssammendragResponseDeferred = async { penService.getVedtakssammendrag(pid) }
            val sumAvForventedeInntekterDeferred = async { penService.getSumAvForventedeInntekter(pid) }

            val vedtakssammendragResponse = vedtakssammendragResponseDeferred.await()
            val sumAvForventedeInntekter = sumAvForventedeInntekterDeferred.await()

            if (!vedtakssammendragResponse.hasIverksattVedtak) return@withContext null

            var inntektFraSkatt = 0.0
            try {
                inntektFraSkatt = inntektskomponentenService.getAretsInntektFraSkatt(pid)
            } catch (e: Exception) {
                logger.warn("Feilet i henting av inntekt for sak: " + uforeSak.sakId + " status: " + uforeSak.status, e)
            }

            return@withContext vedtakssammendragResponse.vedtakssammendrag?.toDittUforeVedtak(sumAvForventedeInntekter, inntektFraSkatt)
        }
    }

    fun hentJournalposter(pid: String): List<Journalpost> = runBlocking {
        withContext(Dispatchers.IO + SecurityCoroutineContext() + RequestContextAsyncContext()) {

            val uforeSak = penService.getSaker(pid).minByOrNull { it.status.prioritet }
                ?: return@withContext emptyList()

            val journalposter = journalpostService.getJournalPostliste(pid, uforeSak.sakId.toString())
                    .filter { it.dokumenter.isNotEmpty() }

            return@withContext journalposter
        }
    }
}