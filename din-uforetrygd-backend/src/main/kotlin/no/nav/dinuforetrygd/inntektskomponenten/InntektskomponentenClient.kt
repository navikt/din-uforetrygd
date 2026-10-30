package no.nav.dinuforetrygd.inntektskomponenten

import no.nav.dinuforetrygd.ClientException
import no.nav.dinuforetrygd.ForbiddenException
import no.nav.dinuforetrygd.PersonNotFoundException
import no.nav.dinuforetrygd.configuration.AppId
import no.nav.dinuforetrygd.configuration.getCallIdFromMdc
import no.nav.dinuforetrygd.configuration.retryOnTimeout
import no.nav.dinuforetrygd.configuration.withMdcContext
import no.nav.dinuforetrygd.security.AzureAdService
import no.nav.dinuforetrygd.logging.NAV_CALL_ID_HEADER
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.MediaType.APPLICATION_PROBLEM_JSON
import org.springframework.stereotype.Component
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.web.reactive.function.client.WebClientResponseException
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

@Component
class InntektskomponentenClient(
    private val webClient: WebClient,
    private val azureAdService: AzureAdService,
    @Value("\${inntektskomponenten.url}") private val url: String,
    @Value("\${inntektskomponenten.scope}") private val scope: String,
) {

    private val logger: Logger = LoggerFactory.getLogger(InntektskomponentenClient::class.java)

    fun hentAbonnerteInntekter(
        pid: String,
        filter: String,
        formål: String,
        månedFom: LocalDate,
        månedTom: LocalDate
    ): HentAbonnerteInntekterResponse {
        val path = "/rest/v2/abonnement/inntekt"
        val yearMonthFormatter = DateTimeFormatter.ofPattern("yyyy-MM")
        val request = HentAbonnerteInntekterRequest(
            personident = pid,
            filter = filter,
            formaal = formål,
            maanedFom = månedFom.format(yearMonthFormatter),
            maanedTom = månedTom.format(yearMonthFormatter)
        )
        try {
            return azureAdService.retrieveClientCredentialsToken(listOf(scope)) //TODO: Temp fix original code: tokenService.getEgressToken(scope = scope, "", AppId.INNTEKTSKOMPONENTEN)
                .let { accessToken ->
                    webClient
                        .post()
                        .uri("$url$path")
                        .header("Authorization", "Bearer $accessToken")
                        .header(NAV_CALL_ID_HEADER, getCallIdFromMdc())
                        .accept(MediaType.APPLICATION_JSON)
                        .bodyValue(request)
                        .retrieve()
                        .bodyToMono(HentAbonnerteInntekterResponse::class.java)
                        .retryWhen(retryOnTimeout)
                        .withMdcContext()
                        .block()!!
                }
        } catch (e: WebClientResponseException) {
            if(e.headers.contentType == APPLICATION_PROBLEM_JSON) {
                logger.warn("Kall til inntektskomponenten feilet med melding: ${e.responseBodyAsString}")
            }
            when (e.statusCode) {
                HttpStatus.FORBIDDEN -> throw ForbiddenException(AppId.INNTEKTSKOMPONENTEN.name, path, e.message, e)
                HttpStatus.NOT_FOUND  -> throw PersonNotFoundException(AppId.INNTEKTSKOMPONENTEN.name, path, e.message, e)
                HttpStatus.BAD_REQUEST  -> {
                    throw ClientException(AppId.INNTEKTSKOMPONENTEN.name, path, e.message, e)}
                else -> throw ClientException(AppId.INNTEKTSKOMPONENTEN.name, path, e.message, e)
            }
        } catch (e: Exception) {
            throw ClientException(AppId.INNTEKTSKOMPONENTEN.name, path, e.message, e)
        }
    }
}

data class HentAbonnerteInntekterResponse(val data: List<Inntektsinformasjon>)

data class Inntekt(
    val type: String,
    val beloep: Double,
    val fordel: String,
    val beskrivelse: String,
    val inngaarIGrunnlagForTrekk: Boolean,
    val utloeserArbeidsgiveravgift: Boolean,
    val skatteOgAvgiftsregel: String?,
    val opptjeningsperiodeFom: LocalDate?,
    val opptjeningsperiodeTom: LocalDate?,
    val tilleggsinformasjon: Tilleggsinformasjon?,
    val manuellVurdering: Boolean?
)

data class Inntektsinformasjon(
    val maaned: String,// yyyy-MM
    val opplysningspliktig: String,
    val underenhet: String,
    val norskident: String,
    val oppsummeringstidspunkt: LocalDateTime,
    val inntektListe: List<Inntekt>?,
    val forskuddstrekkListe: List<Forskuddstrekk>?,
    val avvikListe: List<Avvik> = emptyList(),
)

data class Forskuddstrekk(
    val beloep: Double,
    val beskrivelse: String?
)

data class Avvik(
    val kode: String?,
    val tekst: String?
)

data class Tilleggsinformasjon(
    val type: String
)

data class HentAbonnerteInntekterRequest(
    val personident: String,
    val filter: String,
    val formaal: String,
    val maanedFom: String,// yyyy-MM
    val maanedTom: String// yyyy-MM
)
