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
import { InformasjonOgRegistreringer } from "@/sections/InformasjonOgRegistreringer";
import {UforestatusGuidePanel} from "@/sections/UforeStatusGuidePanel";
import {DittVedtak} from "@/sections/DittVedtak";

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

      <UforestatusGuidePanel visningskriterier={[Visningskriterier.Uforetrygd]} />
      <UforestatusGuidePanel visningskriterier={[Visningskriterier.UforesoknadTilBehandling]} />
      <UforestatusGuidePanel visningskriterier={[Visningskriterier.IngenUforetrygd]} />

      <section>
        <Heading level="2" size="medium">
          Dine saker til behandling
        </Heading>
        <LinkList>
          <Link href="#">Uføretrygd</Link>
        </LinkList>
      </section>

        <DittVedtak visningskriterier={[Visningskriterier.GradertUfore]} />
        <DittVedtak visningskriterier={[Visningskriterier.Uforetrygd]} />

      <InformasjonOgRegistreringer visningskriterier={[]} />
      <InformasjonOgRegistreringer
        visningskriterier={[Visningskriterier.Uforetrygd]}
      />

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
