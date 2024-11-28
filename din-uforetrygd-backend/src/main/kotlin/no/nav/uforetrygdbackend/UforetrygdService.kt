package no.nav.uforetrygdbackend

import no.nav.uforetrygdbackend.fullmakt.FullmaktClient
import no.nav.uforetrygdbackend.pensjon.pen.PenService
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
        val vedtakssammendragResponse = penService.getVedtakssammendrag(pid)
        return UforetrygdResponse(
            pid = pid,
            loggetInnSom = tokenService.determineLoggedInUser(),
            saker = penService.getSaker(pid),
            innloggingstype = tokenService.getInnloggingstype(),
            harGammelFullmaktmottaker = harGammelFullmaktEllerVeilder(pid, tokenService.getInnloggingstype()),
            hasIverksattVedtak = vedtakssammendragResponse.hasIverksattVedtak,
            uforevedtak = vedtakssammendragResponse.vedtakssammendrag?.let {
                DittUforevedtak(
                    uforegrad = it.uforegrad,
                    virkFom = it.virkFom,
                    uforetidspunkt = it.uforetidspunkt,
                    inntektsgrense = it.inntektsgrense,
                    sumAvForventedeInntekter = penService.getSumAvForventedeInntekter(pid),
                    hasBarnetilleggFellesBarn = it.hasBarnetilleggFellesBarn,
                    hasBarnetilleggSaerkullsbarn = it.hasBarnetilleggSaerkullsbarn,
                    hasGjenlevendeTillegg = it.hasGjenlevendeTillegg,
                    hasVarigTilrettelagtArbeid = it.hasVarigTilrettelagtArbeid
                )
            }
        )
    }

    private fun harGammelFullmaktEllerVeilder(pid: String, innloggingstype: Innloggingstype): Boolean =
        if (SecurityContextUtil.isFullmakt() || innloggingstype == Innloggingstype.NAV || innloggingstype == Innloggingstype.SYSTEM)
            false // Kaller ikke fullmakt dersom fullmaktscenario eller saksbehandler
        else
            fullmaktClient.harBprofFullmaktmottager(pid)?.value ?: false
}