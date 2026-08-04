# din-uforetrygd-frontend

### prettier

For automatisk formatering av kode gå til Preferences -> Languages & Framework -> Javascript -> Prettier.
Klikk på Manual Prettier Configurations.
Sett prettier package til prettier i `node_modules`. Klikk på "Run on 'reformat code'" og "Run on save"

## Lokal utvikling

Installere: `npm i`

For å få kontakt med Unleash lokalt må miljøvariablen `UNLEASH_SERVER_API_TOKEN` settes og [denne koden](https://github.com/navikt/din-uforetrygd/blob/20de619ef3af0361bbc1578515dffccd9bf6ebe7/din-uforetrygd-frontend/src/utils/unleash.ts#L7-L9) kommenteres ut. Verdien finner du på [Ufore sin Unleash](https://ufore-unleash-web.iap.nav.cloud.nais.io) under Project settings > API access.


### Mock backend
* Kjør `npm run dev` for standard lokal utvikling (starter både Next.js og mock-backend).
* Scenario-skript (`npm run dev:ingen-uforesak`, `npm run dev:avsluttet`, osv.) starter også mock-backend automatisk.
* Playwright bruker eigen oppstart via `npm run dev:playwright` frå `playwright.config.ts`.

### Playwright-testar

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
