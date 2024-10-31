import { describe, expect, it } from "vitest";
import {getVisningskriterier} from "@/utils/getVisningskriterier/index";
import {components} from "@/api";
import {Visningskriterier} from "@/const";

const uforeResponse: components["schemas"]["UforetrygdResponse"] = {
    pid: "81549300",
    tilgangstype: "PERSONLIG",
    innloggingstype: "LEVEL4",
    harGammelFullmaktmottaker: false,
    saker: [{ type: "UFORETRYGD", grad: 100, status: "LOPENDE" }],
};

const gradertUfoereResponse: components["schemas"]["UforetrygdResponse"] = {
    pid: "81549300",
    tilgangstype: "PERSONLIG",
    innloggingstype: "LEVEL4",
    harGammelFullmaktmottaker: false,
    saker: [{ type: "UFORETRYGD", grad: 50, status: "LOPENDE" }],
};

const ingenUforesakResponse: components["schemas"]["UforetrygdResponse"] = {
    pid: "81549300",
    tilgangstype: "PERSONLIG",
    innloggingstype: "LEVEL4",
    harGammelFullmaktmottaker: false,
    saker: [{ type: "ALDERSPENSJON", grad: 50, status: "LOPENDE" }],
};

describe("getVisningskriterier", () => {
    it("should show visningskriterier for ufore", () => {
        const actual = getVisningskriterier(uforeResponse)
        expect(actual).toEqual([Visningskriterier.Uforetrygd]);
    });
    it("should show visningskriterier for gradert ufore", () => {
        const actual = getVisningskriterier(gradertUfoereResponse)
        expect(actual).toEqual([Visningskriterier.GradertUfore, Visningskriterier.Uforetrygd]);
    })
    it("should show visningskriterier for ingen ufore", () => {
        const actual = getVisningskriterier(ingenUforesakResponse)
        expect(actual).toEqual([Visningskriterier.IngenUforetrygd]);
    })
})