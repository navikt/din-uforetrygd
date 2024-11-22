package no.nav.uforetrygdbackend

import java.time.LocalDate

data class DittUforevedtakResponse(
    val hasIverksattVedtak: Boolean,
    val dittUforevedtak: DittUforevedtak?
)

data  class DittUforevedtak(
    val uforegrad: Int,
    val virkFom: LocalDate?,
    val uforetidspunkt: LocalDate?,
    val inntektsgrense: Int?,
    val sumAvForventedeInntekter: Long?,
    val hasBarnetilleggFellesBarn: Boolean = false,
    val hasBarnetilleggSaerkullsbarn: Boolean = false,
    val hasGjenlevendeTillegg: Boolean = false,
    val hasVarigTilrettelagtArbeid: Boolean = false
)