package no.nav.uforetrygdbackend.journalpost.safselvbetjening

import com.fasterxml.jackson.annotation.JsonProperty
import no.nav.uforetrygdbackend.common.GraphQLError

data class HentJournalposterResponse(
    @JsonProperty("data") val data: SafData?,
    @JsonProperty("errors") val errors: List<GraphQLError>?,
) {
    data class SafData(
        @JsonProperty("dokumentoversiktSelvbetjening") val dokumentoversiktSelvbetjening: DokumentoversiktSelvbetjening?
    ) {
        data class DokumentoversiktSelvbetjening(
            @JsonProperty("journalposter") val journalposter: List<JournalpostSafSelvbetjeningDto>?
        )
    }
}
