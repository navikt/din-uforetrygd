import { Innloggingstype, Visningskriterier } from '@/const'
import React from 'react'
import { SnarveiPanel } from '@/components/SnarveiPanel'
import { components } from '@/api/api'
import { getUrl } from '@/utils/getUrl'
import {
  FileExportIcon,
  FileTextIcon,
  PersonGroupIcon,
  PersonPlusIcon,
  ReceiptIcon,
  WalletIcon,
} from '@navikt/aksel-icons'
import { matchNone, matchSome } from '@/utils/filterShowFor'
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
      <VStack gap="5">
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
    description: 'Gå til dokumenter',
    icon: <FileTextIcon fontSize="2rem" className={styles.snarveiIcon} />,
    showFor: true,
    showFullmaktWarning: false,
    visInnloggingsModal: true,
  },
  {
    href: await getUrl({ urlFromEnv: 'LINK_SKATTETREKK', pid: pid }),
    title: 'Frivillig skattetrekk',
    description: 'Registrer tilleggstrekk',
    icon: <ReceiptIcon fontSize="2rem" className={styles.snarveiIcon} />,
    showFor: true,
    showFullmaktWarning: false,
    visInnloggingsModal: false,
  },
  {
    href: await getUrl({ urlFromEnv: 'LINK_FAMILIEFORHOLD', pid: pid }),
    title: 'Familieforhold',
    description: 'Samboerforhold, sivilstand, barn',
    icon: <PersonPlusIcon fontSize="2rem" className={styles.snarveiIcon} />,
    showFor: true,
    showFullmaktWarning: false,
    visInnloggingsModal: false,
  },
  {
    href: await getUrl({ urlFromEnv: bprofFullmakt ? 'LINK_BPROF_FULLMAKTER' : 'LINK_FULLMAKTER', pid: pid }),
    title: 'Dine fullmakter',
    description: 'Gi fullmakt og se dine fullmakter',
    icon: <PersonGroupIcon fontSize="2rem" className={styles.snarveiIcon} />,
    showFor: true,
    showFullmaktWarning: true,
    visInnloggingsModal: false,
  },
  {
    href: await getUrl({ urlFromEnv: 'LINK_ETTERSENDE', pid: pid }),
    title: 'Ettersend dokumentasjon',
    description: 'Ettersend dokumenter om saken din',
    icon: <FileExportIcon fontSize="2rem" className={styles.snarveiIcon} />,
    showFor: matchSome([Visningskriterier.SakTilBehandling, Visningskriterier.Uforetrygd]),
    showFullmaktWarning: true,
    visInnloggingsModal: false,
  },
]
