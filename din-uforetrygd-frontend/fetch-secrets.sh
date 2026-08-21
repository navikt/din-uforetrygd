#!/usr/bin/env bash

envFile=".env.local"

touch "$envFile"

updateEnvVariable() {
  local key="$1"
  local value="$2"

  if grep -q "^$key=" "$envFile"; then
    # Oppdater eksisterende verdi
    sed -i.bak "s|^$key=.*|$key=$value|" "$envFile"
    rm -f "$envFile.bak"
  else
    # Legg til ny variabel
    echo "${key}=${value}" >> "$envFile"
  fi
}

echo "Henter secrets for Unleash..."

nais secret get din-uforetrygd-frontend-unleash-api-token \
  --team ufore \
  --environment dev-gcp \
  --with-values \
  --reason "Kjøre appen lokalt" \
  --output json |
  jq -r '.data[] | "\(.key)=\(.value)"' |
  while IFS='=' read -r key value; do
    updateEnvVariable "$key" "$value"
  done

echo "Lagret secrets i $envFile"