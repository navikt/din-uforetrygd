package no.nav.uforetrygdbackend.vergemaal

import io.micrometer.core.instrument.Metrics


fun countLoginLevelWithOrWithoutLoginLevel(result: String) =
    countEvent(result, "loginLevelWithOrWithoutLoginLevel")

fun countCountryAreaWhenLoggedInWithVergemaal(result: String) =
    countEvent(result, "countryAreaWhenLoggedInWithVergemaal")

fun countVergemaalOrFremtidsfullmaktType(result: String) =
    countEvent(result, "vergemaalOrFremtidsfullmaktType")

private fun countEvent(result: String, eventName: String) = Metrics.counter(eventName, "result", result).increment()
