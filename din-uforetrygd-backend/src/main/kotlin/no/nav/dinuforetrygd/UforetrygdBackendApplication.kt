package no.nav.dinuforetrygd

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import java.io.File

@SpringBootApplication
class MinUføretrygdApplication

fun main(args: Array<String>) {
    val secretsFile = File("/tmp/uforetrygd.env")

    if (!secretsFile.exists()) {
        ProcessBuilder("./din-uforetrygd-backend/fetch-secrets.sh")
            .inheritIO()
            .start()
            .waitFor()
    }

    runApplication<MinUføretrygdApplication>(*args)
}
