import { Heading, LinkCard } from '@navikt/ds-react'
import { LinkCardAnchor, LinkCardTitle } from '@navikt/ds-react/LinkCard'
import { getFullmaktCookie } from '@/api/getFullmaktCookie'
import { Visningskriterier } from '@/const'
import { env } from '@/env'
import filterShowFor, { matchAll } from '@/utils/filterShowFor/filterShowFor'
import { getFullmaktProps } from '@/utils/fullmakt'
import styles from './relevanteSoknader.module.css'

interface IRelevanteSoknaderProps {
  visningskriterier: Visningskriterier[]
  innloggingstype: string
}

const digitalSøknadHvisHøyInnlogging = (url: string, erFullmektig: boolean, innloggingstype: string): string => {
  if (env('MODE') === 'veileder') return url

  const søknadPåPapir = `${url}?sub=paper`
  const digitalSøknad = `${url}?sub=digital`

  return erFullmektig || innloggingstype === 'LEVEL3' ? søknadPåPapir : digitalSøknad
}

export const RelevanteSoknader: React.FC<IRelevanteSoknaderProps> = async ({ visningskriterier, innloggingstype }) => {
  const erFullmektig = (await getFullmaktCookie()) !== undefined

  const lenker = [
    {
      href: digitalSøknadHvisHøyInnlogging(env('LINK_SOKNAD_UFORE'), erFullmektig, innloggingstype),
      text: 'Søknad om uføretrygd',
      showFor: true,
      showFullmaktWarning: false,
    },
    {
      href: digitalSøknadHvisHøyInnlogging(env('LINK_SOKNAD_BARNETILLEGG'), erFullmektig, innloggingstype),
      text: 'Søknad om barnetillegg til uføretrygd',
      showFor: true,
      showFullmaktWarning: false,
    },
    {
      href: digitalSøknadHvisHøyInnlogging(env('LINK_SOKNAD_GRADERT_UFORE'), erFullmektig, innloggingstype),
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
