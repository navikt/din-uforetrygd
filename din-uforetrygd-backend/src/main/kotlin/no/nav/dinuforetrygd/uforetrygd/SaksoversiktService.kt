package no.nav.dinuforetrygd.uforetrygd

import no.nav.dinuforetrygd.pensjon.pen.Etteroppgjør
import no.nav.dinuforetrygd.pensjon.pen.Krav
import no.nav.dinuforetrygd.pensjon.pen.PenClient
import no.nav.dinuforetrygd.pensjon.pen.Vedtak
import org.springframework.stereotype.Service
import java.time.LocalDate

@Service
class SaksoversiktService(
    private val penClient: PenClient,
) {
    //TODO: trenger vi noe kall mot fullmakt her?

    //TODO: forholder bruker seg til hva en mellom og sluttbehandling er? Blir det ikke bare en del av førstegangsbehandlingen for de? Må se mer på denne.
    //TODO: skal alle ha standard tekst "Søknad er mottatt og ligger i behandlingskø" og "Søknad er ferdig behandlet"? Regulering feks gir lite mening
    //TODO: kan vi utlede denne fristen, eller er det bare skatt som har denne? Hør med mette
    //TODO: undertekster: spiss disse - innvilget og avslag for søknader. Ellers trenger vi de antageligvis ikke, så lenge teksten over er grei
    fun hentSaksoversikt(pid: String, saksid: Long): SaksoversiktResponse {
        val (krav, vedtak) = penClient.hentBehandlinger(pid, saksid)
        return SaksoversiktResponse(
            aktivBehandling = krav?.takeIf { it.erRelevant() }?.toBehandling(),
            avsluttedeBehandlinger = vedtak
                .filter { it.erRelevant() }
                .map { it.toBehandling() }
                .sortedByDescending { it.ferdigstiltDato }
        )
    }
}

private fun Krav.erRelevant() = relevanteKravMap.get(this.kravGjelder)?.contains(this.arsak) ?: false
private fun Vedtak.erRelevant() = this.vedtakstype == "REGULERING" || this.krav.erRelevant()

private fun Krav.toBehandling() = Behandling(
    visningstittel = lagVisningstittel(this, false),
    mottattDato = this.mottattDato,
    ferdigstiltDato = null,
    avslag = false,
    etteroppgjor = null
)

private fun Vedtak.toBehandling() = Behandling(
    visningstittel = lagVisningstittel(this.krav, this.vedtakstype == "REGULERING"),
    mottattDato = this.krav.mottattDato,
    ferdigstiltDato = this.iverksattDato,
    avslag = this.avslag,
    etteroppgjor = this.etteroppgjor?.toEtteroppgjør(this.iverksattDato)
)

private fun Etteroppgjør.toEtteroppgjør(iverksattDato: LocalDate) =
    Etteroppgjør(
        tilbakekreving = if (this.type == "TILBAKEKR") this.avviksbelop else 0,
        etterbetaling = if (this.type == "ETTERBET") this.avviksbelop else 0,
        frist = iverksattDato.plusWeeks(3)
    )

//TODO: kanskje ta en ny runde på disse: hadde skrevet ETTEROPPGJOR istedetfor UT_EO(de har samme decode)
private val relevanteKravMap = mapOf(
    "EKSPORT" to listOf("OMGJ_ETTER_ANKE", "OMGJ_ETTER_KLAGE", "UTVANDRET"),
    "FORSTEG_BH" to listOf("NY_SOKNAD", "OMGJ_ETTER_ANKE", "OMGJ_ETTER_KLAGE"),
    "F_BH_BO_UTL" to listOf("NY_SOKNAD", "OMGJ_ETTER_ANKE", "OMGJ_ETTER_KLAGE"),
    "F_BH_MED_UTL" to listOf("NY_SOKNAD", "OMGJ_ETTER_ANKE", "OMGJ_ETTER_KLAGE"),
    "INNT_E" to listOf(
        "ANNEN_FOR_END_IN",
        "ANNEN_ARSAK_END_IN",
        "BEGGE_FOR_END_IN",
        "BARN_ENDRET_INNTEKT",
        "ENDRET_INNTEKT",
        "OMGJ_ETTER_ANKE",
        "OMGJ_ETTER_KLAGE"
    ),
    "MELLOMBH" to listOf("OMGJ_ETTER_ANKE", "OMGJ_ETTER_KLAGE", "OPPL_UTLAND"),
    "REGULERING" to listOf("OMGJ_ETTER_ANKE", "OMGJ_ETTER_KLAGE"),
    "SLUTT_BH_UTL" to listOf("OMGJ_ETTER_ANKE", "OMGJ_ETTER_KLAGE", "OPPL_UTLAND"),
    "SOK_RED_UG" to listOf("NY_SOKNAD", "OMGJ_ETTER_ANKE", "OMGJ_ETTER_KLAGE"),
    "SOK_OKN_UG" to listOf("NY_SOKNAD", "OMGJ_ETTER_ANKE", "OMGJ_ETTER_KLAGE"),
    "SOK_UU" to listOf(
        "NY_SOKNAD",
        "OMGJ_ETTER_ANKE",
        "OMGJ_ETTER_KLAGE",
        "OMGJ_ETTER_FVL_P35_A",
        "OMGJ_ETTER_FVL_P35_B",
        "OMGJ_ETTER_FVL_P35_C"
    ),
    "SOK_YS" to listOf(
        "NY_SOKNAD",
        "OMGJ_ETTER_ANKE",
        "OMGJ_ETTER_KLAGE",
        "OMGJ_ETTER_FVL_P35_A",
        "OMGJ_ETTER_FVL_P35_B",
        "OMGJ_ETTER_FVL_P35_C"
    ),
    "UT_EO" to listOf("UT_EO", "OMGJ_ETTER_ANKE", "OMGJ_ETTER_KLAGE"),
    "REVURD" to listOf("ENDRING_IFU", "SOKNAD_BT"),
)

private fun lagVisningstittel(krav: Krav, reguleringsvedtak: Boolean): String {
    if (reguleringsvedtak) return "Regulering"
    return when (krav.kravGjelder) {
        "EKSPORT" -> "Eksport"
        "FORSTEG_BH" -> "Førstegangsbehandling"
        "F_BH_BO_UTL" -> "Førstegangsbehandling"
        "F_BH_MED_UTL" -> "Førstegangsbehandling"
        "INNT_E" -> "Inntektsendring"
        "MELLOMBH" -> "Mellombehandling"
        "REGULERING" -> "Regulering"
        "SLUTT_BH_UTL" -> "Sluttbehandling Norge/utland"
        "SOK_RED_UG" -> "Søknad om reduksjon av uføregrad"
        "SOK_OKN_UG" -> "Søknad om økning av uføregrad"
        "SOK_UU" -> "Søknad om ung ufør"
        "SOK_YS" -> "Søknad om yrkesskade"
        "UT_EO" -> "Etteroppgjør"
        "REVURD" -> if(krav.arsak == "ENDRING_IFU") "Endring av inntekt før uførhet" else if(krav.arsak == "SOKNAD_BT") "Søknad om barnetillegg" else throw Exception("Skal ikke mappe kravårsak $krav.arsak")
        else -> throw Exception("Skal ikke mappe kravGjelder $krav.kravGjelder")
    }
}