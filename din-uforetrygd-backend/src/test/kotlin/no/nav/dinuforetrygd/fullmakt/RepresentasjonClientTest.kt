package no.nav.dinuforetrygd.fullmakt

import no.nav.dinuforetrygd.WebClientTest
import no.nav.dinuforetrygd.configuration.AppId
import no.nav.dinuforetrygd.security.TokenService
import okhttp3.mockwebserver.MockResponse
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.Mockito
import org.mockito.Mockito.`when`
import org.slf4j.MDC
import org.springframework.http.HttpStatus
import org.springframework.web.reactive.function.client.WebClient
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue

class RepresentasjonClientTest : WebClientTest() {
    val tokenService = Mockito.mock(TokenService::class.java)
    lateinit var representasjonClient: RepresentasjonClient

    @BeforeEach
    override fun setup() {
        super.setup()
        representasjonClient = RepresentasjonClient(
            baseUrl = baseUrl,
            webClient = WebClient.create(),
            scope = "",
            audience = "",
            tokenService = tokenService,
        )
        `when`(tokenService.getEgressToken("", "", PID_REPRESENTANT, AppId.PENSJON_REPRESENTASJON)).thenReturn("")
        MDC.put("x", "y")
    }

    @AfterEach
    override fun tearDown() {
        MDC.clear()
    }

    @Test
    fun `should return RepresentasjonsforholdValidity when 200 response from hasValidRepresentasjonsforhold`() {
        prepare(hasValidRepresentasjonsforholdResponse200())
        assertEquals(
            RepresentasjonsforholdValidity(true, "Navn Navnesen", "fnr_kryptert", PID_REPRESENTERT),
            representasjonClient.hasValidRepresentasjonsforhold(PID_REPRESENTERT, PID_REPRESENTANT)
        )
        val request = takeRequest()
        val json = request.body.readUtf8()

        val body: ValidRepresentasjonsforholdRequest =
            jacksonObjectMapper().readValue(json)

        assertEquals(PID_REPRESENTERT, body.representertPid)
        assertEquals(PID_REPRESENTANT, body.representantPid)
        assertEquals(
            listOf("UFORETRYGD_LES", "UFORETRYGD_SKRIV", "VERGE_UFORETRYGD_LES", "VERGE_UFORETRYGD_SKRIV"),
            body.validRepresentasjonstyper
        )
        assertEquals(false, body.includeRepresentertNavn)
    }

    private fun hasValidRepresentasjonsforholdResponse200(): MockResponse {
        return jsonResponse(HttpStatus.OK)!!
            .setBody(
                """
                    {
                        "hasValidRepresentasjonsforhold": true,
                        "representertNavn": "Navn Navnesen",
                        "representertPidKryptert": "fnr_kryptert",
                        "representertPid": $PID_REPRESENTERT
                    }
                """.trimIndent()
            )
    }

    companion object {
        const val PID_REPRESENTANT = "00000000001"
        const val PID_REPRESENTERT = "10000000000"
    }
}