import {Heading, Link} from "@navikt/ds-react";
import {LinkList} from "@/components/LinkList";
import {Visningskriterier} from "@/const";
import filterShowFor from "@/utils/filterShowFor";
import getEnv from "@/utils/env";

interface IRelevanteSoknaderProps {
    visningskriterier: Visningskriterier[];
}

const lenker = [
    {
        href: getEnv("LINK_SOKNAD_GRADERT_UFORE"),
        text: "Søknad om endret inntektsgrense - gradert uføretrygd",
        showFor: [Visningskriterier.GradertUfore, Visningskriterier.Uforetrygd]
    },
    {
        href: getEnv("LINK_SOKNAD_UFORE"),
        text: "Søknad om uføretrygd",
        showFor: []
    },
    {
        href: getEnv("LINK_SOKNAD_BARNETILLEGG"),
        text: "Søknad om barnetillegg til uføretrygd",
        showFor: []
    }
]



export const RelevanteSoknader: React.FC<IRelevanteSoknaderProps> = ({ visningskriterier }) => {
    const relevanteLenker = filterShowFor(visningskriterier, lenker);

    if (relevanteLenker.length === 0) {
        return null;
    }

    return (
        <section>
            <Heading level="2" size="medium">
                Relevante søknader
            </Heading>
            <div style={{maxWidth: "450px"}}>
                <LinkList variant="divided">
                    {relevanteLenker.map((lenke) => (
                        <Link key={lenke.href} href={lenke.href}>{lenke.text}</Link>
                    ))}
                </LinkList>
            </div>
        </section>
    )
}
