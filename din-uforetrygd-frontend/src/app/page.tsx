import {Alert, Heading} from "@navikt/ds-react";
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
import {getVisningskriterier} from "@/utils/getVisningskriterier";

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


    console.log(initResponse.data?.saker)

    if (initResponse.data) {
        const visningskriterier: Visningskriterier[] = getVisningskriterier(initResponse.data);
        console.log(visningskriterier)
        return (
            <>
                <Heading size="xlarge" level="1">
                    Uføretrygd
                </Heading>
                <UforestatusGuidePanel visningskriterier={visningskriterier}/>
                <DineSaker visningskriterier={visningskriterier}/>
                <DittVedtak visningskriterier={visningskriterier}/>
                <InformasjonOgRegistreringer visningskriterier={visningskriterier}/>
                <MeldeFra visningskriterier={visningskriterier}/>
                <RelevanteSoknader visningskriterier={visningskriterier}/>
                <KanVaereAktueltForDeg visningskriterier={visningskriterier}/>
            </>
        )
    } else {
        return (
            <Alert variant="error" role="alert">
                Noe gikk galt. Prøv igjen senere.
            </Alert>
        )
    }
}
