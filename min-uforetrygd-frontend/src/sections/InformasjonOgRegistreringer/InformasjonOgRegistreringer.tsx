import { Heading, VStack } from '@navikt/ds-react'
import { Kort, KortGrid } from '@/components/Kort'
import {
  FileExportIcon,
  FileTextIcon,
  PersonGroupIcon,
  PersonPlusIcon,
  ReceiptIcon,
  WalletIcon,
} from '@navikt/aksel-icons'
import { Innloggingstype, Visningskriterier } from '@/const'
import filterShowFor, { matchAll, matchSome } from '@/utils/filterShowFor'
import { getUrl } from '@/utils/getUrl'
import { MinIdDokumentModal } from '@/components/MidIdDokumentModal/MinIdDokumentModal'

interface IInformasjonOgRegistreringerProps {
  visningskriterier: Visningskriterier[]
  pid: string | undefined
  bprofFullmakt: boolean
  innloggingstype: Innloggingstype
}

const getLinks = async (pid: string | undefined, bprofFullmakt: boolean) => [
  {
    href: await getUrl({ urlFromEnv: 'LINK_UTBETALINGER', pid: pid }),
    title: 'Utbetalinger',
    description: 'Oversikt og detaljer',
    icon: WalletIcon,
    showFor: true,
    showFullmaktWarning: false,
    visInnloggingsModal: false,
  },
  {
    href: await getUrl({ urlFromEnv: 'LINK_INNTEKTSPLANLEGGER', pid: pid }),
    title: 'Inntektsplanlegger',
    description: 'Meld fra om endring i inntekt',
    icon: FileTextIcon,
    showFor: matchAll([Visningskriterier.Uforetrygd]),
    showFullmaktWarning: false,
    visInnloggingsModal: false,
  },
  {
    href: await getUrl({ urlFromEnv: 'LINK_DOKUMENTOVERSIKT', pid: pid }),
    title: 'Se alle dokumentene dine',
    description: 'Gå til dokumenter',
    icon: FileTextIcon,
    showFor: true,
    showFullmaktWarning: false,
    visInnloggingsModal: true,
  },
  {
    href: await getUrl({ urlFromEnv: 'LINK_SKATTETREKK', pid: pid }),
    title: 'Frivillig skattetrekk',
    description: 'Registrer tilleggstrekk',
    icon: ReceiptIcon,
    showFor: true,
    showFullmaktWarning: false,
    visInnloggingsModal: false,
  },
  {
    href: await getUrl({ urlFromEnv: 'LINK_FAMILIEFORHOLD', pid: pid }),
    title: 'Familieforhold',
    description: 'Samboerforhold, sivilstand, barn',
    icon: PersonPlusIcon,
    showFor: true,
    showFullmaktWarning: false,
    visInnloggingsModal: false,
  },
  {
    href: await getUrl({ urlFromEnv: bprofFullmakt ? 'LINK_BPROF_FULLMAKTER' : 'LINK_FULLMAKTER', pid: pid }),
    title: 'Dine fullmakter',
    description: 'Gi fullmakt og se dine fullmakter',
    icon: PersonGroupIcon,
    showFor: true,
    showFullmaktWarning: true,
    visInnloggingsModal: false,
  },
  {
    href: await getUrl({ urlFromEnv: 'LINK_ETTERSENDE', pid: pid }),
    title: 'Ettersend dokumentasjon',
    description: 'Ettersend dokumenter om saken din',
    icon: FileExportIcon,
    showFor: matchSome([Visningskriterier.SakTilBehandling, Visningskriterier.Uforetrygd]),
    showFullmaktWarning: true,
    visInnloggingsModal: false,
  },
]

export const InformasjonOgRegistreringer: React.FC<IInformasjonOgRegistreringerProps> = async (props) => {
  const links = await getLinks(props.pid, props.bprofFullmakt)
  const relevantLinks = filterShowFor(props.visningskriterier, links)
  return (
    <section>
      <VStack gap="5">
        <Heading level="2" size="medium">
          Snarveier
        </Heading>
        <KortGrid>
          {relevantLinks.map((link) => (
            <Kort
              key={link.title}
              title={link.title}
              description={link.description}
              href={link.href ?? ''}
              icon={link.icon}
              showFullmaktWarning={link.showFullmaktWarning}
              visInnloggingsModal={link.visInnloggingsModal}
              innloggingstype={props.innloggingstype}
            />
          ))}
          <MinIdDokumentModal innloggingstype={props.innloggingstype} />
        </KortGrid>
      </VStack>
    </section>
  )
}
