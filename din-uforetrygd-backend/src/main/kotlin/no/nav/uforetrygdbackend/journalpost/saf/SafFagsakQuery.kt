package no.nav.uforetrygdbackend.journalpost.saf

data class SafFagsakQuery(
    val query: String,
    val variables: SafFagsakVariables,
) {
    data class SafFagsakVariables(
        val fagsak: SafFagsakInput,
        val foerste: Int,
    ) {
        data class SafFagsakInput(
            val fagsakId: String,
            val fagsaksystem: String,
        )
    }
}
