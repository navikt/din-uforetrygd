package no.nav.uforetrygdbackend.person

import no.nav.uforetrygdbackend.person.parallellesannheter.ParallelleSannheterService
import no.nav.uforetrygdbackend.person.pdl.*
import no.nav.uforetrygdbackend.security.TokenService
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.mockito.Mockito.mock
import org.mockito.Mockito.`when`

class PersonServiceTest {

    private val pdlClient = mock(PdlClient::class.java)
    private val parallelleSannheterService = mock(ParallelleSannheterService::class.java)
    private val tokenService = mock(TokenService::class.java)

    private val service = PersonService(pdlClient, parallelleSannheterService, tokenService)

    @Test
    fun `hasSaksbehandlerAccessToPid should return true when person is ugradert`() {
        `when`(pdlClient.performQueryWithElevatedPriveleges(PdlQueryBuilder.getAdressebeskyttelseQuery(PID))).thenReturn(
            PdlPerson(
                emptyList(),
            )
        )
        `when`(parallelleSannheterService.decideAdressebeskyttelse(emptyList())).thenReturn(null)
        assertTrue(service.hasSaksbehandlerAccessToPid(PID))
    }

    @Test
    fun `hasSaksbehandlerAccessToPid should return true when person is strengt fortrolig and saksbehandler has access`() {
        val adressebskyttelse = listOf(PdlAdressebskyttelse(PdlAdressebeskyttelsesgradering.STRENGT_FORTROLIG, null, null))

        `when`(pdlClient.performQueryWithElevatedPriveleges(PdlQueryBuilder.getAdressebeskyttelseQuery(PID))).thenReturn(
            PdlPerson(
                adressebskyttelse,
            )
        )
        `when`(parallelleSannheterService.decideAdressebeskyttelse(adressebskyttelse)).thenReturn(adressebskyttelse.first())
        `when`(tokenService.isUserInStrengtFortroligGroup()).thenReturn(true)

        assertTrue(service.hasSaksbehandlerAccessToPid(PID))
    }

    @Test
    fun `hasSaksbehandlerAccessToPid should return false when person is strengt fortrolig and saksbehandler lacks access`() {
        val adressebskyttelse = listOf(PdlAdressebskyttelse(PdlAdressebeskyttelsesgradering.STRENGT_FORTROLIG, null, null))

        `when`(pdlClient.performQueryWithElevatedPriveleges(PdlQueryBuilder.getAdressebeskyttelseQuery(PID))).thenReturn(
            PdlPerson(
                adressebskyttelse,
            )
        )
        `when`(parallelleSannheterService.decideAdressebeskyttelse(adressebskyttelse)).thenReturn(adressebskyttelse.first())
        `when`(tokenService.isUserInStrengtFortroligGroup()).thenReturn(false)

        assertFalse(service.hasSaksbehandlerAccessToPid(PID))
    }

    @Test
    fun `hasSaksbehandlerAccessToPid should return true when person is fortrolig and saksbehandler has access`() {
        val adressebskyttelse = listOf(PdlAdressebskyttelse(PdlAdressebeskyttelsesgradering.FORTROLIG, null, null))

        `when`(pdlClient.performQueryWithElevatedPriveleges(PdlQueryBuilder.getAdressebeskyttelseQuery(PID))).thenReturn(
            PdlPerson(
                adressebskyttelse,
            )
        )
        `when`(parallelleSannheterService.decideAdressebeskyttelse(adressebskyttelse)).thenReturn(adressebskyttelse.first())
        `when`(tokenService.isUserInFortroligGroup()).thenReturn(true)

        assertTrue(service.hasSaksbehandlerAccessToPid(PID))
    }

    @Test
    fun `hasSaksbehandlerAccessToPid should return false when person is fortrolig and saksbehandler lacks access`() {
        val adressebskyttelse = listOf(PdlAdressebskyttelse(PdlAdressebeskyttelsesgradering.FORTROLIG, null, null))

        `when`(pdlClient.performQueryWithElevatedPriveleges(PdlQueryBuilder.getAdressebeskyttelseQuery(PID))).thenReturn(
            PdlPerson(
                adressebskyttelse,
            )
        )
        `when`(parallelleSannheterService.decideAdressebeskyttelse(adressebskyttelse)).thenReturn(adressebskyttelse.first())
        `when`(tokenService.isUserInFortroligGroup()).thenReturn(false)

        assertFalse(service.hasSaksbehandlerAccessToPid(PID))
    }

    companion object {
        const val PID = "00000000000"
    }
}