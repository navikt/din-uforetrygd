package no.nav.dinuforetrygd

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import kotlin.collections.emptyList

@SpringBootApplication
class MinUføretrygdApplication

fun main(args: Array<String>) {
    fetchSecretsLokalt()
    runApplication<MinUføretrygdApplication>(*args)
}

fun fetchSecretsLokalt() {
    val activeProfiles = (System.getProperty("spring.profiles.active")
        ?: System.getenv("SPRING_PROFILES_ACTIVE"))
        ?.split(",") ?: emptyList()
    val isLocal = activeProfiles.contains("local")
    val runningViaTilt = System.getenv("RUNNING_VIA_TILT") == "true"

    if (isLocal && !runningViaTilt) {
        ProcessBuilder("./fetch-secrets.sh")
            .inheritIO()
            .start()
            .waitFor()
    }
}