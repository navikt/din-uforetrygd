package no.nav.uforetrygdbackend.vergemaal

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import no.nav.uforetrygdbackend.person.PersonService
import no.nav.uforetrygdbackend.security.SecurityContextUtil
import no.nav.uforetrygdbackend.security.TokenService
import org.springframework.core.annotation.Order
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
@Order(3)
class CheckVergemaalEllerFremitidsfullmaktAndLoginLevelFilter(
    private val tokenService: TokenService,
    private val personService: PersonService,
) : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain,
    ) {
        try {
            countVergemaalAndInnloggingsnivaa(request)
        } catch (e: Exception) {
            logger.warn("Failed to count vergemaal and innloggingsnivaa", e)
        }
        filterChain.doFilter(request, response)
    }

    private fun countVergemaalAndInnloggingsnivaa(request: HttpServletRequest) {
        if (request.getHeader("Authorization") != null && tokenService.isUserLoggedInAsPerson()) {
            val pid = SecurityContextUtil.getPidFromContext()
            val innloggingsniva = tokenService.getInnloggingstype()
            val vergemaalEllerFremtidsfullmakt = personService.getVergemaalEllerFremtidsfullmakt(pid)

            countEvent(
                "UT_${innloggingsniva}_" +
                        (if (vergemaalEllerFremtidsfullmakt != null) "HAR_VERGEMAAL_" else "HAR_IKKE_VERGEMAAL_") +
                                findCountryArea(pid)
            )
        }
    }

    private fun findCountryArea(pid: String): String {
        return when (val landkode = personService.getLandkodeFromBostedsland(pid)) {
            "NOR" -> "BOSTEDSLAND_NORGE"
            "XUK" -> "BOSTEDSLAND_UKJENT"
            EES_COUNTRIES.find { it == landkode } -> "BOSTEDSLAND_EES"
            else -> "BOSTEDSLAND_ANNET"
        }
    }

    companion object {
        // Liste hentet fra https://www.nav.no/no/person/flere-tema/arbeid-og-opphold-i-utlandet/relatert-informasjon/eos-landene
        private val EES_COUNTRIES = listOf(
            "BEL", // "Belgia",
            "BGR", // "Bulgaria",
            "DNK", // "Danmark",
            "EST", // "Estland",
            "FIN", // "Finland",
            "FRA", // "Frankrike",
            "GRC", // "Hellas",
            "IRL", // "Irland",
            "ISL", // "Island",
            "ITA", // "Italia",
            "HRV", // "Kroatia",
            "CYP", //"Kypros",
            "LVA", // "Latvia",
            "LIE", // "Liechtenstein",
            "LTU", // "Litauen",
            "LUX", // "Luxembourg",
            "MLT", // "Malta",
            "NLD", // "Nederland",
            // Norge, // Egen regel for logging av Norge
            "POL", // "Polen",
            "PRT", // "Portugal",
            "ROU", // "Romania",
            "SVK", // "Slovakia",
            "SVN", // "Slovenia",
            "ESP", // "Spania",
            "CHE", // "Sveits",
            "SWE", // "Sverige",
            "CZE", // "Tsjekkia",
            "DEU", // "Tyskland",
            "HUN", // "Ungarn",
            "AUT", // "Østerrike",
        )
    }
}