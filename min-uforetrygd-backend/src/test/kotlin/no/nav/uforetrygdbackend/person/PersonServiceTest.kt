package no.nav.uforetrygdbackend.person

import no.nav.uforetrygdbackend.person.parallellesannheter.ParallelleSannheterService
import no.nav.uforetrygdbackend.person.pdl.*
import no.nav.uforetrygdbackend.security.TokenService
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.mockito.Mockito.mock
import org.mockito.Mockito.`when`
import java.time.LocalDate

class PersonServiceTest {

    private val pdlClient = mock(PdlClient::class.java)
    private val parallelleSannheterService = mock(ParallelleSannheterService::class.java)
    private val tokenService = mock(TokenService::class.java)

    private val service = PersonService(pdlClient, parallelleSannheterService, tokenService)

    @Test
    fun `should set alder based on foedsel from PDL when getPersondata`() {
        val expectedAlder = 46
        val fodselsdato = LocalDate.now().minusYears(expectedAlder.toLong())
        val foedsel = listOf(
            PdlFoedsel(
                fodselsdato,
                null,
                null,
                null
            )
        )
        `when`(pdlClient.performQuery(PdlQueryBuilder.getPersonQuery(PID))).thenReturn(
            PdlPerson(
                foedsel,
                emptyList(),
                emptyList()
            )
        )
        `when`(parallelleSannheterService.decideFodselsdato(foedsel)).thenReturn(fodselsdato)
        val persondata = service.getPersondata(PID)

        assertEquals(expectedAlder, persondata.alder)
    }

    @Test
    fun `should set hasBarn true when user has foreldrebarn relasjon with relatertPersonsRolle BARN`() {
        `when`(pdlClient.performQuery(PdlQueryBuilder.getPersonQuery(PID))).thenReturn(
            PdlPerson(
                emptyList(),
                emptyList(),
                listOf(PdlForelderBarnRelasjon(PdlForelderBarnRelasjonRolle.BARN))
            )
        )
        `when`(parallelleSannheterService.decideFodselsdato(emptyList())).thenReturn(LocalDate.now())
        val persondata = service.getPersondata(PID)

        assertTrue(persondata.hasBarn)
    }

    @Test
    fun `should set hasBarn false when user has no foreldrebarnrelasjon with relatertPersonsRolle BARN`() {
        `when`(pdlClient.performQuery(PdlQueryBuilder.getPersonQuery(PID))).thenReturn(
            PdlPerson(
                emptyList(),
                emptyList(),
                listOf(PdlForelderBarnRelasjon(PdlForelderBarnRelasjonRolle.FAR))
            )
        )
        `when`(parallelleSannheterService.decideFodselsdato(emptyList())).thenReturn(LocalDate.now())
        val persondata = service.getPersondata(PID)

        assertFalse(persondata.hasBarn)
    }

    @Test
    fun `hasSaksbehandlerAccessToPid should return true when person is ugradert`() {
        `when`(pdlClient.performQueryWithElevatedPriveleges(PdlQueryBuilder.getAdressebeskyttelseQuery(PID))).thenReturn(
            PdlPerson(
                emptyList(),
                emptyList(),
                emptyList()
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
                emptyList(),
                adressebskyttelse,
                emptyList()
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
                emptyList(),
                adressebskyttelse,
                emptyList()
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
                emptyList(),
                adressebskyttelse,
                emptyList()
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
                emptyList(),
                adressebskyttelse,
                emptyList()
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