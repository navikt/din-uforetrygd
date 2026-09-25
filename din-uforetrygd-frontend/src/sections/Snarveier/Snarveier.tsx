import {
  BulletListIcon,
  CardIcon,
  EnvelopeClosedIcon,
  FolderFileIcon,
  HandShakeHeartIcon,
  NotePencilIcon,
  ParagraphIcon,
  PersonTallShortIcon,
  PlusMinusSlashIcon,
  WalletIcon,
} from '@navikt/aksel-icons'
import { Heading, HGrid, VStack } from '@navikt/ds-react'
import type React from 'react'
import { Innloggingstype, Visningskriterier } from '@/const'
import { env } from '@/env'
import filterShowFor, { matchNone, matchSome } from '@/utils/filterShowFor/filterShowFor'
import { leggTilPidHvisVeileder } from '@/utils/getUrl/getUrl'
import { isEnabled } from '@/utils/unleash'
import { Lenkekort } from '@/components/Lenkekort/Lenkekort'
import { MinIdDokumentModal } from '@/components/MidIdDokumentModal/MinIdDokumentModal'

interface SnarveierProps {
  visningskriterier: Visningskriterier[]
  pid: string | undefined
  innloggingstype: Innloggingstype
  skalViseDineMuligheter: boolean
  erVergePromise: Promise<boolean>
}

export const Snarveier: React.FC<SnarveierProps> = async ({
  visningskriterier,
  pid,
  innloggingstype,
  skalViseDineMuligheter,
  erVergePromise,
}) => {
  const featureVisRegelverksendringerUt2026 = await isEnabled('din.uforetrygd.forside.snarvei.regelverksendringer2026')
  const erVerge = await erVergePromise

  const lenker = filterShowFor(
    visningskriterier,
    getLinks(pid, featureVisRegelverksendringerUt2026, skalViseDineMuligheter, erVerge)
  )
  if (lenker.length === 0) return null

  return (
    <VStack as="section" gap="space-20" aria-label="Snarveier">
      <Heading level="2" size="medium">
        Snarveier
      </Heading>
      <HGrid gap="space-24" columns={{ md: 2 }}>
        {lenker.map((link) => (
          <Lenkekort
            key={link.title}
            tittel={link.title}
            undertittel={link.description}
            icon={link.icon}
            innloggingstype={innloggingstype}
            href={link.href}
            visFullmaktmodal={link.showFullmaktWarning}
            visInnloggingsmodal={link.visInnloggingsModal}
            disabled={link.disabled}
          />
        ))}

        <MinIdDokumentModal innloggingstype={innloggingstype} />
      </HGrid>
    </VStack>
  )
}

const getLinks = (
  pid: string | undefined,
  featureVisRegelverksendringerUt2026: boolean,
  skalViseDineMuligheter: boolean,
  erVerge: boolean
) => [
  {
    href: `selvbetjening/dine-muligheter${env('MODE') === 'veileder' ? `?pid=${pid}` : ''}`,
    title: 'Dine muligheter',
    description:
      'Har du mulighet, kan du jobbe, studere eller gjøre andre aktiviteter samtidig som du har uføretrygd. ',
    icon: <HandShakeHeartIcon />,
    showFor: skalViseDineMuligheter,
  },
  {
    href: env('LINK_UTBETALINGER'),
    title: 'Utbetalinger',
    description: env('MODE') === 'borger' ? 'Oversikt og detaljer' : 'Veiledere må bruke Salesforce for utbetalinger',
    icon: <WalletIcon />,
    showFor: matchNone([Visningskriterier.Uforetrygd]),
    disabled: env('MODE') === 'veileder',
  },
  {
    href: env('LINK_DOKUMENTOVERSIKT'),
    title: 'Se alle dokumentene dine',
    description: 'Alle dokumentene dine',
    icon: <FolderFileIcon />,
    showFor: true,
    visInnloggingsModal: true,
  },
  {
    href: env('LINK_SKATTETREKK'),
    title: 'Frivillig skattetrekk',
    description: 'Registrer tilleggstrekk',
    icon: <PlusMinusSlashIcon />,
    showFor: true,
  },
  {
    href: leggTilPidHvisVeileder(env('LINK_FAMILIEFORHOLD'), pid),
    title: 'Familieforhold',
    description: 'Samboerforhold, sivilstand, barn',
    icon: <PersonTallShortIcon />,
    showFor: true,
  },
  {
    href: leggTilPidHvisVeileder(env('LINK_REPRESENTASJON_TILLEGGSDATA'), pid),
    title: 'Administrer vergeforhold',
    description: 'Spesifiser brevadresse for vergemål ',
    icon: <NotePencilIcon />,
    showFor: erVerge,
    showFullmaktWarning: true,
  },
  {
    href: env('LINK_FULLMAKTER'),
    title: 'Dine fullmakter',
    description: 'Gi fullmakt og se dine fullmakter',
    icon: <BulletListIcon />,
    showFor: true,
    showFullmaktWarning: true,
  },
  {
    href: env('LINK_ETTERSENDE'),
    title: 'Ettersend dokumentasjon',
    description: 'Her kan du ettersende dokumenter om saken din',
    icon: <EnvelopeClosedIcon />,
    showFor: matchSome([Visningskriterier.SakTilBehandling, Visningskriterier.Uforetrygd]),
    showFullmaktWarning: true,
  },
  {
    href: 'https://www.nav.no/honnorkort#mangler-honnorkort',
    title: 'Honnørkort',
    description: 'Bestill nytt honnørkort hvis det gamle er mistet eller ødelagt',
    icon: <CardIcon />,
    showFor: matchSome([Visningskriterier.Uforetrygd]),
  },
  ...(featureVisRegelverksendringerUt2026
    ? [
        {
          href: env('LINK_REGELVERKSENDRINGER'),
          title: 'Regelverksendringer 2026',
          description: 'Regelendringer for uføretrygd',
          icon: <ParagraphIcon />,
          showFor: true,
        },
      ]
    : []),
]
