# Maven settings

For å kunne bygge og kjøre `din-uforetrygd-backend` lokalt, kan det hende du må legge inn Maven-konfigurasjon i `settings.xml`.

## Hvor skal filen ligge?

Maven leser normalt denne filen fra:

```text
~/.m2/settings.xml
```

Hvis filen ikke finnes fra før, kan du opprette den.

## Slik gjør du det

1. Opprett mappen `~/.m2` hvis den ikke finnes.
2. Åpne eller opprett filen `~/.m2/settings.xml`.
3. Lim inn XML-en i kodeblokken under.
4. Erstatt `GH_USERNAME` og `GH_TOKEN` med dine egne verdier.
4. Lagre filen.

##  

> Erstatt GH_USERNAME med brukernavnet ditt på Github.
> Erstatt GH_TOKEN med din token.

```xml
<settings>
    <pluginGroups>
        <pluginGroup>no.nav.maven.plugins</pluginGroup>
        <pluginGroup>no.nav.aura.maven.plugins</pluginGroup>
        <pluginGroup>no.stelvio.maven.plugins</pluginGroup>
    </pluginGroups>
    <mirrors>
        <mirror>
            <id>NAV internal Nexus</id>
            <mirrorOf>central</mirrorOf>
            <url>https://repo.adeo.no/repository/maven-central</url>
        </mirror>
    </mirrors>
    <profiles>
        <profile>
            <id>internal-repo</id>
            <activation>
                <activeByDefault>true</activeByDefault>
            </activation>
            <repositories>
                <!-- Det generelle interne Nexus-repoet til NAV (brukes kun internt) -->
                <repository>
                    <id>nexus-internal-release</id>
                    <url>https://repo.adeo.no/repository/maven-release</url>
                </repository>
                <!-- Mirror foran Maven Central NAV (brukes kun internt) -->
                <repository>
                    <id>nexus-internal-mirror</id>
                    <url>https://repo.adeo.no/repository/maven-public</url>
                </repository>
                <!-- Skal brukes hvis bygget kjører internt (f.eks. Jenkins, fra utviklerimage, eller via ScaleFT) -->
                <repository>
                    <id>internal-mirror-github-navikt</id>
                    <url>https://repo.adeo.no/repository/github-package-registry-navikt/</url>
                </repository>
                <!-- Skal brukes hvis bygget kjøres fra en Github Action -->
                <repository>
                    <id>github-package-registry-navikt</id>
                    <url>https://maven.pkg.github.com/navikt/maven-release</url>
                </repository>
                <!-- Skal brukes hvis bygget kjører utenfor NAV (f.eks. en ekstern maskin, eller Circle CI) -->
                <repository>
                    <id>external-mirror-github-navikt</id>
                    <url>https://github-package-registry-mirror.gc.nav.no/cached/maven-release</url>
                </repository>
            </repositories>
            <pluginRepositories>
                <pluginRepository>
                    <id>nexus-internal</id>
                    <name>NAV internal Nexus</name>
                    <url>https://repo.adeo.no/repository/maven-public</url>
                </pluginRepository>
            </pluginRepositories>
        </profile>
    </profiles>
    <servers>
        <server>
            <id>github-package-registry</id>
            <username>GH_USERNAME</username>
            <password>GH_TOKEN</password>
        </server>
    </servers>
</settings>
```

## Viktig

Hvis du allerede har en `~/.m2/settings.xml`, ikke overskriv den ukritisk.
Sammenlign innholdet og flett inn nødvendige endringer dersom du allerede har et eksisterende oppsett.

