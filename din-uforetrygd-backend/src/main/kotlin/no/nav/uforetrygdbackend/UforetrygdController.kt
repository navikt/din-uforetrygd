package no.nav.uforetrygdbackend

import no.nav.uforetrygdbackend.security.SecurityContextUtil
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("api")
class UforetrygdController(
    private val uforetrygdService: UforetrygdService
) {

    @GetMapping("initiate")
    fun initiateUforetrygd(): ResponseEntity<UforetrygdResponse> {
        return ResponseEntity
            .status(HttpStatus.OK)
            .body(uforetrygdService.constructUforetrygdResponse(SecurityContextUtil.getPidFromContext()))
    }
}
