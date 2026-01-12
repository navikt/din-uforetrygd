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

    private fun Krav.erRelevant() = relevanteKravMap[this.kravGjelder]?.contains(this.arsak) ?: false
    private fun Vedtak.erRelevant() = this.vedtakstype == "REGULERING" || this.krav.erRelevant()

    private fun Krav.toBehandling() = Behandling(
        tittel = lagBehandlingTittel(
            krav = this,
            isReguleringsvedtak = false
        ),
        mottattDato = this.mottattDato,
        avslag = false,
        steg = lagSteg(
            krav = this,
            reguleringsvedtak = false,
            avslag = false,
            aktivBehandling = true
        )
    )

    private fun Vedtak.toBehandling() = Behandling(
        tittel = lagBehandlingTittel(
            krav = this.krav,
            isReguleringsvedtak = this.vedtakstype == "REGULERING",
            eoÅrstall = this.etteroppgjor?.arstall
        ),
        mottattDato = this.krav.mottattDato,
        ferdigstiltDato = this.iverksattDato,
        avslag = this.avslag,
        etteroppgjor = this.etteroppgjor?.toEtteroppgjør(),
        steg = lagSteg(
            krav = this.krav,
            reguleringsvedtak = this.vedtakstype == "REGULERING",
            avslag = this.avslag,
            aktivBehandling = false
        ),
        vedtakId = this.vedtakId
    )

    private fun Etteroppgjør.toEtteroppgjør() =
        Etteroppgjør(
            tilbakekreving = if (this.type == "TILBAKEKR") abs(this.avviksbelop) else 0,
            etterbetaling = if (this.type == "ETTERBET") abs(this.avviksbelop) else 0,
        )

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
        "UT_EO" to listOf("UT_EO", "UT_OMGJ_ANKE_EO", "UT_OMGJ_KLAGE_EO"),
        "REVURD" to listOf("ENDRING_IFU", "SOKNAD_BT"),
    )

    private fun lagBehandlingTittel(krav: Krav, isReguleringsvedtak: Boolean, eoÅrstall: Int? = null): String {
        return if (isReguleringsvedtak) {//Her er vedtaket type regulering. Det trenger ikke bety at kravet er regulering(det kan bety manuell regulering). Derfor denne i tillegg
            "Regulering"
        } else when (krav.kravGjelder) {
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
            "UT_EO" -> "Etteroppgjør" + (eoÅrstall?.let { " for $eoÅrstall" } ?: "")
            "REVURD" -> when (krav.arsak) {
                "ENDRING_IFU" -> "Endring av inntekt før uførhet"
                "SOKNAD_BT" -> "Søknad om barnetillegg"
                else -> throw Exception("Skal ikke mappe kravårsak $krav.arsak")
            }

            else -> throw Exception("Skal ikke mappe kravGjelder $krav.kravGjelder")
        }
    }

    private fun lagSteg(
        krav: Krav,
        reguleringsvedtak: Boolean,
        avslag: Boolean?,
        aktivBehandling: Boolean
    ): List<Steg> {
        return if (reguleringsvedtak) {//Her er vedtaket type regulering. Det trenger ikke bety at kravet er regulering(det kan bety manuell regulering). Derfor denne i tillegg
            listOf(
                Steg(
                    aktiv = aktivBehandling,
                    utfort = !aktivBehandling,
                    tittel = "Regulering er igangsatt",
                ),
                Steg(
                    aktiv = false,
                    utfort = !aktivBehandling,
                    tittel = "Regulering er ferdig behandlet",
                )
            )
        } else when (krav.kravGjelder) {
            "EKSPORT", "FORSTEG_BH", "F_BH_BO_UTL", "F_BH_MED_UTL", "SLUTT_BH_UTL", "SOK_RED_UG", "SOK_OKN_UG", "SOK_UU", "SOK_YS", "MELLOMBH" ->
                lagDefaultSteg(avslag, aktivBehandling)
            "INNT_E" -> listOf(
                Steg(
                    aktiv = aktivBehandling,
                    utfort = !aktivBehandling,
                    tittel = "Inntektsendring er mottatt og ligger i behandlingskø"
                ),
                Steg(
                    aktiv = false,
                    utfort = !aktivBehandling,
                    tittel = "Inntektsendring er ferdig behandlet"
                )
            )
            "REGULERING" -> listOf(
                Steg(
                    aktiv = aktivBehandling,
                    utfort = !aktivBehandling,
                    tittel = "Regulering er igangsatt"
                ),
                Steg(
                    aktiv = false,
                    utfort = !aktivBehandling,
                    tittel = "Regulering er ferdig behandlet"
                )
            )
            "UT_EO" -> listOf(
                Steg(
                    aktiv = aktivBehandling,
                    utfort = !aktivBehandling,
                    tittel = "Etteroppgjør er igangsatt"
                ),
                Steg(
                    aktiv = false,
                    utfort = !aktivBehandling,
                    tittel = "Etteroppgjør er ferdig behandlet"
                )
            )
            "REVURD" -> when (krav.arsak) {
                "ENDRING_IFU" -> listOf(
                    Steg(
                        aktiv = aktivBehandling,
                        utfort = !aktivBehandling,
                        tittel = "Endring er igangsatt"
                    ),
                    Steg(
                        aktiv = false,
                        utfort = !aktivBehandling,
                        tittel = "Endring er ferdig behandlet"
                    )
                )

                "SOKNAD_BT" -> lagDefaultSteg(avslag, aktivBehandling)
                else -> throw Exception("Skal ikke mappe kravårsak $krav.arsak")
            }

            else -> throw Exception("Skal ikke mappe kravGjelder $krav.kravGjelder")
        }
    }

    private fun lagDefaultSteg(avslag: Boolean?, aktivBehandling: Boolean) =
        listOf(
            Steg(
                aktiv = aktivBehandling,
                utfort = !aktivBehandling,
                tittel = "Søknad er mottatt og ligger i behandlingskø",
            ),
            Steg(
                aktiv = false,
                utfort = !aktivBehandling,
                tittel = "Søknad er ferdig behandlet",
                undertekst = avslag?.let { if (avslag) "Søknaden er avslått" else "Søknaden er innvilget" }
            )
        )
}