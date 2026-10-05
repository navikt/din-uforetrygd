# din-uforetrygd-frontend

## Biome

Vi bruker [Biome](https://biomejs.dev/) til linting og formatering.

- Kjør `npm run check` for å sjekke formatering, linting og typer.
- Kjør `npm run fix` for å formatere koden.
- Installer Biome-pluginen i IntelliJ og slå på formatering ved lagring hvis du vil formatere automatisk.

## Lokal utvikling

Installere: `npm i`

### Unleash
For å få kontakt med Unleash når du kjører mot lokal backend må vi hente noen secrets ved å kjøre `./fetch-secrets.sh`. Dette lagrer nødvendige secrets i `.env.local`. Du kan også finne token og URL for Unleash på [Uføres Unleash](https://ufore-unleash-web.iap.nav.cloud.nais.io) under Project settings > API access og sette dem selv.

Når du kjører mot mock kan du endre togglene i [denne fila](mock/server/unleashHandlers.ts), du trenger ikke fetche secrets.

### Mock backend
Kjør `npm run mock` for lokal utvikling med mockdata. Da starter Next.js og en Express-server på port `8080`.

Mockserveren håndterer appens backend-endepunkter og Unleash. Den bruker data fra `mock/` og trenger ikke token eller kontakt med eksterne tjenester. Endepunktene er definert i `mock/server/mockServer.ts`, mens lokale Unleash-flagg ligger i `mock/server/unleashHandlers.ts`.

Velg scenario med query-parameteren `scenario`:

```text
http://localhost:3000/uforetrygd/selvbetjening?scenario=avsluttet
```

Proxyen videresender scenarioet som `x-mock-scenario` til mockserveren. Eksempler på scenarioer er `avsluttet`, `gradert`, `har-lopende`, `sak-behandling`, `ufore-behandling`, `ingen-uforesak`, `ufore-uten-datoer`, `forbidden`, `ingen-varsel` og `er-verge`. Tilgjengelige data per endepunkt ligger i de respektive `mock/mock*Data.ts`-filene.

Mockmodus laster ikke Dekoratørens, representasjonsbannerets eller UX Signals sine eksterne klientskript. Det hindrer at lokale requests til eksterne sesjonstjenester gir feil i nettleseren.

Playwright bruker fortsatt egen oppstart via `npm run mock:playwright` fra `playwright.config.ts`.

### Mot lokal backend
* Start backenden
* Finn et token og legg det inn i .env.local som `ACCESS_TOKEN`
  * Borger-token: https://tokenx-token-generator.intern.dev.nav.no/api/obo?aud=dev-gcp:ufore:din-uforetrygd-backend
  * Veileder-token: https://azure-token-generator.intern.dev.nav.no/api/obo?aud=dev-gcp:ufore:din-uforetrygd-backend
  * For å generere borger for riktige scenarioer, se [TestBorgere](TestBorgere.md)
* Kjør `npm run local`
* Åpne http://localhost:3000/uforetrygd/selvbetjening

### Playwright-testar

Installasjon av dependencies: `npx playwright install`

`playwright.config.ts` angir webServer.command, som startar mock server
`workers: 1` – diverre fungerer ikkje parallellkøyring av testane p.t.

#### CLI
* Køyr alle testane med `npm run test:playwright` eller `npx playwright test` 
* For å avgrensa til eit gitt scenario, køyr 
  * `npm run test:playwright:<scenario>` eller
  * `npx playwright test tests/uforetrygd-mock-<scenario>.spec.ts`

For å avgrensa til éin test, køyr
* `npx playwright test tests/uforetrygd-mock-ingen-uforesak.spec.ts -g 'renders page for ingen sak'` for å køyra ein einskild test'

Legg til `--trace on` for trace, og deretter `npx playwright show-trace` og opne trace.zip under test-results/...

#### i IntelliJ 
1. Gå til **Run | Edit Configurations...**.
2. Lag ny konfigurasjon av type **Playwright**.
3. Set **Configuration file** til `din-uforetrygd-frontend/playwright.config.ts`.
4. Set **Test kind** til **File** og vel scenariofila, t.d. `tests/uforetrygd-mock-ingen-uforesak.spec.ts`.
5. Set **Working directory** til `din-uforetrygd-frontend`.
6. (Valfritt) Legg til `--project=ingen-uforesak-chromium` i **Playwright options** for å testa éin spesifikk nettlesar
7. I feltet for Environment variables må du potensielt leggja til fullstendig PATH for Node.js, t.d. `/Users/<brukarnamn>/.nvm/versions/node/v20.5.1/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin`. Dette er fordi Playwright startar Node.js i eige miljø, og då kan det hende at Node ikkje blir funne.

Merk:
- Ikkje bruk `npm run dev:*` under **Before launch**. Då ventar IntelliJ for evig på at den skal avslutta, og kjem aldri til testkøyring.
- Playwright-konfigurasjonen definerer ein webServer som køyrer på port 3000, og køyrer scenarioet mot den. Du må difor ikkje starta `npm run dev` manuelt.
- Om du har lokal next-server køyrande på same port frå før feilar playwright-køyringa med "address already in use". Stopp den lokale serveren før du køyrer Playwright.
