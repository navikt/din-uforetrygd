package no.nav.dinuforetrygd.fullmakt


import no.nav.dinuforetrygd.security.TokenService
import no.nav.dinuforetrygd.configuration.AppId
import no.nav.dinuforetrygd.configuration.withMdcContext
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.slf4j.MDC
import org.springframework.beans.factory.annotation.Value
import org.springframework.core.ParameterizedTypeReference
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.stereotype.Component
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.web.reactive.function.client.WebClientResponseException
import org.springframework.web.server.ResponseStatusException
import org.springframework.web.util.UriComponentsBuilder

@Component
class FullmaktClient(
    @Value("\${fullmakt.endpoint.url}") private val baseUrl: String,
    @Value("\${fullmakt.scope}") private val scope: String,
    @Value("\${fullmakt.audience}") private val audience: String,
    @Value("\${webclient.number-of-retries}") private val numberOfRetries: Long,
    private val webClient: WebClient,
    private val tokenService: TokenService
) {

    fun harBprofFullmaktmottager(fullmektigPid: String): HarBprofFullmaktmottakereResponse? {
        return try {
            tokenService.getEgressToken(scope, audience, fullmektigPid, AppId.PENSJON_FULLMAKT).let {
                webClient
                    .get()
                    .uri(urlHarBprofFullmaktmottakere())
                    .headers { header ->
                        header.setBearerAuth(it!!)
                        header[HttpHeaders.CONTENT_TYPE] = MediaType.APPLICATION_JSON_VALUE
                        header[HttpHeaders.ACCEPT] = MediaType.APPLICATION_JSON_VALUE
                        header[NAV_CALL_ID] = MDC.get(NAV_CALL_ID)
                    }
                    .retrieve()
                    .bodyToMono(HarBprofFullmaktmottakereResponse::class.java)
                    .withMdcContext()
                    .retry(numberOfRetries)
                    .block()
            }

        } catch (e: WebClientResponseException) {
            logger.error("Kall til fullmaktstjenesten feilet med melding: ${e.responseBodyAsString}")
            throw FullmaktException(
                SERVICE,
                "harBprofFullmaktmottager",
                "Failed to call service: " + e.responseBodyAsString,
                e
            )
        } catch (e: RuntimeException) { // e.g. when connection broken
            throw FullmaktException(SERVICE, "harBprofFullmaktmottager", "Failed to call service", e)
        }
    }

    fun hasValidRepresentasjonsforhold(fullmaktsgiverPid: String, fullmektigPid: String): RepresentasjonsforholdValidity? {
        return try {
            tokenService.getEgressToken(scope, audience, fullmektigPid, AppId.PENSJON_FULLMAKT).let {
                webClient
                    .get()
                    .uri(urlValidRepresentasjonsforhold())
                    .headers { header ->
                        header.setBearerAuth(it!!)
                        header[HttpHeaders.CONTENT_TYPE] = MediaType.APPLICATION_JSON_VALUE
                        header[HttpHeaders.ACCEPT] = MediaType.APPLICATION_JSON_VALUE
                        header[NAV_CALL_ID] = MDC.get(NAV_CALL_ID)
                        header[FULLMAKTSGIVER_PID] = fullmaktsgiverPid
                    }
                    .retrieve()
                    .bodyToMono(RepresentasjonsforholdValidity::class.java)
                    .withMdcContext()
                    .retry(numberOfRetries)
                    .block()
            }

        } catch (e: WebClientResponseException) {
            logger.error("Kall til fullmaktstjenesten feilet med melding: ${e.responseBodyAsString}")
            throw FullmaktException(
                SERVICE,
                "hasValidRepresentasjonsforhold",
                "Failed to call service: " + e.responseBodyAsString,
                e
            )
        } catch (e: ResponseStatusException) {
            logger.error("Kall til fullmaktstjenesten feilet med statuskode ${e.statusCode}: ${e.message}")
            throw FullmaktException(SERVICE, "hasValidRepresentasjonsforhold", "Failed to call service", e)
        } catch (e: RuntimeException) { // e.g. when connection broken
            logger.error("Kall til fullmaktstjenesten feilet: ${e.message}")
            throw FullmaktException(SERVICE, "hasValidRepresentasjonsforhold", "Failed to call service", e)
        }
    }

    fun findAllRepresentasjonsforhold(fullmektigPid: String): List<Representasjonsforhold> {
        return try {
            tokenService.getEgressToken(scope, audience, fullmektigPid, AppId.PENSJON_FULLMAKT).let {
                webClient
                    .get()
                    .uri(urlFindRepresentasjonsforhold())
                    .headers { header ->
                        header.setBearerAuth(it!!)
                        header[HttpHeaders.CONTENT_TYPE] = MediaType.APPLICATION_JSON_VALUE
                        header[HttpHeaders.ACCEPT] = MediaType.APPLICATION_JSON_VALUE
                        header[NAV_CALL_ID] = MDC.get(NAV_CALL_ID)
                    }
                    .retrieve()
                    .bodyToMono(object : ParameterizedTypeReference<List<Representasjonsforhold>>() {})
                    .withMdcContext()
                    .retry(numberOfRetries)
                    .block() ?: emptyList()
            }

        } catch (e: WebClientResponseException) {
            logger.error("Kall til fullmaktstjenesten feilet med melding: ${e.responseBodyAsString}")
            throw FullmaktException(
                SERVICE,
                "findAllRepresentasjonsforhold",
                "Failed to call service: " + e.responseBodyAsString,
                e
            )
        } catch (e: ResponseStatusException) {
            logger.error("Kall til fullmaktstjenesten feilet med statuskode ${e.statusCode}: ${e.message}")
            throw FullmaktException(SERVICE, "findAllRepresentasjonsforhold", "Failed to call service", e)
        } catch (e: RuntimeException) { // e.g. when connection broken
            logger.error("Kall til fullmaktstjenesten feilet: ${e.message}")
            throw FullmaktException(SERVICE, "findAllRepresentasjonsforhold", "Failed to call service", e)
        }
    }

    private fun urlValidRepresentasjonsforhold() = UriComponentsBuilder.fromUriString(baseUrl)
            .path(PATH_HASREPRESENTASJONSFORHOLD)
            .queryParam(VALID_REPRESENTASJONSTYPER_KEY, VALID_REPRESENTASJONSTYPER)
            .queryParam(INCLUDE_NAVN_KEY, false)
            .build()
            .toUriString()

    private fun urlHarBprofFullmaktmottakere(): String {
        return UriComponentsBuilder.fromUriString(baseUrl)
            .path(PATH_HASBPROFFULLMAKTMOTTAKERE)
            .build()
            .toUriString()
    }

    private fun urlFindRepresentasjonsforhold(): String {
        return UriComponentsBuilder.fromUriString(baseUrl)
            .path(PATH_FINDREPRESENTASJONSFORHOLD)
            .build()
            .toUriString()
    }

    companion object {
        private const val SERVICE = "Fullmakt"
        private const val PATH_HASREPRESENTASJONSFORHOLD = "/representasjon/hasValidRepresentasjonsforhold"
        private const val PATH_FINDREPRESENTASJONSFORHOLD = "/representasjon/findAllRepresentasjonsforhold"
        private const val PATH_HASBPROFFULLMAKTMOTTAKERE = "/representasjon/bprof/harFullmaktmottakere"

        const val NAV_CALL_ID = "Nav-Call-Id"
        const val FULLMAKTSGIVER_PID = "fullmaktsgiverPid"
        const val INCLUDE_NAVN_KEY = "includeFullmaktsgiverNavn"
        const val VALID_REPRESENTASJONSTYPER_KEY = "validRepresentasjonstyper"
        private val VALID_REPRESENTASJONSTYPER = setOf(
            "PENSJON_FULLSTENDIG",
            "PENSJON_BEGRENSET",
            "UFORETRYGD_LES")

        private val logger: Logger = LoggerFactory.getLogger(FullmaktClient::class.java)

    }
}

