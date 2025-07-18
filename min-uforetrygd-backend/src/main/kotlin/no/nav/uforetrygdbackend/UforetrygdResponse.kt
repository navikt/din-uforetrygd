package no.nav.uforetrygdbackend

import com.fasterxml.jackson.annotation.JsonFormat
import java.time.LocalDate
import java.time.LocalDateTime

data class UforetrygdResponse(
    val pid: String,
    val loggetInnSom: String,
    val saker: List<Sak>,
    val hasIverksattVedtak: Boolean,
    val uforevedtak: DittUforevedtak?,
    val innloggingstype: Innloggingstype,
    val harGammelFullmaktmottaker: Boolean,
    val hendelser: List<SakHendelse> = emptyList(),
    val journalposter: List<Journalpost> = emptyList(),
)

data class SakHendelse(
    val type: String,
    val gjelder: String?,
    val arsak: String?,
    val status: String?,
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss[xxxx]")
    val endretDato: LocalDateTime,
    val opprettetAv: String?,
)

data class Journalpost(
    val id: String,
    val tittel: String,
    val opprettetAv: String?,
    val opprettetDato: String,
    val dokumenter: List<Dokument>,
) {
    data class Dokument(
        val tittel: String,
        val dokumentInfoId: String,
        val filstorrelse: Int? = null,
    )
}

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
