package no.nav.uforetrygdbackend.pensjon.pen

import com.fasterxml.jackson.annotation.JsonProperty

data class ForventedeInntekterResponse(
    @JsonProperty("sumAvForventedeInntekter") val sumAvForventedeInntekter: Long?,
)
