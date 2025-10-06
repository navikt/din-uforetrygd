package no.nav.uforetrygdbackend.journalpost.safselvbetjening

data class SafSelvbetjeningJournalpostQuery(
    val query: String,
    val variables: SafSelvbetjeningJournalpostVariables
) {
    data class SafSelvbetjeningJournalpostVariables(
        val ident: String,
        val tema: List<String>
    )
}
