package no.nav.uforetrygdbackend.person.persondata

import no.nav.uforetrygdbackend.configuration.AppId
import no.nav.uforetrygdbackend.security.TokenService
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import org.springframework.web.reactive.function.client.WebClient

@Component
class PersondataClient(
    @Value("\${persondata.endpoint.url}") private val url: String,
    private val webClient: WebClient,
    @Value("\${persondata.scope}") private val scope: String,
    @Value("\${persondata.audience}") private val audience: String,
    @Value("\${webclient.number-of-retries}") private val numberOfRetries: Long,
    private val tokenService: TokenService
) {
    fun getBostedsland(pid: String): BostedslandResponse {
        return webClient
            .get()
            .uri("$url/api/bostedsland/landkode")
            .header("pid", pid)
            .header("Authorization", "Bearer ${tokenService.getEgressToken(scope, audience, pid, AppId.PERSONDATA)}")
            .retrieve()
            .bodyToMono(BostedslandResponse::class.java)
            .retry(numberOfRetries)
            .block() ?: throw RuntimeException("Failed calling persondata for /api/persondata/bostedsland/landkode")
    }
}