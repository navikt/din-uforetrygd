package no.nav.dinuforetrygd.uforetrygd

import no.nav.dinuforetrygd.pensjon.pen.*
import no.nav.dinuforetrygd.pensjon.pen.EtteroppgjørGammel
import no.nav.dinuforetrygd.util.erRelevant
import org.springframework.stereotype.Service
import java.time.LocalDate
import kotlin.math.abs

@Service
class SaksoversiktService(
    private val penClient: PenClient,
) {
    fun hentSaksoversikt(pid: String, saksid: Long): SaksoversiktResponse {
        val (krav, vedtak) = penClient.hentBehandlinger(pid, saksid)

        val åpentKravBehandling: List<SaksoversiktBehandling> = listOfNotNull(
            krav?.takeIf { it.erRelevant() }?.toBehandling()
        )

        val relevanteVedtak = vedtak
            .filter { it.erRelevant() }
            .sortedWith(
                compareByDescending<Vedtak> { it.vedtaksdato }
                    .thenByDescending { it.vedtakId }
            )

        val vedtakTilIverksettelse = relevanteVedtak
            .filter { it.vedtakstatus == VedtakStatus.TIL_IVERKS }
            .map { it.toBehandling() }

        val aktiveBehandlinger = åpentKravBehandling + vedtakTilIverksettelse
        val avsluttedeBehandlinger = relevanteVedtak
            .filter { it.vedtakstatus != VedtakStatus.TIL_IVERKS }
            .map { it.toBehandling() }

        return SaksoversiktResponse(aktiveBehandlinger, avsluttedeBehandlinger)
    }

    private fun Krav.toBehandling() = SaksoversiktBehandling(
        tittel = lagBehandlingTittel(
            krav = this,
            isReguleringsvedtak = false
        ),
        mottattDato = this.mottattDato,
        avslag = false,
        avslattForutgaendeMedlemskap = false,
        steg = lagSteg(
            krav = this,
            reguleringsvedtak = false,
            avslag = false,
            aktivBehandling = true
        )
    )

    private fun Vedtak.toBehandling() = SaksoversiktBehandling(
        tittel = lagBehandlingTittel(
            krav = this.krav,
            isReguleringsvedtak = this.vedtakstype == "REGULERING",
            eoÅrstall = this.etteroppgjor?.arstall
        ),
        mottattDato = this.krav.mottattDato,
        ferdigstiltDato = this.vedtaksdato,
        avslag = this.avslag,
        avslattForutgaendeMedlemskap = this.avslattForutgaendeMedlemskap,
        etteroppgjor = this.etteroppgjor?.toEtteroppgjør(),
        steg = lagSteg(
            krav = this.krav,
            reguleringsvedtak = this.vedtakstype == "REGULERING",
            avslag = this.avslag,
            aktivBehandling = this.vedtakstatus == VedtakStatus.TIL_IVERKS,
            ferdigstiltDato = this.vedtaksdato
        ),
        vedtakId = this.vedtakId
    )

    private fun EtteroppgjørGammel.toEtteroppgjør() =
        SaksoversiktEtteroppgjørGammel(
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
            "MELLOMBH" -> "Søknad om uføretrygd - opplysninger fra utlandet"
            "REGULERING" -> reguleringTekst
            "SLUTT_BH_UTL" -> "Søknad om uføretrygd - endelig vedtak"
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
        aktivBehandling: Boolean,
        ferdigstiltDato: LocalDate? = null
    ): List<Steg> {
        return if (reguleringsvedtak) {//Her er vedtaket type regulering. Det trenger ikke bety at kravet er regulering(det kan bety manuell regulering). Derfor denne i tillegg
            listOf(
                Steg(
                    tittel = "Regulering er igangsatt",
                    dato = krav.mottattDato,
                ),
                Steg(
                    tittel = "Regulering er ferdig behandlet",
                    dato = ferdigstiltDato
                )
            )
        } else when (krav.kravGjelder) {
            "EKSPORT", "FORSTEG_BH", "F_BH_BO_UTL", "F_BH_MED_UTL", "SLUTT_BH_UTL", "SOK_RED_UG", "SOK_OKN_UG", "SOK_UU", "SOK_YS", "MELLOMBH" ->
                lagDefaultSteg(avslag, aktivBehandling, krav.mottattDato, ferdigstiltDato)

            "INNT_E" -> listOf(
                Steg(
                    tittel = "Opplysninger om endret inntekt er mottatt og ligger i behandlingskø",
                    dato = krav.mottattDato
                ),
                Steg(
                    tittel = "Inntektsendring er ferdig behandlet",
                    dato = ferdigstiltDato
                )
            )

            "REGULERING" -> listOf(
                Steg(
                    tittel = "Regulering av uføretrygden er igangsatt",
                    dato = krav.mottattDato
                ),
                Steg(
                    tittel = "Regulering av uføretrygden er ferdig behandlet",
                    dato = ferdigstiltDato
                )
            )

            "UT_EO" -> listOf(
                Steg(
                    tittel = "Etteroppgjør er igangsatt",
                    dato = krav.mottattDato
                ),
                Steg(
                    tittel = "Etteroppgjør er ferdig behandlet",
                    dato = ferdigstiltDato
                )
            )

            "REVURD" -> when (krav.arsak) {
                "ENDRING_IFU" -> lagDefaultSteg(avslag, aktivBehandling, krav.mottattDato, ferdigstiltDato)
                "SOKNAD_BT" -> lagDefaultSteg(avslag, aktivBehandling, krav.mottattDato, ferdigstiltDato)
                else -> throw Exception("Skal ikke mappe kravårsak $krav.arsak")
            }

            else -> throw Exception("Skal ikke mappe kravGjelder $krav.kravGjelder")
        }
    }

    private fun lagDefaultSteg(avslag: Boolean?, aktivBehandling: Boolean, mottattDato: LocalDate, ferdigstiltDato: LocalDate? = null) =
        listOf(
            Steg(
                tittel = "Søknad er mottatt og ligger i behandlingskø",
                dato = mottattDato
            ),
            Steg(
                tittel = "Søknad er ferdig behandlet",
                undertekst = if (aktivBehandling) null else avslag?.let { if (avslag) "Søknaden er avslått" else "Søknaden er innvilget" },
                dato = ferdigstiltDato
            )
        )
}