package no.nav.dinuforetrygd.uforetrygd

import no.nav.dinuforetrygd.pensjon.pen.Etteroppgjør
import no.nav.dinuforetrygd.pensjon.pen.Krav
import no.nav.dinuforetrygd.pensjon.pen.PenClient
import no.nav.dinuforetrygd.pensjon.pen.Vedtak
import org.springframework.stereotype.Service
import kotlin.math.abs

@Service
class SaksoversiktService(
    private val penClient: PenClient,
) {
    //TODO: trenger vi noe kall mot fullmakt her?

    //TODO: forholder bruker seg til hva en mellom og sluttbehandling er? Blir det ikke bare en del av førstegangsbehandlingen for de? Og burde det vises som flere behandlinger eller en?
    // - Anne Sofie ser mer på denne.

    //TODO: etteroppgjør
    // - frist kan vi ikke ha med. Vi har ikke datoen, det kan være oppdelte betalinger etc
    // - Det kan komme flere etteroppgjør over kort tid. Hvordan ønsker vi å håndtere det?
    // - Få inn årstall for etteroppgjør

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

private fun Krav.erRelevant() = relevanteKravMap[this.kravGjelder]?.contains(this.arsak) ?: false
private fun Vedtak.erRelevant() = this.vedtakstype == "REGULERING" || this.krav.erRelevant()

private fun Krav.toBehandling() = Behandling(
    mottattDato = this.mottattDato,
    ferdigstiltDato = null,
    avslag = false,
    etteroppgjor = null,
    tekster = lagTekster(
        krav = this,
        reguleringsvedtak = false
    )
)

private fun Vedtak.toBehandling() = Behandling(
    mottattDato = this.krav.mottattDato,
    ferdigstiltDato = this.iverksattDato,
    avslag = this.avslag,
    etteroppgjor = this.etteroppgjor?.toEtteroppgjør(),
    tekster = lagTekster(
        krav = this.krav,
        reguleringsvedtak = this.vedtakstype == "REGULERING",
        avslag = this.avslag,
        eoÅrstall = this.etteroppgjor?.arstall
    )
)

private fun Etteroppgjør.toEtteroppgjør() =
    Etteroppgjør(
        tilbakekreving = if (this.type == "TILBAKEKR") abs(this.avviksbelop) else 0,
        etterbetaling = if (this.type == "ETTERBET") abs(this.avviksbelop) else 0,
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

private fun lagTekster(krav: Krav, reguleringsvedtak: Boolean, avslag: Boolean? = null, eoÅrstall: Int? = null): Tekster {
    var tittel: String
    var mottatt = "Søknad er mottatt og ligger i behandlingskø"
    var ferdigBehandlet = "Søknad er ferdig behandlet"
    var ferdigBehandletUndertekst: String? =
        avslag?.let { if (avslag) "Søknaden er avslått" else "Søknaden er innvilget" }

    if (reguleringsvedtak) {//Her er vedtaket type regulering. Det trenger ikke bety at kravet er regulering(det kan bety manuell regulering). Derfor denne i tillegg
        tittel = "Regulering"
        mottatt = "Regulering er igangsatt"
        ferdigBehandlet = "Regulering er ferdig behandlet"
        ferdigBehandletUndertekst = null
    } else when (krav.kravGjelder) {
        "EKSPORT" -> tittel = "Eksport"
        "FORSTEG_BH" -> tittel = "Førstegangsbehandling"
        "F_BH_BO_UTL" -> tittel = "Førstegangsbehandling"
        "F_BH_MED_UTL" -> tittel = "Førstegangsbehandling"
        "INNT_E" -> {
            tittel = "Inntektsendring"
            mottatt = "Inntektsendring er mottatt og ligger i behandlingskø"
            ferdigBehandlet = "Inntektsendring er ferdig behandlet"
            ferdigBehandletUndertekst = null
        }

        "MELLOMBH" -> tittel = "Mellombehandling"
        "REGULERING" -> {
            tittel = "Regulering"
            mottatt = "Regulering er igangsatt"
            ferdigBehandlet = "Regulering er ferdig behandlet"
            ferdigBehandletUndertekst = null
        }

        "SLUTT_BH_UTL" -> tittel = "Sluttbehandling Norge/utland"
        "SOK_RED_UG" -> tittel = "Søknad om reduksjon av uføregrad"
        "SOK_OKN_UG" -> tittel = "Søknad om økning av uføregrad"
        "SOK_UU" -> tittel = "Søknad om ung ufør"
        "SOK_YS" -> tittel = "Søknad om yrkesskade"
        "UT_EO" -> {
            tittel = "Etteroppgjør" + (eoÅrstall?.let { " for $eoÅrstall" } ?: "")
            mottatt = "Etteroppgjør er igangsatt"
            ferdigBehandlet = "Etteroppgjør er ferdig behandlet"
            ferdigBehandletUndertekst = null
        }

        "REVURD" -> when (krav.arsak) {
            "ENDRING_IFU" -> {
                tittel = "Endring av inntekt før uførhet"
                mottatt = "Endring er igangsatt"
                ferdigBehandlet = "Endring er ferdig behandlet"
                ferdigBehandletUndertekst = null
            }

            "SOKNAD_BT" -> tittel = "Søknad om barnetillegg"
            else -> throw Exception("Skal ikke mappe kravårsak $krav.arsak")
        }

        else -> throw Exception("Skal ikke mappe kravGjelder $krav.kravGjelder")
    }

    return Tekster(
        tittel = tittel,
        mottatt = mottatt,
        ferdigBehandlet = ferdigBehandlet,
        ferdigBehandletUndertekst = ferdigBehandletUndertekst
    )
}