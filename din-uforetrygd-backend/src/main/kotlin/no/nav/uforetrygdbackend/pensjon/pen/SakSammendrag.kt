package no.nav.uforetrygdbackend.pensjon.pen

import com.fasterxml.jackson.annotation.JsonFormat
import java.time.LocalDate

data class SakSammendrag(val sakId: Long,
                         val sakType: String,
                         val sakStatus: String,
                         @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss[xxxx]")
                         val fomDato: LocalDate?,
                         @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss[xxxx]")
                         val tomDato: LocalDate?,
                         val enhetId: String)
