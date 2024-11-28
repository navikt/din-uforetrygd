package no.nav.uforetrygdbackend

import java.time.LocalDate

data class UforetrygdResponse(
    val pid: String,
    val loggetInnSom: String,
    val saker: List<Sak>,
    val hasIverksattVedtak: Boolean,
    val uforevedtak: DittUforevedtak?,
    val innloggingstype: Innloggingstype,
    val harGammelFullmaktmottaker: Boolean
)

data class DittUforevedtak(
    val uforegrad: Int,
    val virkFom: LocalDate?,
    val uforetidspunkt: LocalDate?,
    val inntektsgrense: Int?,
    val sumAvForventedeInntekter: Long?,
    val hasBarnetilleggFellesBarn: Boolean,
    val hasBarnetilleggSaerkullsbarn: Boolean,
    val hasGjenlevendeTillegg: Boolean,
    val hasVarigTilrettelagtArbeid: Boolean
)

enum class Innloggingstype {
    LEVEL4,
    LEVEL3,
    NAV,
    SYSTEM
}

data class Sak(val type: Sakstype, val status: Sakstatus)

enum class Sakstatus {
    OPPRETTET,
    TIL_BEHANDLING,
    AVSLUTTET,
    LOPENDE,
    UKJENT
}

enum class Sakstype {
    ALDERSPENSJON,
    AFP,
    AFP_PRIVAT,
    BARNEPENSJON,
    FAMILIEPLEIER_YTELSE,
    GAMMEL_YRKESSKADE,
    GENERELL,
    GJENLEVENDE_YTELSE,
    GRUNNBLANKETTER,
    KRIGSPENSJON,
    OMSORGSOPPTJENING,
    UFORETRYGD,
    UKJENT
}
