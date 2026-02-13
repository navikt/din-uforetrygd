package no.nav.dinuforetrygd.uforetrygd

import no.nav.dinuforetrygd.pensjon.pen.PenClient
import no.nav.dinuforetrygd.pensjon.pen.Vedtak
import no.nav.dinuforetrygd.pensjon.pen.VedtakStatus
import no.nav.dinuforetrygd.util.erRelevant
import org.springframework.stereotype.Service

@Service
class SaksoversiktService(
    private val penClient: PenClient,
) {

    fun hentSaksoversikt(pid: String, saksid: Long): SaksoversiktResponse {
        val (krav, vedtak) = penClient.hentBehandlinger(pid, saksid)

        val åpentKravBehandling = listOfNotNull(
            krav?.takeIf { it.erRelevant() }
        ).map { Behandling.fraKrav(it) }

        val relevanteVedtak = vedtak
            .filter { it.erRelevant() }
            .sortedWith(
                compareByDescending<Vedtak> { it.vedtaksdato }
                    .thenByDescending { it.vedtakId }
            )

        val vedtakTilIverksettelse = relevanteVedtak
            .filter { it.vedtakstatus == VedtakStatus.TIL_IVERKS }
            .map { Behandling.fraVedtak(it) }

        val aktiveBehandlinger = åpentKravBehandling + vedtakTilIverksettelse

        val avsluttedeBehandlinger = relevanteVedtak
            .filter { it.vedtakstatus != VedtakStatus.TIL_IVERKS }
            .map { Behandling.fraVedtak(it) }

        return SaksoversiktResponse(aktiveBehandlinger, avsluttedeBehandlinger)
    }

}