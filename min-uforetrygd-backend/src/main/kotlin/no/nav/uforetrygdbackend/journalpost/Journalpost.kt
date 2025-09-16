package no.nav.uforetrygdbackend.journalpost

import no.nav.uforetrygdbackend.journalpost.model.EndretAvKode

data class Journalpost(
    val id: String,
    val tittel: String,
    val opprettetAv: EndretAvKode,
    val opprettetDato: String,
    val dokumenter: List<Dokument>,
) {
    data class Dokument(
        val tittel: String,
        val dokumentInfoId: String,
        val filstorrelse: Int? = null,
        val variant: DokumentVariant? = null
    ) {
        enum class DokumentVariant {
            ARKIV, SLADDET
        }
    }
}