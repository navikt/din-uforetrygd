package no.nav.dinuforetrygd.uforetrygd

import no.nav.dinuforetrygd.pensjon.pen.Krav
import no.nav.dinuforetrygd.pensjon.pen.PenClient
import org.springframework.stereotype.Service

@Service
class SaksoversiktService(
    private val penClient: PenClient,
) {
    //TODO: trenger vi noe kall mot fullmakt her?
    fun hentSaksoversikt(pid: String, saksid: Long): SaksoversiktResponse {
        val krav: List<Krav> = penClient.getDenBesteSaksoversikten(pid, saksid)
        return SaksoversiktResponse(
            aktivBehandling = krav.firstOrNull { it.status == "UNDER_BEHANDLING" }?.toBehandling(),//TODO: flere krav under behandling?
            avsluttedeBehandlinger = krav
                .filter { it.erRelevant() }
                .map { it.toBehandling() }
        )
    }
}

private fun Krav.erRelevant() = relevanteKravMap.get(this.kravGjelder)?.contains(this.arsak) ?: false

private fun Krav.toBehandling() = Behandling(
    visningstittel = this.kravGjelder,
    status = when (this.status) {
        //TODO: riktige mappinger - hvilke statuser?
        else -> BehandlingStatus.UNDER_BEHANDLING
    },
    mottattDato = this.mottattDato,
    ferdigstiltDato = this.iverksattDato
)

private val relevanteKravMap = mapOf(
    "EKSPORT" to listOf("OMGJ_ETTER_ANKE", "OMGJ_ETTER_KLAGE", "UTVANDRET"),
    // TODO: Hva med ettergivelse
    "FORSTEG_BH" to listOf("NY_SOKNAD", "OMGJ_ETTER_ANKE", "OMGJ_ETTER_KLAGE"),
    "F_BH_BO_UTL" to listOf("NY_SOKNAD", "OMGJ_ETTER_ANKE", "OMGJ_ETTER_KLAGE"),
    "F_BH_MED_UTL" to listOf("NY_SOKNAD", "OMGJ_ETTER_ANKE", "OMGJ_ETTER_KLAGE"),
    "INNT_E" to listOf("ANNEN_FOR_END_IN", "ANNEN_ARSAK_END_IN", "BEGGE_FOR_END_IN", "BARN_ENDRET_INNTEKT", "ENDRET_INNTEKT", "OMGJ_ETTER_ANKE", "OMGJ_ETTER_KLAGE"),
    "MELLOMBH" to listOf("OMGJ_ETTER_ANKE", "OMGJ_ETTER_KLAGE", "OPPL_UTLAND"),
    "REGULERING" to listOf("OMGJ_ETTER_ANKE", "OMGJ_ETTER_KLAGE"),
    // TODO: revurdering
    "SLUTT_BH_UTL" to listOf("OMGJ_ETTER_ANKE", "OMGJ_ETTER_KLAGE", "OPPL_UTLAND"),
    "SOK_RED_UG" to listOf("NY_SOKNAD", "OMGJ_ETTER_ANKE", "OMGJ_ETTER_KLAGE"),
    "SOK_OKN_UG" to listOf("NY_SOKNAD", "OMGJ_ETTER_ANKE", "OMGJ_ETTER_KLAGE"),
    "SOK_UU" to listOf("NY_SOKNAD", "OMGJ_ETTER_ANKE", "OMGJ_ETTER_KLAGE", "OMGJ_ETTER_FVL_P35_A", "OMGJ_ETTER_FVL_P35_B", "OMGJ_ETTER_FVL_P35_C"),
    "SOK_YS" to listOf("NY_SOKNAD", "OMGJ_ETTER_ANKE", "OMGJ_ETTER_KLAGE", "OMGJ_ETTER_FVL_P35_A", "OMGJ_ETTER_FVL_P35_B", "OMGJ_ETTER_FVL_P35_C"),
    "UT_EO" to listOf("ETTEROPPGJOR", "OMGJ_ETTER_ANKE", "OMGJ_ETTER_KLAGE"),
)