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

class FullmaktClientTest : WebClientTest() {
    val tokenService = Mockito.mock(TokenService::class.java)
    lateinit var fullmaktClient: FullmaktClient

    @BeforeEach
    override fun setup() {
        super.setup()
        fullmaktClient = FullmaktClient(
            baseUrl = baseUrl,
            webClient = WebClient.create(),
            scope = "",
            audience = "",
            tokenService = tokenService,
        )
        `when`(tokenService.getEgressToken("", "", PID_FULLMEKTIG, AppId.PENSJON_FULLMAKT)).thenReturn("")
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
            RepresentasjonsforholdValidity(true, "Navn Navnesen", "fnr_kryptert", PID_FULLMAKTSGIVER),
            fullmaktClient.hasValidRepresentasjonsforhold(PID_FULLMAKTSGIVER, PID_FULLMEKTIG)
        )
        val request = takeRequest()

        assertEquals(
            "/representasjon/hasValidRepresentasjonsforhold?" +
                    "validRepresentasjonstyper=PENSJON_FULLSTENDIG" +
                    "&validRepresentasjonstyper=PENSJON_BEGRENSET" +
                    "&validRepresentasjonstyper=UFORETRYGD_LES" +
                    "&includeFullmaktsgiverNavn=false",
            request.path
        )
        assertEquals(PID_FULLMAKTSGIVER, request.getHeader("fullmaktsgiverPid"))
    }

    private fun hasValidRepresentasjonsforholdResponse200(): MockResponse {
        return jsonResponse(HttpStatus.OK)!!
            .setBody(
                """
                    {
                        "hasValidRepresentasjonsforhold": true,
                        "fullmaktsgiverNavn": "Navn Navnesen",
                        "fullmaktsgiverFnrKryptert": "fnr_kryptert",
                        "fullmaktsgiverFnr": $PID_FULLMAKTSGIVER
                    }
                """.trimIndent()
            )
    }

    companion object {
        const val PID_FULLMEKTIG = "00000000001"
        const val PID_FULLMAKTSGIVER = "10000000000"
    }
}