package no.nav.dinuforetrygd.fullmakt

import com.fasterxml.jackson.annotation.JsonInclude

@JsonInclude(JsonInclude.Include.NON_NULL)
data class HarRepresentasjonforholdRequest(
    val representantPid: String?,
    val validRepresentasjonstyper: List<String>?
)

@JsonInclude(JsonInclude.Include.NON_NULL)
data class ValidRepresentasjonsforholdRequest(
    val representertPid: String,
    val representantPid: String?,
    val validRepresentasjonstyper: List<String>,
    val includeRepresentertNavn: Boolean = false
)