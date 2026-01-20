import { Innloggingstype, Visningskriterier } from '@/const'
import React from 'react'
import { SnarveiPanel } from '@/components/SnarveiPanel'
import { getUrl } from '@/utils/getUrl'
import { FileTextIcon, WalletIcon } from '@navikt/aksel-icons'
import { matchAll } from '@/utils/filterShowFor'
import styles from './inntektSnarveier.module.css'

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
    href: await getUrl({ urlFromEnv: 'LINK_INNTEKTSPLANLEGGER', pid }),
    title: 'Inntektsplanlegger',
    description: 'Meld fra om endring i inntekt',
    icon: <FileTextIcon fontSize="2rem" className={styles.snarveiIcon} />,
    showFor: matchAll([Visningskriterier.Uforetrygd]),
    showFullmaktWarning: false,
    visInnloggingsModal: false,
  },
  {
    href: await getUrl({ urlFromEnv: 'LINK_UTBETALINGER', pid }),
    title: 'Utbetalinger',
    description: 'Oversikt og detaljer',
    icon: <WalletIcon fontSize="2rem" className={styles.snarveiIcon} />,
    showFor: matchAll([Visningskriterier.Uforetrygd]),
    showFullmaktWarning: false,
    visInnloggingsModal: false,
  }
];