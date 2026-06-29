import {
  BriefcaseIcon,
  BulletListIcon,
  CardIcon,
  EnvelopeClosedIcon,
  FolderFileIcon,
  NotePencilIcon,
  ParagraphIcon,
  PersonTallShortIcon,
  PlusMinusSlashIcon,
  WalletIcon,
} from '@navikt/aksel-icons'
import { Heading, VStack } from '@navikt/ds-react'
import type React from 'react'
import type { components } from '@/api/api'
import { SnarveiPanel } from '@/components/SnarveiPanel/SnarveiPanel'
import { type Innloggingstype, Visningskriterier } from '@/const'
import { matchAll, matchNone, matchSome } from '@/utils/filterShowFor/filterShowFor'
import { getUrl } from '@/utils/getUrl/getUrl'
import { isEnabled } from '@/utils/unleash'
import styles from './snarveier.module.css'

interface SnarveierProps {
  visningskriterier: Visningskriterier[]
  pid: string | undefined
  uforetrygdResponse: components['schemas']['UforetrygdResponse']
  skalViseDineMuligheter: boolean
}

export const Snarveier: React.FC<SnarveierProps> = async ({
  visningskriterier,
  pid,
  uforetrygdResponse,
  skalViseDineMuligheter,
}) => {
  const featureVisRegelverksendringerUt2026 = await isEnabled('din.uforetrygd.forside.snarvei.regelverksendringer2026')

  return (
    <section aria-label="Snarveier">
      <VStack gap="space-20">
        <Heading level="2" size="medium">
          Snarveier
        </Heading>
        <SnarveiPanel
          links={
            await getLinks(
              pid,
              featureVisRegelverksendringerUt2026,
              skalViseDineMuligheter
            )
          }
          visningskriterier={visningskriterier}
          pid={pid}
          innloggingstype={uforetrygdResponse.innloggingstype as Innloggingstype}
        />
      </VStack>
    </section>
  )
}

const getLinks = async (
  pid: string | undefined,
  featureVisRegelverksendringerUt2026: boolean,
  skalViseDineMuligheter: boolean
) => [
  {
    href: 'selvbetjening/dine-muligheter',
    title: 'Dine muligheter',
    description:
      'Har du mulighet, kan du jobbe, studere eller gjøre andre aktiviteter samtidig som du har uføretrygd. ',
    icon: <BriefcaseIcon fontSize="2rem" className={styles.snarveiIcon} />,
    showFor: skalViseDineMuligheter,
    showFullmaktWarning: false,
    visInnloggingsModal: false,
  },
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
    href: await getUrl({ urlFromEnv: 'LINK_REPRESENTASJON_TILLEGGSDATA', pid: pid }),
    title: 'Administrer vergeforhold',
    description: 'Spesifiser brevadresse for vergemål ',
    icon: <NotePencilIcon fontSize="2rem" className={styles.snarveiIcon} />,
    showFor: matchAll([Visningskriterier.ErVerge]),
    showFullmaktWarning: true,
    visInnloggingsModal: false,
  },
  {
    href: await getUrl({
      urlFromEnv: 'LINK_FULLMAKTER',
      pid: pid,
    }),
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
  {
    href: 'https://www.nav.no/honnorkort#mangler-honnorkort',
    title: 'Honnørkort',
    description: 'Bestill nytt honnørkort hvis det gamle er mistet eller ødelagt',
    icon: <CardIcon fontSize="2rem" className={styles.snarveiIcon} />,
    showFor: matchSome([Visningskriterier.Uforetrygd]),
    showFullmaktWarning: false,
    visInnloggingsModal: false,
  },
  ...(featureVisRegelverksendringerUt2026
    ? [
        {
          href: await getUrl({
            urlFromEnv: 'LINK_REGELVERKSENDRINGER',
            pid: pid,
          }),
          title: 'Regelverksendringer 2026',
          description: 'Regelendringer for uføretrygd',
          icon: <ParagraphIcon fontSize="2rem" className={styles.snarveiIcon} />,
          showFor: true,
          showFullmaktWarning: false,
          visInnloggingsModal: false,
        },
      ]
    : []),
]
