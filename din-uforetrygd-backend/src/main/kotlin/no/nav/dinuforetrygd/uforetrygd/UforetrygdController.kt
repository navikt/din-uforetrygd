package no.nav.dinuforetrygd.uforetrygd

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withContext
import no.nav.dinuforetrygd.ErrorHandler
import no.nav.dinuforetrygd.SakNotFoundException
import no.nav.dinuforetrygd.audit.Auditor
import no.nav.dinuforetrygd.journalpost.Journalpost
import no.nav.dinuforetrygd.journalpost.JournalpostService
import no.nav.dinuforetrygd.pensjon.pen.PenService
import no.nav.dinuforetrygd.security.RequestContextAsyncContext
import no.nav.dinuforetrygd.security.SecurityContextUtil
import no.nav.dinuforetrygd.security.SecurityCoroutineContext
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
    private val uforetrygdService: ForsideService,
    private val saksoversiktService: SaksoversiktService,
    private val tokenService: TokenService,
    private val auditor: Auditor,
) {

    private val logger = LoggerFactory.getLogger(UforetrygdController::class.java)

    @GetMapping("dekrypter-pid")
    fun hentDekryptertPid(): ResponseEntity<PidResponse> {
        return ResponseEntity.ok(PidResponse(SecurityContextUtil.getPidFromContext()))
    }

    @GetMapping("initiate")
    fun initiateUforetrygd(): ResponseEntity<UforetrygdResponse> {
        val pid = SecurityContextUtil.getPidFromContext()
        try {
            val response = ResponseEntity
                .status(HttpStatus.OK)
                .body(uforetrygdService.hentForsideData(pid))

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

    @GetMapping("journalposter")
    fun hentJournalposter(): ResponseEntity<List<Journalpost>> {
        val pid = SecurityContextUtil.getPidFromContext()
        try {
            val journalposter = uforetrygdService.hentJournalposter(pid)

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

}

data class SaksoversiktResponse(
    val aktiveBehandlinger: List<Behandling>,
    val avsluttedeBehandlinger: List<Behandling>
)

data class PidResponse(val pid: String)
