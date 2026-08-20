package no.nav.dinuforetrygd

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import java.io.File

@SpringBootApplication
class MinUføretrygdApplication

fun main(args: Array<String>) {
    fetchSecretsLokalt()
    runApplication<MinUføretrygdApplication>(*args)
}

fun fetchSecretsLokalt() {
    val isLocal = System.getProperty("spring.profiles.active")
        ?.split(",")
        ?.contains("local") == true

    val secretsFile = File("/tmp/uforetrygd.env")

    if (isLocal && !secretsFile.exists()) {
        ProcessBuilder("./din-uforetrygd-backend/fetch-secrets.sh")
            .inheritIO()
            .start()
            .waitFor()
    }
}