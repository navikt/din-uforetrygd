package no.nav.uforetrygdbackend

import no.nav.uforetrygdbackend.security.SecurityContextUtil
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("api")
class UforetrygdController(
    private val uforetrygdService: UforetrygdService
) {

    @GetMapping("initiate")
    fun initiateUforetrygd(): ResponseEntity<UforetrygdResponse> {
        val pid = SecurityContextUtil.getPidFromContext()
        return try {
            ResponseEntity
                .status(HttpStatus.OK)
                .body(uforetrygdService.constructUforetrygdResponse(pid))
        } catch (e: Exception) {
            throw ErrorHandler.exceptionToErrorResponse(
                exception = e,
                pid = pid
            )
        }
    }
}
