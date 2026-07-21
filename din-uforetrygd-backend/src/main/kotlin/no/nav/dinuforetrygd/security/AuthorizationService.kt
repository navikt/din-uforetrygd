package no.nav.dinuforetrygd.security

import jakarta.servlet.http.Cookie
import no.nav.dinuforetrygd.fullmakt.RepresentasjonClient
import no.nav.dinuforetrygd.fullmakt.RepresentasjonException
import no.nav.dinuforetrygd.fullmakt.RepresentasjonsforholdValidity
import no.nav.dinuforetrygd.person.PersonService
import no.nav.dinuforetrygd.person.pdl.PdlAdressebeskyttelsesgradering
import no.nav.dinuforetrygd.skjerming.SkjermingClient
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service

@Service
class AuthorizationService(
    @Value("\${strengt-fortrolig-tilgang.group.id}") private val strengtFortroligAdresseGroupId: String,
    @Value("\${fortrolig-tilgang.group.id}") private val fortroligAdresseGroupId: String,
    @Value("\${skjermet-tilgang.group.id}") private val skjermetGroupId: String,
    @Value("\${saksbehandler.group.id}") private val pensjonSaksbehandlerGroupId: String,
    @Value("\${veileder.group.id}") private val pensjonVeilederGroupId: String,
    @Value("\${brukerhjelpa.group.id}") private val pensjonBrukerhjelpaGroupId: String,
    @Value("\${okonomi.group.id}") private val pensjonOkonomiGroupId: String,
    private val tokenService: TokenService,
    private val skjermingClient: SkjermingClient,
    private val personService: PersonService,
    private val representasjonClient: RepresentasjonClient
) {

    private val log: Logger = LoggerFactory.getLogger(AuthorizationService::class.java)

    fun checkVeilederTilgangTilInnbygger(pid: String) {
        checkBasisTilgang()
        checkSkjermetAnsatt(pid)
        checkAdressebeskyttetInnbygger(pid)
    }

    fun checkBorgerTilgang(navOnBehalfOfCookie: Cookie?) : AuthenticatedUserDetails {
        val requestingPid = tokenService.determineRequestingPid()
        if (navOnBehalfOfCookie != null) {
            val fullmaktsgiverKryptertPid = navOnBehalfOfCookie.value
            val representasjonsforholdValidity = haandterRepresentasjon(fullmaktsgiverKryptertPid, requestingPid)
            return AuthenticatedUserDetails(representasjonsforholdValidity.representertPid, representasjonsforholdValidity.hasValidRepresentasjonsforhold)
        }else {
            checkAdressebeskyttelseAndLoginLevel(requestingPid)
            return AuthenticatedUserDetails(requestingPid, false)
        }
    }

    private fun checkBasisTilgang() {
        val adGroups = tokenService.getGroups()

        if (!(adGroups.contains(pensjonSaksbehandlerGroupId) ||
            adGroups.contains(pensjonVeilederGroupId) ||
            adGroups.contains(pensjonBrukerhjelpaGroupId) ||
            adGroups.contains(pensjonOkonomiGroupId))) {
            log.info("Veileder/saksbehandler mangler basis rolle for pensjon. Nekter tilgang.")
            throw VeilederUnauthorizedException()
        }
    }

    private fun checkSkjermetAnsatt(pid: String) {
        if (!tokenService.getGroups().contains(skjermetGroupId) && skjermingClient.isSkjermet(pid)) {
            log.info("Bruker skjermet, veileder/saksbehandler mangler autorisering. Nekter tilgang.")
            throw VeilederUnauthorizedException()
        }
    }

    private fun checkAdressebeskyttetInnbygger(pid: String) {
        val adressebeskyttelse = personService.getAdressebeskyttelsesgrad(pid)
        val adGroups = tokenService.getGroups()
        when (adressebeskyttelse) {
            PdlAdressebeskyttelsesgradering.FORTROLIG -> {
                if (!adGroups.contains(fortroligAdresseGroupId)) {
                    log.info("Bruker adressebeskyttet - fortrolig, veileder/saksbehandler mangler autorisering. Nekter tilgang.")
                    throw VeilederUnauthorizedException()
                }
            }
            PdlAdressebeskyttelsesgradering.STRENGT_FORTROLIG -> {
                if (!adGroups.contains(strengtFortroligAdresseGroupId)) {
                    log.info("Bruker adressebeskyttet - strengt fortrolig, veileder/saksbehandler mangler autorisering. Nekter tilgang.")
                    throw VeilederUnauthorizedException()
                }
            }
            PdlAdressebeskyttelsesgradering.STRENGT_FORTROLIG_UTLAND -> {
                if (!adGroups.contains(strengtFortroligAdresseGroupId)) {
                    log.info("Bruker adressebeskyttet - strengt fortrolig utland , veileder/saksbehandler mangler autorisering. Nekter tilgang.")
                    throw VeilederUnauthorizedException()
                }
            }
            else -> {}
        }
    }

    private fun checkAdressebeskyttelseAndLoginLevel(requestingPid: String) {
        if (!tokenService.isLoginLevelHigh()) {
            val adressebeskyttelse = personService.getAdressebeskyttelsesgrad(requestingPid)
            if (adressebeskyttelse == PdlAdressebeskyttelsesgradering.STRENGT_FORTROLIG || adressebeskyttelse == PdlAdressebeskyttelsesgradering.STRENGT_FORTROLIG_UTLAND) {
                log.info("Bruker adressebeskyttet - Strengt Fortrolig, innloggingsnivå for lavt. Nekter adgang")
                throw LoginLevelTooLowException()
            }
        }
    }

    private fun haandterRepresentasjon(representertPid: String, requestingPid: String): RepresentasjonsforholdValidity {
        try {
            val harGyldigRepresentasjon = representasjonClient.hasValidRepresentasjonsforhold(representertPid, requestingPid)
            if (harGyldigRepresentasjon == null || !harGyldigRepresentasjon.hasValidRepresentasjonsforhold) {
                log.info("Fullmaktsforhold er ikke funnet. Nekter adgang")
                throw NoRepresentasjonPresentException()
            }

            if(personService.hasAdressebeskyttelse(harGyldigRepresentasjon.representertPid)) {
                log.info("Fullmaktsforhold for bruker med adressebeskyttelse. Nekter adgang")
                throw NoRepresentasjonPresentException()
            }

            return harGyldigRepresentasjon
        } catch (e: RepresentasjonException) {
            log.error("Noe gikk galt ved kall til fullmakt. Nekter adgang")
            log.warn("FullmaktException: ${e.message}")
            throw NoRepresentasjonPresentException()
        }
    }
}