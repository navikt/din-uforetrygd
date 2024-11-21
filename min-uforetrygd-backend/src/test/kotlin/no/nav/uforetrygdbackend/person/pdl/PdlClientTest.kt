package no.nav.uforetrygdbackend.person.pdl

import no.nav.uforetrygdbackend.ClientException
import no.nav.uforetrygdbackend.ForbiddenException
import no.nav.uforetrygdbackend.WebClientTest
import no.nav.uforetrygdbackend.security.AzureAdService
import no.nav.uforetrygdbackend.security.TokenService
import okhttp3.mockwebserver.MockResponse
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.mockito.Mockito.mock
import org.springframework.http.HttpStatus
import org.springframework.web.reactive.function.client.WebClient

class PdlClientTest: WebClientTest(){
    val tokenService: TokenService = mock(TokenService::class.java)
    val azureAdService: AzureAdService = mock(AzureAdService::class.java)
    lateinit var pdlClient: PdlClient

    @BeforeEach
    override fun setup() {
        super.setup()
        pdlClient = PdlClient(
            url = baseUrl,
            webClient = WebClient.create(),
            scope = "",
            audience = "",
            tokenService = tokenService,
            azureAdService = azureAdService
        )
    }

    @Test
    fun `should return Person when performing pdl query`() {
        prepare(response200())
        val person = pdlClient.performQuery(PdlPersonQuery("", PdlPersonVariables("", false)))
        assertEquals(PdlAdressebeskyttelsesgradering.STRENGT_FORTROLIG, person.adressebeskyttelse?.get(0)?.gradering)
    }

    @Test
    fun `should throw ForbiddenException when unauthenticated from PDL`(){
        prepare(responsePdlError("unauthenticated"))
        assertThrows<ForbiddenException> {
            pdlClient.performQuery(
                PdlPersonQuery(
                    "",
                    PdlPersonVariables("", false)
                )
            )
        }
    }

    @Test
    fun `should throw ForbiddenException when unauthorized from PDL`(){
        prepare(responsePdlError("unauthorized"))
        assertThrows<ForbiddenException> {
            pdlClient.performQuery(
                PdlPersonQuery(
                    "",
                    PdlPersonVariables("", false)
                )
            )
        }
    }

    @Test
    fun `should throw ClientException when not found from PDL`(){
        prepare(responsePdlError("not_found"))
        assertThrows<ClientException> {
            pdlClient.performQuery(
                PdlPersonQuery(
                    "",
                    PdlPersonVariables("", false)
                )
            )
        }
    }

    @Test
    fun `should throw ClientException when bad request from PDL`(){
        prepare(responsePdlError("bad_request"))
        assertThrows<ClientException> {
            pdlClient.performQuery(
                PdlPersonQuery(
                    "",
                    PdlPersonVariables("", false)
                )
            )
        }
    }

    @Test
    fun `should throw ClientException when server error from PDL`(){
        prepare(responsePdlError("server_error"))
        assertThrows<ClientException> {
            pdlClient.performQuery(
                PdlPersonQuery(
                    "",
                    PdlPersonVariables("", false)
                )
            )
        }
    }

    private fun response200(): MockResponse {
        return jsonResponse(HttpStatus.OK)!!
            .setBody(
                """{
                        "data": {
                            "hentPerson": {
                                "adressebeskyttelse": [{ 
                                    "gradering": "STRENGT_FORTROLIG",
                                    "folkeregistermetadata": {
                                        "ajourholdstidspunkt": "2021-03-26T10:56:01",
                                        "gyldighetstidspunkt": "2021-03-26T10:56:01"
                                    },
                                    "metadata": {
                                        "master": "FREG",
                                        "endringer": [
                                            {
                                            "registrert": "2021-03-26T10:56:01"
                                            }
                                        ]
                                    }
                                }]
                            }
                        }
                    }
                """
            )
    }

    private fun responsePdlError(errorCode: String): MockResponse {
        return jsonResponse(HttpStatus.OK)!!
            .setBody(
                """{
    "data": null,
    "errors": [{"message": "En feil",
                "locations": [{"line":1, "columns":9}],
                "path": ["/path/p"],
                "extensions":{"code": "$errorCode", "classification":"CRITICAL"}}
               ]
    
}"""
            )
    }
}