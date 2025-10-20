package no.nav.dinuforetrygd.uforetrygd

import no.nav.dinuforetrygd.ErrorHandler
import no.nav.dinuforetrygd.security.SecurityContextUtil
import no.nav.dinuforetrygd.security.TokenService
import no.nav.dinuforetrygd.audit.Auditor
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("api")
class UforetrygdController(
    private val uforetrygdService: UforetrygdService,
    private val tokenService: TokenService,
    private val auditor: Auditor
) {

    private val logger = LoggerFactory.getLogger(UforetrygdController::class.java)

    @GetMapping("initiate")
    fun initiateUforetrygd(): ResponseEntity<UforetrygdResponse> {
        val pid = SecurityContextUtil.getPidFromContext()
        try {
            val response = ResponseEntity
                .status(HttpStatus.OK)
                .body(uforetrygdService.constructUforetrygdResponse(pid))

            if (tokenService.isUserLoggedInAsSaksbehandler()) {
                auditor.auditInternalUserRead(tokenService.determineLoggedInUserId(), SecurityContextUtil.getPidFromContext())
            } else if (SecurityContextUtil.isFullmakt()) {
                auditor.auditFullmaktRead(tokenService.determineLoggedInUserId(), SecurityContextUtil.getPidFromContext())
            }
            return response
        } catch (e: Exception) {
            logger.error(e.message, e)
            throw ErrorHandler.exceptionToErrorResponse(e)
        }
    }
}
