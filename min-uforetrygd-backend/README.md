# Uforetrygd-backend
## API Documentation

## How to run locally
Set the following env variables:
* AZURE_APP_CLIENT_SECRET
* TOKEN_X_PRIVATE_JWK

Or use EnvFile - se fetch-secrets.sh

URL: http://localhost:8080/api/initiate

### Tokens for test
#### TokenX (Innbygger)
https://tokenx-token-generator.intern.dev.nav.no/api/obo?aud=dev-gcp:pensjonselvbetjening:uforetrygd-backend
#### Azure AD (Veileder)
https://azure-token-generator.intern.dev.nav.no/api/obo?aud=dev-gcp:pensjonselvbetjening:uforetrygd-backend