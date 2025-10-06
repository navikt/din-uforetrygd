package no.nav.uforetrygdbackend.configuration

enum class AppId(
    val supportsTokenX: Boolean,
    val supportsFullmakt: Boolean
) {
    PENSJON_FULLMAKT(true, false),
    SKJERMING(false, false),
    PEN(true, true),
    PDL(true, false),
    PERSONDATA(true, true),
    SAF_SELVBETJENING(true, true),
    SAF(false, false),
}