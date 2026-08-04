package no.nav.dinuforetrygd.configuration

import no.nav.dinuforetrygd.logging.NAV_CALL_ID_MDC
import org.slf4j.MDC

fun getCallIdFromMdc() = MDC.get(NAV_CALL_ID_MDC)