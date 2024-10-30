import {LinkList} from "@/components/LinkList";
import { Heading, Link } from "@navikt/ds-react";
import {Visningskriterier} from "@/const";

interface IDineSaker {
    visningskriterier: Visningskriterier[];
}

export const DineSaker: React.FC<IDineSaker> = ( {visningskriterier} ) => {

    if (visningskriterier.includes(Visningskriterier.UforesoknadTilBehandling)) {
        return (
            <section>
                <Heading level="2" size="medium">
                    Dine saker til behandling
                </Heading>
                <LinkList>
                    <Link href="#">Uføretrygd</Link>
                </LinkList>
            </section>
        )
    }
}