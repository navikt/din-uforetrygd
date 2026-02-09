package no.nav.dinuforetrygd.uforetrygd

import java.time.LocalDate

data class SaksoversiktResponse(
    val aktiveBehandlinger: List<Behandling>,
    val avsluttedeBehandlinger: List<Behandling>
)

data class Behandling(
    val tittel: String,
    val mottattDato: LocalDate,
    val ferdigstiltDato: LocalDate? = null,
    val avslag: Boolean,
    val etteroppgjor: Etteroppgjør? = null,
    val steg: List<Steg>,
    val vedtakId: Long? = null,
    val avslattForutgaendeMedlemskap: Boolean
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