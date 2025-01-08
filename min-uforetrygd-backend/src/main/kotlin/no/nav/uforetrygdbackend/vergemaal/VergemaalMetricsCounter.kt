package no.nav.uforetrygdbackend.vergemaal

import io.micrometer.core.instrument.Metrics

private const val EVENT_NAME = "vergemaal"

fun countEvent(result: String) = Metrics.counter(EVENT_NAME, "result", result).increment()
