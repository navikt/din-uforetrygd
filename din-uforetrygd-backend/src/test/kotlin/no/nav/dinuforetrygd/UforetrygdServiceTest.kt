package no.nav.dinuforetrygd

import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import no.nav.dinuforetrygd.configuration.AppId
import no.nav.dinuforetrygd.fullmakt.FullmaktClient
import no.nav.dinuforetrygd.fullmakt.HarBprofFullmaktmottakereResponse
import no.nav.dinuforetrygd.inntektskomponenten.InntektskomponentenService
import no.nav.dinuforetrygd.journalpost.Journalpost
import no.nav.dinuforetrygd.journalpost.JournalpostService
import no.nav.dinuforetrygd.journalpost.model.EndretAvKode
import no.nav.dinuforetrygd.pensjon.pen.PenService
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
    val inntektskomponentenService = mockk<InntektskomponentenService>()
    val uforetrygdService = UforetrygdService(
        penService = penService,
        tokenService = tokenService,
        fullmaktClient = fullmaktClient,
        journalpostService = journalpostService,
        inntektskomponentenService = inntektskomponentenService,
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
        assertNull(response.sak)
        assertFalse(response.hasIverksattVedtak)
        assertNull(response.uforevedtak)
    }

    @Test
    fun `should return a response with no sak or vedtak when there is no uforesak`() {
        every { penService.getSaker(any()) } returns emptyList()
        every { journalpostService.getJournalPostliste(any(), any()) } returns mockJournalPostliste()

        val response = uforetrygdService.constructUforetrygdResponse(PID)
        verify(exactly = 0) { penService.getVedtakssammendrag(PID) }
        verify(exactly = 0) { penService.getSumAvForventedeInntekter(PID) }

        assertEquals(PID, response.pid)
        assertNull(response.sak)
        assertFalse(response.hasIverksattVedtak)
        assertNull(response.uforevedtak)
    }

    @Test
    fun `should return a response with uforesak and no vedtak, when there is no vedtakssammendrag`() {
        every { penService.getSaker(any()) } returns listOf(Sak(Sakstatus.LOPENDE, 1L))
        every { penService.getVedtakssammendrag(any()) } returns VedtakssammendragResponse(false, null)
        every { penService.getSumAvForventedeInntekter(any()) } returns FORVENTET_INNTEKT
        every { penService.penClient.getSaksoversikt(any(), any()) } returns Saksoversikt(1L, null, null, null, emptyList())
        every { journalpostService.getJournalPostliste(any(), any()) } returns mockJournalPostliste()

        val response = uforetrygdService.constructUforetrygdResponse(PID)
        verify(exactly = 1) { penService.getVedtakssammendrag(PID) }
        verify(exactly = 1) { penService.getSumAvForventedeInntekter(PID) }

        assertNotNull(response.sak)
        assertFalse(response.hasIverksattVedtak)
        assertNull(response.uforevedtak)
    }

    @Test
    fun `should return a response with only one sak when there are multiple saker`() {
        every { penService.getSaker(any()) } returns listOf(
            Sak(Sakstatus.LOPENDE, 1L),
            Sak(Sakstatus.LOPENDE, 1L),
            Sak(Sakstatus.AVSLUTTET, 1L)
        )
        every { penService.getVedtakssammendrag(any()) } returns VedtakssammendragResponse(false, null)
        every { penService.getSumAvForventedeInntekter(any()) } returns FORVENTET_INNTEKT
        every { journalpostService.getJournalPostliste(any(), any()) } returns mockJournalPostliste()
        every { penService.penClient.getSaksoversikt(any(), any()) } returns Saksoversikt(1L, null, null, null, emptyList())

        val response = uforetrygdService.constructUforetrygdResponse(PID)

        assertNotNull(response.sak)
        assertFalse(response.hasIverksattVedtak)
        assertNull(response.uforevedtak)
    }

    @Test
    fun `should return a response with uforesak and vedtak, when there is vedtakssammendrag`() {
        val virkFom = LocalDate.now()
        val uforetidspunkt = LocalDate.now().minusYears(1)
        val uforegrad = 50
        val inntektsgrense = 150_000
        val inntektstak = 200_000
        val kompensasjonsgrad = 65.5
        val nettoUtbetalingMnd = 20_000
        val inntektFraSkatt = 100_000.0
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
                hasVarigTilrettelagtArbeid = false,
                inntektstak = inntektstak,
                kompensasjonsgrad = kompensasjonsgrad,
                nettoUtbetalingMnd = nettoUtbetalingMnd
            )
        )

        every { penService.getSaker(any()) } returns listOf(Sak(Sakstatus.LOPENDE, 1L))
        every { penService.getVedtakssammendrag(any()) } returns vedtakssammendragResponse
        every { penService.getSumAvForventedeInntekter(any()) } returns FORVENTET_INNTEKT
        every { penService.penClient.getSaksoversikt(any(), any()) } returns Saksoversikt(1L, null, null, null, emptyList())
        every { journalpostService.getJournalPostliste(any(), any()) } returns mockJournalPostliste()
        every { inntektskomponentenService.getAretsInntektFraSkatt(any()) } returns inntektFraSkatt

        val response = uforetrygdService.constructUforetrygdResponse(PID)
        verify(exactly = 1) { penService.getVedtakssammendrag(PID) }
        verify(exactly = 1) { penService.getSumAvForventedeInntekter(PID) }

        assertNotNull(response.sak)
        assertTrue(response.hasIverksattVedtak)
        assertEquals(uforegrad, response.uforevedtak?.uforegrad)
        assertEquals(virkFom, response.uforevedtak?.virkFom)
        assertEquals(uforetidspunkt, response.uforevedtak?.uforetidspunkt)
        assertEquals(FORVENTET_INNTEKT, response.uforevedtak?.sumAvForventedeInntekter)
        assertEquals(inntektsgrense, response.uforevedtak?.inntektsgrense)
        assertEquals(response.uforevedtak!!.inntektstak, inntektstak)
        assertEquals(response.uforevedtak!!.kompensasjonsgrad, kompensasjonsgrad)
        assertEquals(response.uforevedtak!!.nettoUtbetalingMnd, nettoUtbetalingMnd)
        assertEquals(response.uforevedtak!!.inntektFraSkatt, inntektFraSkatt)
        assertFalse(response.uforevedtak!!.hasBarnetilleggFellesBarn)
        assertFalse(response.uforevedtak!!.hasBarnetilleggSaerkullsbarn)
        assertFalse(response.uforevedtak!!.hasGjenlevendeTillegg)
        assertFalse(response.uforevedtak!!.hasVarigTilrettelagtArbeid)
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