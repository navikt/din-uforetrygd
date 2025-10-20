package no.nav.dinuforetrygd.fullmakt

data class Representasjonsforhold(
    val fullmaktsgiver: String,
    val fullmaktsgiverNavn: String?,
    val typer: List<String>,
    val kilde: String
)
