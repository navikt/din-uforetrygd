package no.nav.uforetrygdbackend.journalpost.safselvbetjening

private const val TEMA_UFORE: String = "UFO"

fun getSafSelvbetjeningJournalpostQuery(pid: String): SafSelvbetjeningJournalpostQuery =
    SafSelvbetjeningJournalpostQuery(
        query = SafSelvbetjeningJournalpostQuery::class.java.getResource("/safselvbetjening/alleJournalposter.graphql")
            ?.readText()?.replace("[ \n\r]", "")
            ?: throw IllegalArgumentException("Unable to locate graphQl file"),
        variables = SafSelvbetjeningJournalpostQuery.SafSelvbetjeningJournalpostVariables(pid, listOf(TEMA_UFORE))
    )
