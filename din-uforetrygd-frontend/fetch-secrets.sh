#!/usr/bin/env bash
set -euo pipefail

envFile=".env.local"
appName="din-uforetrygd-frontend"
sourceName="$appName-unleash-api-token"
reason="Kjøre $appName lokalt"
team="ufore"
environment="dev-gcp"

touch "$envFile"

updateEnvVariable() {
  local key="$1"
  local value="$2"

  # Oppdater eksisterende verdi hvis den finnes, ellers legg til ny variabel
  if grep -q "^$key=" "$envFile"; then
    sed -i.bak "s|^$key=.*|$key=$value|" "$envFile"
    rm -f "$envFile.bak"
  else
    echo "${key}=${value}" >> "$envFile"
  fi
}

accessToken=$(printf 'n\n' | nais auth print-access-token --nais 2>/dev/null)

# Logg inn hvis output ikke inneholder en gyldig JWT.
if [[ ! "$accessToken" =~ ^eyJ[^.]+\.[^.]+\..+ ]]; then
  nais login --nais -y
fi

echo "Henter secrets for Unleash..."

nais secret get "$sourceName" \
  --team "$team" \
  --environment "$environment" \
  --with-values \
  --reason "$reason" \
  --output json |
  jq -r '.data[] | "\(.key)=\(.value)"' |
  while IFS='=' read -r key value; do
    updateEnvVariable "$key" "$value"
  done

echo "Lagret secrets i $envFile"