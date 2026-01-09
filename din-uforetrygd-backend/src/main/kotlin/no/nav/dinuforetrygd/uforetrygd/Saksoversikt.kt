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
    val aktivBehandling: Behandling?,
    val avsluttedeBehandlinger: List<Behandling>
)

data class Behandling(
    val tittel: String,
    val mottattDato: LocalDate,
    val ferdigstiltDato: LocalDate? = null,
    val avslag: Boolean,
    val etteroppgjor: Etteroppgjør? = null,
    val steg: List<Steg>,
    val vedtakId: Long? = null
)

data class Steg(
    val aktiv: Boolean,
    val utfort: Boolean,
    val tittel: String,
    val undertekst: String? = null
)

data class Etteroppgjør(
    val etterbetaling: Int,
    val tilbakekreving: Int,
)