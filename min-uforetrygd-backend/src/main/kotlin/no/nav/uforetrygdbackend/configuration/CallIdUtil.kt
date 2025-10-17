package no.nav.uforetrygdbackend.configuration

import no.nav.uforetrygdbackend.util.NAV_CALL_ID_MDC
import org.slf4j.MDC

fun getCallIdFromMdc() = MDC.get(NAV_CALL_ID_MDC)