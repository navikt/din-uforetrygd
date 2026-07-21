package no.nav.dinuforetrygd.fullmakt

data class HarRepresentasjonforholdRequest(
    val representantPid: String?,
    val validRepresentasjonstyper: List<String>?
)

data class ValidRepresentasjonsforholdRequest(
    val representertPid: String,
    val representantPid: String?,
    val validRepresentasjonstyper: List<String>,
    val includeRepresentertNavn: Boolean = false
)