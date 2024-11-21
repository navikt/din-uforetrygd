package no.nav.uforetrygdbackend

data class UforetrygdResponse(
    val pid: String,
    val loggetInnSom: String,
    val saker: List<Sak>,
    val tilgangstype: Tilgangstype,
    val innloggingstype: Innloggingstype,
    val harGammelFullmaktmottaker: Boolean
)

enum class Innloggingstype {
    LEVEL4,
    LEVEL3,
    NAV,
    SYSTEM
}

enum class Tilgangstype {
    PERSONLIG,
    FULLMAKT_LES,
    FULLMAKT_KOMMUNISER,
    FULLMAKT_SKRIV,
    FULLMAKT_FULLSTENDIG,
    FULLMAKT_BEGRENSET,
    FULLMAKT_SAMHANDLER,
    FULLMAKT_SAMHANDLER_ADMIN,
    FULLMAKT_SUPER_ADMIN,
    VERGE,
    PENGEMOTTAKER,
    VERGE_PENGEMOTTAKER,
    SAKSBEHANDLER,
    VEILEDER,
    VEILEDER_BEGRENSET, //TODO: Skal denne også tas med?
    BRUKERHJELPA,
    KLAGEBEHANDLER,
    OKONOMI
}

data class Sak(val type: Sakstype, val grad: Int?, val status: Sakstatus)

enum class Sakstatus {
    OPPRETTET,
    TIL_BEHANDLING,
    AVSLUTTET,
    LOPENDE,
    UKJENT
}

enum class Sakstype {
    ALDERSPENSJON,
    AFP,
    AFP_PRIVAT,
    BARNEPENSJON,
    FAMILIEPLEIER_YTELSE,
    GAMMEL_YRKESSKADE,
    GENERELL,
    GJENLEVENDE_YTELSE,
    GRUNNBLANKETTER,
    KRIGSPENSJON,
    OMSORGSOPPTJENING,
    UFORETRYGD,
    UKJENT
}
