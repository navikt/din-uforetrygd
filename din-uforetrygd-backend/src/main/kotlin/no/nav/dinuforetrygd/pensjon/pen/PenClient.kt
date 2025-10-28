package no.nav.dinuforetrygd.pensjon.pen

import no.nav.dinuforetrygd.ClientException
import no.nav.dinuforetrygd.ForbiddenException
import no.nav.dinuforetrygd.PersonNotFoundException
import no.nav.dinuforetrygd.configuration.AppId
import no.nav.dinuforetrygd.configuration.getCallIdFromMdc
import no.nav.dinuforetrygd.configuration.withMdcContext
import no.nav.dinuforetrygd.uforetrygd.Saksoversikt
import no.nav.dinuforetrygd.security.TokenService
import no.nav.dinuforetrygd.util.NAV_CALL_ID_HEADER
import org.springframework.beans.factory.annotation.Value
import org.springframework.core.ParameterizedTypeReference
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.stereotype.Component
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.web.reactive.function.client.WebClientResponseException

@Component
class PenClient(
    @Value("\${pen.endpoint.url}") private val url: String,
    @Value("\${pen.scope}") private val scope: String,
    @Value("\${pen.audience}") private val audience: String,
    @Value("\${webclient.number-of-retries}") private val numberOfRetries: Long,
    private val webClient: WebClient,
    private val tokenService: TokenService
) {
    fun getSaksammendrag(pid: String): List<SakSammendrag> {
        val path = "/pen/api/selvbetjening/sak/sammendrag/v2"
        try {
            return tokenService.getEgressToken(scope = scope, audience = audience, pid = pid, appId = AppId.PEN)
                .let { accessToken ->
                    webClient
                        .get()
                        .uri("$url$path")
                        .header("fnr", pid)
                        .header("Authorization", "Bearer $accessToken")
                        .header(NAV_CALL_ID_HEADER, getCallIdFromMdc())
                        .accept(MediaType.APPLICATION_JSON)
                        .retrieve()
                        .bodyToMono(object : ParameterizedTypeReference<List<SakSammendrag>>() {})
                        .withMdcContext()
                        .retry(numberOfRetries)
                        .block() ?: emptyList()
                }
        } catch (e: WebClientResponseException) {
            if (HttpStatus.FORBIDDEN == e.statusCode) {
                throw ForbiddenException(AppId.PEN.name, path, e.message, e)
            }
            throw ClientException(AppId.PEN.name, path, e.message, e)
        } catch (e: Exception) {
            throw ClientException(AppId.PEN.name, path, e.message, e)
        }
    }

    fun getSaksoversikt(pid: String, sakId: Long): Saksoversikt {
        val path = "/pen/api/selvbetjening/saksoversikt/v2"
        try {
            return tokenService.getEgressToken(scope = scope, audience = audience, pid = pid, appId = AppId.PEN)
                .let { accessToken ->
                    webClient
                        .get()
                        .uri("$url$path?sakId=$sakId")
                        .header("fnr", pid)
                        .header("Authorization", "Bearer $accessToken")
                        .header(NAV_CALL_ID_HEADER, getCallIdFromMdc())
                        .accept(MediaType.APPLICATION_JSON)
                        .retrieve()
                        .bodyToMono(Saksoversikt::class.java)
                        .withMdcContext()
                        .retry(numberOfRetries)
                        .block()!!
                }
        } catch (e: WebClientResponseException) {
            if (HttpStatus.FORBIDDEN == e.statusCode) {
                throw ForbiddenException(AppId.PEN.name, path, e.message, e)
            } else if (HttpStatus.NOT_FOUND == e.statusCode) {
                throw PersonNotFoundException(AppId.PEN.name, path, e.message, e)
            }
            throw ClientException(AppId.PEN.name, path, e.message, e)
        } catch (e: Exception) {
            throw ClientException(AppId.PEN.name, path, e.message, e)
        }
    }

    fun getVedtakssammendragResponse(pid: String): VedtakssammendragResponse {
        val path = "/pen/api/selvbetjening/uforetrygd/vedtakssammendrag/seneste"
        return try {
            tokenService.getEgressToken(scope = scope, audience = audience, pid = pid, appId = AppId.PEN)
                .let { accessToken ->
                    webClient
                        .get()
                        .uri("$url$path")
                        .header("fnr", pid)
                        .header("Authorization", "Bearer $accessToken")
                        .header(NAV_CALL_ID_HEADER, getCallIdFromMdc())
                        .accept(MediaType.APPLICATION_JSON)
                        .retrieve()
                        .bodyToMono(VedtakssammendragResponse::class.java)
                        .withMdcContext()
                        .retry(numberOfRetries)
                        .block()!!
                }
        } catch (e: WebClientResponseException) {
            if (HttpStatus.FORBIDDEN == e.statusCode) {
                throw ForbiddenException(AppId.PEN.name, path, e.message, e)
            }
            throw ClientException(AppId.PEN.name, path, e.message, e)
        } catch (e: Exception) {
            throw ClientException(AppId.PEN.name, path, e.message, e)
        }
    }

    fun getForventedeInntekterResponse(pid: String): ForventedeInntekterResponse {
        val path = "/pen/api/selvbetjening/rightColumnHelper"
        return try {
            tokenService.getEgressToken(scope = scope, audience = audience, pid = pid, appId = AppId.PEN)
                .let { accessToken ->
                    webClient
                        .get()
                        .uri("$url$path")
                        .header("fnr", pid)
                        .header("Authorization", "Bearer $accessToken")
                        .header(NAV_CALL_ID_HEADER, getCallIdFromMdc())
                        .accept(MediaType.APPLICATION_JSON)
                        .retrieve()
                        .bodyToMono(ForventedeInntekterResponse::class.java)
                        .withMdcContext()
                        .retry(numberOfRetries)
                        .block()!!
                }
        } catch (e: WebClientResponseException) {
            if (HttpStatus.FORBIDDEN == e.statusCode) {
                throw ForbiddenException(AppId.PEN.name, path, e.message, e)
            }
            throw ClientException(AppId.PEN.name, path, e.message, e)
        } catch (e: Exception) {
            throw ClientException(AppId.PEN.name, path, e.message, e)
        }
    }
}