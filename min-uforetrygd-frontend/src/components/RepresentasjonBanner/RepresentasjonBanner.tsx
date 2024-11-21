'use client'
export const RepresentasjonBanner = () => {
  return (
    <representasjon-banner
      representasjonstyper="PENSJON_FULLSTENDIG,PENSJON_BEGRENSET,UFORETRYGD_LES"
      redirectTo={`${window.location.origin}/uforetrygd/selvbetjening`}
    ></representasjon-banner>
  )
}
