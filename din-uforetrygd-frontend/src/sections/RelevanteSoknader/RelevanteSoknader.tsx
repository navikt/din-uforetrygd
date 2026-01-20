  import { Heading, HGrid, LinkCard, VStack } from '@navikt/ds-react'
import { Visningskriterier } from '@/const'
import filterShowFor, { matchAll } from '@/utils/filterShowFor'
import { getUrl } from '@/utils/getUrl'
import { getFullmaktCookie } from '@/api/getFullmaktCookie'
import { LinkCardAnchor, LinkCardTitle } from '@navikt/ds-react/LinkCard'
import React from 'react'

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
    <VStack
      gap="8"
      aria-label="Relevante søknader"
      style={{
        backgroundColor: 'var(--ax-bg-sunken)',
        alignSelf: 'stretch',
        width: '100vw',
        paddingTop: '2rem',
        paddingBottom: '2rem',
      }}
    >
      <div
        style={{
          maxWidth: "var(--content-width)", marginLeft: 'var(--ax-space-12)', marginRight: 'var(--ax-space-12)', margin: '0 auto',
        }}
      >
        <Heading level="2" size="medium">
          Relevante søknader
        </Heading>
        <HGrid gap="6" columns={{ md: 2 }}>
          {lenker.map((lenke) => (
            <LinkCard key={lenke.href}>
              <LinkCardTitle>
                <LinkCardAnchor href={lenke.href || ''}>{lenke.text}</LinkCardAnchor>
              </LinkCardTitle>
            </LinkCard>
          ))}
        </HGrid>
      </div>
    </VStack>
  )
}
