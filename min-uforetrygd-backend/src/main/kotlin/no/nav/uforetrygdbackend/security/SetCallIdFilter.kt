package no.nav.uforetrygdbackend.security

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import no.nav.uforetrygdbackend.configuration.CallIdUtil.Companion.NAV_CALL_ID_NAME
import org.slf4j.MDC
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import java.util.UUID

@Component
class SetCallIdFilter : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain,
    ) {
        request.getHeader(NAV_CALL_ID_NAME)?.let { MDC.put(NAV_CALL_ID_NAME, it) } ?: MDC.put(
            NAV_CALL_ID_NAME,
            UUID.randomUUID().toString()
        )
        filterChain.doFilter(request, response)
    }
}