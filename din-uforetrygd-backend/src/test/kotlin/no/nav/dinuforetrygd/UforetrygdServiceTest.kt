package no.nav.dinuforetrygd

import io.mockk.every
import no.nav.dinuforetrygd.pensjon.pen.PenService
import io.mockk.mockk
import io.mockk.verify
import no.nav.dinuforetrygd.configuration.AppId
import no.nav.dinuforetrygd.fullmakt.FullmaktClient
import no.nav.dinuforetrygd.fullmakt.HarBprofFullmaktmottakereResponse
import no.nav.dinuforetrygd.journalpost.Journalpost
import no.nav.dinuforetrygd.journalpost.JournalpostService
import no.nav.dinuforetrygd.journalpost.model.EndretAvKode
import no.nav.dinuforetrygd.pensjon.pen.Vedtakssammendrag
import no.nav.dinuforetrygd.pensjon.pen.VedtakssammendragResponse
import no.nav.dinuforetrygd.security.SecurityContextUtil
import no.nav.dinuforetrygd.security.TokenService
import no.nav.dinuforetrygd.uforetrygd.*
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
    val journalpostService = mockk<JournalpostService>()
    val uforetrygdService = UforetrygdService(
        penService = penService,
        tokenService = tokenService,
        fullmaktClient = fullmaktClient,
        journalpostService = journalpostService
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
        every { journalpostService.getJournalPostliste(any(), any()) } returns mockJournalPostliste()

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
        every { journalpostService.getJournalPostliste(any(), any()) } returns mockJournalPostliste()

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
        every { journalpostService.getJournalPostliste(any(), any()) } returns mockJournalPostliste()

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
        every { journalpostService.getJournalPostliste(any(), any()) } returns mockJournalPostliste()

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
        every { journalpostService.getJournalPostliste(any(), any()) } returns mockJournalPostliste()

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
        assertFalse(response.uforevedtak!!.hasBarnetilleggSaerkullsbarn)
        assertFalse(response.uforevedtak!!.hasGjenlevendeTillegg)
        assertFalse(response.uforevedtak!!.hasVarigTilrettelagtArbeid)
    }

    @Test
    fun `should return a response with uforesak and noe vedtak when response from pen fails`() {
        every { penService.getSaker(any()) } returns listOf(Sak(Sakstype.UFORETRYGD, Sakstatus.LOPENDE))
        every { penService.getVedtakssammendrag(any()) } throws ClientException(AppId.PEN.name, "/", null, null)
        every { penService.getSumAvForventedeInntekter(any()) } returns FORVENTET_INNTEKT
        every { journalpostService.getJournalPostliste(any(), any()) } returns mockJournalPostliste()

        val response = uforetrygdService.constructUforetrygdResponse(PID)
        verify(exactly = 1) { penService.getVedtakssammendrag(PID) }
        verify(exactly = 0) { penService.getSumAvForventedeInntekter(PID) }

        assertTrue(response.saker.isNotEmpty())
        assertEquals(Sakstype.UFORETRYGD, response.saker.first().type)
        assertEquals(Sakstatus.LOPENDE, response.saker.first().status)
        assertFalse(response.hasIverksattVedtak)
        assertNull(response.uforevedtak)
    }

    fun mockJournalPostliste(): List<Journalpost> {
        return listOf(
            Journalpost(
                id = "12345678",
                tittel = "Søknad om uføretrygd",
                opprettetAv = EndretAvKode.BRUKER,
                opprettetDato = "2023-01-15",
                dokumenter = listOf(
                    Journalpost.Dokument(
                        tittel = "Søknadsskjema uføretrygd",
                        dokumentInfoId = "DOK123456",
                        filstorrelse = 102400,
                        variant = Journalpost.Dokument.DokumentVariant.ARKIV
                    ),
                    Journalpost.Dokument(
                        tittel = "Legeerklæring",
                        dokumentInfoId = "DOK789012",
                        filstorrelse = 256000,
                        variant = Journalpost.Dokument.DokumentVariant.ARKIV
                    )
                )
            ),
            Journalpost(
                id = "87654321",
                tittel = "Vedtak om uføretrygd",
                opprettetAv = EndretAvKode.SAKSBEHANDLER,
                opprettetDato = "2023-02-20",
                dokumenter = listOf(
                    Journalpost.Dokument(
                        tittel = "Vedtaksbrev",
                        dokumentInfoId = "DOK345678",
                        filstorrelse = 51200,
                        variant = Journalpost.Dokument.DokumentVariant.ARKIV
                    )
                )
            )
        )
    }
}