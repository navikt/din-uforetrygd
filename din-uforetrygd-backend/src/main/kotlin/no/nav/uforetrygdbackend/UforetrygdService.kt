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

    fun constructUforetrygdResponse(pid: String): UforetrygdResponse = UforetrygdResponse(
        pid = pid,
        loggetInnSom = tokenService.determineLoggedInUser(),
        saker = penService.getSaker(pid),
        tilgangstype = determineTilgangstype(),
        innloggingstype = tokenService.getInnloggingstype(),
        harGammelFullmaktmottaker = harGammelFullmaktEllerVeilder(pid, tokenService.getInnloggingstype())
    )

    fun getDittUforevedtak(pid: String): DittUforevedtak {
        val sumAvForventedeInntekter = penService.getSumAvForventedeInntekter(pid)
        val vedtakssammendrag = penService.getVedtakssammendrag(pid)

        return DittUforevedtak(
            uforegrad = vedtakssammendrag.uforegrad,
            virkFom = vedtakssammendrag.virkFom,
            uforetidspunkt = vedtakssammendrag.uforetidspunkt,
            inntektsgrense = vedtakssammendrag.inntektsgrense,
            sumAvForventedeInntekter = sumAvForventedeInntekter,
            hasBarnetilleggFellesBarn = vedtakssammendrag.hasBarnetilleggFellesBarn,
            hasBarnetilleggSaerkullsbarn = vedtakssammendrag.hasBarnetilleggSaerkullsbarn,
            hasGjenlevendeTillegg = vedtakssammendrag.hasGjenlevendeTillegg,
            hasVarigTilrettelagtArbeid = vedtakssammendrag.hasVarigTilrettelagtArbeid
        )
    }

    private fun harGammelFullmaktEllerVeilder(pid: String, innloggingstype: Innloggingstype): Boolean =
        if (SecurityContextUtil.isFullmakt() || innloggingstype == Innloggingstype.NAV || innloggingstype == Innloggingstype.SYSTEM)
            false // Kaller ikke fullmakt dersom fullmaktscenario eller saksbehandler
        else
            fullmaktClient.harBprofFullmaktmottager(pid)?.value ?: false

    private fun determineTilgangstype(): Tilgangstype {
        if (tokenService.isUserLoggedInAsSaksbehandler()) {
            return determineSaksbehandlerTilgangstype()
        }
        if (tokenService.isUserLoggedInAsPerson() && SecurityContextUtil.isFullmakt()) {
            return determineFullmaktTilgangstype()
        }
        if (isValidSamhandlerAdmin(tokenService.determineRequestingPid())) {
            return Tilgangstype.FULLMAKT_SAMHANDLER_ADMIN
        }
        return Tilgangstype.PERSONLIG
    }

    private fun determineSaksbehandlerTilgangstype(): Tilgangstype {
        if (tokenService.isUserInSaksbehandlerGroup()) {
            return Tilgangstype.SAKSBEHANDLER
        }
        if (tokenService.isUserInVeilederGroup()) {
            return Tilgangstype.VEILEDER
        }
        if (tokenService.isUserInBrukerhjelpaGroup()) {
            return Tilgangstype.BRUKERHJELPA
        }
        if (tokenService.isUserInOkonomiGroup()) {
            return Tilgangstype.OKONOMI
        }
        if (tokenService.isUserInKlagebehandlerGroup()) {
            return Tilgangstype.KLAGEBEHANDLER
        }
        throw IllegalStateException("Application is in saksbehandler mode, but user lacks a valid saksbehandler group")
    }

    private fun determineFullmaktTilgangstype(): Tilgangstype {

        val allRepresentasjonsforhold =
            fullmaktClient.findAllRepresentasjonsforhold(tokenService.determineRequestingPid())

        val personligeRepresentasjonsforhold = allRepresentasjonsforhold
            .filter { it.fullmaktsgiver == SecurityContextUtil.getPidFromContext() }

        if (personligeRepresentasjonsforhold.any { it.typer.contains("PENSJON_SKRIV") }) {
            return Tilgangstype.FULLMAKT_SKRIV
        }
        if (personligeRepresentasjonsforhold.any { it.typer.contains("PENSJON_FULLSTENDIG") }) {
            return Tilgangstype.FULLMAKT_FULLSTENDIG
        }

        if (personligeRepresentasjonsforhold.any { it.typer.contains("PENSJON_VERGE_PENGEMOTTAKER") }) {
            return Tilgangstype.VERGE_PENGEMOTTAKER
        }
        if (personligeRepresentasjonsforhold.any { it.typer.contains("PENSJON_VERGE") }) {
            return Tilgangstype.VERGE
        }
        if (personligeRepresentasjonsforhold.any { it.typer.contains("PENSJON_PENGEMOTTAKER") }) {
            return Tilgangstype.PENGEMOTTAKER
        }

        if (personligeRepresentasjonsforhold.any { it.typer.contains("PENSJON_KOMMUNISER") }) {
            return Tilgangstype.FULLMAKT_KOMMUNISER
        }
        if (personligeRepresentasjonsforhold.any { it.typer.contains("PENSJON_LES") }) {
            return Tilgangstype.FULLMAKT_LES
        }
        if (personligeRepresentasjonsforhold.any { it.typer.contains("PENSJON_BEGRENSET") }) {
            return Tilgangstype.FULLMAKT_BEGRENSET
        }

        if (allRepresentasjonsforhold.any { it.typer.contains("PENSJON_SAMHANDLER_ADMIN") }) {
            //Note: When PENSJON_SAMHANDLER_ADMIN fullmakt is used on behalf of another user, admin mode is disabled until the samhandler changes back to self.
            return Tilgangstype.FULLMAKT_SAMHANDLER
        }

        if (allRepresentasjonsforhold.any { it.typer.contains("PENSJON_SAMHANDLER") }) {
            return Tilgangstype.FULLMAKT_SAMHANDLER
        }

        if (allRepresentasjonsforhold.any { it.typer.contains("PENSJON_SUPERADMIN") }) {
            return Tilgangstype.FULLMAKT_SUPER_ADMIN
        }

        throw IllegalStateException("Application is in fullmakt mode, but no fullmakt of valid type was found!")
    }

    private fun isValidSamhandlerAdmin(samhandlerAdminPid: String): Boolean {
        val allFullmakter = fullmaktClient.findAllRepresentasjonsforhold(samhandlerAdminPid)
        return allFullmakter.stream().anyMatch { representasjonsforhold ->
            representasjonsforhold.typer.contains(
                SAMHANDLER_ADMIN_TYPE
            )
        }
    }

    companion object {
        const val SAMHANDLER_ADMIN_TYPE = "PENSJON_SAMHANDLER_ADMIN"
    }
}