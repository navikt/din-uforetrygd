package no.nav.dinuforetrygd.pensjon.pen

import com.fasterxml.jackson.annotation.JsonProperty
import java.time.LocalDate

data class ForventedeInntekterResponse(
    @JsonProperty("sumAvForventedeInntekter") val sumAvForventedeInntekter: Long?,
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
    val hasBarnetilleggFellesBarn: Boolean,
    val hasBarnetilleggSaerkullsbarn: Boolean,
    val hasGjenlevendeTillegg: Boolean,
    val hasVarigTilrettelagtArbeid: Boolean
)

data class KravResponse(val krav: List<Krav>)

data class Krav(
    val kravGjelder: String,
    val status: String,
    val arsak: String,
    val mottattDato: LocalDate,
    val iverksattDato: LocalDate?
)
