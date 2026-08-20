# Henter secrets for din-uforetrygd-backend og lagrer de under /private/tmp/ - her slettes alt ved restart av mac
# Sett opp 2run configuration" til å "Enable EnvFile" - og pek på rett fil
# Fungerer for mac.. (pga /private/tmp/)
currentDir=$(pwd)
cd /private/tmp/

nais secret get \
    "$(nais app env din-uforetrygd-backend --environment dev-gcp --output json \
              | jq -r '[.[] | select(.name | test("^(AZURE_)")) | .source.name] | unique[]')" \
    --environment dev-gcp --with-values --reason "Testmiljø" --output json | jq -r '.data[] | "\(.key)=\(.value)"' > uforetrygd.env

nais secret get \
    "$(nais app env din-uforetrygd-backend --environment dev-gcp --output json \
              | jq -r '[.[] | select(.name | test("^(TOKEN_X_)")) | .source.name] | unique[]')" \
    --environment dev-gcp --with-values --reason "Testmiljø" --output json | jq -r '.data[] | "\(.key)=\(.value)"' >> uforetrygd.env

cd $currentDir