import { Heading, VStack } from '@navikt/ds-react'
import { Kort, KortGrid } from '@/components/Kort'
import {
  EnvelopeClosedIcon,
  FileExportIcon,
  FileTextIcon,
  PersonGroupIcon,
  PersonPlusIcon,
  ReceiptIcon,
  SackKronerIcon,
} from '@navikt/aksel-icons'
import { Visningskriterier } from '@/const'
import filterShowFor, { matchAll, matchSome } from '@/utils/filterShowFor'
import { getUrl } from '@/utils/getUrl'

interface IInformasjonOgRegistreringerProps {
  visningskriterier: Visningskriterier[]
  pid: string | undefined
  bprofFullmakt: boolean
}

const getLinks = async (pid: string | undefined, bprofFullmakt: boolean) => [
  {
    href: await getUrl({ urlFromEnv: 'LINK_UTBETALINGER', pid: pid }),
    title: 'Utbetalinger',
    description: 'Oversikt og detaljer',
    icon: SackKronerIcon,
    showFor: true,
  },
  {
    href: await getUrl({ urlFromEnv: 'LINK_BREV', pid: pid }),
    title: 'Brev',
    description: 'Vedtak med mer',
    icon: EnvelopeClosedIcon,
    showFor: true,
  },
  {
    href: await getUrl({ urlFromEnv: 'LINK_INNTEKTSPLANLEGGER', pid: pid }),
    title: 'Inntektsplanlegger',
    description: 'Meld fra om endring i inntekt',
    icon: FileTextIcon,
    showFor: matchAll([Visningskriterier.Uforetrygd]),
  },
  {
    href: await getUrl({ urlFromEnv: 'LINK_SAKER', pid: pid }),
    title: 'Sakene dine',
    description: 'Status på søknader og vedtak',
    icon: FileTextIcon,
    showFor: true,
  },
  {
    href: await getUrl({ urlFromEnv: 'LINK_SKATTETREKK', pid: pid }),
    title: 'Frivillig skattetrekk',
    description: 'Registrer tilleggstrekk',
    icon: ReceiptIcon,
    showFor: true,
  },
  {
    href: await getUrl({ urlFromEnv: 'LINK_FAMILIEFORHOLD', pid: pid }),
    title: 'Famileforhold',
    description: 'Samboerforhold, sivilstand, barn',
    icon: PersonPlusIcon,
    showFor: true,
  },
  {
    href: await getUrl({ urlFromEnv: bprofFullmakt ? 'LINK_BPROF_FULLMAKTER' : 'LINK_FULLMAKTER', pid: pid }),
    title: 'Dine fullmakter',
    description: 'Gi fullmakt og se dine fullmakter',
    icon: PersonGroupIcon,
    showFor: true,
  },
  {
    href: await getUrl({ urlFromEnv: 'LINK_ETTERSENDE', pid: pid }),
    title: 'Ettersend dokumentasjon',
    description: 'Til uføresaken din',
    icon: FileExportIcon,
    showFor: matchSome([Visningskriterier.SakTilBehandling, Visningskriterier.Uforetrygd]),
  },
]

export const InformasjonOgRegistreringer: React.FC<IInformasjonOgRegistreringerProps> = async (props) => {
  const links = await getLinks(props.pid, props.bprofFullmakt)
  const relevantLinks = filterShowFor(props.visningskriterier, links)
  return (
    <section>
      <VStack gap="5">
        <Heading level="2" size="medium">
          Informasjon og registreringer
        </Heading>
        <KortGrid>
          {relevantLinks.map((link) => (
            <Kort
              key={link.title}
              title={link.title}
              description={link.description}
              href={link.href ?? ''}
              icon={link.icon}
            />
          ))}
        </KortGrid>
      </VStack>
    </section>
  )
}
