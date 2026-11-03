#!/usr/bin/env bash
set -euo pipefail

scriptDir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
envFile="$scriptDir/.env.local"
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

envFileContainsRequiredSecretPrefixes() {
  [[ -f "$envFile" ]] || return 1

  for prefix in "UNLEASH"; do
    grep -q "^${prefix}" "$envFile" || return 1
  done

  return 0
}

if [[ "${1:-}" != "--force" ]] && envFileContainsRequiredSecretPrefixes; then
  echo "Secrets finnes allerede i $envFile. Kjør fetch-secrets.sh med --force for å hente secrets på nytt."
  exit 0
fi
  
nais login --nais -y

echo "Henter secrets for $appName..."

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