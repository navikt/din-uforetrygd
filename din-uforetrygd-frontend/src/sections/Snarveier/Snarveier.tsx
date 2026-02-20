import { Innloggingstype, Visningskriterier } from '@/const'
import React from 'react'
import { SnarveiPanel } from '@/components/SnarveiPanel/SnarveiPanel'
import { components } from '@/api/api'
import { getUrl } from '@/utils/getUrl/getUrl'
import {
  BulletListIcon,
  EnvelopeClosedIcon,
  FolderFileIcon,
  PersonTallShortIcon,
  PlusMinusSlashIcon,
  WalletIcon,
} from '@navikt/aksel-icons'
import { matchNone, matchSome } from '@/utils/filterShowFor/filterShowFor'
import { Heading, VStack } from '@navikt/ds-react'
import styles from './snarveier.module.css'

interface SnarveierProps {
  visningskriterier: Visningskriterier[]
  pid: string | undefined
  uforetrygdResponse: components['schemas']['UforetrygdResponse']
}

export const Snarveier: React.FC<SnarveierProps> = async ({ visningskriterier, pid, uforetrygdResponse }) => {
  return (
    <section aria-label="Snarveier">
      <VStack gap="space-20">
        <Heading level="2" size="medium">
          Snarveier
        </Heading>
        <SnarveiPanel
          links={await getLinks(pid, uforetrygdResponse.harGammelFullmaktmottaker!)}
          visningskriterier={visningskriterier}
          pid={pid}
          innloggingstype={uforetrygdResponse.innloggingstype as Innloggingstype}
        />
      </VStack>
    </section>
  )
}

const getLinks = async (pid: string | undefined, bprofFullmakt: boolean) => [
  {
    href: await getUrl({ urlFromEnv: 'LINK_UTBETALINGER', pid: pid }),
    title: 'Utbetalinger',
    description: 'Oversikt og detaljer',
    icon: <WalletIcon fontSize="2rem" className={styles.snarveiIcon} />,
    showFor: matchNone([Visningskriterier.Uforetrygd]),
    showFullmaktWarning: false,
    visInnloggingsModal: false,
  },
  {
    href: await getUrl({ urlFromEnv: 'LINK_DOKUMENTOVERSIKT', pid: pid }),
    title: 'Se alle dokumentene dine',
    description: 'Alle dokumentene dine',
    icon: <FolderFileIcon fontSize="2rem" className={styles.snarveiIcon} />,
    showFor: true,
    showFullmaktWarning: false,
    visInnloggingsModal: true,
  },
  {
    href: await getUrl({ urlFromEnv: 'LINK_SKATTETREKK', pid: pid }),
    title: 'Frivillig skattetrekk',
    description: 'Registrer tilleggstrekk',
    icon: <PlusMinusSlashIcon fontSize="2rem" className={styles.snarveiIcon} />,
    showFor: true,
    showFullmaktWarning: false,
    visInnloggingsModal: false,
  },
  {
    href: await getUrl({ urlFromEnv: 'LINK_FAMILIEFORHOLD', pid: pid }),
    title: 'Familieforhold',
    description: 'Samboerforhold, sivilstand, barn',
    icon: <PersonTallShortIcon fontSize="2rem" className={styles.snarveiIcon} />,
    showFor: true,
    showFullmaktWarning: false,
    visInnloggingsModal: false,
  },
  {
    href: await getUrl({ urlFromEnv: bprofFullmakt ? 'LINK_BPROF_FULLMAKTER' : 'LINK_FULLMAKTER', pid: pid }),
    title: 'Dine fullmakter',
    description: 'Gi fullmakt og se dine fullmakter',
    icon: <BulletListIcon fontSize="2rem" className={styles.snarveiIcon} />,
    showFor: true,
    showFullmaktWarning: true,
    visInnloggingsModal: false,
  },
  {
    href: await getUrl({ urlFromEnv: 'LINK_ETTERSENDE', pid: pid }),
    title: 'Ettersend dokumentasjon',
    description: 'Her kan du ettersende dokumenter om saken din',
    icon: <EnvelopeClosedIcon fontSize="2rem" className={styles.snarveiIcon} />,
    showFor: matchSome([Visningskriterier.SakTilBehandling, Visningskriterier.Uforetrygd]),
    showFullmaktWarning: true,
    visInnloggingsModal: false,
  },
]
