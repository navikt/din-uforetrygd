package no.nav.uforetrygdbackend.pensjon.pen

import java.time.LocalDate

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