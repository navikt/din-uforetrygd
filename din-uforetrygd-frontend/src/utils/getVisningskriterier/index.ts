import {Visningskriterier} from "@/const";
import {components} from "@/api";

export const getVisningskriterier = (init: components["schemas"]["UforetrygdResponse"]) => {
    const saker = init.saker!
    const visningskriterier = saker.filter(sak => sak.type === "UFORETRYGD").reduce((acc: Visningskriterier[], sak) => {
            if (sak.status === "TIL_BEHANDLING") {
                acc.push(Visningskriterier.UforesoknadTilBehandling)
            } else if (sak.status === "LOPENDE") {
                if (sak.grad !== 100) {
                    acc.push(Visningskriterier.GradertUfore)
                }
                acc.push(Visningskriterier.Uforetrygd)
            }
        return acc
    }, [])
    return visningskriterier.length > 0 ? visningskriterier : [Visningskriterier.IngenUforetrygd]
}

