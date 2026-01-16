# din-uforetrygd-frontend

### prettier

For automatisk formatering av kode gå til Preferences -> Languages & Framework -> Javascript -> Prettier.
Klikk på Manual Prettier Configurations.
Sett prettier package til prettier i `node_modules`. Klikk på "Run on 'reformat code'" og "Run on save"

## Lokal utvikling

Installere: `npm i`

For å få kontakt med Unleash lokalt må miljøvariablen `UNLEASH_SERVER_API_TOKEN` settes og [denne koden](https://github.com/navikt/din-uforetrygd/blob/20de619ef3af0361bbc1578515dffccd9bf6ebe7/din-uforetrygd-frontend/src/utils/unleash.ts#L7-L9) kommenteres ut. Verdien finner du på [Ufore sin Unleash](https://ufore-unleash-web.iap.nav.cloud.nais.io) under Project settings > API access.


### Mock backend
* Kjør `npm run dev` eller klikk på run knappen i IntelliJ ved siden av skriptet i `package.json`
