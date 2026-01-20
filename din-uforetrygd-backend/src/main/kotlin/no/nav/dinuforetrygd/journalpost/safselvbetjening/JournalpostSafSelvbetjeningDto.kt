package no.nav.dinuforetrygd.journalpost.safselvbetjening

import java.time.LocalDateTime

data class JournalpostSafSelvbetjeningDto(
    val tittel: String,
    val journalpostId: String,
    val journalposttype: String,
    val tema: String?,
    val avsender: Aktoer?,
    val mottaker: Aktoer?,
    val sak: Sak?,
    val datoSortering: LocalDateTime,
    val dokumenter: List<Dokument>,
) {
    data class Sak (
        val fagsakId: String?,
    )
    data class Aktoer (
        val id: String?,
    )
    data class Dokument(
        val tittel: String?,
        val dokumentInfoId: String,
        val dokumentvarianter: List<DokumentVariant>,
    ) {
        data class DokumentVariant(
            val brukerHarTilgang: Boolean,
            val filtype: String,
            val filstorrelse: Int,
        )
    }
}