import { Heading, Link } from '@navikt/ds-react'
import { LinkList } from '@/components/LinkList'
import { Visningskriterier } from '@/const'
import filterShowFor, { matchAll } from '@/utils/filterShowFor'
import { getUrl } from '@/utils/getUrl'
import { getFullmaktCookie } from '@/api/getFullmaktCookie'
import { getFullmaktProps } from '@/components/FullmaktHydrator'

interface IRelevanteSoknaderProps {
  visningskriterier: Visningskriterier[]
  innloggingstype: string
}

export const RelevanteSoknader: React.FC<IRelevanteSoknaderProps> = async ({ visningskriterier, innloggingstype }) => {
  const isFullmektig = (await getFullmaktCookie()) !== undefined

  const lenker = [
    {
      href: await getUrl({
        urlFromEnv: 'LINK_SOKNAD_GRADERT_UFORE',
        isFullmektig: isFullmektig,
        innloggingstype: innloggingstype,
      }),
      text: 'Søknad om endret inntektsgrense ved gradert uføretrygd',
      showFor: matchAll([Visningskriterier.GradertUfore]),
      showFullmaktWarning: false,
    },
    {
      href: await getUrl({
        urlFromEnv: 'LINK_SOKNAD_UFORE',
        isFullmektig: isFullmektig,
        innloggingstype: innloggingstype,
      }),
      text: 'Søknad om uføretrygd',
      showFor: true,
      showFullmaktWarning: false,
    },
    {
      href: await getUrl({
        urlFromEnv: 'LINK_SOKNAD_BARNETILLEGG',
        isFullmektig: isFullmektig,
        innloggingstype: innloggingstype,
      }),
      text: 'Søknad om barnetillegg til uføretrygd',
      showFor: true,
      showFullmaktWarning: false,
    },
  ]

  const relevanteLenker = filterShowFor(visningskriterier, lenker)

  if (relevanteLenker.length === 0) {
    return null
  }

  return (
    <section>
      <Heading level="2" size="medium">
        Relevante søknader
      </Heading>
      <div style={{ maxWidth: '450px' }}>
        <LinkList variant="divided">
          {relevanteLenker.map((lenke) => (
            <Link key={lenke.href} href={lenke.href} {...getFullmaktProps(lenke.showFullmaktWarning)}>
              {lenke.text}
            </Link>
          ))}
        </LinkList>
      </div>
    </section>
  )
}
