package no.nav.uforetrygdbackend.security

import no.nav.uforetrygdbackend.configuration.CallIdUtil
import no.nav.uforetrygdbackend.configuration.CallIdUtil.Companion.NAV_CALL_ID_NAME
import no.nav.uforetrygdbackend.configuration.getCallIdFromMdc
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
                .header(NAV_CALL_ID_NAME, CallIdUtil.getCallIdFromMdc())
                .accept(MediaType.APPLICATION_JSON)
                .bodyValue(encryptedPid)
                .retrieve()
                .bodyToMono(String::class.java)
                .block()
        }
}