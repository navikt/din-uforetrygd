package no.nav.dinuforetrygd.pensjon.pen

import no.nav.dinuforetrygd.ClientException
import no.nav.dinuforetrygd.ForbiddenException
import no.nav.dinuforetrygd.WebClientTest
import no.nav.dinuforetrygd.configuration.AppId
import no.nav.dinuforetrygd.security.TokenService
import okhttp3.mockwebserver.MockResponse
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.mockito.Mockito
import org.mockito.Mockito.`when`
import org.slf4j.MDC
import org.springframework.http.HttpStatus
import org.springframework.web.reactive.function.client.WebClient
import java.time.LocalDate

class PenClientTest : WebClientTest() {
    val tokenService = Mockito.mock(TokenService::class.java)
    lateinit var penClient: PenClient

    @BeforeEach
    override fun setup() {
        super.setup()
        penClient = PenClient(
            url = baseUrl,
            webClient = WebClient.create(),
            scope = "",
            audience = "",
            tokenService = tokenService,
        )
        MDC.put("x", "y")
    }

    @AfterEach
    override fun tearDown() {
        MDC.clear()
    }

    @Test
    fun `should return list of saksammendrag when 200 response from sammendragv2`() {
        prepare(sakSammendragResponse200())
        assertEquals(
            listOf(
                SakSammendrag(
                    98798L,
                    "UFOREP",
                    "LOPENDE",
                    LocalDate.of(2008, 9, 12),
                    LocalDate.of(2018, 11, 15),
                    "8767809"
                )
            ), penClient.getSaksammendrag(PID)
        )
        val request = takeRequest()

        assertEquals("/pen/api/selvbetjening/sak/sammendrag/v2", request.path)
        assertEquals(PID, request.getHeader("fnr"))
    }


    @Test
    fun `should throw ForbiddenException when 403 response from sammendragv2`() {
        prepare(response403())
        val exception = assertThrows<ForbiddenException> { penClient.getSaksammendrag(PID) }
        assertEquals(AppId.PEN.name, exception.system)
        assertEquals("/pen/api/selvbetjening/sak/sammendrag/v2", exception.service)
    }

    @Test
    fun `should throw ClientException when 500 response from sammendragv2`() {
        prepare(response500())
        val exception = assertThrows<ClientException> { penClient.getSaksammendrag(PID) }
        assertEquals(AppId.PEN.name, exception.system)
        assertEquals("/pen/api/selvbetjening/sak/sammendrag/v2", exception.service)
    }

    @Test
    fun `should throw ClientException when unexpected exception occurs in getSaksammendrag`() {
        prepare(sakSammendragResponse200())
        `when`(tokenService.getEgressToken("", "", PID, AppId.PEN)).thenThrow(IllegalStateException())
        val exception = assertThrows<ClientException> { penClient.getSaksammendrag(PID) }
        assertEquals(AppId.PEN.name, exception.system)
        assertEquals("/pen/api/selvbetjening/sak/sammendrag/v2", exception.service)
    }

    @Test
    fun `returns dinuforetrygdresponse when 200 response from din-uforetrygd seneste`() {
        prepare(dinUforetrygdResponse200())
        assertEquals(
            VedtakssammendragResponse(
                hasIverksattVedtak = true,
                vedtakssammendrag = Vedtakssammendrag(
                    uforegrad = 50,
                    virkFom = LocalDate.parse("2020-01-01"),
                    uforetidspunkt = LocalDate.parse("2020-01-01"),
                    inntektsgrense = 140_000,
                    hasBarnetilleggFellesBarn = false,
                    hasBarnetilleggSaerkullsbarn = false,
                    hasGjenlevendeTillegg = false,
                    hasVarigTilrettelagtArbeid = false,
                    inntektstak = 200000,
                    kompensasjonsgrad = 65.5,
                    nettoUtbetalingMnd = 20000
                )
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
                     "sakType": "UFOREP",
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
                    "hasIverksattVedtak": true,
                    "vedtakssammendrag":{
                            "uforegrad": 50,
                            "virkFom": "2020-01-01",
                            "uforetidspunkt" : "2020-01-01",
                            "inntektsgrense": 140000,
                            "hasBarnetilleggFellesBarn": false,
                            "hasBarnetilleggSaerkullsbarn": false,
                            "hasGjenlevendeTillegg": false,
                            "hasVarigTilrettelagtArbeid": false,
                            "inntektstak": 200000,
                            "kompensasjonsgrad": 65.5,
                            "nettoUtbetalingMnd": 20000
                        }
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