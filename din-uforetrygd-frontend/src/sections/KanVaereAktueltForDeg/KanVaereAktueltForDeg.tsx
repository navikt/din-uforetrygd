import { LinkList } from '@/components/LinkList'
import { Visningskriterier } from '@/const'
import filterShowFor, { matchAll } from '@/utils/filterShowFor'
import { Heading, Link } from '@navikt/ds-react'
import { getUrl } from '@/utils/getUrl'

interface IKanVaereAktueltForDegProps {
  visningskriterier: Visningskriterier[]
}

const links = [
  {
    href: await getUrl({ urlFromEnv: 'LINK_LES_MER_OM_UFORETRYGD' }),
    text: 'Les mer om uføretrygd',
    showFor: true,
  },
  {
    href: await getUrl({ urlFromEnv: 'LINK_ENDRE_KONTONUMMER' }),
    text: 'Endre kontonummer',
    showFor: matchAll([Visningskriterier.Uforetrygd]),
  },
  {
    href: await getUrl({ urlFromEnv: 'LINK_PERSONOPPLYSNINGER' }),
    text: 'Personopplysninger',
    showFor: true,
  },
  {
    href: await getUrl({ urlFromEnv: 'LINK_OKONOMISKE_TILLEGG' }),
    text: 'Økonomiske tillegg og andre ordninger',
    showFor: matchAll([Visningskriterier.Uforetrygd]),
  },
  {
    href: await getUrl({ urlFromEnv: 'LINK_KLAGE' }),
    text: 'Klage',
    showFor: true,
  },
]

export const KanVaereAktueltForDeg: React.FC<IKanVaereAktueltForDegProps> = (props) => {
  const aktueltForDegLenker = filterShowFor(props.visningskriterier, links)
  return (
    <section>
      <Heading level="2" size="medium">
        Kan være aktuelt for deg
      </Heading>
      <LinkList>
        {aktueltForDegLenker.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.text}
          </Link>
        ))}
      </LinkList>
    </section>
  )
}
