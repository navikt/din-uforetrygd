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

    private val service = PersonService(pdlClient, parallelleSannheterService)


    companion object {
        const val PID = "00000000000"
    }
}