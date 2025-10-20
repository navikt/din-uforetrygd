package no.nav.dinuforetrygd.person.pdl

data class PdlPersonQuery(
        val query: String,
        val variables: PdlPersonVariables,
)

data class PdlPersonVariables(
    val ident: String,
)