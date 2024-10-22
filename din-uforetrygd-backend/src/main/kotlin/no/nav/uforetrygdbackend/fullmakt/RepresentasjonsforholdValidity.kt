package no.nav.uforetrygdbackend.fullmakt

import com.fasterxml.jackson.annotation.JsonProperty

data class RepresentasjonsforholdValidity (
    @JsonProperty("hasValidRepresentasjonsforhold") val hasValidRepresentasjonsforhold: Boolean,
    @JsonProperty("fullmaktsgiverNavn") val fullmaktsgiverNavn: String?
)
