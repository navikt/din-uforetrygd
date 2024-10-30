import {Visningskriterier} from "@/const";
import {ShowMore} from "@/components/ShowMore";
import {BodyShort, Heading, Link, List } from "@navikt/ds-react";
import { ListItem } from "@navikt/ds-react/List";

interface IDittVedtak {
    visningskriterier: Visningskriterier[];
}

export const DittVedtak: React.FC<IDittVedtak> = ({visningskriterier}) => {
    if (visningskriterier.includes(Visningskriterier.Uforetrygd)) {
        return (
            <section>
                <ShowMore
                    heading="Ditt uførevedtak, inntekt og inntektsgrenser"
                    aria-labelledby="info-heading"
                    collapsedHeight="10rem"
                    scrollBackOnCollapse={false}
                    variant="info"
                    as="section"
                    headingSize="medium"
                    headingLevel="2"
                >
                    <List>
                        <ListItem>Uføregrad 50 prosent</ListItem>
                        <ListItem>Uføretidspunkt 03.05.2018</ListItem>
                        <ListItem>Uføretrygd ble invilget 06.07.2021</ListItem>
                        <ListItem>Du har tiltaket Varig tilrettelagt arbeid</ListItem>
                    </List>
                    <Heading level="3" size="small">
                        Tillegg til uføretrygden
                    </Heading>
                    <List>
                        <ListItem>Barnetillegg for 1 særkullsbarn og 2 fellesbarn</ListItem>
                        <ListItem>Gjenlevendetillegg</ListItem>
                    </List>

                    <Heading level="3" size="small">
                        Inntektsgrense og registrert forventet inntekt
                    </Heading>
                    <BodyShort>
                        Har du inntekt ved siden av uføretrygden? Du finner dine
                        inntektsgrenser, trekkprosent (kompensasjonsgrad) og hvilken inntekt
                        vi har beregnet din uføretrygd ut fra, på førstesiden i{" "}
                        <Link href="#">inntektsplanleggeren</Link>.
                    </BodyShort>
                </ShowMore>

            </section>
        )
    }
}