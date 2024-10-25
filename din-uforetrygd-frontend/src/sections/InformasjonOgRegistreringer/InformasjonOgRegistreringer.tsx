import {Heading} from "@navikt/ds-react";
import {Kort, KortGrid} from "@/components/Kort";
import {
    EnvelopeClosedIcon, FileExportIcon,
    FileTextIcon,
    PersonGroupIcon,
    PersonPlusIcon,
    ReceiptIcon,
    SackKronerIcon
} from "@navikt/aksel-icons";
import getEnv from "@/utils/env";
import {Visningskriterier} from "@/const";

const links = [
    {
        href: getEnv("LINK_UTBETALINGER"),
        title: "Utbetalinger",
        description: "Oversikt og detaljer",
        showFor: [],
    },
    {
        href: getEnv("LINK_BREV"),
        title: "Brev for uføretrygd",
        description: "Vedtak med mer",
        showFor: [],
    },
    {
        href: getEnv("LINK_INNTEKTSPLANLEGGER"),
        title: "Inntektsplanlegger",
        description: "Meld fra om endring i inntekt",
        showFor: [Visningskriterier.Uforetrygd],
    },
    {
        href: getEnv("LINK_SAKER"),
        title: "Sakene dine",
        description: "Status på søknader og vedtak",
        showFor: [],
    },
    {
        href: getEnv("LINK_SKATTETREKK"),
        title: "Frivillig skattetrekk",
        description: "Registrer tilleggstrekk",
        showFor: [Visningskriterier.Uforetrygd],
    },
    {
        href: getEnv("LINK_FAMILIEFORHOLD"),
        title: "Famileforhold",
        description: "Samboerforhold, sivilstand, barn",
        showFor: [],
    },
    {
        href: getEnv("LINK_FULLMAKTER"),
        title: "Dine fullmakter",
        description: "Gi fullmakt og se dine fullmakter",
        showFor: [],
    },
    {
        href: getEnv("LINK_ETTERSENDE"),
        title: "Ettersend informasjon",
        description: "Til uføresaken din",
        showFor: [Visningskriterier.UforesoknadTilBehandling],
    }
]


export const InformasjonOgRegistreringer = () => {
    return (
        <section>
            <Heading level="2" size="medium">
                Informasjon og registreringer
            </Heading>
            <KortGrid>
                <Kort
                    title="Utbetalinger"
                    description="Oversikt og detaljer"
                    link="about:blank"
                    icon={SackKronerIcon}
                />
                <Kort
                    title="Brev for uføretrygd"
                    description="Vedtak med mer"
                    link="about:blank"
                    icon={EnvelopeClosedIcon}
                />
                <Kort
                    title="Inntektsplanlegger"
                    description="Meld fra om endring i inntekt"
                    link="about:blank"
                    icon={FileTextIcon}
                />
                <Kort
                    title="Sakene dine"
                    description="Status på søknader og vedtak"
                    link="about:blank"
                    icon={FileTextIcon}
                />
                <Kort
                    title="Frivillig skattetrekk"
                    description="Registrer tilleggstrekk"
                    link="about:blank"
                    icon={ReceiptIcon}
                />
                <Kort
                    title="Famileforhold"
                    description="Samboerforhold, sivilstand, barn"
                    link="about:blank"
                    icon={PersonPlusIcon}
                />
                <Kort
                    title="Dine fullmakter"
                    description="Gi fullmakt og se dine fullmakter"
                    link="about:blank"
                    icon={PersonGroupIcon}
                />
                <Kort
                    title="Ettersend informasjon"
                    description="Til uføresaken din"
                    link="about:blank"
                    icon={FileExportIcon}
                />
            </KortGrid>
        </section>
    )
}