package no.nav.dinuforetrygd.fullmakt

data class HarRepresentasjonforholdRequest(
    val representantPid: String?,
    val validRepresentasjonstyper: List<String>?
)