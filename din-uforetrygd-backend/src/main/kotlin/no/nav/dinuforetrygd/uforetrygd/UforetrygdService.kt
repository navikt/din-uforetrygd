package no.nav.dinuforetrygd.uforetrygd

import no.nav.dinuforetrygd.fullmakt.FullmaktClient
import no.nav.dinuforetrygd.journalpost.JournalpostService
import no.nav.dinuforetrygd.journalpost.model.EndretAvKode
import no.nav.dinuforetrygd.pensjon.pen.PenService
import no.nav.dinuforetrygd.pensjon.pen.Vedtakssammendrag
import no.nav.dinuforetrygd.security.SecurityContextUtil
import no.nav.dinuforetrygd.security.TokenService
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class UforetrygdService(
    private val penService: PenService,
    private val tokenService: TokenService,
    private val fullmaktClient: FullmaktClient,
    private val journalpostService: JournalpostService
) {
    private val logger: Logger = LoggerFactory.getLogger(UforetrygdService::class.java)

    fun constructUforetrygdResponse(pid: String): UforetrygdResponse {
        val uforeSak = penService.getSaker(pid).velgSak()
        if (uforeSak == null) return constructUforetrygdResponse(pid, uforeSak)

        try {
            val uforeSakshendelser =  penService.penClient.getSaksoversikt(pid, uforeSak.sakId).hendelser
            val vedtakssammendragResponse = penService.getVedtakssammendrag(pid)
            val sumAvForventedeInntekter = penService.getSumAvForventedeInntekter(pid)
            return constructUforetrygdResponse(
                pid = pid,
                sak = uforeSak,
                hasIverksattVedtak = vedtakssammendragResponse.hasIverksattVedtak,
                uforevedtak = vedtakssammendragResponse.vedtakssammendrag?.toDittUforeVedtak(sumAvForventedeInntekter),
                hendelser = uforeSakshendelser
            )
        } catch (e: Exception) {
            logger.warn("Failed to get response from pen when SAK with type UFORETRYGD exists", e)
            return constructUforetrygdResponse(pid, uforeSak)
        }
    }

    private fun List<Sak>.velgSak() = this.minByOrNull { it.status.prioritet }


    private fun constructUforetrygdResponse(
        pid: String,
        sak: Sak?,
        hasIverksattVedtak: Boolean = false,
        uforevedtak: DittUforevedtak? = null,
        hendelser: List<HendelseData>? = null
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
        hendelser = hendelser?.filterNot { it.kravStatus == "AVBRUTT" }?.let { hendelseData -> hendelseData.map { constructSakHendelse(it, pid) } } ?: listOf(),
    )

    private fun Vedtakssammendrag.toDittUforeVedtak(sumAvForventedeInntekter: Long?): DittUforevedtak =
        DittUforevedtak(
            uforegrad = this.uforegrad,
            virkFom = this.virkFom,
            uforetidspunkt = this.uforetidspunkt,
            inntektsgrense = this.inntektsgrense,
            sumAvForventedeInntekter = sumAvForventedeInntekter,
            hasBarnetilleggFellesBarn = this.hasBarnetilleggFellesBarn,
            hasBarnetilleggSaerkullsbarn = this.hasBarnetilleggSaerkullsbarn,
            hasGjenlevendeTillegg = this.hasGjenlevendeTillegg,
            hasVarigTilrettelagtArbeid = this.hasVarigTilrettelagtArbeid
        )

    private fun constructSakHendelse(
        hendelse: HendelseData,
        pid: String,
    ): SakHendelse {
        return SakHendelse(
            type = hendelse.hendelse,
            gjelder = hendelse.kravGjelder,
            arsak = hendelse.kravArsak,
            status = hendelse.kravStatus,
            endretDato = hendelse.endretDato,
            opprettetAv = convertToEndretAvKode(hendelse.opprettetAv, pid)
        )
    }

    private fun convertToEndretAvKode(endretAvString: String?, pid: String): EndretAvKode {
        if (endretAvString == null) {
            return EndretAvKode.UKJENT
        }
        if (endretAvString.lowercase().contains("bpen")
            || endretAvString.lowercase().contains("automatisk")
        ) {
            return EndretAvKode.AUTOMATISK_PROSESS
        }
        if (endretAvString.matches(Regex("^[A-Za-z]\\d{6}\$"))) {
            return EndretAvKode.SAKSBEHANDLER
        }
        if (endretAvString == pid) {
            return EndretAvKode.BRUKER
        }
        if (isFodselsnummer(endretAvString)) {
            return EndretAvKode.FULLMEKTIG
        }
        return EndretAvKode.UKJENT
    }

    private fun isFodselsnummer(fodselsnummer: String): Boolean =
        fodselsnummer.matches(Regex("^\\d{11}\$"))

    private fun harGammelFullmaktEllerVeilder(pid: String, innloggingstype: Innloggingstype): Boolean =
        if (SecurityContextUtil.isFullmakt() || innloggingstype == Innloggingstype.NAV || innloggingstype == Innloggingstype.SYSTEM)
            false // Kaller ikke fullmakt dersom fullmaktscenario eller saksbehandler
        else
            fullmaktClient.harBprofFullmaktmottager(pid)?.value ?: false
}