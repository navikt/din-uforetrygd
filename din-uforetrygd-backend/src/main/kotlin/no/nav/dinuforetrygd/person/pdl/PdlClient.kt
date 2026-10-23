package no.nav.dinuforetrygd.person.pdl

interface PdlClient {
    fun performQuery(query: PdlPersonQuery): PdlPerson
    fun performQueryWithElevatedPriveleges(query: PdlPersonQuery): PdlPerson
    fun performQuery(query: PdlPersonQuery, token: String?): PdlPerson
}