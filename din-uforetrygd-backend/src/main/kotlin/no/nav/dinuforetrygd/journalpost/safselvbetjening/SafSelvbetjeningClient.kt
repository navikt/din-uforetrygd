package no.nav.dinuforetrygd.journalpost.safselvbetjening

import no.nav.dinuforetrygd.ClientException
import no.nav.dinuforetrygd.ForbiddenException
import no.nav.dinuforetrygd.PersonNotFoundException
import no.nav.dinuforetrygd.common.handleGraphQLErrorResponse
import no.nav.dinuforetrygd.configuration.AppId
import no.nav.dinuforetrygd.configuration.getCallIdFromMdc
import no.nav.dinuforetrygd.configuration.retryOnTimeout
import no.nav.dinuforetrygd.configuration.withMdcContext
import no.nav.dinuforetrygd.security.SecurityContextUtil
import no.nav.dinuforetrygd.security.TokenService
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.core.io.buffer.DataBuffer
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Component
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.web.reactive.function.client.WebClientResponseException
import reactor.core.publisher.Flux

@Component
class SafSelvbetjeningClient(
    @Value("\${safselvbetjening.endpoint.url}") private val baseUrl: String,
    @Value("\${safselvbetjening.audience}") private val audience: String,
    @Value("\${safselvbetjening.scope}") private val scope: String,
    private val tokenService: TokenService,
    private val webClient: WebClient,
) {
    companion object {
        private const val SAF_SELVBETJENING_API = "saf-selvbetjening-graphql-api"
    }

    private val logger = LoggerFactory.getLogger(SafSelvbetjeningClient::class.java)

    fun hentDokument(
        journalpostId: String,
        dokumentInfoId: String,
    ): ResponseEntity<Flux<DataBuffer>>? = tokenService.getEgressToken(
        scope,
        audience,
        SecurityContextUtil.getPidFromContext(),
        AppId.SAF_SELVBETJENING
    ).let {
        val path = "rest/hentdokument"
        try {
            webClient
                .get()
                .uri("$baseUrl/$path/${journalpostId}/${dokumentInfoId}")
                .header("Authorization", "Bearer $it")
                .header("Nav-Callid", getCallIdFromMdc())
                .accept(MediaType.APPLICATION_PDF)
                .retrieve()
                .toEntityFlux(DataBuffer::class.java)
                .retryWhen(retryOnTimeout)
                .withMdcContext()
                .block()
        } catch (e: WebClientResponseException) {
            when (e.statusCode) {
                HttpStatus.FORBIDDEN -> throw ForbiddenException(AppId.SAF_SELVBETJENING.name, path, e.message, e)
                HttpStatus.NOT_FOUND -> throw PersonNotFoundException(AppId.SAF_SELVBETJENING.name, path, e.message, e)
                else -> throw ClientException(AppId.SAF_SELVBETJENING.name, path, e.message, e)
            }
        } catch (e: Exception) {
            throw ClientException(AppId.SAF_SELVBETJENING.name, path, e.message, e)
        }
    }

    fun performGraphQLQuery(pid: String): List<JournalpostSafSelvbetjeningDto>? {
        val query = getSafSelvbetjeningJournalpostQuery(pid)
        val response = tokenService.getEgressToken(
            scope,
            audience,
            SecurityContextUtil.getPidFromContext(),
            AppId.SAF_SELVBETJENING
        ).let {
            webClient
                .post()
                .uri("$baseUrl/graphql")
                .header("Authorization", "Bearer $it")
                .header("Nav-Callid", getCallIdFromMdc())
                .accept(MediaType.APPLICATION_JSON)
                .bodyValue(query)
                .retrieve()
                .bodyToMono(HentJournalposterResponse::class.java)
                .retryWhen(retryOnTimeout)
                .withMdcContext()
                .block()
        }

        return response?.data?.dokumentoversiktSelvbetjening?.journalposter
            ?: handleGraphQLErrorResponse(
                errors = response?.errors,
                appId = AppId.SAF_SELVBETJENING,
                service = SAF_SELVBETJENING_API,
                logger = logger
            )
    }
}