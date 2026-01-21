package no.nav.dinuforetrygd.inntektskomponenten

import org.springframework.stereotype.Service
import java.time.LocalDate
import java.time.Month

@Service
class InntektskomponentenService(
    private val inntektskomponentenClient: InntektskomponentenClient,
) {

    fun getAretsInntektFraSkatt(pid: String): Double {
        val response = inntektskomponentenClient.hentAbonnerteInntekter(
            pid = pid,
            filter = "UfoereA-Inntekt",
            formål = "Ufoere",
            månedFom = LocalDate.now().withMonth(Month.JANUARY.value),
            månedTom = LocalDate.now()
        )
        val sum = response.data.sumOf { inntektPerMåned -> inntektPerMåned.inntektListe?.sumOf { it.beloep } ?: 0.0 }
        return sum
    }
}