import { BodyShort, Box, Heading, Link, List } from "@navikt/ds-react";
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
import { SakTilBehandling } from "@/components/SakTilBehandling";
import { ShowMore } from "@/components/ShowMore";
import { ListItem } from "@navikt/ds-react/List";
import { LinkList } from "@/components/LinkList";
import type { paths } from "@/api.d.ts";
import createClient from "openapi-fetch";
import { RelevanteSoknader } from "@/sections/RelevanteSoknader";
import { Visningskriterier } from "@/const";
import getOboToken from "@/utils/getOboToken";
import { KanVaereAktueltForDeg } from "@/sections/KanVaereAktueltForDeg";

const client = createClient<paths>({
  baseUrl: process.env.UFORETRYGD_BACKEND,
});

export default async function Home() {
  const oboToken = await getOboToken();
  const initResponse = await client.GET("/api/initiate", {
    headers: {
      Authorization: `Bearer ${oboToken}`,
    },
    cache: "no-store",
  });

  console.log("Init response: ");
  console.log(initResponse);

  return (
    <>
      <Heading size="xlarge" level="1">
        Uføretrygd
      </Heading>

      <SakTilBehandling />

      <section>
        <Heading level="2" size="medium">
          Dine saker til behandling
        </Heading>
        <LinkList>
          <Link href="#">Uføretrygd</Link>
        </LinkList>
      </section>

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
          <ListItem>Uføregrad 80 prosent</ListItem>
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

      <section>
        <Box
          background="surface-alt-3-subtle"
          padding="4"
          borderRadius="xlarge"
        >
          <Heading level="2" size="medium">
            Husk å gi oss beskjed om endringer i din situasjon
          </Heading>
          <Link href="#">
            Se hvile endringer du må si fra om og hvordan du sier fra.
          </Link>
        </Box>
      </section>

      <RelevanteSoknader
        visningskriterier={[
          Visningskriterier.Uforetrygd,
          Visningskriterier.GradertUfore,
        ]}
      />
      <RelevanteSoknader visningskriterier={[]} />

      <KanVaereAktueltForDeg visningskriterier={[]} />
      <KanVaereAktueltForDeg
        visningskriterier={[Visningskriterier.Uforetrygd]}
      />
    </>
  );
}
