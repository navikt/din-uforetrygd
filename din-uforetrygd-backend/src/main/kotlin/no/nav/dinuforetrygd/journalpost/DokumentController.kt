package no.nav.dinuforetrygd.journalpost

import no.nav.dinuforetrygd.ForbiddenException
import no.nav.dinuforetrygd.PersonNotFoundException
import no.nav.dinuforetrygd.security.TokenService
import org.slf4j.LoggerFactory
import org.springframework.core.io.InputStreamResource
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException

@RestController
@RequestMapping("api/dokument")
class DokumentController(
    private val journalpostService: JournalpostService,
    private val tokenService: TokenService
) {

    private val logger = LoggerFactory.getLogger(DokumentController::class.java)

    @GetMapping("{journalpostId}/{dokumentInfoId}")
    fun getDokument(
        @PathVariable("journalpostId") journalpostId: String,
        @PathVariable("dokumentInfoId") dokumentInfoId: String,
        @RequestParam("variantformat", required = false) variantformat: String?
    ): ResponseEntity<InputStreamResource> {
        try {
            if (!journalpostId.all { it.isDigit() } || !dokumentInfoId.all { it.isDigit() }) {
                logger.error("Invalid ID format")
                throw ResponseStatusException(HttpStatus.BAD_REQUEST, "BAD_REQUEST")
            }

            val dokumentResponse = if (tokenService.isUserLoggedInAsSaksbehandler()) {
                if (variantformat == null) {
                    val reason = "Variant format missing"
                    logger.warn(reason)
                    throw ResponseStatusException(HttpStatus.BAD_REQUEST, reason)
                } else if (!validateVariantFormat(variantformat)) {
                    logger.error("Invalid variantformat")
                    throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid variantformat")
                }

                journalpostService.getDokument(journalpostId, dokumentInfoId, variantformat)
            } else {
                journalpostService.getDokument(journalpostId, dokumentInfoId)
            }

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
