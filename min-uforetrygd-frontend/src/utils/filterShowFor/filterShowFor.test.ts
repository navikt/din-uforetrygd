import {describe, expect, it} from "vitest";
import {Visningskriterier} from "@/const";
import filterShowFor from "./index";


const lenker = [
    {
        href: "#",
        text: "Søknad om endret inntektsgrense - gradert uføretrygd",
        showFor: [Visningskriterier.GradertUfore, Visningskriterier.Uforetrygd]
    },
    {
        href: "#",
        text: "Søknad om uføretrygd",
        showFor: []
    },
    {
        href: "#",
        text: "Søknad om barnetillegg til uføretrygd",
        showFor: []
    },
    {
        href: "#",
        text: "Ettersend informasjon",
        showFor: [Visningskriterier.UforesoknadTilBehandling, Visningskriterier.Uforetrygd],
    }
]


describe("filterShowFor", () => {
    it("should show relevante lenker when no ufore", () => {
        const actual = filterShowFor([], lenker).map(lenke => lenke.text)
        expect(actual).toEqual(["Søknad om uføretrygd", "Søknad om barnetillegg til uføretrygd"])
    })

    it("should show relevante lenker when gradert ufore", () => {
        const actual = filterShowFor([Visningskriterier.GradertUfore, Visningskriterier.Uforetrygd], lenker).map(lenke => lenke.text)
        expect(actual).toEqual([
            "Søknad om endret inntektsgrense - gradert uføretrygd",
            "Søknad om uføretrygd",
            "Søknad om barnetillegg til uføretrygd"
        ])
    })

    it("should show if one creteria is met", () => {
        const actual = filterShowFor([Visningskriterier.UforesoknadTilBehandling, Visningskriterier.Uforetrygd], lenker).map(lenke => lenke.text)
        expect(actual).toEqual(["Ettersend informasjon"])

    })

})