package no.nav.dinuforetrygd.inntektskomponenten

import java.time.LocalDate

interface InntektskomponentenClient {
    fun hentAbonnerteInntekter(
        pid: String,
        filter: String,
        formål: String,
        månedFom: LocalDate,
        månedTom: LocalDate
    ): HentAbonnerteInntekterResponse
}
