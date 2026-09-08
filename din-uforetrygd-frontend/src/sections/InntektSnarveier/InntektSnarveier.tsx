import { CalculatorIcon, WalletIcon } from '@navikt/aksel-icons'
import type React from 'react'
import { SnarveiPanel } from '@/components/SnarveiPanel/SnarveiPanel'
import { type Innloggingstype, Visningskriterier } from '@/const'
import { matchAll } from '@/utils/filterShowFor/filterShowFor'
import { leggTilInnloggaBrukerNavn, leggTilPidHvisVeileder } from '@/utils/getUrl/getUrl'
import styles from './inntektSnarveier.module.css'
import { serverEnv } from '@/env'

interface InntektSnarveierProps {
  visningskriterier: Visningskriterier[]
  pid: string | undefined
  innloggingstype: Innloggingstype
}

export const InntektSnarveier: React.FC<InntektSnarveierProps> = async ({
  visningskriterier,
  pid,
  innloggingstype,
}) => {
  return (
    <section aria-label="Snarvei til inntektsplanlegger og utbetalinger">
      <SnarveiPanel
        links={await getLinks(pid)}
        visningskriterier={visningskriterier}
        pid={pid}
        innloggingstype={innloggingstype}
      />
    </section>
  )
}

const getLinks = async (pid: string | undefined) => [
  {
    href: leggTilPidHvisVeileder(serverEnv.LINK_INNTEKTSPLANLEGGER, pid),
    title: 'Inntektsplanlegger',
    description: 'Meld fra om endring i inntekt',
    icon: <CalculatorIcon fontSize="2rem" className={styles.snarveiIcon} />,
    showFor: matchAll([Visningskriterier.Uforetrygd]),
    showFullmaktWarning: false,
    visInnloggingsModal: false,
  },
  {
    href: await leggTilInnloggaBrukerNavn(leggTilPidHvisVeileder(serverEnv.LINK_UTBETALINGER, pid)),
    title: 'Utbetalinger',
    description: 'Oversikt og detaljer',
    icon: <WalletIcon fontSize="2rem" className={styles.snarveiIcon} />,
    showFor: matchAll([Visningskriterier.Uforetrygd]),
    showFullmaktWarning: false,
    visInnloggingsModal: false,
  },
]
