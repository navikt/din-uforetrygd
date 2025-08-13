import { Visningskriterier } from '@/const'
import {BodyLong, Button, GuidePanel, Heading, Link, VStack} from '@navikt/ds-react'
import styles from './uforestatusGuidePanel.module.css'

interface IUforeStatusGuidePanel {
  visningskriterier: Visningskriterier[]
}

export const UforestatusGuidePanel: React.FC<IUforeStatusGuidePanel> = async ({ visningskriterier}) => {
  if (
    visningskriterier.includes(Visningskriterier.SakTilBehandling) &&
    !visningskriterier.includes(Visningskriterier.Uforetrygd)
  ) {
    return (
      <div className={styles.guidepanelWrapper}>
        <section>
          <GuidePanel poster className={styles.tilBehandling}>
            <Heading level="2" size="medium" className={styles.uforetrygdHeading}>
              Søknaden din om uføretrygd er under behandling
            </Heading>
            <BodyLong>
              Søknad tilknyttet din uføretrygd er til behandling.
            </BodyLong>
            <BodyLong>
              <Link href={""}>Se saksbehandlingstider for uføretrygd</Link>
            </BodyLong>
            <Button
              variant="primary-neutral"
              as="a"
              href="#hendelser-expansion-card"
            >
              Se siste hendelser i saken
            </Button>
          </GuidePanel>
        </section>
      </div>
    )
  }

  if (visningskriterier.includes(Visningskriterier.IngenUforesak)) {
    return (
      <div className={styles.guidepanelWrapper}>
        <section>
          <GuidePanel poster className={styles.ingenUforetrygd}>
            <VStack gap="3">
              <Heading level="2" size="medium">
                Du har ikke uføretrygd
              </Heading>
              <BodyLong>
                Før du søker om uføretrygd må det være avklart om du har muligheter til å være i arbeid. Det er vi som
                kommer frem til dette i samarbeid med deg. Kontakt{' '}
                <Link href={""}>ditt lokale Nav-kontor</Link> for veiledning.
              </BodyLong>
            </VStack>
          </GuidePanel>
        </section>
      </div>
    )
  }

  return null
}