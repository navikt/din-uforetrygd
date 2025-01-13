package no.nav.uforetrygdbackend.vergemaal

import io.micrometer.core.instrument.Metrics

const val EVENT_NAME = "loginlevel_vergemaal_and_country_counter"

fun countEvent(result: String) = Metrics.counter(EVENT_NAME, "result", result).increment()
