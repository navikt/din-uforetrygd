package no.nav.uforetrygdbackend.security

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import no.nav.uforetrygdbackend.util.NAV_CALL_ID_HEADER
import org.slf4j.MDC
import org.springframework.core.annotation.Order
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import java.util.UUID

@Component
@Order(1)
class SetCallIdFilter : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain,
    ) {
        request.getHeader(NAV_CALL_ID_HEADER)?.let { MDC.put(NAV_CALL_ID_HEADER, it) } ?: MDC.put(
            NAV_CALL_ID_HEADER,
            UUID.randomUUID().toString()
        )
        filterChain.doFilter(request, response)
    }
}