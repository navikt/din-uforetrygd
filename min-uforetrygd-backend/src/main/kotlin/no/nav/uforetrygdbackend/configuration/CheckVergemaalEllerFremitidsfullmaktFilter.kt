package no.nav.uforetrygdbackend.configuration

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
        val innloggingsniva = tokenService.getInnloggingstype()
        val pid = SecurityContextUtil.getPidFromContext()
        val vergemaalEllerFremtidsfullmakt = personService.getVergemaalEllerFremtidsfullmakt(pid)
        logger.info("Innlogget bruker har vergemaal eller fremtidsfullmakt av type: $vergemaalEllerFremtidsfullmakt")

        if (vergemaalEllerFremtidsfullmakt != null && innloggingsniva == Innloggingstype.LEVEL3) {
            logger.info("Innlogget bruker har vergemaal eller fremtidsfullmakt og er innlogget med innloggingsniva 3")
        }

        filterChain.doFilter(request, response)
    }
}