import { BodyShort, Button, Heading, Link, List, VStack } from '@navikt/ds-react'
import { ListItem } from '@navikt/ds-react/List'

export default () => (
  <section>
    <VStack gap="space-48" align="start" paddingBlock="space-64 space-80" data-aksel-template="404-v4">
      <div>
        <Heading level="1" size="large" spacing>
          Beklager, vi fant ikke siden
        </Heading>
        <BodyShort spacing>Denne siden kan være slettet eller flyttet, eller det er en feil i lenken.</BodyShort>
        <List>
          <ListItem>Bruk gjerne søket eller menyen</ListItem>
          <ListItem>
            <Link as="a" href="/">
              Gå til forsiden
            </Link>
          </ListItem>
        </List>
      </div>
      <Button as="a" href="/uforetrygd/selvbetjening">
        Gå til Din uføretrygd
      </Button>
    </VStack>
  </section>
)
