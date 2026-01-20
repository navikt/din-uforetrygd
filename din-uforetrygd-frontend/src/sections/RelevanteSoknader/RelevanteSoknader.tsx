import { Heading, LinkCard } from '@navikt/ds-react'
import { Visningskriterier } from '@/const'
import filterShowFor, { matchAll } from '@/utils/filterShowFor'
import { getUrl } from '@/utils/getUrl'
import { getFullmaktCookie } from '@/api/getFullmaktCookie'
import { getFullmaktProps } from '@/utils/fullmakt'
import styles from './relevanteSoknader.module.css'
import { LinkCardAnchor, LinkCardTitle } from '@navikt/ds-react/LinkCard'

interface IRelevanteSoknaderProps {
  visningskriterier: Visningskriterier[]
  innloggingstype: string
}

export const RelevanteSoknader: React.FC<IRelevanteSoknaderProps> = async ({ visningskriterier, innloggingstype }) => {
  const isFullmektig = (await getFullmaktCookie()) !== undefined

  const lenker = [
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
  ]

  const relevanteLenker = filterShowFor(visningskriterier, lenker)

  if (relevanteLenker.length === 0) {
    return null
  }

  return (
    <section aria-label={'Relevante søknader'} className={styles.relevantesoknaderSection}>
      <div className={styles.relevanteSoknaderContent}>
        <Heading level="2" size="medium">
          Relevante søknader
        </Heading>
        <div className={styles.relevanteSoknaderLenker}>
          {relevanteLenker.map(
            (lenke) =>
              lenke.href && (
                <LinkCard key={lenke.href} {...getFullmaktProps(lenke.showFullmaktWarning)}>
                  <LinkCardTitle>
                    <LinkCardAnchor href={lenke.href}>{lenke.text}</LinkCardAnchor>
                  </LinkCardTitle>
                </LinkCard>
              )
          )}
        </div>
      </div>
    </section>
  )
}
