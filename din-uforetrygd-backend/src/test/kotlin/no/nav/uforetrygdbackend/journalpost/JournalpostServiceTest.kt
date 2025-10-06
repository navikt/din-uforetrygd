package no.nav.uforetrygdbackend.journalpost

import no.nav.uforetrygdbackend.journalpost.model.EndretAvKode
import no.nav.uforetrygdbackend.journalpost.saf.JournalpostSafDto
import no.nav.uforetrygdbackend.journalpost.saf.SafClient
import no.nav.uforetrygdbackend.journalpost.safselvbetjening.JournalpostSafSelvbetjeningDto
import no.nav.uforetrygdbackend.journalpost.safselvbetjening.SafSelvbetjeningClient
import no.nav.uforetrygdbackend.security.TokenService
import org.junit.jupiter.api.Assertions.assertEquals as assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertNull
import org.mockito.Mockito
import org.mockito.Mockito.mock
import java.time.LocalDate

class JournalpostServiceTest {

    private val tokenService = mock(TokenService::class.java)
    private val safSelvbetjeningClient = mock(SafSelvbetjeningClient::class.java)
    private val safClient = mock(SafClient::class.java)
    private val journalpostService = JournalpostService(
        safSelvbetjeningClient = safSelvbetjeningClient,
        safClient = safClient,
        tokenService = tokenService
    )

    @Test
    fun `mottar journalpostliste der bruker har tilgang til dokument`() {
        // Arrange
        val pid = "12345678901"
        val sakId = "123456"
        val journalpostId = "JP123"
        val dokumentInfoId = "DOK123"

        val dokumentVariant = JournalpostSafSelvbetjeningDto.Dokument.DokumentVariant(
            filtype = "PDF",
            filstorrelse = 1024,
            brukerHarTilgang = true,
        )

        val dokument = JournalpostSafSelvbetjeningDto.Dokument(
            dokumentInfoId = dokumentInfoId,
            tittel = "Dokument tittel",
            dokumentvarianter = listOf(dokumentVariant)
        )

        val journalpost = JournalpostSafSelvbetjeningDto(
            journalpostId = journalpostId,
            tittel = "Journalpost tittel",
            tema = "UFO",
            journalposttype = "I",
            datoSortering = LocalDate.parse("2023-01-01").atStartOfDay(),
            avsender = JournalpostSafSelvbetjeningDto.Aktoer(id = pid),
            mottaker = null,
            sak = JournalpostSafSelvbetjeningDto.Sak(fagsakId = sakId),
            dokumenter = listOf(dokument)
        )

        Mockito.`when`(tokenService.isUserLoggedInAsPerson()).thenReturn(true)
        Mockito.`when`(safSelvbetjeningClient.performGraphQLQuery(pid)).thenReturn(listOf(journalpost))

        // Act
        val result = journalpostService.getJournalPostliste(pid, sakId)

        // Assert
        assertEquals(1, result.size)
        assertEquals(journalpostId, result[0].id)
        assertEquals(EndretAvKode.BRUKER, result[0].opprettetAv)
        assertEquals("2023-01-01T00:00", result[0].opprettetDato)
        assertEquals(1, result[0].dokumenter.size)
        assertEquals(dokumentInfoId, result[0].dokumenter[0].dokumentInfoId)
        assertEquals(1024, result[0].dokumenter[0].filstorrelse)
    }

    @Test
    fun `filtrerer vekk journalpost med annet tema`() {
        // Arrange
        val pid = "12345678901"
        val sakId = "123456"

        val relevantJournalpost = createJournalpostSelvbetjening("JP123", "UFO", sakId, "I")
        val irrelevantJournalpost = createJournalpostSelvbetjening("JP456", "SYK", sakId, "I")

        Mockito.`when`(tokenService.isUserLoggedInAsPerson()).thenReturn(true)
        Mockito.`when`(safSelvbetjeningClient.performGraphQLQuery(pid))
            .thenReturn(listOf(relevantJournalpost, irrelevantJournalpost))

        // Act
        val result = journalpostService.getJournalPostliste(pid, sakId)

        // Assert
        assertEquals(1, result.size)
        assertEquals("JP123", result[0].id)
    }

    @Test
    fun `filtrerer vekk jouralpost for annen sakId`() {
        // Arrange
        val pid = "12345678901"
        val sakId = "123456"
        val otherSakId = "654321"

        val relevantJournalpost = createJournalpostSelvbetjening("JP123", "UFO", sakId, "I")
        val irrelevantJournalpost = createJournalpostSelvbetjening("JP456", "UFO", otherSakId, "I")

        Mockito.`when`(tokenService.isUserLoggedInAsPerson()).thenReturn(true)
        Mockito.`when`(safSelvbetjeningClient.performGraphQLQuery(pid))
            .thenReturn(listOf(relevantJournalpost, irrelevantJournalpost))

        // Act
        val result = journalpostService.getJournalPostliste(pid, sakId)

        // Assert
        assertEquals(1, result.size)
        assertEquals("JP123", result[0].id)
    }

    @Test
    fun `filterer vekk journalposter uten dokumenter`() {
        // Arrange
        val pid = "12345678901"
        val sakId = "123456"

        val relevantJournalpost = createJournalpostSelvbetjening("JP123", "UFO", sakId, "I")
        val emptyDocsJournalpost = JournalpostSafSelvbetjeningDto(
            journalpostId = "JP456",
            tittel = "Empty docs",
            tema = "PEN",
            journalposttype = "I",
            datoSortering = LocalDate.parse("2023-01-01").atStartOfDay(),
            avsender = null,
            mottaker = null,
            sak = JournalpostSafSelvbetjeningDto.Sak(fagsakId = sakId),
            dokumenter = emptyList()
        )

        Mockito.`when`(tokenService.isUserLoggedInAsPerson()).thenReturn(true)
        Mockito.`when`(safSelvbetjeningClient.performGraphQLQuery(pid))
            .thenReturn(listOf(relevantJournalpost, emptyDocsJournalpost))

        // Act
        val result = journalpostService.getJournalPostliste(pid, sakId)

        // Assert
        assertEquals(1, result.size)
        assertEquals("JP123", result[0].id)
    }

    @Test
    fun `saksbehandler mottar journalpostliste`() {
        // Arrange
        val pid = "12345678901"
        val sakId = "123456"

        val journalpost = JournalpostSafDto(
            journalpostId = "JP123",
            tittel = "Journalpost tittel",
            tema = "PEN",
            journalposttype = "I",
            datoOpprettet = LocalDate.parse("2023-01-01").atStartOfDay(),
            sak = JournalpostSafDto.Sak(fagsakId = sakId),
            dokumenter = listOf(
                JournalpostSafDto.Dokument(
                    dokumentInfoId = "DOK123",
                    tittel = "Dokument tittel",
                    dokumentvarianter = listOf(
                        JournalpostSafDto.Dokument.DokumentVariant(
                            filtype = "PDF",
                            brukerHarTilgang = true,
                            variantformat = JournalpostSafDto.Dokument.DokumentVariant.Variantformat.ARKIV
                        )
                    )
                )
            ),
            avsenderMottaker = null
        )

        Mockito.`when`(tokenService.isUserLoggedInAsPerson()).thenReturn(false)
        Mockito.`when`(tokenService.isUserLoggedInAsSaksbehandler()).thenReturn(true)
        Mockito.`when`(safClient.performGraphQLQuery(sakId)).thenReturn(listOf(journalpost))

        // Act
        val result = journalpostService.getJournalPostliste(pid, sakId)

        // Assert
        assertEquals(1, result.size)
        assertEquals("JP123", result[0].id)
        assertEquals(EndretAvKode.UKJENT, result[0].opprettetAv)
        assertEquals("2023-01-01T00:00", result[0].opprettetDato)
        assertEquals(1, result[0].dokumenter.size)
        assertEquals("DOK123", result[0].dokumenter[0].dokumentInfoId)
        assertNull(result[0].dokumenter[0].filstorrelse)
    }

    @Test
    fun `saksbehandler mottar liste der irrelevant journalpost er filtrert vekk`() {
        // Arrange
        val pid = "12345678901"
        val sakId = "123456"

        val relevantJournalpost = createJournalpostSaf("JP123", "UFO", sakId, "I")
        val wrongTemaJournalpost = createJournalpostSaf("JP456", "SYK", sakId, "I")
        val wrongSakIdJournalpost = createJournalpostSaf("JP789", "UFO", "654321", "I")
        val emptyDocsJournalpost = createJournalpostSafWithNoDocs("JP101", "UFO", sakId, "I")
        val typeNJournalpost = createJournalpostSaf("JP102", "UFO", sakId, "N")

        Mockito.`when`(tokenService.isUserLoggedInAsPerson()).thenReturn(false)
        Mockito.`when`(tokenService.isUserLoggedInAsSaksbehandler()).thenReturn(true)
        Mockito.`when`(safClient.performGraphQLQuery(sakId)).thenReturn(
            listOf(
                relevantJournalpost,
                wrongTemaJournalpost,
                wrongSakIdJournalpost,
                emptyDocsJournalpost,
                typeNJournalpost
            )
        )

        // Act
        val result = journalpostService.getJournalPostliste(pid, sakId)

        // Assert
        assertEquals(1, result.size)
        assertEquals("JP123", result[0].id)
    }

    @Test
    fun `filtrerer vekk dokumentvarianter markert med at bruker ikke har tilgang`() {
        val pid = "12345678"
        val sakId = "123456"
        val dokumentInfoId = "123123"

        val dokument = JournalpostSafSelvbetjeningDto.Dokument(
            dokumentInfoId = dokumentInfoId,
            tittel = "Dokument tittel",
            dokumentvarianter = listOf(dokumentVariant(false), dokumentVariant(false), dokumentVariant(false))
        )

        val journalpost = createJournalpostSelvbetjening("JP123", "UFO", sakId, "I", listOf(dokument))

        Mockito.`when`(tokenService.isUserLoggedInAsPerson()).thenReturn(true)
        Mockito.`when`(safSelvbetjeningClient.performGraphQLQuery(pid)).thenReturn(
            listOf(
                journalpost
            )
        )

        val result = journalpostService.getJournalPostliste(pid, sakId)

        assertEquals(0, result.first().dokumenter.size)
    }

    @Test
    fun `saksbehandler mottar liste der irrelevant journalpost er filtrert vekk med SafClient`() {
        // Arrange
        val pid = "12345678901"
        val sakId = "123456"

        val relevantJournalpost = createJournalpostSaf("JP123", "UFO", sakId, "I")
        val wrongTemaJournalpost = createJournalpostSaf("JP456", "SYK", sakId, "I")
        val wrongSakIdJournalpost = createJournalpostSaf("JP789", "UFO", "654321", "I")
        val emptyDocsJournalpost = createJournalpostSafWithNoDocs("JP101", "PEN", sakId, "I")
        val typeNJournalpost = createJournalpostSaf("JP102", "PEN", sakId, "N")

        Mockito.`when`(tokenService.isUserLoggedInAsPerson()).thenReturn(false)
        Mockito.`when`(tokenService.isUserLoggedInAsSaksbehandler()).thenReturn(true)
        Mockito.`when`(safClient.performGraphQLQuery(sakId)).thenReturn(
            listOf(
                relevantJournalpost,
                wrongTemaJournalpost,
                wrongSakIdJournalpost,
                emptyDocsJournalpost,
                typeNJournalpost
            )
        )

        // Act
        val result = journalpostService.getJournalPostliste(pid, sakId)

        // Assert
        assertEquals(1, result.size)
        assertEquals("JP123", result[0].id)
    }

    @Test
    fun `filtrerer vekk dokumenter markert med at bruker ikke har tilgang med SafClient`() {
        val pid = "12345678"
        val sakId = "123456"
        val dokumentInfoId = "123123"

        val dokument = JournalpostSafDto.Dokument(
            dokumentInfoId = dokumentInfoId,
            tittel = "Dokument tittel",
            dokumentvarianter = listOf(
                JournalpostSafDto.Dokument.DokumentVariant(
                    filtype = "PDF",
                    brukerHarTilgang = false,
                    variantformat = JournalpostSafDto.Dokument.DokumentVariant.Variantformat.ARKIV
                )
            )
        )

        val journalpost = JournalpostSafDto(
            journalpostId = "JP123",
            tittel = "Journalpost tittel",
            tema = "PEN",
            journalposttype = "I",
            datoOpprettet = LocalDate.parse("2023-01-01").atStartOfDay(),
            sak = JournalpostSafDto.Sak(fagsakId = sakId),
            dokumenter = listOf(dokument),
            avsenderMottaker = null
        )

        Mockito.`when`(tokenService.isUserLoggedInAsPerson()).thenReturn(false)
        Mockito.`when`(tokenService.isUserLoggedInAsSaksbehandler()).thenReturn(true)
        Mockito.`when`(safClient.performGraphQLQuery(sakId)).thenReturn(listOf(journalpost))

        // Act
        val result = journalpostService.getJournalPostliste(pid, sakId)

        // Assert
        assertEquals(1, result.size)
        assertEquals(0, result[0].dokumenter.size)
    }

    @Test
    fun `velger sladdet variant ved flere dokumentvarianter med SafClient`() {
        val pid = "12345678"
        val sakId = "123456"
        val dokumentInfoId = "123123"

        val dokument = JournalpostSafDto.Dokument(
            dokumentInfoId = dokumentInfoId,
            tittel = "Dokument tittel",
            dokumentvarianter = listOf(
                JournalpostSafDto.Dokument.DokumentVariant(
                    filtype = "PDF",
                    brukerHarTilgang = true,
                    variantformat = JournalpostSafDto.Dokument.DokumentVariant.Variantformat.ORIGINAL
                ),
                JournalpostSafDto.Dokument.DokumentVariant(
                    filtype = "PDF",
                    brukerHarTilgang = true,
                    variantformat = JournalpostSafDto.Dokument.DokumentVariant.Variantformat.ARKIV
                ),
                JournalpostSafDto.Dokument.DokumentVariant(
                    filtype = "PDF",
                    brukerHarTilgang = true,
                    variantformat = JournalpostSafDto.Dokument.DokumentVariant.Variantformat.SLADDET
                )
            )
        )

        val journalpost = JournalpostSafDto(
            journalpostId = "JP123",
            tittel = "Journalpost tittel",
            tema = "PEN",
            journalposttype = "I",
            datoOpprettet = LocalDate.parse("2023-01-01").atStartOfDay(),
            sak = JournalpostSafDto.Sak(fagsakId = sakId),
            dokumenter = listOf(dokument),
            avsenderMottaker = null
        )

        Mockito.`when`(tokenService.isUserLoggedInAsPerson()).thenReturn(false)
        Mockito.`when`(tokenService.isUserLoggedInAsSaksbehandler()).thenReturn(true)
        Mockito.`when`(safClient.performGraphQLQuery(sakId)).thenReturn(listOf(journalpost))

        // Act
        val result = journalpostService.getJournalPostliste(pid, sakId)

        // Assert
        assertEquals(1, result.size)
        assertEquals(1, result[0].dokumenter.size)
        assertEquals("SLADDET", result[0].dokumenter[0].variant!!.name)
    }

    @Test
    fun `filtrerer vekk journalpost med null sak for SafSelvbetjening`() {
        // Arrange
        val pid = "12345678901"
        val sakId = "123456"

        val relevantJournalpost = createJournalpostSelvbetjening("JP123", "PEN", sakId, "I")
        val journalpostWithNullSak = JournalpostSafSelvbetjeningDto(
            journalpostId = "JP456",
            tittel = "Journalpost with null sak",
            tema = "UFO",
            journalposttype = "I",
            datoSortering = LocalDate.parse("2023-01-01").atStartOfDay(),
            avsender = null,
            mottaker = null,
            sak = JournalpostSafSelvbetjeningDto.Sak("1234567"),
            dokumenter = listOf(
                JournalpostSafSelvbetjeningDto.Dokument(
                    dokumentInfoId = "DOK456",
                    tittel = "Dokument",
                    dokumentvarianter = listOf(dokumentVariant(true))
                )
            )
        )

        Mockito.`when`(tokenService.isUserLoggedInAsPerson()).thenReturn(true)
        Mockito.`when`(safSelvbetjeningClient.performGraphQLQuery(pid))
            .thenReturn(listOf(relevantJournalpost, journalpostWithNullSak))

        // Act
        val result = journalpostService.getJournalPostliste(pid, sakId)

        // Assert
        assertEquals(1, result.size)
        assertEquals("JP123", result[0].id)
    }

    @Test
    fun `filtrerer vekk journalpost med null fagsakId for SafSelvbetjening`() {
        // Arrange
        val pid = "12345678901"
        val sakId = "123456"

        val relevantJournalpost = createJournalpostSelvbetjening("JP123", "UFO", sakId, "I")
        val journalpostWithNullFagsakId = JournalpostSafSelvbetjeningDto(
            journalpostId = "JP456",
            tittel = "Journalpost with null fagsakId",
            tema = "UFO",
            journalposttype = "I",
            datoSortering = LocalDate.parse("2023-01-01").atStartOfDay(),
            avsender = null,
            mottaker = null,
            sak = JournalpostSafSelvbetjeningDto.Sak(fagsakId = "1234567"),
            dokumenter = listOf(
                JournalpostSafSelvbetjeningDto.Dokument(
                    dokumentInfoId = "DOK456",
                    tittel = "Dokument",
                    dokumentvarianter = listOf(dokumentVariant(true))
                )
            )
        )

        Mockito.`when`(tokenService.isUserLoggedInAsPerson()).thenReturn(true)
        Mockito.`when`(safSelvbetjeningClient.performGraphQLQuery(pid))
            .thenReturn(listOf(relevantJournalpost, journalpostWithNullFagsakId))

        // Act
        val result = journalpostService.getJournalPostliste(pid, sakId)

        // Assert
        assertEquals(1, result.size)
        assertEquals("JP123", result[0].id)
    }

    @Test
    fun `filtrerer vekk journalpost med null sak for SafClient`() {
        // Arrange
        val pid = "12345678901"
        val sakId = "123456"

        val relevantJournalpost = createJournalpostSaf("JP123", "UFO", sakId, "I")
        val journalpostWithNullSak = JournalpostSafDto(
            journalpostId = "JP456",
            tittel = "Journalpost with null sak",
            tema = "UFO",
            journalposttype = "I",
            datoOpprettet = LocalDate.parse("2023-01-01").atStartOfDay(),
            sak = JournalpostSafDto.Sak("1234567"),
            dokumenter = listOf(
                JournalpostSafDto.Dokument(
                    dokumentInfoId = "DOK456",
                    tittel = "Dokument",
                    dokumentvarianter = listOf(
                        JournalpostSafDto.Dokument.DokumentVariant(
                            filtype = "PDF",
                            brukerHarTilgang = true,
                            variantformat = JournalpostSafDto.Dokument.DokumentVariant.Variantformat.ARKIV
                        )
                    )
                )
            ),
            avsenderMottaker = null
        )

        Mockito.`when`(tokenService.isUserLoggedInAsPerson()).thenReturn(false)
        Mockito.`when`(tokenService.isUserLoggedInAsSaksbehandler()).thenReturn(true)
        Mockito.`when`(safClient.performGraphQLQuery(sakId))
            .thenReturn(listOf(relevantJournalpost, journalpostWithNullSak))

        // Act
        val result = journalpostService.getJournalPostliste(pid, sakId)

        // Assert
        assertEquals(1, result.size)
        assertEquals("JP123", result[0].id)
    }

    @Test
    fun `filtrerer vekk journalpost med null fagsakId for SafClient`() {
        // Arrange
        val pid = "12345678901"
        val sakId = "123456"

        val relevantJournalpost = createJournalpostSaf("JP123", "UFO", sakId, "I")
        val journalpostWithNullFagsakId = JournalpostSafDto(
            journalpostId = "JP456",
            tittel = "Journalpost with null fagsakId",
            tema = "UFO",
            journalposttype = "I",
            datoOpprettet = LocalDate.parse("2023-01-01").atStartOfDay(),
            sak = JournalpostSafDto.Sak("1234567"),
            dokumenter = listOf(
                JournalpostSafDto.Dokument(
                    dokumentInfoId = "DOK456",
                    tittel = "Dokument",
                    dokumentvarianter = listOf(
                        JournalpostSafDto.Dokument.DokumentVariant(
                            filtype = "PDF",
                            brukerHarTilgang = true,
                            variantformat = JournalpostSafDto.Dokument.DokumentVariant.Variantformat.ARKIV
                        )
                    )
                )
            ),
            avsenderMottaker = null
        )

        Mockito.`when`(tokenService.isUserLoggedInAsPerson()).thenReturn(false)
        Mockito.`when`(tokenService.isUserLoggedInAsSaksbehandler()).thenReturn(true)
        Mockito.`when`(safClient.performGraphQLQuery(sakId))
            .thenReturn(listOf(relevantJournalpost, journalpostWithNullFagsakId))

        // Act
        val result = journalpostService.getJournalPostliste(pid, sakId)

        // Assert
        assertEquals(1, result.size)
        assertEquals("JP123", result[0].id)
    }

    private fun dokumentVariant(
        brukerHarTilgang: Boolean,
    ) = JournalpostSafSelvbetjeningDto.Dokument.DokumentVariant(
        filtype = "PDF",
        filstorrelse = 1024,
        brukerHarTilgang = brukerHarTilgang,
    )

    private fun createJournalpostSelvbetjening(
        journalpostId: String,
        tema: String,
        fagsakId: String,
        journalposttype: String,
        dokumenter: List<JournalpostSafSelvbetjeningDto.Dokument>? = null,
    ): JournalpostSafSelvbetjeningDto {
        return JournalpostSafSelvbetjeningDto(
            journalpostId = journalpostId,
            tittel = "Journalpost $journalpostId",
            tema = tema,
            journalposttype = journalposttype,
            datoSortering = LocalDate.parse("2023-01-01").atStartOfDay(),
            avsender = JournalpostSafSelvbetjeningDto.Aktoer(id = "12345678901"),
            mottaker = null,
            sak = JournalpostSafSelvbetjeningDto.Sak(fagsakId = fagsakId),
            dokumenter = dokumenter
                ?: listOf(
                    JournalpostSafSelvbetjeningDto.Dokument(
                        dokumentInfoId = "DOK-$journalpostId",
                        tittel = "Dokument for $journalpostId",
                        dokumentvarianter = listOf(
                            JournalpostSafSelvbetjeningDto.Dokument.DokumentVariant(
                                filtype = "PDF",
                                filstorrelse = 1024,
                                brukerHarTilgang = true,
                            )
                        )
                    )
                )
        )
    }

    private fun createJournalpostSaf(
        journalpostId: String,
        tema: String,
        fagsakId: String,
        journalposttype: String,
    ): JournalpostSafDto {
        return JournalpostSafDto(
            journalpostId = journalpostId,
            tittel = "Journalpost $journalpostId",
            tema = tema,
            journalposttype = journalposttype,
            datoOpprettet = LocalDate.parse("2023-01-01").atStartOfDay(),
            sak = JournalpostSafDto.Sak(fagsakId = fagsakId),
            dokumenter = listOf(
                JournalpostSafDto.Dokument(
                    dokumentInfoId = "DOK-$journalpostId",
                    tittel = "Dokument for $journalpostId",
                    dokumentvarianter = listOf(
                        JournalpostSafDto.Dokument.DokumentVariant(
                            filtype = "PDF",
                            brukerHarTilgang = true,
                            variantformat = JournalpostSafDto.Dokument.DokumentVariant.Variantformat.ARKIV
                        )
                    )
                )
            ),
            avsenderMottaker = null
        )
    }

    private fun createJournalpostSafWithNoDocs(
        journalpostId: String,
        tema: String,
        fagsakId: String,
        journalposttype: String,
    ): JournalpostSafDto {
        return JournalpostSafDto(
            journalpostId = journalpostId,
            tittel = "Journalpost $journalpostId",
            tema = tema,
            journalposttype = journalposttype,
            datoOpprettet = LocalDate.parse("2023-01-01").atStartOfDay(),
            sak = JournalpostSafDto.Sak(fagsakId = fagsakId),
            dokumenter = emptyList(),
            avsenderMottaker = null
        )
    }

}