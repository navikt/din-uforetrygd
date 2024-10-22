package no.nav.uforetrygdbackend.pensjon.pen

import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import com.fasterxml.jackson.databind.util.StdConverter
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneId

data class UttaksgradResponse(@JsonProperty("uttaksgradList") val uttaksgradList: List<Uttaksgrad>)

data class Uttaksgrad(
    @JsonProperty("uttaksgradId") val uttaksgradId: Long?,
    @JsonProperty("fomDato") @JsonDeserialize(converter = EpochDateConverter::class) val fomDato: LocalDate?,
    @JsonProperty("tomDato") @JsonDeserialize(converter = EpochDateConverter::class) val tomDato: LocalDate?,
    @JsonProperty("uttaksgrad") val uttaksgrad: Int?,
    @JsonProperty("vedtakId") val vedtakId: Long?,
    @JsonProperty("sakId") var sakId: Long?
)

class EpochDateConverter : StdConverter<Long, LocalDate>() {
    override fun convert(value: Long): LocalDate {
        val instant = Instant.ofEpochMilli(value)
        return instant.atZone(ZoneId.of("Europe/Oslo")).toLocalDate()
    }
}
