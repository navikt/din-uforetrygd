package no.nav.uforetrygdbackend.pensjon.pen

import no.nav.uforetrygdbackend.ClientException
import no.nav.uforetrygdbackend.ForbiddenException
import no.nav.uforetrygdbackend.WebClientTest
import no.nav.uforetrygdbackend.configuration.AppId
import no.nav.uforetrygdbackend.security.TokenService
import okhttp3.mockwebserver.MockResponse
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.Mockito
import org.mockito.Mockito.`when`
import org.springframework.http.HttpStatus
import org.springframework.web.reactive.function.client.WebClient
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneId

class PenClientTest : WebClientTest() {
    val tokenService = Mockito.mock(TokenService::class.java)
    lateinit var penClient: PenClient

    @BeforeEach
    override fun setup() {
        super.setup()
        penClient = PenClient(
            url = baseUrl, webClient = WebClient.create(), scope = "", audience = "", tokenService = tokenService
        )
    }

    @Test
    fun `should return list of saksammendrag when 200 response from sammendragWonderful`() {
        prepare(sakSammendragResponse200())
        assertEquals(
            listOf(
                SakSammendrag(
                    98798L,
                    "ALDER",
                    "LOPENDE",
                    LocalDate.of(2008, 9, 12),
                    LocalDate.of(2018, 11, 15),
                    "8767809"
                )
            ), penClient.getSaksammendrag(PID)
        )
        val request = takeRequest()

        assertEquals("/pen/api/selvbetjening/sak/sammendragWonderful", request.path)
        assertEquals(PID, request.getHeader("fnr"))
    }


    @Test
    fun `should throw ForbiddenException when 403 response from sammendragWonderful`() {
        prepare(response403())
        val exception = assertThrows<ForbiddenException> { penClient.getSaksammendrag(PID) }
        assertEquals(AppId.PEN.name, exception.system)
        assertEquals("/pen/api/selvbetjening/sak/sammendragWonderful", exception.service)
    }

    @Test
    fun `should throw ClientException when 500 response from sammendragWonderful`() {
        prepare(response500())
        val exception = assertThrows<ClientException> { penClient.getSaksammendrag(PID) }
        assertEquals(AppId.PEN.name, exception.system)
        assertEquals("/pen/api/selvbetjening/sak/sammendragWonderful", exception.service)
    }

    @Test
    fun `should throw ClientException when unexpected exception occurs in getSaksammendrag`() {
        prepare(sakSammendragResponse200())
        `when`(tokenService.getEgressToken("", "", PID, AppId.PEN)).thenThrow(IllegalStateException())
        val exception = assertThrows<ClientException> { penClient.getSaksammendrag(PID) }
        assertEquals(AppId.PEN.name, exception.system)
        assertEquals("/pen/api/selvbetjening/sak/sammendragWonderful", exception.service)
    }

    @Test
    fun `should return list of uttaksgrad when 200 response from uttaksgrad`() {
        prepare(uttaksgradResponse200())
        val expectedFom = Instant.ofEpochMilli(1724673890L).atZone(ZoneId.of("Europe/Oslo")).toLocalDate()
        val expectedTom = Instant.ofEpochMilli(1724673919L).atZone(ZoneId.of("Europe/Oslo")).toLocalDate()
        assertEquals(
            listOf(
                Uttaksgrad(
                    213123L,
                    expectedFom,
                    expectedTom,
                    50,
                    45345L,
                    2342345L
                )
            ), penClient.getUttaksgradHistorikk(PID)
        )
        val request = takeRequest()

        assertEquals("/pen/api/selvbetjening/uttaksgrad/person", request.path)
        assertEquals(PID, request.getHeader("pid"))
    }

    @Test
    fun `should throw ForbiddenException when 403 response from uttaksgrad`() {
        prepare(response403())
        val exception = assertThrows<ForbiddenException> { penClient.getUttaksgradHistorikk(PID) }
        assertEquals(AppId.PEN.name, exception.system)
        assertEquals("/pen/api/selvbetjening/uttaksgrad/person", exception.service)
    }

    @Test
    fun `should throw ClientException when 500 response from uttaksgrad`() {
        prepare(response500())
        val exception = assertThrows<ClientException> { penClient.getUttaksgradHistorikk(PID) }
        assertEquals(AppId.PEN.name, exception.system)
        assertEquals("/pen/api/selvbetjening/uttaksgrad/person", exception.service)
    }

    @Test
    fun `should throw ClientException when unexpected exception occurs in getUttaksgradHistorikk`() {
        prepare(uttaksgradResponse200())
        `when`(tokenService.getEgressToken("", "", PID, AppId.PEN)).thenThrow(IllegalStateException())
        val exception = assertThrows<ClientException> { penClient.getUttaksgradHistorikk(PID) }
        assertEquals(AppId.PEN.name, exception.system)
        assertEquals("/pen/api/selvbetjening/uttaksgrad/person", exception.service)
    }

    @Test
    fun `should return uforegrad when 200 response from uforegrad seneste`() {
        prepare(uforegradResponse200())
        assertEquals(
            50, penClient.getUforegrad(PID)
        )
        val request = takeRequest()

        assertEquals("/pen/api/selvbetjening/uforetrygd/uforegrad/seneste", request.path)
        assertEquals(PID, request.getHeader("fnr"))
    }

    @Test
    fun `should throw ForbiddenException when 403 response from uforegrad`() {
        prepare(response403())
        val exception = assertThrows<ForbiddenException> { penClient.getUforegrad(PID) }
        assertEquals(AppId.PEN.name, exception.system)
        assertEquals("/pen/api/selvbetjening/uforetrygd/uforegrad/seneste", exception.service)
    }

    @Test
    fun `should throw ClientException when 500 response from uforegrad`() {
        prepare(response500())
        val exception = assertThrows<ClientException> { penClient.getUforegrad(PID) }
        assertEquals(AppId.PEN.name, exception.system)
        assertEquals("/pen/api/selvbetjening/uforetrygd/uforegrad/seneste", exception.service)
    }

    @Test
    fun `should throw ClientException when unexpected exception occurs in getUforegrad`() {
        prepare(uforegradResponse200())
        `when`(tokenService.getEgressToken("", "", PID, AppId.PEN)).thenThrow(IllegalStateException())
        val exception = assertThrows<ClientException> { penClient.getUforegrad(PID) }
        assertEquals(AppId.PEN.name, exception.system)
        assertEquals("/pen/api/selvbetjening/uforetrygd/uforegrad/seneste", exception.service)
    }

    @Test
    fun `returns dinuforetrygdresponse when 200 response from din-uforetrygd seneste`() {
        prepare(dinUforetrygdResponse200())
        assertEquals(
            VedtakssammendragResponse(
                uforegrad = 50,
                virkFom = LocalDate.parse("2020-01-01"),
                uforetidspunkt = LocalDate.parse("2020-01-01"),
                inntektsgrense = 140_000,
                hasBarnetilleggFellesBarn = false,
                hasBarnetilleggSaerkullsbarn = false,
                hasGjenlevendeTillegg = false,
                hasVarigTilrettelagtArbeid = false
            ), penClient.getVedtakssammendragResponse(PID)
        )
        val request = takeRequest()

        assertEquals("/pen/api/selvbetjening/uforetrygd/vedtakssammendrag/seneste", request.path)
        assertEquals(PID, request.getHeader("fnr"))
    }

    @Test
    fun `throws ForbiddenException when 403 response from din-uforetrygd`() {
        prepare(response403())
        val exception = assertThrows<ForbiddenException> { penClient.getVedtakssammendragResponse(PID) }
        assertEquals(AppId.PEN.name, exception.system)
        assertEquals("/pen/api/selvbetjening/uforetrygd/vedtakssammendrag/seneste", exception.service)
    }

    @Test
    fun `throws ClientException when 500 response from din-uforetrygd`() {
        prepare(response500())
        val exception = assertThrows<ClientException> { penClient.getVedtakssammendragResponse(PID) }
        assertEquals(AppId.PEN.name, exception.system)
        assertEquals("/pen/api/selvbetjening/uforetrygd/vedtakssammendrag/seneste", exception.service)
    }

    @Test
    fun `throws ClientException when unexpected exception occurs in getDinUforetrygdResponse`() {
        prepare(uforegradResponse200())
        `when`(tokenService.getEgressToken("", "", PID, AppId.PEN)).thenThrow(IllegalStateException())
        val exception = assertThrows<ClientException> { penClient.getVedtakssammendragResponse(PID) }
        assertEquals(AppId.PEN.name, exception.system)
        assertEquals("/pen/api/selvbetjening/uforetrygd/vedtakssammendrag/seneste", exception.service)
    }

    private fun sakSammendragResponse200(): MockResponse {
        return jsonResponse(HttpStatus.OK)!!
            .setBody(
                """
                [
                    {
                    "sakId": 98798,
                     "sakType": "ALDER",
                     "sakStatus": "LOPENDE",
                     "fomDato": "2008-09-12T10:56:01",
                     "tomDato": "2018-11-15T10:56:01",
                     "enhetId": "8767809"
                    }
                ]
                """.trimIndent()
            )
    }

    private fun uttaksgradResponse200(): MockResponse {
        return jsonResponse(HttpStatus.OK)!!
            .setBody(
                """
                    {
                    "uttaksgradList": [
                        {
                        "uttaksgradId": 213123,
                        "fomDato": 1724673890,
                        "tomDato": 1724673919,
                        "uttaksgrad": 50,
                        "vedtakId": 45345,
                        "sakId": 2342345
                        }
                    ]
                }
                """.trimIndent()
            )
    }

    private fun dinUforetrygdResponse200(): MockResponse {
        return jsonResponse(HttpStatus.OK)!!
            .setBody(
                """
                    {
                        "uforegrad": 50,
                        "virkFom": "2020-01-01",
                        "uforetidspunkt" : "2020-01-01",
                        "inntektsgrense": 140000,
                        "hasBarnetilleggFellesBarn": false,
                        "hasBarnetilleggSaerkullsbarn": false,
                        "hasGjenlevendeTillegg": false,
                        "hasVarigTilrettelagtArbeid": false
                    }
                """.trimIndent()
            )
    }

    private fun uforegradResponse200(): MockResponse {
        return jsonResponse(HttpStatus.OK)!!
            .setBody(
                """
                    {
                    "uforegrad": 50
                }
                """.trimIndent()
            )
    }

    private fun response403(): MockResponse {
        return jsonResponse(HttpStatus.FORBIDDEN)!!
    }

    private fun response500(): MockResponse {
        return jsonResponse(HttpStatus.INTERNAL_SERVER_ERROR)!!
    }

    companion object {
        const val PID = "00000000000"
    }
}