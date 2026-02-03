package no.nav.dinuforetrygd.uforetrygd

import com.fasterxml.jackson.annotation.JsonFormat
import no.nav.dinuforetrygd.journalpost.Journalpost
import no.nav.dinuforetrygd.journalpost.model.EndretAvKode
import java.time.LocalDate
import java.time.LocalDateTime

data class UforetrygdResponse(
    val pid: String,
    val loggetInnSom: String,
    val sak: Sak?,
    val hasIverksattVedtak: Boolean,
    val uforevedtak: DittUforevedtak?,
    val innloggingstype: Innloggingstype,
    val harGammelFullmaktmottaker: Boolean,
    val journalposter: List<Journalpost> = emptyList(),
    val behandling: ForsideBehandling? = null
)

data class DittUforevedtak(
    val uforegrad: Int,
    val virkFom: LocalDate?,
    val uforetidspunkt: LocalDate?,
    val inntektsgrense: Int?,
    val inntektstak: Int?,
    val inntektFraSkatt: Double,
    val kompensasjonsgrad: Double?,
    val nettoUtbetalingMnd: Int,
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

data class Sak(
    val status: Sakstatus,
    val sakId: Long
)

enum class Sakstatus (val prioritet: Int){
    OPPRETTET (3),
    TIL_BEHANDLING (2),
    AVSLUTTET (4),
    LOPENDE(1),
}