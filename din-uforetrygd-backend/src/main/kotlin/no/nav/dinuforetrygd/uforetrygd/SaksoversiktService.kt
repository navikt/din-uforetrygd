package no.nav.dinuforetrygd.uforetrygd

import no.nav.dinuforetrygd.pensjon.pen.*
import no.nav.dinuforetrygd.pensjon.pen.Etteroppgjør
import no.nav.dinuforetrygd.util.erRelevant
import org.springframework.stereotype.Service
import java.time.LocalDate
import kotlin.math.abs

@Service
class SaksoversiktService(
    private val penClient: PenClient,
) {
    fun hentSaksoversikt(pid: String, saksid: Long): SaksoversiktResponse {
        val (krav, vedtak) = penClient.hentBehandlinger(pid, saksid)

        val åpentKravBehandling: List<Behandling> = listOfNotNull(
            krav?.takeIf { it.erRelevant() }?.toBehandling()
        )

        val relevanteVedtak = vedtak
            .filter { it.erRelevant() }
            .sortedWith(
                compareByDescending<Vedtak> { it.vedtaksdato }
                    .thenByDescending { it.vedtakId }
            )

        val vedtakTilIverksettelse = relevanteVedtak
            .filter { it.vedtakstatus == VedtakStatus.TIL_IVERKS }
            .map { it.toBehandling() }

        val aktiveBehandlinger = åpentKravBehandling + vedtakTilIverksettelse
        val avsluttedeBehandlinger = relevanteVedtak
            .filter { it.vedtakstatus != VedtakStatus.TIL_IVERKS }
            .map { it.toBehandling() }

        return SaksoversiktResponse(aktiveBehandlinger, avsluttedeBehandlinger)
    }

    private fun Krav.toBehandling() = Behandling(
        kravGjelder = this.kravGjelder,
        arsak = this.arsak,
        vedtakstype = null,
        mottattDato = this.mottattDato,
        avslag = false,
        avslattForutgaendeMedlemskap = false
    )

    private fun Vedtak.toBehandling() = Behandling(
        kravGjelder = this.krav.kravGjelder,
        arsak = this.krav.arsak,
        vedtakstype = this.vedtakstype,
        mottattDato = this.krav.mottattDato,
        ferdigstiltDato = this.vedtaksdato,
        avslag = this.avslag,
        avslattForutgaendeMedlemskap = this.avslattForutgaendeMedlemskap,
        etteroppgjor = this.etteroppgjor?.toEtteroppgjør(),
        vedtakId = this.vedtakId
    )

    private fun Etteroppgjør.toEtteroppgjør() =
        Etteroppgjør(
            tilbakekreving = if (this.type == "TILBAKEKR") abs(this.avviksbelop) else 0,
            etterbetaling = if (this.type == "ETTERBET") abs(this.avviksbelop) else 0,
        )
}