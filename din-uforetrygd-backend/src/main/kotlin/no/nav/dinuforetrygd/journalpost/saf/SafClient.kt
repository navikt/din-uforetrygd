package no.nav.dinuforetrygd.journalpost.saf

import no.nav.dinuforetrygd.common.handleGraphQLErrorResponse
import no.nav.dinuforetrygd.configuration.AppId
import no.nav.dinuforetrygd.configuration.getCallIdFromMdc
import no.nav.dinuforetrygd.security.SecurityContextUtil
import no.nav.dinuforetrygd.security.TokenService
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.core.io.buffer.DataBuffer
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Component
import org.springframework.web.reactive.function.client.WebClient
import reactor.core.publisher.Flux

@Component
class SafClient(
    @Value("\${saf.endpoint.url}") private val baseUrl: String,
    @Value("\${saf.audience}") private val audience: String,
    @Value("\${saf.scope}") private val scope: String,
    @Value("\${webclient.number-of-retries}") private val numberOfRetries: Long,
    private val tokenService: TokenService,
    private val webClient: WebClient,
) {

    private val logger = LoggerFactory.getLogger(SafClient::class.java)

    fun hentDokument(
        journalpostId: String,
        dokumentInfoId: String,
        variantFormat: String,
    ): ResponseEntity<Flux<DataBuffer>>? =
        tokenService.getEgressToken(scope, audience, SecurityContextUtil.getPidFromContext(), AppId.SAF).let {
            webClient
                .get()
                .uri("$baseUrl/rest/hentdokument/${journalpostId}/${dokumentInfoId}/${variantFormat}")
                .header("Authorization", "Bearer $it")
                .header("Nav-Callid", getCallIdFromMdc())
                .header("Nav-User-Id", tokenService.determineLoggedInUserId())
                .accept(MediaType.APPLICATION_PDF)
                .retrieve()
                .toEntityFlux(DataBuffer::class.java)
                .block()
        }

    fun performGraphQLQuery(fagsakId: String): List<JournalpostSafDto> {
        val query = getSafFagsakQuery(fagsakId, FAGSAKSYSTEM)
        val response =
            tokenService.getEgressToken(scope, audience, SecurityContextUtil.getPidFromContext(), AppId.SAF).let {
                webClient
                    .post()
                    .uri("$baseUrl/graphql")
                    .header("Authorization", "Bearer $it")
                    .header("Nav-Callid", getCallIdFromMdc())
                    .header("Nav-User-Id", tokenService.determineLoggedInUserId())
                    .accept(MediaType.APPLICATION_JSON)
                    .bodyValue(query)
                    .retrieve()
                    .bodyToMono(HentDokumentoversiktFagsakResponse::class.java)
                    .retry(numberOfRetries)
                    .block()
            }

        return response?.data?.dokumentoversiktFagsak?.journalposter
            ?: handleGraphQLErrorResponse(
                errors = response?.errors,
                appId = AppId.SAF,
                service = SAF_API,
                logger = logger
            )
    }

    companion object {
        private const val FAGSAKSYSTEM: String = "PP01"
        private const val SAF_API = "saf-graphql-api"
    }
}