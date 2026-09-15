package no.nav.dinuforetrygd.fullmakt

interface RepresentasjonClient {
    fun hasValidRepresentasjonsforhold(representertPid: String, representantPid: String): RepresentasjonsforholdValidity?
    fun harRepresentasjonsforhold(representantPid: String, validRepresentasjonstyper: List<String>): HarRepresentasjonsforhold?

    companion object {
        val VALID_VERGE_TYPER = listOf(
            "VERGE_UFORETRYGD_LES",
            "VERGE_UFORETRYGD_SKRIV"
        )
    }
}
