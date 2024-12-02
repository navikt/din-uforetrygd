# Henter secrets for uforetrygd-backend og lagrer de under /private/tmp/ - her slettes alt ved restart av mac
# Sett opp 2run configuration" til å "Enable EnvFile" - og pek på rett fil
# Fungerer for mac.. (pga /private/tmp/)
currentDir=$(pwd)
cd /private/tmp/
node $currentDir/../utils/fetch-secrets-to-env/dist/fetch-secrets.js pensjonselvbetjening uforetrygd-backend azure,tokenx uforetrygd.env
cd $currentDir
