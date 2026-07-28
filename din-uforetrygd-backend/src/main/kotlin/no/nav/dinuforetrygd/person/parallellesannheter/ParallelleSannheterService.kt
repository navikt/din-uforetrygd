package no.nav.dinuforetrygd.person.parallellesannheter

import no.nav.dinuforetrygd.person.parallellesannheter.dto.AdressebeskyttelseParallelleSannheterContainer
import no.nav.dinuforetrygd.person.parallellesannheter.dto.NavnParallelleSannheterContainer
import no.nav.dinuforetrygd.person.pdl.PdlAdressebskyttelse
import no.nav.dinuforetrygd.person.pdl.PdlNavn
import org.springframework.stereotype.Service

@Service
class ParallelleSannheterService(private val parallelleSannheterClient: ParallelleSannheterClient) {

    fun decideAdressebeskyttelse(adressebskyttelse: List<PdlAdressebskyttelse>?): PdlAdressebskyttelse? {
        val adressebeskyttelseParallellSannhetContainer = AdressebeskyttelseParallelleSannheterContainer(adressebskyttelse)
        return if (adressebeskyttelseParallellSannhetContainer.isDecisionNecessary()) {
            parallelleSannheterClient.decideAdressebeskyttelse(adressebeskyttelseParallellSannhetContainer).getSannhet().firstOrNull()
        } else {
            adressebeskyttelseParallellSannhetContainer.lockDecision().getSannhet().firstOrNull()
        }
    }

    fun decideNavn(navn: List<PdlNavn>?): PdlNavn? {
        val navnParallellSannhetContainer = NavnParallelleSannheterContainer(navn)
        return if (navnParallellSannhetContainer.isDecisionNecessary()) {
            parallelleSannheterClient.decideNavn(navnParallellSannhetContainer).getSannhet().firstOrNull()
        } else {
            navnParallellSannhetContainer.lockDecision().getSannhet().firstOrNull()
        }
    }
}