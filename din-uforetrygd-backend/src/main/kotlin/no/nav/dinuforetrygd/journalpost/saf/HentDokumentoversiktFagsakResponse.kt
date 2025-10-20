package no.nav.dinuforetrygd.journalpost.saf

import com.fasterxml.jackson.annotation.JsonProperty
import no.nav.dinuforetrygd.common.GraphQLError

data class HentDokumentoversiktFagsakResponse(
    @JsonProperty("data") val data: SafData?,
    @JsonProperty("errors") val errors: List<GraphQLError>?,
) {
    data class SafData(
        @JsonProperty("dokumentoversiktFagsak") val dokumentoversiktFagsak: DokumentoversiktFagsak?
    ) {
        data class DokumentoversiktFagsak(
            @JsonProperty("journalposter") val journalposter: List<JournalpostSafDto>?
        )
    }
}
