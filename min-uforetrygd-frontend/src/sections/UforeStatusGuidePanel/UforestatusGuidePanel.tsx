import { Visningskriterier } from '@/const'
import { BodyLong, GuidePanel, Heading, Link, List, VStack } from '@navikt/ds-react'
import { ListItem } from '@navikt/ds-react/List'
import styles from './uforestatusGuidePanel.module.css'
import { getUrl } from '@/utils/getUrl'

interface IUforeStatusGuidePanel {
  visningskriterier: Visningskriterier[]
  pid: string | undefined
}

export const UforestatusGuidePanel: React.FC<IUforeStatusGuidePanel> = async ({ visningskriterier, pid }) => {
  if (visningskriterier.includes(Visningskriterier.UforesoknadTilBehandling)) {
    const saksbehandlingstiderLenke = await getUrl({ urlFromEnv: 'LINK_SAKSBEHANDLINGSTIDER_UFORETRYGD' })
    const saksoversiktLenke = await getUrl({ urlFromEnv: 'LINK_SAKER', pid: pid })
    return (
      <section>
        <GuidePanel className={styles.tilBehandling}>
          <Heading level="2" size="medium">
            Søknaden din om uføretrygd er under behandling
          </Heading>
          <List>
            <ListItem>
              <Link href={saksbehandlingstiderLenke}>Se saksbehandlingstider for uføretrygd</Link>
            </ListItem>
            <ListItem>
              <Link href={saksoversiktLenke}>Se saken din</Link>
            </ListItem>
          </List>
        </GuidePanel>
      </section>
    )
  }

  if (visningskriterier.includes(Visningskriterier.IngenUforetrygd)) {
    const dittLokaleNavKontorLenke = await getUrl({ urlFromEnv: 'LINK_DITT_LOKALE_NAV_KONTOR' })
    return (
      <section>
        <GuidePanel className={styles.ingenUforetrygd}>
          <VStack gap="3">
            <Heading level="2" size="medium">
              Du har ikke uføretrygd
            </Heading>
            <BodyLong>
              Før du søker om uføretrygd må det være avklart om du har muligheter til å være i arbeid. Det er vi som
              kommer frem til dette i samarbeid med deg. Kontakt{' '}
              <Link href={dittLokaleNavKontorLenke}>ditt lokale Nav-kontor</Link> for veiledning.
            </BodyLong>
          </VStack>
        </GuidePanel>
      </section>
    )
  }
}
