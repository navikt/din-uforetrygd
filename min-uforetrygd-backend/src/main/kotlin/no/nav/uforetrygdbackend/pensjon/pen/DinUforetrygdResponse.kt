package no.nav.uforetrygdbackend.pensjon.pen

import java.time.LocalDate

data class DinUforetrygdResponse(
    val uforegrad: Int,
    val virkFom: LocalDate?,
    val uforetidspunkt: LocalDate?,
    val hasBarnetilleggFellesBarn: Boolean = false,
    val hasBarnetilleggSaerkullsbarn: Boolean = false,
    val hasGjenlevendeTillegg: Boolean = false,
    val hasVarigTilrettelagtArbeid: Boolean = false
)