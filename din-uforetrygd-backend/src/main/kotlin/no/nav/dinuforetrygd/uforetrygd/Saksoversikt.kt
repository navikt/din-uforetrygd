package no.nav.dinuforetrygd.uforetrygd

import java.time.LocalDate

data class SaksoversiktResponse(
    val aktiveBehandlinger: List<Behandling>,
    val avsluttedeBehandlinger: List<Behandling>
)

data class Behandling(
    val kravGjelder: String,
    val arsak: String?,
    val vedtakstype: String?,
    val mottattDato: LocalDate,
    val ferdigstiltDato: LocalDate? = null,
    val avslag: Boolean,
    val etteroppgjor: Etteroppgjør? = null,
    val vedtakId: Long? = null,
    val avslattForutgaendeMedlemskap: Boolean
)

data class Etteroppgjør(
    val etterbetaling: Int,
    val tilbakekreving: Int,
)