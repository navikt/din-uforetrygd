package no.nav.dinuforetrygd.pensjon.pen

import java.time.LocalDate

data class SakSammendrag(val sakId: Long,
                         val sakType: String,
                         val sakStatus: String,
                         val fomDato: LocalDate?,
                         val tomDato: LocalDate?,
                         val enhetId: String)
