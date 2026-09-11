'use client'

// @nais/apm/react (v0.4.0, pre-1.0) eksporterer ApmErrorBoundary som en class component,
// men filen mangler et eget 'use client'-direktiv. Next.js sin RSC-bundler antar da at
// modulen er trygg å kjøre server-side, noe som feiler siden React.Component ikke finnes
// i server-runtimen ("Class extends value undefined is not a constructor").
// Ved å re-eksportere komponenten herfra (i en fil markert 'use client') tvinges hele
// kjeden inn i client-bundlet, slik at den kan importeres trygt fra server-komponenter
// som layout.tsx. Fjern denne wrapperen når @nais/apm retter direktivet oppstrøms.
export { ApmErrorBoundary } from '@nais/apm/react'
