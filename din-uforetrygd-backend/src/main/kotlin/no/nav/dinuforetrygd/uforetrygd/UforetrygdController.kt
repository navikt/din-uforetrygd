package no.nav.dinuforetrygd.uforetrygd

import no.nav.dinuforetrygd.ErrorHandler
import no.nav.dinuforetrygd.SakNotFoundException
import no.nav.dinuforetrygd.audit.Auditor
import no.nav.dinuforetrygd.fullmakt.RepresentasjonClient
import no.nav.dinuforetrygd.fullmakt.RepresentasjonClient.Companion.VALID_VERGE_TYPER
import no.nav.dinuforetrygd.journalpost.Journalpost
import no.nav.dinuforetrygd.person.PersonService
import no.nav.dinuforetrygd.security.SecurityContextUtil
import no.nav.dinuforetrygd.security.TokenService
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException

@RestController
@RequestMapping("api")
class UforetrygdController(
    private val forsideService: ForsideService,
    private val saksoversiktService: SaksoversiktService,
    private val personService: PersonService,
    private val tokenService: TokenService,
    private val auditor: Auditor,
    private val representasjonClient: RepresentasjonClient,
) {

    private val logger = LoggerFactory.getLogger(UforetrygdController::class.java)

    @GetMapping("borgerinfo")
    fun hentBorgerInfo(): ResponseEntity<BorgerInfoResponse> {
        val dekryptertPid = SecurityContextUtil.getPidFromContext()
        val navn = personService.getNavn(dekryptertPid)

        if (tokenService.isUserLoggedInAsSaksbehandler()) {
            auditor.auditInternalUserRead(tokenService.determineLoggedInUserId(), SecurityContextUtil.getPidFromContext())
        } else if (SecurityContextUtil.isFullmakt()) {
            auditor.auditFullmaktRead(tokenService.determineLoggedInUserId(), SecurityContextUtil.getPidFromContext())
        }

        return ResponseEntity.ok(BorgerInfoResponse(dekryptertPid, navn ?: ""))
    }

    @GetMapping("initiate")
    fun initiateUforetrygd(): ResponseEntity<UforetrygdResponse> {
        val pid = SecurityContextUtil.getPidFromContext()
        try {
            val response = ResponseEntity
                .status(HttpStatus.OK)
                .body(forsideService.hentForsideData(pid))

            if (tokenService.isUserLoggedInAsSaksbehandler()) {
                auditor.auditInternalUserRead(tokenService.determineLoggedInUserId(), pid)
            } else if (SecurityContextUtil.isFullmakt()) {
                auditor.auditFullmaktRead(tokenService.determineLoggedInUserId(), pid)
            }
            return response
        } catch (e: Exception) {
            throw ErrorHandler.exceptionToErrorResponse(e)
        }
    }

    @GetMapping("uforevedtak")
    fun hentUforevedtak(): ResponseEntity<DittUforevedtak> {
        val pid = SecurityContextUtil.getPidFromContext()
        try {
            val uforevedtak = forsideService.hentUforevedtak(pid)

            if (tokenService.isUserLoggedInAsSaksbehandler()) {
                auditor.auditInternalUserRead(tokenService.determineLoggedInUserId(), pid)
            } else if (SecurityContextUtil.isFullmakt()) {
                auditor.auditFullmaktRead(tokenService.determineLoggedInUserId(), pid)
            }

            return ResponseEntity.ok(uforevedtak)
        } catch (e: Exception) {
            throw ErrorHandler.exceptionToErrorResponse(e)
        }
    }

    @GetMapping("journalposter")
    fun hentJournalposter(): ResponseEntity<List<Journalpost>> {
        val pid = SecurityContextUtil.getPidFromContext()
        try {
            val journalposter = forsideService.hentJournalposter(pid)

            if (tokenService.isUserLoggedInAsSaksbehandler()) {
                auditor.auditInternalUserRead(tokenService.determineLoggedInUserId(), pid)
            } else if (SecurityContextUtil.isFullmakt()) {
                auditor.auditFullmaktRead(tokenService.determineLoggedInUserId(), pid)
            }

            return ResponseEntity.ok(journalposter)
        } catch (e: Exception) {
            throw ErrorHandler.exceptionToErrorResponse(e)
        }
    }

    @GetMapping("saksoversikt")
    fun hentSaker(@RequestParam saksid: Long): SaksoversiktResponse {
        try {
            val response = saksoversiktService.hentSaksoversikt(SecurityContextUtil.getPidFromContext(), saksid)
            if (tokenService.isUserLoggedInAsSaksbehandler()) {
                auditor.auditInternalUserRead(tokenService.determineLoggedInUserId(), SecurityContextUtil.getPidFromContext())
            } else if (SecurityContextUtil.isFullmakt()) {
                auditor.auditFullmaktRead(tokenService.determineLoggedInUserId(), SecurityContextUtil.getPidFromContext())
            }
            return response
        } catch (e: SakNotFoundException) {
            throw ResponseStatusException(HttpStatus.NOT_FOUND)
        } catch (e: Exception) {
            throw ErrorHandler.exceptionToErrorResponse(e)
        }
    }

    @GetMapping("er-verge")
    fun erVerge(): ResponseEntity<Boolean> {
        try {
            val erVerge = !SecurityContextUtil.isFullmakt()
                    && representasjonClient.harRepresentasjonsforhold(SecurityContextUtil.getPidFromContext(), VALID_VERGE_TYPER)?.value ?: false

            if (tokenService.isUserLoggedInAsSaksbehandler()) {
                auditor.auditInternalUserRead(tokenService.determineLoggedInUserId(), SecurityContextUtil.getPidFromContext())
            } else if (SecurityContextUtil.isFullmakt()) {
                auditor.auditFullmaktRead(tokenService.determineLoggedInUserId(), SecurityContextUtil.getPidFromContext())
            }
            return ResponseEntity.ok(erVerge)
        } catch (e: Exception) {
            throw ErrorHandler.exceptionToErrorResponse(e)
        }
    }
}

data class SaksoversiktResponse(
    val aktiveBehandlinger: List<Behandling>,
    val avsluttedeBehandlinger: List<Behandling>
)

data class BorgerInfoResponse(val pid: String, val navn: String)
