package no.nav.dinuforetrygd.skjerming


import no.nav.dinuforetrygd.configuration.AppId
import no.nav.dinuforetrygd.configuration.getCallIdFromMdc
import no.nav.dinuforetrygd.configuration.withMdcContext
import no.nav.dinuforetrygd.security.TokenService
import no.nav.dinuforetrygd.util.NAV_CALL_ID_HEADER
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.MediaType
import org.springframework.stereotype.Component
import org.springframework.web.reactive.function.client.WebClient

@Component
class SkjermingClient(
    @Value("\${skjerming.endpoint.url}") private val url: String,
    @Value("\${skjerming.scope}") private val scope: String,
    @Value("\${webclient.number-of-retries}") private val numberOfRetries: Long,
    private val webClient: WebClient,
    private val tokenService: TokenService
) {
    fun isSkjermet(pid: String): Boolean {
        return tokenService.getEgressToken(scope = scope, pid = pid, appId = AppId.SKJERMING).let { accessToken ->
            webClient
                .post()
                .uri("$url/skjermet")
                .header("Authorization", "Bearer $accessToken")
                .header(NAV_CALL_ID_HEADER, getCallIdFromMdc())
                .accept(MediaType.APPLICATION_JSON)
                .bodyValue(SkjermingRequest(pid))
                .retrieve()
                .bodyToMono(Boolean::class.java)
                .withMdcContext()
                .retry(numberOfRetries)
                .block() ?: false
        }
    }
}