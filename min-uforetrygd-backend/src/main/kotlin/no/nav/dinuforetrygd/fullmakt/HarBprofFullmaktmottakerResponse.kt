package no.nav.dinuforetrygd.fullmakt

import com.fasterxml.jackson.annotation.JsonProperty

data class HarBprofFullmaktmottakereResponse (
    @JsonProperty("value") val value: Boolean
)
