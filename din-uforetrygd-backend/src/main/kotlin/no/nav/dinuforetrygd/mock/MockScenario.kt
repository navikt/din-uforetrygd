package no.nav.dinuforetrygd.mock

import jakarta.servlet.http.HttpServletRequest
import org.springframework.context.annotation.Profile
import org.springframework.stereotype.Component

const val MOCK_SCENARIO_HEADER = "X-Mock-Scenario"
const val DEFAULT_SCENARIO = "default"

/**
 * Leser X-Mock-Scenario-headeren som din-uforetrygd-frontend allerede sender på alle
 * kall mot backenden (se src/api/common.ts og src/proxy.ts i frontend-repoet), slik at
 * @Profile("local")-mockene våre kan returnere ulike, navngitte datasett basert på
 * samme scenario-navn som brukes i frontendens egne MSW-mocker (mock/mockData.ts m.fl.).
 *
 * HttpServletRequest injiseres her som en request-scoped proxy av Spring (samme mønster
 * som brukes for MDC-context ellers i kodebasen) - trygt å injisere i en singleton-bean.
 */
@Profile("local")
@Component
class MockScenario(private val request: HttpServletRequest) {

    fun current(): String = request.getHeader(MOCK_SCENARIO_HEADER) ?: DEFAULT_SCENARIO
}
