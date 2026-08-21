# din-uforetrygd-backend

## Lokal utvikling

Du må være lagt til i teamet ufore i Nais Console

For å kjøre backenden lokalt trengs noen miljøvariabler fra Nais. Disse hentes automatisk første gang appen startes med `local`-profilen.
Miljøvariablene må hentes på nytt når appen deployes til testmiljø, det må gjøres manuelt ved å kjøre skriptet `./fetch-secrets.sh --force`.
Skriptet lagrer miljøvariablene i mappen `/tmp` og fjernes når maskinen slåes av.

I IntelliJ kan du velge `edit configurations` ved siden av run-knappen.
* Sett `local` i  active profiles

Får du problemer med at maven ikke finner avhengigheter, kan det hende du må legge inn Maven-konfigurasjon i `settings.xml`. Se [Maven settings](../onboarding/mavensettings.md) for mer informasjon.

Nå skal du kunne kjøre backend lokalt.

For å kjøre requests mot backend må du ha access tokens. Dette kan du hente her:
* [Access token for borger](https://tokenx-token-generator.intern.dev.nav.no/api/obo?aud=dev-gcp:ufore:din-uforetrygd-backend)
* [Access token for veileder](https://azure-token-generator.intern.dev.nav.no/api/obo?aud=dev-gcp:ufore:din-uforetrygd-backend)