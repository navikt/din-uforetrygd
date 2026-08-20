# Henter TokenX- og AzureAd-secrets for din-uforetrygd-backend og lagrer de under /tmp/ - her slettes alt ved restart av maskinen

envFile="/tmp/uforetrygd.env"
reason="Kjøre din-uforetrygd-backend lokalt"

nais login --nais -y

echo "Henter AzureAd secrets..."
nais secret get \
    "$(nais app env din-uforetrygd-backend --environment dev-gcp --output json \
              | jq -r 'map(select(.name | startswith("AZURE_")) | .source.name) | unique[]')" \
    --environment dev-gcp --with-values --reason "$reason" --output json | jq -r '.data[] | "\(.key)=\(.value)"' > $envFile

echo "Henter TokenX secrets..."
nais secret get \
    "$(nais app env din-uforetrygd-backend --environment dev-gcp --output json \
              | jq -r 'map(select(.name | startswith("TOKEN_X_")) | .source.name) | unique[]')" \
      --environment dev-gcp --with-values --reason "$reason" --output json | jq -r '.data[] | "\(.key)=\(.value)"' >> $envFile

echo "Lagret secrets i $envFile"