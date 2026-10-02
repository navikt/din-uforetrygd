package no.nav.dinuforetrygd.mock

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import org.springframework.context.annotation.Profile
import org.springframework.core.io.ClassPathResource
import org.springframework.stereotype.Component

/**
 * Leser scenario-baserte mock-data for en gitt klient fra JSON-filer i
 * src/main/resources/mock/<klient>/<scenario>.json, f.eks. mock/pen/avsluttet.json.
 *
 * Hvert scenario for en klient samles i én fil (ikke splittet per endepunkt/metode),
 * slik at hele "fortellingen" for et scenario ("denne brukeren har en avsluttet sak")
 * er lett å lese og redigere ett sted. Speiler mønsteret i din-uforetrygd-frontend sine
 * MSW-mocker (mock/mockData.ts), der hvert scenario også er én samlet objektliteral.
 *
 * Bevisst uten caching: filene leses på nytt for hver kall, slik at man kan redigere en
 * scenario-fil og se endringen umiddelbart uten å restarte backend. Ren lokal utvikling,
 * så ytelse er irrelevant her - rask iterasjon er det som teller.
 *
 * Feiler høyt (IllegalArgumentException) dersom det forespurte scenarioet ikke finnes for
 * klienten, i stedet for stille å falle tilbake til default - en skrivefeil i
 * ?scenario=-parameteren skal være synlig, ikke skjule seg bak feil data.
 *
 * Bruker en egen ObjectMapper-instans (med Kotlin- og JavaTime-støtte for LocalDate m.m.)
 * fremfor å injisere Spring sin auto-konfigurerte ObjectMapper, siden denne appen ikke
 * eksponerer en slik bean (se f.eks. SetPidFilter/TokenXService, som også lager sin egen
 * ObjectMapper() direkte - samme etablerte mønster i denne kodebasen).
 */
@Profile("local")
@Component
final class MockDataLoader {

    @PublishedApi
    internal val objectMapper: ObjectMapper = ObjectMapper()
        .registerKotlinModule()
        .registerModule(JavaTimeModule())

    inline fun <reified T> load(client: String, scenario: String): T {
        val path = "mock/$client/$scenario.json"
        val resource = ClassPathResource(path)
        if (!resource.exists()) {
            val available =
                ClassPathResource("mock/$client").file.listFiles { file -> file.extension == "json" }
                    ?.map { it.nameWithoutExtension }?.sorted() ?: emptyList()
            throw IllegalArgumentException(
                "Fant ikke mock-scenario '$scenario' for klient '$client' (lette etter $path). " +
                        "Tilgjengelige scenarioer: $available"
            )
        }
        return resource.inputStream.use { objectMapper.readValue(it, T::class.java) }
    }
}

