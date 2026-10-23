#!/usr/bin/env bash
set -euo pipefail

# Henter TokenX- og AzureAd-secrets for din-uforetrygd-backend og lagrer dem under /tmp/.
# Innholdet i /tmp slettes ved restart av maskinen.

envFile="/tmp/uforetrygd.env"
appName="din-uforetrygd-backend"
reason="Kjøre $appName lokalt"
team="ufore"
environment="dev-gcp"

declare -A secretPrefixes=(
  ["AzureAd"]="AZURE"
  ["TokenX"]="TOKEN_X"
)

envFileContainsRequiredSecretPrefixes() {
  [[ -f "$envFile" ]] || return 1

  for prefix in "${secretPrefixes[@]}"; do
    grep -q "^${prefix}" "$envFile" || return 1
  done

  return 0
}

if [[ "${1:-}" != "--force" ]] && envFileContainsRequiredSecretPrefixes; then
  echo "Secrets finnes allerede i $envFile. Kjør fetch-secrets.sh med --force for å hente secrets på nytt."
  exit 0
fi

nais login --nais -y

: > "$envFile"

echo "Starter henting av secrets for $appName..."
for secretName in "${!secretPrefixes[@]}"; do
  prefix="${secretPrefixes[$secretName]}"

  echo "Henter secrets for $secretName..."

  nais secret get \
    "$(nais app env "$appName" \
        --team "$team" \
        --environment "$environment" \
        --output json \
      | jq -r --arg prefix "$prefix" \
          'map(select(.name | startswith($prefix)) | .source.name) | unique[]')" \
    --team "$team" \
    --environment "$environment" \
    --with-values \
    --reason "$reason" \
    --output json \
  | jq -r '.data[] | "\(.key)=\(.value)"' >> "$envFile"
done

echo "Lagret secrets i $envFile"