import { Heading, Link } from '@navikt/ds-react'
import { LinkList } from '@/components/LinkList/LinkList'
import { Visningskriterier } from '@/const'
import { env } from '@/env'
import filterShowFor, { matchAll } from '@/utils/filterShowFor/filterShowFor'
import { getFullmaktProps } from '@/utils/fullmakt'
import styles from './kanVaereAktueltForDeg.module.css'

interface IKanVaereAktueltForDegProps {
  visningskriterier: Visningskriterier[]
}

export const KanVaereAktueltForDeg: React.FC<IKanVaereAktueltForDegProps> = (props) => {
  const links = [
    {
      href: env().LINK_LES_MER_OM_UFORETRYGD,
      text: 'Les om uføretrygd',
      showFor: true,
      showFullmaktWarning: false,
    },
    {
      href: env().LINK_ENDRE_KONTONUMMER,
      text: 'Endre kontonummer',
      showFor: matchAll([Visningskriterier.Uforetrygd]),
      showFullmaktWarning: true,
    },
    {
      href: env().LINK_PERSONOPPLYSNINGER,
      text: 'Personopplysninger',
      showFor: true,
      showFullmaktWarning: true,
    },
    {
      href: env().LINK_OKONOMISKE_TILLEGG,
      text: 'Økonomiske tillegg og andre ordninger',
      showFor: matchAll([Visningskriterier.Uforetrygd]),
      showFullmaktWarning: false,
    },
    {
      href: env().LINK_SAKSBEHANDLINGSTIDER_UFORETRYGD,
      text: 'Saksbehandlingstider',
      showFor: true,
      showFullmaktWarning: false,
    },
    {
      href: env().LINK_KLAGE,
      text: 'Klage',
      showFor: true,
      showFullmaktWarning: false,
    },
  ]

  const aktueltForDegLenker = filterShowFor(props.visningskriterier, links)

  return (
    <section aria-label="Aktuelt for deg">
      <Heading level="2" size="medium">
        Kan være aktuelt for deg
      </Heading>
      <LinkList>
        {aktueltForDegLenker.map((link) => (
          <Link
            className={styles.aktueltForDegLenker}
            key={link.href}
            href={link.href}
            {...getFullmaktProps(link.showFullmaktWarning)}
          >
            {link.text}
          </Link>
        ))}
      </LinkList>
    </section>
  )
}
