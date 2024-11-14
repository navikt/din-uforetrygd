import { LinkList } from '@/components/LinkList'
import { Heading, Link } from '@navikt/ds-react'
import { Visningskriterier } from '@/const'
import { getUrl } from '@/utils/getUrl'

interface IDineSaker {
  visningskriterier: Visningskriterier[]
}

export const DineSaker: React.FC<IDineSaker> = async ({ visningskriterier }) => {
  if (visningskriterier.includes(Visningskriterier.UforesoknadTilBehandling)) {
    const saksoversiktLenke = await getUrl('LINK_SAKER')
    return (
      <section>
        <Heading level="2" size="medium">
          Dine saker til behandling
        </Heading>
        <LinkList>
          <Link href={saksoversiktLenke}>Uføretrygd</Link>
        </LinkList>
      </section>
    )
  }
}
