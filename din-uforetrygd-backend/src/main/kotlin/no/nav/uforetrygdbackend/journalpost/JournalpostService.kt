package no.nav.uforetrygdbackend.journalpost

import no.nav.uforetrygdbackend.journalpost.model.EndretAvKode
import no.nav.uforetrygdbackend.journalpost.saf.JournalpostSafDto
import no.nav.uforetrygdbackend.journalpost.saf.SafClient
import no.nav.uforetrygdbackend.journalpost.safselvbetjening.JournalpostSafSelvbetjeningDto
import no.nav.uforetrygdbackend.journalpost.safselvbetjening.SafSelvbetjeningClient
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
    fun getDokument(journalpostId: String, dokumentInfoId: String, variantFormat: String? = null): DokumentDto {
        val dokumentResponse = when {
            tokenService.isUserLoggedInAsPerson() ->
                safSelvbetjeningClient.hentDokument(journalpostId, dokumentInfoId)

            tokenService.isUserLoggedInAsSaksbehandler() ->
                safClient.hentDokument(journalpostId, dokumentInfoId, variantFormat!!)

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
                .subscribe(DataBufferUtils.releaseConsumer())
        } ?: throw IllegalStateException("Unable to fetch document")

        return DokumentDto(pipedInputStream, contentLength)
    }

    fun getJournalPostliste(pid: String, sakId: String): List<Journalpost> {
        if (tokenService.isUserLoggedInAsPerson()) {
            val journalpostResponse = safSelvbetjeningClient.performGraphQLQuery(pid)
            return journalpostResponse?.filter { (it.tema == "UFO" || it.tema == "PEN") && it.sak?.fagsakId == sakId && it.dokumenter.isNotEmpty() && it.journalposttype != "N" }
                ?.map {
                    Journalpost(
                        id = it.journalpostId,
                        tittel = it.tittel,
                        opprettetAv = decideOpprettetAv(pid, it.avsender, it.mottaker),
                        opprettetDato = it.datoSortering.toString(),
                        dokumenter = mapSafSelvbetjeningsDocument(it.dokumenter),
                    )
                } ?: emptyList()
        } else {
            return safClient.performGraphQLQuery(sakId)
                .filter { (it.tema == "UFO" || it.tema == "PEN") && it.sak.fagsakId == sakId && it.dokumenter.isNotEmpty() && it.journalposttype != "N" }
                .map {
                    Journalpost(
                        id = it.journalpostId,
                        tittel = it.tittel,
                        opprettetAv = EndretAvKode.UKJENT,
                        opprettetDato = it.datoOpprettet.toString(),
                        dokumenter = mapSafDocument(it.dokumenter),
                    )
                }
        }
    }

    private fun mapSafSelvbetjeningsDocument(dokumenter: List<JournalpostSafSelvbetjeningDto.Dokument>): List<Journalpost.Dokument> =
        dokumenter.mapNotNull {
            it.dokumentvarianter.firstOrNull { variant -> variant.brukerHarTilgang && variant.filtype == "PDF" }
                ?.let { variant ->
                    Journalpost.Dokument(
                        tittel = it.tittel,
                        dokumentInfoId = it.dokumentInfoId,
                        filstorrelse = variant.filstorrelse,
                    )
                }
            }
        }

    private fun mapSafDocument(dokumenter: List<JournalpostSafDto.Dokument>): List<Journalpost.Dokument> =
        dokumenter.mapNotNull {
            it.dokumentvarianter.let { varianter ->
                varianter.firstOrNull {variant ->
                    variant.variantformat == JournalpostSafDto.Dokument.DokumentVariant.Variantformat.SLADDET
                } ?: varianter.firstOrNull() { variant ->
                    variant.variantformat == JournalpostSafDto.Dokument.DokumentVariant.Variantformat.ARKIV
                }
            }?.let {variant ->
                if (!variant.brukerHarTilgang) {
                    null
                } else {
                    Journalpost.Dokument(
                        tittel = it.tittel,
                        dokumentInfoId = it.dokumentInfoId,
                        filstorrelse = null,
                        variant = Journalpost.Dokument.DokumentVariant.valueOf(variant.variantformat.name)
                    )
                }
            }
        }

    private fun decideOpprettetAv(
        pid: String,
        avsender: JournalpostSafSelvbetjeningDto.Aktoer?,
        mottaker: JournalpostSafSelvbetjeningDto.Aktoer?,
    ): EndretAvKode {
        if (avsender?.id != null) {
            if (avsender.id == pid) return EndretAvKode.BRUKER
            if (isFodselsnummer(avsender.id)) return EndretAvKode.FULLMEKTIG
        }
        if (mottaker != null) {
            if (mottaker.id == pid) return EndretAvKode.NAV
        }

        return EndretAvKode.UKJENT
    }

    private fun isFodselsnummer(fodselsnummer: String): Boolean = fodselsnummer.matches(Regex("^\\d{11}\$"))

