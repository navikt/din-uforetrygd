package no.nav.dinuforetrygd.person.pdl

import org.springframework.context.annotation.Profile
import org.springframework.stereotype.Component

@Profile("local")
@Component
class PdlClientMock : PdlClient {

    private fun mockPerson(): PdlPerson = PdlPerson(
        adressebeskyttelse = null,
        navn = listOf(
            PdlNavn(
                fornavn = "Lokal",
                mellomnavn = null,
                etternavn = "Testbruker",
                metadata = null,
                folkeregistermetadata = null
            )
        ),
        vergemaalEllerFremtidsfullmakt = null
    )

    override fun performQuery(query: PdlPersonQuery): PdlPerson = mockPerson()

    override fun performQueryWithElevatedPriveleges(query: PdlPersonQuery): PdlPerson = mockPerson()

    override fun performQuery(query: PdlPersonQuery, token: String?): PdlPerson = mockPerson()
}