import { Heading } from "@navikt/ds-react";
import { Kort, KortGrid } from "@/components/Kort";
import {
  EnvelopeClosedIcon,
  FileExportIcon,
  FileTextIcon,
  PersonGroupIcon,
  PersonPlusIcon,
  ReceiptIcon,
  SackKronerIcon,
} from "@navikt/aksel-icons";
import getEnv from "@/utils/env";
import { Visningskriterier } from "@/const";
import filterShowFor, { matchAll, matchSome } from "@/utils/filterShowFor";

interface IInformasjonOgRegistreringerProps {
  visningskriterier: Visningskriterier[];
}
const links = [
  {
    href: getEnv("LINK_UTBETALINGER"),
    title: "Utbetalinger",
    description: "Oversikt og detaljer",
    icon: SackKronerIcon,
    showFor: true,
  },
  {
    href: getEnv("LINK_BREV"),
    title: "Brev for uføretrygd",
    description: "Vedtak med mer",
    icon: EnvelopeClosedIcon,
    showFor: true,
  },
  {
    href: getEnv("LINK_INNTEKTSPLANLEGGER"),
    title: "Inntektsplanlegger",
    description: "Meld fra om endring i inntekt",
    icon: FileTextIcon,
    showFor: matchAll([Visningskriterier.Uforetrygd]),
  },
  {
    href: getEnv("LINK_SAKER"),
    title: "Sakene dine",
    description: "Status på søknader og vedtak",
    icon: FileTextIcon,
    showFor: true,
  },
  {
    href: getEnv("LINK_SKATTETREKK"),
    title: "Frivillig skattetrekk",
    description: "Registrer tilleggstrekk",
    icon: ReceiptIcon,
    showFor: matchAll([Visningskriterier.Uforetrygd]),
  },
  {
    href: getEnv("LINK_FAMILIEFORHOLD"),
    title: "Famileforhold",
    description: "Samboerforhold, sivilstand, barn",
    icon: PersonPlusIcon,
    showFor: true,
  },
  {
    href: getEnv("LINK_FULLMAKTER"),
    title: "Dine fullmakter",
    description: "Gi fullmakt og se dine fullmakter",
    icon: PersonGroupIcon,
    showFor: true,
  },
  {
    href: getEnv("LINK_ETTERSENDE"),
    title: "Ettersend informasjon",
    description: "Til uføresaken din",
    icon: FileExportIcon,
    showFor: matchSome([
      Visningskriterier.UforesoknadTilBehandling,
      Visningskriterier.Uforetrygd,
    ]),
  },
];

export const InformasjonOgRegistreringer: React.FC<
  IInformasjonOgRegistreringerProps
> = (props) => {
  const relevantLinks = filterShowFor(props.visningskriterier, links);
  return (
    <section>
      <Heading level="2" size="medium">
        Informasjon og registreringer
      </Heading>
      <KortGrid>
        {relevantLinks.map((link) => (
          <Kort
            key={link.title}
            title={link.title}
            description={link.description}
            href={link.href ?? ""}
            icon={link.icon}
          />
        ))}
      </KortGrid>
    </section>
  );
};

