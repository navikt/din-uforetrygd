import { Heading } from '@navikt/ds-react'
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
}

const getLinks = async (pid: string | undefined) => [
  {
    href: await getUrl('LINK_UTBETALINGER', pid),
    title: 'Utbetalinger',
    description: 'Oversikt og detaljer',
    icon: SackKronerIcon,
    showFor: true,
  },
  {
    href: await getUrl('LINK_BREV', pid),
    title: 'Brev for uføretrygd',
    description: 'Vedtak med mer',
    icon: EnvelopeClosedIcon,
    showFor: true,
  },
  {
    href: await getUrl('LINK_INNTEKTSPLANLEGGER', pid),
    title: 'Inntektsplanlegger',
    description: 'Meld fra om endring i inntekt',
    icon: FileTextIcon,
    showFor: matchAll([Visningskriterier.Uforetrygd]),
  },
  {
    href: await getUrl('LINK_SAKER', pid),
    title: 'Sakene dine',
    description: 'Status på søknader og vedtak',
    icon: FileTextIcon,
    showFor: true,
  },
  {
    href: await getUrl('LINK_SKATTETREKK', pid),
    title: 'Frivillig skattetrekk',
    description: 'Registrer tilleggstrekk',
    icon: ReceiptIcon,
    showFor: matchAll([Visningskriterier.Uforetrygd]),
  },
  {
    href: await getUrl('LINK_FAMILIEFORHOLD', pid),
    title: 'Famileforhold',
    description: 'Samboerforhold, sivilstand, barn',
    icon: PersonPlusIcon,
    showFor: true,
  },
  {
    href: await getUrl('LINK_FULLMAKTER', pid),
    title: 'Dine fullmakter',
    description: 'Gi fullmakt og se dine fullmakter',
    icon: PersonGroupIcon,
    showFor: true,
  },
  {
    href: await getUrl('LINK_ETTERSENDE', pid),
    title: 'Ettersend informasjon',
    description: 'Til uføresaken din',
    icon: FileExportIcon,
    showFor: matchSome([Visningskriterier.UforesoknadTilBehandling, Visningskriterier.Uforetrygd]),
  },
]

export const InformasjonOgRegistreringer: React.FC<IInformasjonOgRegistreringerProps> = async (props) => {
  const links = await getLinks(props.pid)
  const relevantLinks = filterShowFor(props.visningskriterier, links)
  return (
    <section>
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
    </section>
  )
}
