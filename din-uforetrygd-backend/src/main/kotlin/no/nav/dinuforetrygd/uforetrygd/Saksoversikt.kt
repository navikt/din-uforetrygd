package no.nav.dinuforetrygd.uforetrygd

import java.time.LocalDate

data class SaksoversiktResponse(
    val aktiveBehandlinger: List<SaksoversiktBehandling>,
    val avsluttedeBehandlinger: List<SaksoversiktBehandling>
)

data class SaksoversiktBehandling(
    val tittel: String,
    val mottattDato: LocalDate,
    val ferdigstiltDato: LocalDate? = null,
    val avslag: Boolean,
    val etteroppgjor: SaksoversiktEtteroppgjørGammel? = null,
    val steg: List<Steg>,
    val vedtakId: Long? = null,
    val avslattForutgaendeMedlemskap: Boolean
)

data class Steg(
    val tittel: String,
    val undertekst: String? = null,
    val dato: LocalDate? = null,
)

data class SaksoversiktEtteroppgjørGammel(
    val etterbetaling: Int,
    val tilbakekreving: Int,
)