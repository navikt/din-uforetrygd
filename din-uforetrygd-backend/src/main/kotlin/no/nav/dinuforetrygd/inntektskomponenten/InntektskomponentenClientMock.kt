package no.nav.dinuforetrygd.inntektskomponenten

import org.springframework.context.annotation.Profile
import org.springframework.stereotype.Component
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

/**
 * Mock av InntektskomponentenClient for lokal utvikling. Returnerer én måneds
 * inntekt slik at InntektskomponentenService.getAretsInntektFraSkatt() summerer til
 * et ikke-null beløp (12 500 kr/måned), i tråd med tallstørrelsene brukt i
 * din-uforetrygd-frontend sine MSW-mocker (sumAvForventedeInntekter: 150 000).
 */
@Profile("local")
@Component
class InntektskomponentenClientMock : InntektskomponentenClient {

    override fun hentAbonnerteInntekter(
        pid: String,
        filter: String,
        formål: String,
        månedFom: LocalDate,
        månedTom: LocalDate
    ): HentAbonnerteInntekterResponse = HentAbonnerteInntekterResponse(
        data = listOf(
            Inntektsinformasjon(
                maaned = månedTom.format(DateTimeFormatter.ofPattern("yyyy-MM")),
                opplysningspliktig = "999999999",
                underenhet = "999999999",
                norskident = pid,
                oppsummeringstidspunkt = LocalDateTime.now(),
                inntektListe = listOf(
                    Inntekt(
                        type = "LOENNSINNTEKT",
                        beloep = 12500.0,
                        fordel = "kontantytelse",
                        beskrivelse = "fastloenn",
                        inngaarIGrunnlagForTrekk = true,
                        utloeserArbeidsgiveravgift = true,
                        skatteOgAvgiftsregel = null,
                        opptjeningsperiodeFom = null,
                        opptjeningsperiodeTom = null,
                        tilleggsinformasjon = null,
                        manuellVurdering = false
                    )
                ),
                forskuddstrekkListe = emptyList(),
                avvikListe = emptyList()
            )
        )
    )
}
