'use client'

export const RepresentasjonBanner = () => {
  // Selv om komponenten er 'use client' vil next prøve å rendere den på serveren, og da vil window.location.origin være undefined.
  if (!window.location.origin) return
  return (
    <representasjon-banner
      representasjonstyper="PENSJON_FULLSTENDIG,PENSJON_BEGRENSET,UFORETRYGD_LES"
      redirectTo={`${window.location.origin}/uforetrygd/selvbetjening`}
    ></representasjon-banner>
  )
}
