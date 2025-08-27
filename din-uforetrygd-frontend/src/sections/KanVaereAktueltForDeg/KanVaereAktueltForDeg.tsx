import { LinkList } from '@/components/LinkList'
import { Visningskriterier } from '@/const'
import filterShowFor, { matchAll } from '@/utils/filterShowFor'
import { Heading, Link } from '@navikt/ds-react'
import { getUrl } from '@/utils/getUrl'
import { getFullmaktProps } from '@/utils/fullmakt'
import styles from './kanVaereAktueltForDeg.module.css'

interface IKanVaereAktueltForDegProps {
  visningskriterier: Visningskriterier[]
}

const links = [
  {
    href: await getUrl({ urlFromEnv: 'LINK_LES_MER_OM_UFORETRYGD' }),
    text: 'Les om uføretrygd',
    showFor: true,
    showFullmaktWarning: false,
  },
  {
    href: await getUrl({ urlFromEnv: 'LINK_ENDRE_KONTONUMMER' }),
    text: 'Endre kontonummer',
    showFor: matchAll([Visningskriterier.Uforetrygd]),
    showFullmaktWarning: true,
  },
  {
    href: await getUrl({ urlFromEnv: 'LINK_PERSONOPPLYSNINGER' }),
    text: 'Personopplysninger',
    showFor: true,
    showFullmaktWarning: true,
  },
  {
    href: await getUrl({ urlFromEnv: 'LINK_OKONOMISKE_TILLEGG' }),
    text: 'Økonomiske tillegg og andre ordninger',
    showFor: matchAll([Visningskriterier.Uforetrygd]),
    showFullmaktWarning: false,
  },
  {
    href: await getUrl({ urlFromEnv: 'LINK_SAKSBEHANDLINGSTIDER_UFORETRYGD' }),
    text: 'Saksbehandlingstider',
    showFor: true,
    showFullmaktWarning: false,
  },
  {
    href: await getUrl({ urlFromEnv: 'LINK_KLAGE' }),
    text: 'Klage',
    showFor: true,
    showFullmaktWarning: false,
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
          <Link className={styles.aktueltForDegLenker} key={link.href} href={link.href} {...getFullmaktProps(link.showFullmaktWarning)}>
            {link.text}
          </Link>
        ))}
      </LinkList>
    </section>
  )
}
