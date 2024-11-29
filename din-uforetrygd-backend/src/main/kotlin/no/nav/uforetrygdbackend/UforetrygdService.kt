package no.nav.uforetrygdbackend

import no.nav.uforetrygdbackend.fullmakt.FullmaktClient
import no.nav.uforetrygdbackend.pensjon.pen.PenService
import no.nav.uforetrygdbackend.pensjon.pen.Vedtakssammendrag
import no.nav.uforetrygdbackend.security.SecurityContextUtil
import no.nav.uforetrygdbackend.security.TokenService
import org.springframework.stereotype.Service

@Service
class UforetrygdService(
    private val penService: PenService,
    private val tokenService: TokenService,
    private val fullmaktClient: FullmaktClient,
) {
    fun constructUforetrygdResponse(pid: String): UforetrygdResponse {
        val uforeSak = penService.getSaker(pid).filter { it.type == Sakstype.UFORETRYGD }
        if (uforeSak.isEmpty()) return constructUforetrygdResponse(pid, uforeSak)

        val vedtakssammendragResponse = penService.getVedtakssammendrag(pid)
        val sumAvForventedeInntekter = penService.getSumAvForventedeInntekter(pid)
        return constructUforetrygdResponse(
            pid = pid,
            saker = uforeSak,
            hasIverksattVedtak = vedtakssammendragResponse.hasIverksattVedtak,
            uforevedtak = vedtakssammendragResponse.vedtakssammendrag?.toDittUforeVedtak(sumAvForventedeInntekter)
        )
    }

    private fun constructUforetrygdResponse(
        pid: String,
        saker: List<Sak>,
        hasIverksattVedtak: Boolean = false,
        uforevedtak: DittUforevedtak? = null,
    ) = UforetrygdResponse(
        pid = pid,
        loggetInnSom = tokenService.determineLoggedInUser(),
        saker = saker,
        innloggingstype = tokenService.getInnloggingstype(),
        harGammelFullmaktmottaker = harGammelFullmaktEllerVeilder(pid, tokenService.getInnloggingstype()),
        hasIverksattVedtak = hasIverksattVedtak,
        uforevedtak = uforevedtak
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

    private fun harGammelFullmaktEllerVeilder(pid: String, innloggingstype: Innloggingstype): Boolean =
        if (SecurityContextUtil.isFullmakt() || innloggingstype == Innloggingstype.NAV || innloggingstype == Innloggingstype.SYSTEM)
            false // Kaller ikke fullmakt dersom fullmaktscenario eller saksbehandler
        else
            fullmaktClient.harBprofFullmaktmottager(pid)?.value ?: false
}