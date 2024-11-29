package no.nav.uforetrygdbackend.security

import com.fasterxml.jackson.databind.ObjectMapper
import jakarta.servlet.FilterChain
import jakarta.servlet.http.Cookie
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.Mockito.*
import org.springframework.http.HttpStatus
import org.springframework.mock.web.MockHttpServletResponse
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.context.SecurityContextImpl
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken

class SetPidFilterTest{
    private val tokenService = mock(TokenService::class.java)
    private val authorizationService = mock(AuthorizationService::class.java)

    private val filter = SetPidFilter(tokenService, authorizationService)
    private val objectMapper = ObjectMapper()

    // Mock request objekt
    val request = mock(HttpServletRequest::class.java)

    @BeforeEach
    fun setupContext(){
        SecurityContextHolder.setContext(
            SecurityContextImpl(
                JwtAuthenticationToken(
                    Jwt(
                        "test",
                        null,
                        null,
                        mapOf("test" to "test"),
                        mapOf("test" to "test")
                    )
                )
            )
        )

        `when`(request.requestURI).thenReturn("/mocked/endpoint")
    }

    @Test
    fun `should set AuthenticatedUserDetails with fullmakt data when user logged in on behalf of other person and has valid fullmakt`(){
        val pidFullmaktsgiver = "00000000002"

        val request = mock(HttpServletRequest::class.java)
        val response = mock(HttpServletResponse::class.java)
        val filterChain = mock(FilterChain::class.java)

        `when`(request.getHeader("Authorization")).thenReturn("Test")
        `when`(tokenService.determineTokenType()).thenReturn(TokenService.TokenType.TOKEN_X)
        `when`(request.cookies).thenReturn(arrayOf(Cookie("nav-obo", pidFullmaktsgiver)))
        `when`(authorizationService.checkBorgerTilgang(any())).thenReturn(AuthenticatedUserDetails(pidFullmaktsgiver, true))

        filter.doFilter(request, response, filterChain)

        assertTrue(SecurityContextUtil.isFullmakt())
        assertEquals(pidFullmaktsgiver, SecurityContextUtil.getPidFromContext())
    }

    @Test
    fun `should set AuthenticatedUserDetails with isFullmakt false when no fullmakt cookie present`(){
        val pid = "00000000002"

        val request = mock(HttpServletRequest::class.java)
        val response = mock(HttpServletResponse::class.java)
        val filterChain = mock(FilterChain::class.java)

        `when`(request.getHeader("Authorization")).thenReturn("Test")
        `when`(tokenService.determineTokenType()).thenReturn(TokenService.TokenType.TOKEN_X)
        `when`(tokenService.determineRequestingPid()).thenReturn(pid)
        `when`(authorizationService.checkBorgerTilgang(any())).thenReturn(AuthenticatedUserDetails(pid, false))

        filter.doFilter(request, response, filterChain)

        assertFalse(SecurityContextUtil.isFullmakt())
        assertEquals(pid, SecurityContextUtil.getPidFromContext())
    }

    @Test
    fun `should set AuthenticationDetails when user is logged in as saksbehandler and saksbehandler has access to user`(){
        val pid = "00000000001"

        val request = mock(HttpServletRequest::class.java)
        val response = mock(HttpServletResponse::class.java)
        val filterChain = mock(FilterChain::class.java)

        `when`(request.getHeader("Authorization")).thenReturn("Test")
        `when`(request.getHeader("pid")).thenReturn(pid)
        `when`(tokenService.determineTokenType()).thenReturn(TokenService.TokenType.AZURE_AD_ON_BEHALF_OF)

        filter.doFilter(request, response, filterChain)

        assertFalse(SecurityContextUtil.isFullmakt())
        assertEquals(pid, SecurityContextUtil.getPidFromContext())
    }

    @Test
    fun `should set AuthenticationDetails when user is logged in as saksbehandler and saksbehandler has no access to user`(){
        val pid = "00000000001"
        val path = "/random/endpoint"

        val request = mock(HttpServletRequest::class.java)
        val response = MockHttpServletResponse()
        val filterChain = mock(FilterChain::class.java)

        `when`(request.getHeader("Authorization")).thenReturn("Test")
        `when`(request.getHeader("pid")).thenReturn(pid)
        `when`(request.requestURI).thenReturn(path)
        `when`(tokenService.determineTokenType()).thenReturn(TokenService.TokenType.AZURE_AD_ON_BEHALF_OF)
        `when`(authorizationService.checkVeilederTilgangTilInnbygger(pid)).thenThrow(VeilederUnauthorizedException())

        filter.doFilter(request, response, filterChain)

        val errorResponse = objectMapper.readValue(response.contentAsString, SetPidFilterErrorResponse::class.java)

        assertEquals(ErrorCode.VEILEDER_UNAUTHORIZED, errorResponse.message)
        assertEquals(HttpStatus.FORBIDDEN.value(), response.status)
        assertEquals(HttpStatus.FORBIDDEN.name, errorResponse.error)
        assertEquals(path, errorResponse.path)
    }
}