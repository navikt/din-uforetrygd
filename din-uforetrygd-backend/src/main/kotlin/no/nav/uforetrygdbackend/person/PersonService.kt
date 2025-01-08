package no.nav.uforetrygdbackend.person

import no.nav.uforetrygdbackend.person.parallellesannheter.ParallelleSannheterService
import no.nav.uforetrygdbackend.person.pdl.*
import org.springframework.stereotype.Service

@Service
class PersonService(
    private val pdlClient: PdlClient,
    private val parallelleSannheterService: ParallelleSannheterService
) {

    fun hasAdressebeskyttelse(pid: String): Boolean {
        val adressebeskyttelsesgrad = getAdressebeskyttelsesgrad(pid)
        if (adressebeskyttelsesgrad == null || adressebeskyttelsesgrad == PdlAdressebeskyttelsesgradering.UGRADERT) {
            return false
        }
        return true
    }

    fun getAdressebeskyttelsesgrad(pid: String): PdlAdressebeskyttelsesgradering? {
        val adressebeskyttelse =
            pdlClient.performQueryWithElevatedPriveleges(PdlQueryBuilder.getAdressebeskyttelseQuery(pid)).adressebeskyttelse
        return parallelleSannheterService.decideAdressebeskyttelse(adressebeskyttelse)?.gradering
    }

    fun getVergemaalEllerFremtidsfullmakt(pid: String): PdlVergemaalEllerFremtidsfullmakt? {
        val vergemaalEllerFremtidsfullmakt = pdlClient.performQuery(PdlQueryBuilder.getVergemaaalEllerFremtidsfullmaktQuery(pid)).vergemaalEllerFremtidsfullmakt
        return vergemaalEllerFremtidsfullmakt?.firstOrNull()
    }
}
