package no.nav.uforetrygdbackend

import io.mockk.every
import no.nav.uforetrygdbackend.pensjon.pen.PenService
import io.mockk.mockk
import io.mockk.verify
import no.nav.uforetrygdbackend.fullmakt.FullmaktClient
import no.nav.uforetrygdbackend.fullmakt.HarBprofFullmaktmottakereResponse
import no.nav.uforetrygdbackend.pensjon.pen.Vedtakssammendrag
import no.nav.uforetrygdbackend.pensjon.pen.VedtakssammendragResponse
import no.nav.uforetrygdbackend.security.SecurityContextUtil
import no.nav.uforetrygdbackend.security.TokenService
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContext
import org.springframework.security.core.context.SecurityContextHolder
import java.time.LocalDate

class UforetrygdServiceTest {
    val penService = mockk<PenService>()
    val tokenService = mockk<TokenService>()
    val fullmaktClient = mockk<FullmaktClient>()
    val uforetrygdService = UforetrygdService(
        penService = penService,
        tokenService = tokenService,
        fullmaktClient = fullmaktClient
    )

    companion object {
        const val PID = "12345678901"
        const val FORVENTET_INNTEKT = 1000L
    }

    @BeforeEach
    fun setup() {
        val authentication: Authentication = mockk<Authentication>()
        val securityContext = mockk<SecurityContext>()
        every { securityContext.authentication } returns authentication
        SecurityContextHolder.setContext(securityContext)
        every { tokenService.getInnloggingstype() } returns Innloggingstype.LEVEL4
        every { tokenService.determineLoggedInUser() } returns ""
        every { SecurityContextUtil.isFullmakt() } returns false
        every { fullmaktClient.harBprofFullmaktmottager(any()) } returns HarBprofFullmaktmottakereResponse(false)
    }

    @Test
    fun `should return a response with no sak or vedtak when there is no sak`() {
        every { penService.getSaker(any()) } returns emptyList()

        val response = uforetrygdService.constructUforetrygdResponse(PID)
        verify(exactly = 0) { penService.getVedtakssammendrag(PID) }
        verify(exactly = 0) { penService.getSumAvForventedeInntekter(PID) }

        assertEquals(PID, response.pid)
        assertTrue(response.saker.isEmpty())
        assertFalse(response.hasIverksattVedtak)
        assertNull(response.uforevedtak)
    }

    @Test
    fun `should return a response with no sak or vedtak when there is no uforesak`() {
        every { penService.getSaker(any()) } returns listOf(Sak(Sakstype.ALDERSPENSJON, Sakstatus.LOPENDE))

        val response = uforetrygdService.constructUforetrygdResponse(PID)
        verify(exactly = 0) { penService.getVedtakssammendrag(PID) }
        verify(exactly = 0) { penService.getSumAvForventedeInntekter(PID) }

        assertEquals(PID, response.pid)
        assertTrue(response.saker.isEmpty())
        assertFalse(response.hasIverksattVedtak)
        assertNull(response.uforevedtak)
    }

    @Test
    fun `should return a response with uforesak and no vedtak, when there is no vedtakssammendrag`() {
        every { penService.getSaker(any()) } returns listOf(Sak(Sakstype.UFORETRYGD, Sakstatus.LOPENDE))
        every { penService.getVedtakssammendrag(any()) } returns VedtakssammendragResponse(false, null)
        every { penService.getSumAvForventedeInntekter(any()) } returns FORVENTET_INNTEKT

        val response = uforetrygdService.constructUforetrygdResponse(PID)
        verify(exactly = 1) { penService.getVedtakssammendrag(PID) }
        verify(exactly = 1) { penService.getSumAvForventedeInntekter(PID) }

        assertTrue(response.saker.isNotEmpty())
        assertEquals(1, response.saker.size)
        assertEquals(Sakstype.UFORETRYGD, response.saker.first().type)
        assertFalse(response.hasIverksattVedtak)
        assertNull(response.uforevedtak)
    }

    @Test
    fun `should return a response with only one sak when there are multiple saker`() {
        every { penService.getSaker(any()) } returns listOf(
            Sak(Sakstype.UFORETRYGD, Sakstatus.LOPENDE),
            Sak(Sakstype.ALDERSPENSJON, Sakstatus.LOPENDE),
            Sak(Sakstype.GAMMEL_YRKESSKADE, Sakstatus.AVSLUTTET)
        )
        every { penService.getVedtakssammendrag(any()) } returns VedtakssammendragResponse(false, null)
        every { penService.getSumAvForventedeInntekter(any()) } returns FORVENTET_INNTEKT

        val response = uforetrygdService.constructUforetrygdResponse(PID)

        assertTrue(response.saker.isNotEmpty())
        assertEquals(1, response.saker.size)
        assertEquals(Sakstype.UFORETRYGD, response.saker.first().type)
        assertFalse(response.hasIverksattVedtak)
        assertNull(response.uforevedtak)
    }

    @Test
    fun `should return a response with uforesak and vedtak, when there is vedtakssammendrag`() {
        val virkFom = LocalDate.now()
        val uforetidspunkt = LocalDate.now().minusYears(1)
        val uforegrad = 50
        val inntektsgrense = 150_000
        val vedtakssammendragResponse = VedtakssammendragResponse(
            hasIverksattVedtak = true,
            vedtakssammendrag = Vedtakssammendrag(
                uforegrad = uforegrad,
                virkFom = virkFom,
                uforetidspunkt = uforetidspunkt,
                inntektsgrense = inntektsgrense,
                hasBarnetilleggFellesBarn = false,
                hasBarnetilleggSaerkullsbarn = false,
                hasGjenlevendeTillegg = false,
                hasVarigTilrettelagtArbeid = false
            )
        )

        every { penService.getSaker(any()) } returns listOf(Sak(Sakstype.UFORETRYGD, Sakstatus.LOPENDE))
        every { penService.getVedtakssammendrag(any()) } returns vedtakssammendragResponse
        every { penService.getSumAvForventedeInntekter(any()) } returns FORVENTET_INNTEKT

        val response = uforetrygdService.constructUforetrygdResponse(PID)
        verify(exactly = 1) { penService.getVedtakssammendrag(PID) }
        verify(exactly = 1) { penService.getSumAvForventedeInntekter(PID) }

        assertTrue(response.saker.isNotEmpty())
        assertTrue(response.hasIverksattVedtak)
        assertEquals(uforegrad, response.uforevedtak?.uforegrad)
        assertEquals(virkFom, response.uforevedtak?.virkFom)
        assertEquals(uforetidspunkt, response.uforevedtak?.uforetidspunkt)
        assertEquals(FORVENTET_INNTEKT, response.uforevedtak?.sumAvForventedeInntekter)
        assertEquals(inntektsgrense, response.uforevedtak?.inntektsgrense)
        assertFalse(response.uforevedtak!!.hasBarnetilleggFellesBarn)
        assertFalse(response.uforevedtak.hasBarnetilleggSaerkullsbarn)
        assertFalse(response.uforevedtak.hasGjenlevendeTillegg)
        assertFalse(response.uforevedtak.hasVarigTilrettelagtArbeid)
    }
}