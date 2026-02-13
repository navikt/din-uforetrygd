package no.nav.dinuforetrygd.uforetrygd

import no.nav.dinuforetrygd.pensjon.pen.EtteroppgjørGammel
import no.nav.dinuforetrygd.pensjon.pen.Krav
import no.nav.dinuforetrygd.pensjon.pen.Vedtak
import no.nav.dinuforetrygd.pensjon.pen.VedtakStatus
import java.time.LocalDate

data class Behandling(
    val type: BehandlingType,
    val status: Status,
    val mottattDato: LocalDate,
    val avslattForutgaendeMedlemskap: Boolean,
    val ferdigstiltDato: LocalDate? = null,
    val etteroppgjor: Etteroppgjør? = null,
    val beregning: Beregning? = null,
) {

    companion object {
        fun fraKrav(krav: Krav) = Behandling(
            type = finnType(krav),
            status = Status.MOTTATT,
            mottattDato = krav.mottattDato,
            avslattForutgaendeMedlemskap = false
        )

        fun fraVedtak(vedtak: Vedtak) = Behandling(
            type = finnType(vedtak.krav),
            status = finnStatus(vedtak),
            mottattDato = vedtak.krav.mottattDato,
            avslattForutgaendeMedlemskap = vedtak.avslattForutgaendeMedlemskap,
            ferdigstiltDato = vedtak.vedtaksdato,
            etteroppgjor = vedtak.etteroppgjor?.let { Etteroppgjør.fraPenEtteroppgjør(it) },
            beregning = vedtak.beregning?.let { Beregning(it.nettoUforetrygdPerManed) },
        )

        private fun finnType(krav: Krav): BehandlingType {
            return when (krav.kravGjelder) {
                "FORSTEG_BH", "F_BH_BO_UTL", "F_BH_MED_UTL" -> BehandlingType.SØKNAD_UFØRETRYGD
                "SOK_RED_UG", "SOK_OKN_UG" -> BehandlingType.SØKNAD_ENDRING_UFØREGRAD
                "SOK_UU" -> BehandlingType.SØKNAD_UNG_UFØR
                "SOK_YS" -> BehandlingType.SØKNAD_YRKESSKADE
                "REVURD" -> when (krav.arsak) {
                    "SOKNAD_BT" -> BehandlingType.SØKNAD_BARNETILLEGG
                    else -> BehandlingType.INGEN
                }
                else -> BehandlingType.INGEN
            }
        }

        private fun finnStatus(vedtak: Vedtak): Status {
            return if (vedtak.vedtakstatus == VedtakStatus.TIL_IVERKS) Status.MOTTATT
            else if (vedtak.avslag) Status.AVSLAG
            else Status.INNVILGET
        }
    }
}

data class Beregning(
    val nettoUforetrygdPerManed: Int,
)

data class Etteroppgjør(
     val arstall: Int,
     val avviksbelop: Int,
     val type: String
) {
    companion object {
        fun fraPenEtteroppgjør(penEtteroppgjør: EtteroppgjørGammel) = Etteroppgjør(
            arstall = penEtteroppgjør.arstall,
            avviksbelop = penEtteroppgjør.avviksbelop,
            type = penEtteroppgjør.type
        )
    }
}

enum class BehandlingType {
    SØKNAD_UFØRETRYGD, SØKNAD_ENDRING_UFØREGRAD, SØKNAD_BARNETILLEGG, SØKNAD_UNG_UFØR, SØKNAD_YRKESSKADE, INGEN
}

enum class Status {
    MOTTATT, INNVILGET, AVSLAG
}