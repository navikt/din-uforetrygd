package no.nav.dinuforetrygd.fullmakt

import org.springframework.context.annotation.Profile
import org.springframework.stereotype.Component

@Profile("mock")
@Component
class RepresentasjonClientMock : RepresentasjonClient {

    override fun hasValidRepresentasjonsforhold(
        representertPid: String,
        representantPid: String
    ): RepresentasjonsforholdValidity = RepresentasjonsforholdValidity(
        hasValidRepresentasjonsforhold = true,
        representertNavn = null,
        representertPidKryptert = "",
        representertPid = representertPid
    )

    override fun harRepresentasjonsforhold(
        representantPid: String,
        validRepresentasjonstyper: List<String>
    ): HarRepresentasjonsforhold = HarRepresentasjonsforhold(value = false)
}
