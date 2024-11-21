package no.nav.uforetrygdbackend.person

import no.nav.uforetrygdbackend.person.parallellesannheter.ParallelleSannheterService
import no.nav.uforetrygdbackend.person.pdl.*
import no.nav.uforetrygdbackend.security.TokenService
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.time.Period

@Service
class PersonService(
    private val pdlClient: PdlClient,
    private val parallelleSannheterService: ParallelleSannheterService,
    private val tokenService: TokenService
) {

    fun hasSaksbehandlerAccessToPid(pid: String): Boolean {
        val adressebeskyttelse = getAdressebeskyttelsesgrad(pid)
        return (isUgradert(adressebeskyttelse)
                || isStrengtFortroligAndSaksbehandlerHasAccess(adressebeskyttelse)
                || isFortroligAndSaksbehandlerHasAccess(adressebeskyttelse))
    }

    fun hasAdressebeskyttelse(pid: String): Boolean {
        val adressebeskyttelsesgrad = getAdressebeskyttelsesgrad(pid)
        if (adressebeskyttelsesgrad == null || adressebeskyttelsesgrad == PdlAdressebeskyttelsesgradering.UGRADERT) {
            return false
        }
        return true
    }

    private fun isUgradert(adressebeskyttelse: PdlAdressebeskyttelsesgradering?) =
        adressebeskyttelse == null || adressebeskyttelse == PdlAdressebeskyttelsesgradering.UGRADERT

    private fun isFortroligAndSaksbehandlerHasAccess(adressebeskyttelse: PdlAdressebeskyttelsesgradering?) =
        adressebeskyttelse == PdlAdressebeskyttelsesgradering.FORTROLIG && tokenService.isUserInFortroligGroup()

    private fun isStrengtFortroligAndSaksbehandlerHasAccess(adressebeskyttelse: PdlAdressebeskyttelsesgradering?) =
        (adressebeskyttelse == PdlAdressebeskyttelsesgradering.STRENGT_FORTROLIG || adressebeskyttelse == PdlAdressebeskyttelsesgradering.STRENGT_FORTROLIG_UTLAND)
                && tokenService.isUserInStrengtFortroligGroup()

    private fun getAdressebeskyttelsesgrad(pid: String): PdlAdressebeskyttelsesgradering? {
        val adressebeskyttelse =
            pdlClient.performQueryWithElevatedPriveleges(PdlQueryBuilder.getAdressebeskyttelseQuery(pid)).adressebeskyttelse
        return parallelleSannheterService.decideAdressebeskyttelse(adressebeskyttelse)?.gradering
    }
}
