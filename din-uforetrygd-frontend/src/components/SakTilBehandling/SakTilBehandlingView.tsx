import { GuidePanel, Heading, Link, List } from '@navikt/ds-react'
import { ListItem } from '@navikt/ds-react/List'

export const SakTilBehandlingView = () => {
  return (
    <section>
      <GuidePanel>
        <Heading level="2" size="medium">
          Søknaden din om uføretrygd er under behandling
        </Heading>
        <List>
          <ListItem>
            <Link href="#">Se saksbehandlingstider for uføretrygd</Link>
          </ListItem>
          <ListItem>
            <Link href="#">Se saken din</Link>
          </ListItem>
        </List>
      </GuidePanel>
    </section>
  )
}
