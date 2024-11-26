'use client'
import styles from './RepresentasjonBanner.module.css'

export const RepresentasjonBanner = () => {
  // Selv om komponenten er 'use client' vil next prøve å rendere den på serveren, og da vil window.location.origin være undefined.
  return (
    <div className={styles.representasjonBannerWrapper}>
      <representasjon-banner
        className={styles.representasjonBanner}
        representasjonstyper="PENSJON_FULLSTENDIG,PENSJON_BEGRENSET,UFORETRYGD_LES"
        redirectTo={`${window.location.origin}/uforetrygd/selvbetjening`}
      ></representasjon-banner>
    </div>
  )
}

export default RepresentasjonBanner
