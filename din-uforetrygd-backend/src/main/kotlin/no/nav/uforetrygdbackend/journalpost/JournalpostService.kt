package no.nav.uforetrygdbackend.journalpost

import no.nav.uforetrygdbackend.Sak
import no.nav.uforetrygdbackend.journalpost.saf.SafClient
import no.nav.uforetrygdbackend.journalpost.safselvbetjening.JournalpostSafSelvbetjeningDto
import no.nav.uforetrygdbackend.journalpost.safselvbetjening.SafSelvbetjeningClient
import no.nav.uforetrygdbackend.journalpost.model.EndretAvKode
import no.nav.uforetrygdbackend.security.TokenService
import org.springframework.core.io.buffer.DataBufferUtils
import org.springframework.stereotype.Service
import reactor.core.scheduler.Schedulers
import java.io.PipedInputStream
import java.io.PipedOutputStream

@Service
class JournalpostService(
    private val safSelvbetjeningClient: SafSelvbetjeningClient,
    private val safClient: SafClient,
    private val tokenService: TokenService,
) {
    fun getDokument(journalpostId: String, dokumentInfoId: String): DokumentDto {
        val dokumentResponse = when {
            tokenService.isUserLoggedInAsPerson() ->
                safSelvbetjeningClient.hentDokument(journalpostId, dokumentInfoId, VARIANT_FORMAT)

            tokenService.isUserLoggedInAsSaksbehandler() ->
                safClient.hentDokument(journalpostId, dokumentInfoId, VARIANT_FORMAT)

            else -> throw IllegalArgumentException("Cannot determine login type")
        }

        val contentLength =
            dokumentResponse?.headers?.contentLength ?: throw IllegalArgumentException("Content length is missing")

        val pipedOutputStream = PipedOutputStream()
        val pipedInputStream = PipedInputStream(pipedOutputStream, contentLength.toInt())

        dokumentResponse.body?.let { dataBufferFlux ->
            DataBufferUtils.write(dataBufferFlux, pipedOutputStream)
                .publishOn(Schedulers.boundedElastic())
                .doOnComplete { pipedOutputStream.close() }
                .subscribe()
        } ?: throw IllegalStateException("Unable to fetch document")

        return DokumentDto(pipedInputStream, contentLength)
    }

    fun getJournalPostliste(pid: String, sakId: String): List<Journalpost> {
        if (tokenService.isUserLoggedInAsPerson()) {
            val journalpostResponse = safSelvbetjeningClient.performGraphQLQuery(pid)
            return journalpostResponse?.filter { it.tema == "UFO" && it.sak.fagsakId == sakId && it.dokumenter.isNotEmpty()}?.map {
                Journalpost(
                    id = it.journalpostId,
                    tittel = it.tittel,
                    opprettetAv = decideOpprettetAv(pid, it.avsender, it.mottaker),
                    opprettetDato = it.datoSortering.toString(),
                    dokumenter = it.dokumenter.filter { dokument ->
                        dokument.dokumentvarianter.any { variant -> variant.brukerHarTilgang }
                    }.map { dokument ->
                        Journalpost.Dokument(
                            tittel = dokument.tittel,
                            dokumentInfoId = dokument.dokumentInfoId,
                            filstorrelse = dokument.dokumentvarianter.first { variant -> variant.filtype == "PDF" }.filstorrelse
                        )
                    }
                )
            } ?: emptyList()
        } else {
            return safClient.performGraphQLQuery(sakId).filter { it.tema == "UFO" && it.sak.fagsakId == sakId && it.dokumenter.isNotEmpty()}.map {
                Journalpost(
                    id = it.journalpostId,
                    tittel = it.tittel,
                    opprettetAv = EndretAvKode.UKJENT,
                    opprettetDato = it.datoOpprettet.toString(),
                    dokumenter = it.dokumenter.filter { dokument ->
                        dokument.dokumentvarianter.any { variant -> variant.brukerHarTilgang }
                    }.map { dokument ->
                        Journalpost.Dokument(
                            tittel = dokument.tittel,
                            dokumentInfoId = dokument.dokumentInfoId,
                        )
                    }
                )
            }
        }
    }


    private fun decideOpprettetAv(
        pid: String,
        avsender: JournalpostSafSelvbetjeningDto.Aktoer?,
        mottaker: JournalpostSafSelvbetjeningDto.Aktoer?,
    ): EndretAvKode {
        if (avsender != null) {
            if (avsender.id == pid) return EndretAvKode.BRUKER
            if (isFodselsnummer(avsender.id)) return EndretAvKode.FULLMEKTIG
        }
        if (mottaker != null) {
            if (mottaker.id == pid) return EndretAvKode.NAV
        }

        return EndretAvKode.UKJENT
    }

    private fun isFodselsnummer(fodselsnummer: String): Boolean =
        fodselsnummer.matches(Regex("^\\d{11}\$"))

    companion object {
        private const val VARIANT_FORMAT = "ARKIV"
    }
}
