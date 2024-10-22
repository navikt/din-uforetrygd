package no.nav.uforetrygdbackend.person.parallellesannheter

import no.nav.uforetrygdbackend.person.parallellesannheter.dto.AdressebeskyttelseParallelleSannheterContainer
import no.nav.uforetrygdbackend.person.parallellesannheter.dto.FoedselParallelleSannheterContainer
import no.nav.uforetrygdbackend.person.pdl.PdlAdressebskyttelse
import no.nav.uforetrygdbackend.person.pdl.PdlFoedsel
import org.springframework.stereotype.Service
import java.time.LocalDate

@Service
class ParallelleSannheterService(private val parallelleSannheterClient: ParallelleSannheterClient) {

    fun decideFodselsdato(foedsel: List<PdlFoedsel>?): LocalDate? {
        val foedselParallellSannhetContainer = FoedselParallelleSannheterContainer(foedsel)
        return if (foedselParallellSannhetContainer.isDecisionNecessary()) {
            parallelleSannheterClient.decideFoedsel(foedselParallellSannhetContainer).getSannhet().firstOrNull()?.foedselsdato
        } else {
            foedselParallellSannhetContainer.lockDecision().getSannhet().firstOrNull()?.foedselsdato
        }
    }

    fun decideAdressebeskyttelse(adressebskyttelse: List<PdlAdressebskyttelse>?): PdlAdressebskyttelse? {
        val adressebeskyttelseParallellSannhetContainer = AdressebeskyttelseParallelleSannheterContainer(adressebskyttelse)
        return if (adressebeskyttelseParallellSannhetContainer.isDecisionNecessary()) {
            parallelleSannheterClient.decideAdressebeskyttelse(adressebeskyttelseParallellSannhetContainer).getSannhet().firstOrNull()
        } else {
            adressebeskyttelseParallellSannhetContainer.lockDecision().getSannhet().firstOrNull()
        }
    }
}