package no.nav.uforetrygdbackend.pensjon.pen

import com.fasterxml.jackson.annotation.JsonProperty

data class UforegradResponse(@JsonProperty("uforegrad") val uforegrad: Int?)