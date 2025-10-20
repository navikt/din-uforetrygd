package no.nav.dinuforetrygd.journalpost

import java.io.InputStream

data class DokumentDto(
    val inputStream: InputStream,
    val contentLength: Long,
)