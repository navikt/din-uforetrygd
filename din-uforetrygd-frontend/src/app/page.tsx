import {Heading} from "@navikt/ds-react";
import type {paths} from "@/api.d.ts";
import createClient from "openapi-fetch";
import {RelevanteSoknader} from "@/sections/RelevanteSoknader";
import {Visningskriterier} from "@/const";
import getOboToken from "@/utils/getOboToken";
import {KanVaereAktueltForDeg} from "@/sections/KanVaereAktueltForDeg";
import {InformasjonOgRegistreringer} from "@/sections/InformasjonOgRegistreringer";
import {UforestatusGuidePanel} from "@/sections/UforeStatusGuidePanel";
import {DittVedtak} from "@/sections/DittVedtak";
import {MeldeFra} from "@/sections/MeldeFra";
import {DineSaker} from "@/sections/DineSaker";

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

      <DineSaker visningskriterier={[Visningskriterier.UforesoknadTilBehandling]} />
      <DineSaker visningskriterier={[Visningskriterier.Uforetrygd]} />

        <DittVedtak visningskriterier={[Visningskriterier.GradertUfore]} />
        <DittVedtak visningskriterier={[Visningskriterier.Uforetrygd]} />

      <InformasjonOgRegistreringer visningskriterier={[]} />
      <InformasjonOgRegistreringer
        visningskriterier={[Visningskriterier.Uforetrygd]}
      />

      <MeldeFra visningskriterier={[Visningskriterier.Uforetrygd]}/>
      <MeldeFra visningskriterier={[Visningskriterier.GradertUfore]}/>

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
