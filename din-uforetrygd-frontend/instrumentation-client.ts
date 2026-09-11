import { initNaisAPMClient } from '@nais/apm/react'

// Kjøres tidlig i nettleseren for hele appen. Løser app-navn, versjon, miljø
// og collector-URL automatisk fra Nais. Ingenting sendes over nettverket på localhost.
initNaisAPMClient({
  namespace: 'ufore',
})
