package no.nav.dinuforetrygd.security

import no.nav.dinuforetrygd.configuration.getCallIdFromMdc
import no.nav.dinuforetrygd.configuration.withMdcContext
import no.nav.dinuforetrygd.util.NAV_CALL_ID_HEADER
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.MediaType
import org.springframework.stereotype.Component
import org.springframework.web.reactive.function.client.WebClient

@Component
class PidEncryptionClient(
    @Value("\${pid-encryption.endpoint.url}") private val baseUrl: String,
    @Value("\${pid-encryption.scope}") private val scope: String,
    private val azureAdService: AzureAdService,
    private val webClient: WebClient,
) {
    fun decrypt(encryptedPid: String): String? =
        azureAdService.retrieveClientCredentialsToken(listOf(scope)).let { token ->
            webClient
                .post()
                .uri("$baseUrl/api/decrypt")
                .header("Authorization", "Bearer $token")
                .header(NAV_CALL_ID_HEADER, getCallIdFromMdc())
                .accept(MediaType.APPLICATION_JSON)
                .bodyValue(encryptedPid)
                .retrieve()
                .bodyToMono(String::class.java)
                .withMdcContext()
                .block()
        }
}