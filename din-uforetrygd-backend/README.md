# din-uforetrygd-backend

## Lokal utvikling

Du må være lagt til i teamet ufore i Nais Console

For å kjøre backenden lokalt er du nødt til å tilgjengeligjøre noen miljøvariabler som ikke er sjekket inn.
Disse kan hentes ved å kjøre skriptet `./fetch-secrets.sh`. For å kjøre skriptet må du:
1. Ha installert [env-fetch](https://github.com/navikt/env-fetch)
2. Være innlogget i GCP: `nais login` eller `gcloud auth login`
3. Sett kontekst til dev gcp: `kubectl config use-context dev-gcp`

Skriptet lagrer miljøvariablene i mappen `/private/tmp` og fjernes når maskinen slåes av.

I IntelliJ kan du velge `edit configurations` ved siden av run-knappen.
* Sett `local` i  active profiles
* Huk av for Enable EnvFile og legge til `/private/tmp/uforetrygd.env`

Får du problemer med at maven ikke finner avhengigheter, kan det hende du må legge inn Maven-konfigurasjon i `settings.xml`. Se [Maven settings](../onboarding/mavensettings.md) for mer informasjon.

Nå skal du kunne kjøre backend lokalt.

For å kjøre requests mot backend må du ha access tokens. Dette kan du hente her:
* [Access token for borger](https://tokenx-token-generator.intern.dev.nav.no/api/obo?aud=dev-gcp:ufore:din-uforetrygd-backend)
* [Access token for veileder](https://azure-token-generator.intern.dev.nav.no/api/obo?aud=dev-gcp:ufore:din-uforetrygd-backend)