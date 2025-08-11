package no.nav.uforetrygdbackend.person.pdl

class PdlQueryBuilder {
    companion object {

        fun getAdressebeskyttelseQuery(pid: String): PdlPersonQuery {
            return getPdlQuery(pid, "/pdl/adressebeskyttelse.graphql")
        }

        fun getVergemaaalEllerFremtidsfullmaktQuery(pid: String): PdlPersonQuery {
            return getPdlQuery(pid, "/pdl/vergemaalEllerFremtidsfullmakt.graphql")
        }

        private fun getPdlQuery(
            pid: String,
            queryFilePath: String,
        ) = PdlPersonQuery(
            PdlPersonQuery::class.java.getResource(queryFilePath)
                ?.readText()?.replace("[ \n\r]", "")
                ?: throw IllegalArgumentException("Unable to locate graphQl file"),
            PdlPersonVariables(pid)
        )
    }
}