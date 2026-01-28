package no.nav.dinuforetrygd.pensjon.pen

data class HentBehandlingerRequest(val pid: String, val sakId: Long)
data class HentForsideDataRequest(val pid: String, val sakId: Long)

