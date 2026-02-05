package no.nav.dinuforetrygd.uforetrygd

import no.nav.dinuforetrygd.pensjon.pen.Etteroppgjør
import no.nav.dinuforetrygd.pensjon.pen.Krav
import no.nav.dinuforetrygd.pensjon.pen.PenClient
import no.nav.dinuforetrygd.pensjon.pen.Vedtak
import no.nav.dinuforetrygd.util.erRelevant
import org.springframework.stereotype.Service
import kotlin.math.abs

@Service
class SaksoversiktService(
    private val penClient: PenClient,
) {
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
        ferdigstiltDato = this.vedtaksdato,
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

    private fun lagBehandlingTittel(krav: Krav, isReguleringsvedtak: Boolean, eoÅrstall: Int? = null): String {
        val reguleringTekst = "Regulering i forbindelse med nytt grunnbeløp"
        return if (isReguleringsvedtak) {//Her er vedtaket type regulering. Det trenger ikke bety at kravet er regulering(det kan bety manuell regulering). Derfor denne i tillegg
            reguleringTekst
        } else when (krav.kravGjelder) {
            "EKSPORT" -> "Eksport av uføretrygd til utlandet"
            "FORSTEG_BH", "F_BH_BO_UTL", "F_BH_MED_UTL" -> "Søknad om uføretrygd"
            "INNT_E" -> "Inntektsendring"
            "MELLOMBH" -> "Mellombehandling"
            "REGULERING" -> reguleringTekst
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
                    tittel = "Opplysninger om endret inntekt er mottatt og ligger i behandlingskø"
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
                    tittel = "Regulering av uføretrygden er igangsatt"
                ),
                Steg(
                    aktiv = false,
                    utfort = !aktivBehandling,
                    tittel = "Regulering av uføretrygden er ferdig behandlet"
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
                "ENDRING_IFU" -> lagDefaultSteg(avslag, aktivBehandling)
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
                undertekst = if (aktivBehandling) null else avslag?.let { if (avslag) "Søknaden er avslått" else "Søknaden er innvilget" }
            )
        )
}