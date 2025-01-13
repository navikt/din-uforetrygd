package no.nav.uforetrygdbackend.person.pdl

data class PdlPersonQuery(
        val query: String,
        val variables: PdlPersonVariables,
)

data class PdlPersonVariables(
    val ident: String,
)