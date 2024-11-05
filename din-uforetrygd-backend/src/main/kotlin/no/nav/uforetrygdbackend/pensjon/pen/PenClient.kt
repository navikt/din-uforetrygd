package no.nav.uforetrygdbackend.pensjon.pen

import no.nav.uforetrygdbackend.ClientException
import no.nav.uforetrygdbackend.ForbiddenException
import no.nav.uforetrygdbackend.configuration.AppId
import no.nav.uforetrygdbackend.configuration.CallIdUtil
import no.nav.uforetrygdbackend.configuration.getCallIdFromMdc
import no.nav.uforetrygdbackend.security.TokenService
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
    private val webClient: WebClient,
    private val tokenService: TokenService
) {
    fun getSaksammendrag(pid: String): List<SakSammendrag> {
        val path = "/pen/api/selvbetjening/sak/sammendragWonderful"
        try {
            return tokenService.getEgressToken(scope = scope, audience = audience, pid = pid, appId = AppId.PEN)
                .let { accessToken ->
                    webClient
                        .get()
                        .uri("$url$path")
                        .header("fnr", pid)
                        .header("Authorization", "Bearer $accessToken")
                        .header(CallIdUtil.NAV_CALL_ID_NAME, CallIdUtil.getCallIdFromMdc())
                        .accept(MediaType.APPLICATION_JSON)
                        .retrieve()
                        .bodyToMono(object : ParameterizedTypeReference<List<SakSammendrag>>() {})
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

    fun getUttaksgradHistorikk(pid: String): List<Uttaksgrad> {
        val path = "/pen/api/selvbetjening/uttaksgrad/person"
        try {
            return tokenService.getEgressToken(scope = scope, audience = audience, pid = pid, appId = AppId.PEN)
                .let { accessToken ->
                    webClient
                        .get()
                        .uri("$url$path")
                        .header("pid", pid)
                        .header("Authorization", "Bearer $accessToken")
                        .header(CallIdUtil.NAV_CALL_ID_NAME, CallIdUtil.getCallIdFromMdc())
                        .accept(MediaType.APPLICATION_JSON)
                        .retrieve()
                        .bodyToMono(UttaksgradResponse::class.java)
                        .block()?.uttaksgradList ?: emptyList()
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

    fun getUforegrad(pid: String): Int? {
        val path = "/pen/api/selvbetjening/uforetrygd/uforegrad/seneste"
        try {
            return tokenService.getEgressToken(scope = scope, audience = audience, pid = pid, appId = AppId.PEN)
                .let { accessToken ->
                    webClient
                        .get()
                        .uri("$url$path")
                        .header("fnr", pid)
                        .header("Authorization", "Bearer $accessToken")
                        .header(CallIdUtil.NAV_CALL_ID_NAME, CallIdUtil.getCallIdFromMdc())
                        .accept(MediaType.APPLICATION_JSON)
                        .retrieve()
                        .bodyToMono(UforegradResponse::class.java)
                        .block()?.uforegrad
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

    fun getDinUforetrygdResponse(pid: String): DinUforetrygdResponse {
        val path = "/pen/api/selvbetjening/uforetrygd/din-uforetrygd"
        return try {
            tokenService.getEgressToken(scope = scope, audience = audience, pid = pid, appId = AppId.PEN)
                .let { accessToken ->
                    webClient
                        .get()
                        .uri("$url$path")
                        .header("fnr", pid)
                        .header("Authorization", "Bearer $accessToken")
                        .header(CallIdUtil.NAV_CALL_ID_NAME, CallIdUtil.getCallIdFromMdc())
                        .accept(MediaType.APPLICATION_JSON)
                        .retrieve()
                        .bodyToMono(DinUforetrygdResponse::class.java)
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