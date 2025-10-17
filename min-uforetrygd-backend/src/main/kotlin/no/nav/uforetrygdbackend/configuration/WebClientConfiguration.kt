package no.nav.uforetrygdbackend.configuration

import org.slf4j.LoggerFactory
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.client.reactive.ReactorClientHttpConnector
import org.springframework.web.reactive.function.client.ExchangeFilterFunction
import org.springframework.web.reactive.function.client.ExchangeStrategies
import org.springframework.web.reactive.function.client.WebClient
import reactor.core.publisher.Mono
import reactor.netty.http.client.HttpClient
import java.time.Duration

@Configuration
class WebClientConfiguration {
    private val logger = LoggerFactory.getLogger(WebClientConfiguration::class.java)

    @Bean
    fun webClient(): WebClient = WebClient.builder()
        .clientConnector(ReactorClientHttpConnector(httpClient))
        .exchangeStrategies(ExchangeStrategies.builder().codecs { it.defaultCodecs().maxInMemorySize(16 * 1024 * 1024) }.build())
        .filter(logRequest())
        .build()

    private val httpClient = HttpClient.create()
        .responseTimeout(Duration.ofSeconds(5)) // Response timeout
        .option(io.netty.channel.ChannelOption.CONNECT_TIMEOUT_MILLIS, 2000) // Connection timeout

    private fun logRequest(): ExchangeFilterFunction = ExchangeFilterFunction.ofRequestProcessor { clientRequest ->
        logger.info("Request: ${clientRequest.method()} ${clientRequest.url()}")
        Mono.just(clientRequest)
    }
}