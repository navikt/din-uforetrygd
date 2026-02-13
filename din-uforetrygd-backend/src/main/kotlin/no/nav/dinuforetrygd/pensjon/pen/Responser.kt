package no.nav.dinuforetrygd.pensjon.pen

import com.fasterxml.jackson.annotation.JsonProperty
import java.time.LocalDate

data class ForventedeInntekterResponse(
    @param:JsonProperty("sumAvForventedeInntekter") val sumAvForventedeInntekter: Long?,
)

data class VedtakssammendragResponse(
    val hasIverksattVedtak: Boolean,
    val vedtakssammendrag: Vedtakssammendrag?,
)

data class Vedtakssammendrag(
    val uforegrad: Int,
    val virkFom: LocalDate?,
    val uforetidspunkt: LocalDate?,
    val inntektsgrense: Int?,
    val inntektstak: Int?,
    val kompensasjonsgrad: Double?,
    val nettoUtbetalingMnd: Int,
    val hasBarnetilleggFellesBarn: Boolean,
    val hasBarnetilleggSaerkullsbarn: Boolean,
    val hasGjenlevendeTillegg: Boolean,
    val hasVarigTilrettelagtArbeid: Boolean
)

data class HentBehandlingerResponse(
    val apentKrav: Krav?,
    val vedtak: List<Vedtak>
)

data class Vedtak(
    val vedtakId: Long,
    val vedtakstype: String,
    val vedtakstatus: VedtakStatus,
    val vedtaksdato: LocalDate,
    val avslag: Boolean,
    val krav: Krav,
    val etteroppgjor: EtteroppgjørResponse? = null,
    val beregning: Beregning? = null,
    val avslattForutgaendeMedlemskap: Boolean
)

enum class VedtakStatus {
    TIL_IVERKS, IVERKS, REAK, STOPPES, STOPPET, TIL_SAMORDN, SAMORDN
}

data class Beregning(
    val nettoUforetrygdPerManed: Int
)

data class Krav(
    val kravGjelder: String,
    val status: String,
    val arsak: String,
    val mottattDato: LocalDate,
)

data class EtteroppgjørResponse(
    val arstall: Int,
    val avviksbelop: Int,
    val type: String
)

data class HentForsideDataResponse(
    val apentKrav: Krav?,
    val vedtakIverksattSiste7Dager: List<Vedtak>
)