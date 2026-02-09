package no.nav.dinuforetrygd.uforetrygd

import no.nav.dinuforetrygd.pensjon.pen.Krav
import no.nav.dinuforetrygd.pensjon.pen.Vedtak
import no.nav.dinuforetrygd.pensjon.pen.VedtakStatus
import no.nav.dinuforetrygd.util.erRelevant
import java.time.LocalDate

data class ForsideBehandling(
    val type: BehandlingType,
    val status: Status,
    val beregning: Beregning? = null,
    val dato: LocalDate?
    val avslattForutgaendeMedlemskap: Boolean
)

data class Beregning(
    val nettoUforetrygdPerManed: Int
)

enum class BehandlingType {
    SØKNAD_UFØRETRYGD, SØKNAD_ENDRING_UFØREGRAD, SØKNAD_BARNETILLEGG, SØKNAD_UNG_UFØR, SØKNAD_YRKESSKADE, INGEN
}

enum class Status {
    MOTTATT, INNVILGET, AVSLAG
}

fun lagBehandling(åpentKrav: Krav?, vedtakIverksattSiste7Dager: List<Vedtak>): ForsideBehandling? {
    val relevantÅpentKrav: Krav? = åpentKrav?.takeIf { it.erRelevant() }

    val relevantVedtak: Vedtak? = vedtakIverksattSiste7Dager
        .filter { it.erRelevant() }
        .maxByOrNull { it.vedtaksdato }
        .takeIf { relevantÅpentKrav == null }

    if (relevantÅpentKrav == null && relevantVedtak == null) return null

    val type = finnBehandlingType(relevantÅpentKrav ?: relevantVedtak!!.krav)

    if (type == BehandlingType.INGEN) return null

    val status = finnBehandlingStatus(relevantÅpentKrav, relevantVedtak)

    return ForsideBehandling(
        type = type,
        status = status,
        beregning = relevantVedtak?.beregning?.let { Beregning(it.nettoUforetrygdPerManed) },
        dato = if (status == Status.MOTTATT) åpentKrav?.mottattDato else relevantVedtak!!.vedtaksdato,
        avslattForutgaendeMedlemskap = relevantVedtak?.avslattForutgaendeMedlemskap ?: false

    )
}

fun finnBehandlingType(krav: Krav): BehandlingType {
    return when (krav.kravGjelder) {
        "FORSTEG_BH", "F_BH_BO_UTL", "F_BH_MED_UTL" -> BehandlingType.SØKNAD_UFØRETRYGD
        "SOK_RED_UG", "SOK_OKN_UG" -> BehandlingType.SØKNAD_ENDRING_UFØREGRAD
        "SOK_UU" -> BehandlingType.SØKNAD_UNG_UFØR
        "SOK_YS" -> BehandlingType.SØKNAD_YRKESSKADE
        "REVURD" -> when (krav.arsak) {
            "SOKNAD_BT" -> BehandlingType.SØKNAD_BARNETILLEGG
            else -> BehandlingType.INGEN // TODO: når alle typer er lagt til, så trenger vi ikke koden ingen, men kaster exception hvis det er noe vi ikke forventer
        }

        else -> BehandlingType.INGEN // TODO: når alle typer er lagt til, så trenger vi ikke koden ingen, men kaster exception hvis det er noe vi ikke forventer
    }
}

fun finnBehandlingStatus(krav: Krav?, vedtak: Vedtak?): Status {
    return if (krav != null || vedtak?.vedtakstatus == VedtakStatus.TIL_IVERKS) Status.MOTTATT
    else if (vedtak!!.avslag) Status.AVSLAG
    else Status.INNVILGET
}