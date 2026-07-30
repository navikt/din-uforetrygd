package no.nav.dinuforetrygd.person

import no.nav.dinuforetrygd.person.parallellesannheter.ParallelleSannheterService
import no.nav.dinuforetrygd.person.pdl.*
import org.springframework.stereotype.Service

@Service
class PersonService(
    private val pdlClient: PdlClient,
    private val parallelleSannheterService: ParallelleSannheterService,
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

    fun getNavn(pid: String): String? {
        pdlClient.performQuery(PdlQueryBuilder.getPersonQuery(pid)).let {
            val navn = parallelleSannheterService.decideNavn(it.navn)
            return navn?.let {
                "${it.fornavn} ${it.mellomnavn?.let { mellomnavn -> "$mellomnavn " } ?: ""}${it.etternavn}"
            }
        }
    }
}
