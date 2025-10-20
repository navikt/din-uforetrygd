package no.nav.dinuforetrygd.journalpost.saf

import java.time.LocalDateTime

data class JournalpostSafDto(
    val tittel: String,
    val journalpostId: String,
    val journalposttype: String,
    val tema: String?,
    val avsenderMottaker: AvsenderMottaker?,
    val sak: Sak,
    val datoOpprettet: LocalDateTime,
    val dokumenter: List<Dokument>,
) {
    data class Sak (
        val fagsakId: String,
    )
    data class AvsenderMottaker (
        val id: String?,
        val erLikBruker: Boolean,
    )
    data class Dokument(
        val tittel: String,
        val dokumentInfoId: String,
        val dokumentvarianter: List<DokumentVariant>,
    ) {
        data class DokumentVariant(
            val variantformat: Variantformat,
            val brukerHarTilgang: Boolean,
            val filtype: String,
        ) {
            enum class Variantformat {
                ARKIV, SLADDET, PRODUKSJON, PRODUKSJON_DLF, FULLVERSJON, ORIGINAL
            }
        }
    }
}