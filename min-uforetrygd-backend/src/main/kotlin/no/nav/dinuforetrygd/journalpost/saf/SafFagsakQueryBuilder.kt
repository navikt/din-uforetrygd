package no.nav.dinuforetrygd.journalpost.saf

fun getSafFagsakQuery(fagsakId: String, fagsaksystem: String): SafFagsakQuery =
    SafFagsakQuery(
        query = SafFagsakQuery::class.java.getResource("/saf/dokumentoversiktFagsak.graphql")
            ?.readText()?.replace("[ \n\r]", "")
            ?: throw IllegalArgumentException("Unable to locate graphQl file"),
        variables = SafFagsakQuery.SafFagsakVariables(
            fagsak = SafFagsakQuery.SafFagsakVariables.SafFagsakInput(
                fagsakId = fagsakId,
                fagsaksystem = fagsaksystem
            ),
            foerste = 100
        )
    )