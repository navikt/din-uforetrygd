package no.nav.uforetrygdbackend.vergemaal

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import no.nav.uforetrygdbackend.Innloggingstype
import no.nav.uforetrygdbackend.person.PersonService
import no.nav.uforetrygdbackend.security.SecurityContextUtil
import no.nav.uforetrygdbackend.security.TokenService
import org.springframework.core.annotation.Order
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
@Order(3)
class CheckVergemaalEllerFremitidsfullmaktAndLoginLevelFilter(
    private val tokenService: TokenService,
    private val personService: PersonService,
) : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain,
    ) {
        if (request.getHeader("Authorization") != null && tokenService.isUserLoggedInAsPerson()) {
            val pid = SecurityContextUtil.getPidFromContext()
            val innloggingsniva = tokenService.getInnloggingstype()
            val vergemaalEllerFremtidsfullmakt = personService.getVergemaalEllerFremtidsfullmakt(pid)

            when (innloggingsniva) {
                Innloggingstype.LEVEL3 -> {
                    if (vergemaalEllerFremtidsfullmakt != null) {
                        logger.info("Innlogget bruker har vergemaal eller fremtidsfullmakt og er innlogget med innloggingsniva 3")
                        countEvent("level3_vergemaal_eller_fremtidsfullmakt")
                    } else {
                        logger.info("Innlogget bruker har ikke vergemaal eller fremtidsfullmakt og er innlogget med innloggingsniva 3")
                        countEvent("level3_no_vergemaal_eller_fremtidsfullmakt")
                    }
                }

                Innloggingstype.LEVEL4 -> {
                    if (vergemaalEllerFremtidsfullmakt != null) {
                        logger.info("Innlogget bruker har vergemaal eller fremtidsfullmakt og er innlogget med innloggingsniva 4")
                        countEvent("level4_vergemaal_eller_fremtidsfullmakt")
                    } else {
                        logger.info("Innlogget bruker har ikke vergemaal eller fremtidsfullmakt og er innlogget med innloggingsniva 4")
                        countEvent("level4_no_vergemaal_eller_fremtidsfullmakt")
                    }
                }
                else -> {
                    // do nothing
                }
            }
        }
        filterChain.doFilter(request, response)
    }
}