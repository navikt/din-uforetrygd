package no.nav.dinuforetrygd.logging

import ch.qos.logback.access.common.spi.IAccessEvent
import tools.jackson.core.JsonGenerator
import com.nimbusds.jwt.JWTParser
import net.logstash.logback.composite.AbstractJsonProvider

class AuthorizationJsonProvider : AbstractJsonProvider<IAccessEvent>() {

    override fun writeTo(generator: JsonGenerator, event: IAccessEvent) {
        event.getRequestHeader("Authorization")?.let { auth ->
            if (auth.startsWith("Bearer ")) {
                val token = auth.removePrefix("Bearer ").trim()
                try {
                    val jwt = JWTParser.parse(token)
                    jwt.jwtClaimsSet.getStringClaim("NAVident")?.let { navIdent ->
                        generator.writeStringProperty(NAV_IDENT, navIdent)
                    }
                    jwt.jwtClaimsSet.getStringClaim("pid")?.let { pid ->
                        generator.writeStringProperty(LOGGED_IN_PID, Masker.maskPid(pid))
                    }
                } catch (e: Exception) {
                    //Trenger ingen videre håndtering
                }
            }
        }
        event.request.cookies?.firstOrNull { cookie -> cookie.name.equals("nav-obo") }?.let { cookie ->
            generator.writeStringProperty(OBO_PID, Masker.maskPid(cookie.value))
        }
    }
}
