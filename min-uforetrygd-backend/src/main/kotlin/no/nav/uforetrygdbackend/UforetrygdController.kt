package no.nav.uforetrygdbackend

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("api")
class UforetrygdController {

    @GetMapping("initiate")
    fun initiateDinPensjon(): ResponseEntity<InitResponse> {
        return ResponseEntity
            .status(HttpStatus.OK)
            .body(InitResponse(true))

    }
}

data class InitResponse(val ok: Boolean)
