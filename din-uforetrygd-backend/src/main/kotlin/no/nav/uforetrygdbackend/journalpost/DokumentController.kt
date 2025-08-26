package no.nav.uforetrygdbackend.journalpost

import no.nav.uforetrygdbackend.ForbiddenException
import no.nav.uforetrygdbackend.PersonNotFoundException
import org.slf4j.LoggerFactory
import org.springframework.core.io.InputStreamResource
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException

@RestController
@RequestMapping("api/dokument")
class DokumentController(
    private val journalpostService: JournalpostService
) {

    private val logger = LoggerFactory.getLogger(DokumentController::class.java)

    @GetMapping("{journalpostId}/{dokumentInfoId}/{variantFormat}")
    fun getDokument(
        @PathVariable("journalpostId") journalpostId: String,
        @PathVariable("dokumentInfoId") dokumentInfoId: String,
        @PathVariable("variantFormat") variantFormat: String
    ): ResponseEntity<InputStreamResource> {
        logger.info("Traff endepunkt")
        try {
            if (!journalpostId.all { it.isDigit() } || !dokumentInfoId.all { it.isDigit() }) {
                logger.error("Invalid ID format: journalpostId=$journalpostId, dokumentInfoId=$dokumentInfoId")
                throw ResponseStatusException(HttpStatus.BAD_REQUEST, "BAD_REQUEST")
            }

            if (!validateVariantFormat(variantFormat)) {
                logger.error("Invalid variantformat=$variantFormat")
                throw ResponseStatusException(HttpStatus.BAD_REQUEST, "BAD_REQUEST")
            }

            val dokumentResponse = journalpostService.getDokument(journalpostId, dokumentInfoId, variantFormat)
            val responseBody = InputStreamResource(dokumentResponse.inputStream)

            return ResponseEntity
                .ok()
                .contentType(MediaType.APPLICATION_PDF)
                .contentLength(dokumentResponse.contentLength)
                .body(responseBody)
        } catch (e: ForbiddenException) {
            logger.error("ForbiddenException caught", e)
            throw ResponseStatusException(HttpStatus.FORBIDDEN, "FORBIDDEN")
        } catch (e: PersonNotFoundException) {
            logger.error("Not found", e)
            throw ResponseStatusException(HttpStatus.NOT_FOUND, "NOT_FOUND")
        }
    }

    private fun validateVariantFormat(variantFormat: String) = variantFormat == "ARKIV" || variantFormat == "SLADDET"
}