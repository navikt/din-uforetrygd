package no.nav.dinuforetrygd.uforetrygd

import java.time.LocalDate
import java.time.LocalDateTime

data class Saksoversikt(
    val sakId: Long,
    val forsteVirkFomDato: LocalDate?,
    val gjeldendeVedtak: Vedtaksdata?,
    val avslaattVedtak: Vedtaksdata?,
    val hendelser: List<HendelseData>,
)

data class Vedtaksdata(
    val vedtakId: Long,
    val endretAv: String?,
    val endretDato: LocalDateTime?,
    val ytelseskomponenter: List<String>,
)

data class HendelseData(
    val hendelse: String,
    val kravId: Long?,
    val kravGjelder: String?,
    val kravArsak: String?,
    val kravStatus: String?,
    val endretDato: LocalDateTime,
    val opprettetAv: String?,
)

data class SaksoversiktResponse(
    // TODO får vi problmemer ved evt flere åpne krav?
    val aktivBehandling: Behandling?,
    val avsluttedeBehandlinger: List<Behandling>
)

data class Behandling(
    val visningstittel: String,
    val mottattDato: LocalDate,
    val ferdigstiltDato: LocalDate?,
    val avslag: Boolean,
    val etteroppgjor: Etteroppgjør?
)

data class Etteroppgjør(
    val etterbetaling: Int,
    val tilbakekreving: Int,
    val frist: LocalDate
)