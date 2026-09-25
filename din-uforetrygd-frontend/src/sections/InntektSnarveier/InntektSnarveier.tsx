import { CalculatorIcon, WalletIcon } from '@navikt/aksel-icons'
import type React from 'react'
import { type Innloggingstype, Visningskriterier } from '@/const'
import { env } from '@/env'
import styles from './inntektSnarveier.module.css'
import { HGrid } from '@navikt/ds-react'
import { Lenkekort } from '@/components/Lenkekort/Lenkekort'
import { leggTilPidHvisVeileder } from '@/utils/getUrl/getUrl'

interface InntektSnarveierProps {
  visningskriterier: Visningskriterier[]
  innloggingstype: Innloggingstype
  pid?: string
}

export const InntektSnarveier: React.FC<InntektSnarveierProps> = async ({
  visningskriterier,
  innloggingstype,
  pid,
}) => {
  if (!visningskriterier.includes(Visningskriterier.Uforetrygd)) return null

  return (
    <HGrid as="section" gap="space-24" columns={{ md: 2 }} aria-label="Snarvei til inntektsplanlegger og utbetalinger">
      <Lenkekort
        tittel="Inntektsplanlegger"
        undertittel="Meld fra om endring i inntekt"
        href={leggTilPidHvisVeileder(env('LINK_INNTEKTSPLANLEGGER'), pid)}
        icon={<CalculatorIcon fontSize="2rem" className={styles.snarveiIcon} />}
        innloggingstype={innloggingstype}
      />
      <Lenkekort
        tittel="Utbetalinger"
        undertittel={
          env('MODE') === 'borger' ? 'Oversikt og detaljer' : 'Veiledere må bruke Salesforce for utbetalinger'
        }
        href={env('LINK_UTBETALINGER')}
        icon={<WalletIcon fontSize="2rem" className={styles.snarveiIcon} />}
        innloggingstype={innloggingstype}
        disabled={env('MODE') === 'veileder'}
      />
    </HGrid>
  )
}
