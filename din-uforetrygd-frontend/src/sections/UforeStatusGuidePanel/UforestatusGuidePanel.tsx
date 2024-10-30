import {Visningskriterier} from "@/const";
import {BodyLong, GuidePanel, Heading, Link, List, VStack} from "@navikt/ds-react";
import {ListItem} from "@navikt/ds-react/List";
import styles from "./uforestatusGuidePanel.module.css";

interface IUforeStatusGuidePanel {
    visningskriterier: Visningskriterier[];
}

export const UforestatusGuidePanel: React.FC<IUforeStatusGuidePanel> = ({visningskriterier}) => {

    if (visningskriterier.includes(Visningskriterier.UforesoknadTilBehandling)) {
        return (
            <section>
                <GuidePanel className={styles.tilBehandling}>
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

    if (visningskriterier.includes(Visningskriterier.IngenUforetrygd)) {
        return (
            <section>
                <GuidePanel className={styles.ingenUforetrygd}>
                    <VStack gap="3">
                        <Heading level="2" size="medium">
                            Du har ikke uføretrygd
                        </Heading>
                        <BodyLong>
                            Du har ikke uføretrygd.
                            Før du søker om uføretrygd må det være avklart om du har muligheter til å være i arbeid.
                            Det er vi som kommer frem til dette i samarbeid med deg. Kontakt <Link href={"#"}>ditt
                            lokale Nav-kontor</Link> for veiledning.
                        </BodyLong>
                    </VStack>
                </GuidePanel>
            </section>
        )
    }
}