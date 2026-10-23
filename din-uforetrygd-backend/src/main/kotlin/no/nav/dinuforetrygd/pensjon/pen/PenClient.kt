package no.nav.dinuforetrygd.pensjon.pen

interface PenClient {
    fun getSaksammendrag(pid: String): List<SakSammendrag>
    suspend fun getVedtakssammendragResponse(pid: String): VedtakssammendragResponse
    suspend fun getForventedeInntekterResponse(pid: String): ForventedeInntekterResponse
    suspend fun hentForsideData(pid: String, sakId: Long): HentForsideDataResponse
    fun hentBehandlinger(pid: String, sakId: Long): HentBehandlingerResponse
}
