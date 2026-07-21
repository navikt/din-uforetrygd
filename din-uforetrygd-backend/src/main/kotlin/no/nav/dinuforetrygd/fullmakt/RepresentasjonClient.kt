package no.nav.dinuforetrygd.fullmakt


import kotlinx.coroutines.reactor.awaitSingle
import no.nav.dinuforetrygd.security.TokenService
import no.nav.dinuforetrygd.configuration.AppId
import no.nav.dinuforetrygd.configuration.retryOnTimeout
import no.nav.dinuforetrygd.configuration.withMdcContext
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.slf4j.MDC
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.stereotype.Component
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.web.reactive.function.client.WebClientResponseException
import org.springframework.web.server.ResponseStatusException
import org.springframework.web.util.UriComponentsBuilder

@Component
class RepresentasjonClient(
    @Value("\${fullmakt.endpoint.url}") private val baseUrl: String,
    @Value("\${fullmakt.scope}") private val scope: String,
    @Value("\${fullmakt.audience}") private val audience: String,
    private val webClient: WebClient,
    private val tokenService: TokenService
) {

    fun hasValidRepresentasjonsforhold(representertPid: String, representantPid: String): RepresentasjonsforholdValidity? {
        return try {
            tokenService.getEgressToken(scope, audience, representantPid, AppId.PENSJON_REPRESENTASJON).let {
                webClient
                    .post()
                    .uri(urlValidRepresentasjonsforhold())
                    .bodyValue(ValidRepresentasjonsforholdRequest(
                        representertPid,
                        representantPid,
                        VALID_FULLMAKT_TYPER + VALID_VERGE_TYPER))
                    .headers { header ->
                        header.setBearerAuth(it!!)
                        header[HttpHeaders.CONTENT_TYPE] = MediaType.APPLICATION_JSON_VALUE
                        header[HttpHeaders.ACCEPT] = MediaType.APPLICATION_JSON_VALUE
                        header[NAV_CALL_ID] = MDC.get(NAV_CALL_ID)
                    }
                    .retrieve()
                    .bodyToMono(RepresentasjonsforholdValidity::class.java)
                    .retryWhen(retryOnTimeout)
                    .withMdcContext()
                    .block()
            }

        } catch (e: WebClientResponseException) {
            logger.error("Kall til representasjonstjenesten feilet med melding: ${e.responseBodyAsString}")
            throw RepresentasjonException(
                SERVICE,
                "hasValidRepresentasjonsforhold",
                "Failed to call service: " + e.responseBodyAsString,
                e
            )
        } catch (e: ResponseStatusException) {
            logger.error("Kall til representasjonstjenesten feilet med statuskode ${e.statusCode}: ${e.message}")
            throw RepresentasjonException(SERVICE, "hasValidRepresentasjonsforhold", "Failed to call service", e)
        } catch (e: RuntimeException) { // e.g. when connection broken
            logger.error("Kall til representasjonstjenesten feilet: ${e.message}")
            throw RepresentasjonException(SERVICE, "hasValidRepresentasjonsforhold", "Failed to call service", e)
        }
    }

    suspend fun harRepresentasjonsforhold(representantPid: String, validRepresentasjonstyper: List<String>): HarRepresentasjonsforhold? {
        return try {
            tokenService.getEgressToken(scope, audience, representantPid, AppId.PENSJON_REPRESENTASJON).let {
                webClient
                    .post()
                    .uri(urlHarRepresentasjonsforhold())
                    .headers { header ->
                        header.setBearerAuth(it!!)
                        header[HttpHeaders.CONTENT_TYPE] = MediaType.APPLICATION_JSON_VALUE
                        header[HttpHeaders.ACCEPT] = MediaType.APPLICATION_JSON_VALUE
                        header[NAV_CALL_ID] = MDC.get(NAV_CALL_ID)
                    }
                    .bodyValue(HarRepresentasjonforholdRequest(representantPid, validRepresentasjonstyper))
                    .retrieve()
                    .bodyToMono(HarRepresentasjonsforhold::class.java)
                    .retryWhen(retryOnTimeout)
                    .withMdcContext()
                    .awaitSingle()
            }

        } catch (e: WebClientResponseException) {
            logger.error("Kall til representasjonstjenesten feilet med melding: ${e.responseBodyAsString}")
            throw RepresentasjonException(
                SERVICE,
                "harRepresentasjonsforhold",
                "Failed to call service: " + e.responseBodyAsString,
                e
            )
        } catch (e: ResponseStatusException) {
            logger.error("Kall til representasjonstjenesten feilet med statuskode ${e.statusCode}: ${e.message}")
            throw RepresentasjonException(SERVICE, "harRepresentasjonsforhold", "Failed to call service", e)
        } catch (e: RuntimeException) { // e.g. when connection broken
            logger.error("Kall til representasjonstjenesten feilet: ${e.message}")
            throw RepresentasjonException(SERVICE, "harRepresentasjonsforhold", "Failed to call service", e)
        }
    }


    private fun urlValidRepresentasjonsforhold() = UriComponentsBuilder.fromUriString(baseUrl)
            .path(PATH_HAS_VALID_REPRESENTASJONSFORHOLD)
            .build()
            .toUriString()

    private fun urlHarRepresentasjonsforhold() = UriComponentsBuilder.fromUriString(baseUrl)
        .path(PATH_HAR_REPRESENTASJONSFORHOLD)
        .build()
        .toUriString()

    companion object {
        private const val SERVICE = "Representasjon"
        private const val PATH_HAS_VALID_REPRESENTASJONSFORHOLD = "/representasjon/hasValidRepresentasjonsforhold"
        private const val PATH_HAR_REPRESENTASJONSFORHOLD = "/representasjon/harRepresentasjonsforhold"

        const val NAV_CALL_ID = "Nav-Call-Id"
        private val VALID_FULLMAKT_TYPER = listOf(
            "UFORETRYGD_LES",
            "UFORETRYGD_SKRIV")
        val VALID_VERGE_TYPER = listOf(
            "VERGE_UFORETRYGD_LES",
            "VERGE_UFORETRYGD_SKRIV"
        )

        private val logger: Logger = LoggerFactory.getLogger(RepresentasjonClient::class.java)

    }
}

