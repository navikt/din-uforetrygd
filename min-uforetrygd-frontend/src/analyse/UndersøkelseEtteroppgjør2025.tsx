'use client'

import Script from 'next/script'

export default function UndersøkelseEtteroppgjør2025() {
  return (
    <>
      <Script id="skyra-config" strategy="afterInteractive">
        {`window.SKYRA_CONFIG = {
           org: 'arbeids-og-velferdsetaten-nav',
      }`}
      </Script>
      <Script src="https://survey.skyra.no/skyra-survey.js" defer strategy="afterInteractive" />
      {/* @ts-expect-error ikke typet */}
      <skyra-survey slug="arbeids-og-velferdsetaten-nav/ufore-etteroppgjor-2025"></skyra-survey>
    </>
  )
}
