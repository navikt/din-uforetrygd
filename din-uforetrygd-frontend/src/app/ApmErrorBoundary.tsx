'use client'

// @nais/apm/react mangler 'use client', som gjør at Next.js feilaktig forsøker å
// kjøre ApmErrorBoundary server-side. Denne wrapperen tvinger komponenten inn i
// client-bundlet og kan fjernes når dette rettes i @nais/apm.
export { ApmErrorBoundary } from '@nais/apm/react'
