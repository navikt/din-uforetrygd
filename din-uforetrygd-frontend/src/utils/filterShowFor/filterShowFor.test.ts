import { describe, expect, it } from "vitest";
import { Visningskriterier } from "@/const";
import filterShowFor, { matchAll, matchSome } from "./index";

describe("filterShowFor", () => {
  const lenker = [
    {
      href: "#",
      text: "Søknad om endret inntektsgrense - gradert uføretrygd",
      showFor: matchAll([
        Visningskriterier.GradertUfore,
        Visningskriterier.Uforetrygd,
      ]),
    },
    {
      href: "#",
      text: "Søknad om uføretrygd",
      showFor: true,
    },
    {
      href: "#",
      text: "Søknad om barnetillegg til uføretrygd",
      showFor: true,
    },
    {
      href: "#",
      text: "Ettersend informasjon",
      showFor: matchSome([
        Visningskriterier.UforesoknadTilBehandling,
        Visningskriterier.Uforetrygd,
      ]),
    },
  ];
  describe("test with links", () => {
    it("should show relevante lenker when no ufore", () => {
      const actual = filterShowFor([], lenker).map((lenke) => lenke.text);
      expect(actual).toEqual([
        "Søknad om uføretrygd",
        "Søknad om barnetillegg til uføretrygd",
      ]);
    });

    it("should show relevante lenker when gradert ufore", () => {
      const actual = filterShowFor(
        [Visningskriterier.GradertUfore, Visningskriterier.Uforetrygd],
        lenker,
      ).map((lenke) => lenke.text);
      expect(actual).toEqual([
        "Søknad om endret inntektsgrense - gradert uføretrygd",
        "Søknad om uføretrygd",
        "Søknad om barnetillegg til uføretrygd",
        "Ettersend informasjon",
      ]);
    });
  });

  it("should not match for false boolean", () => {
    const input = [
      {
        text: "should not match 1",
        showFor: false,
      },
    ];
    const actual = filterShowFor([], input);
    expect(actual).toEqual([]);
  });

  it('should match for "true" boolean', () => {
    const input = [
      {
        text: "should match 1",
        showFor: true,
      },
      {
        text: "should not match 2",
        showFor: false,
      },
    ];
    const actual = filterShowFor([Visningskriterier.GradertUfore], input);
    expect(actual.map((it) => it.text)).toEqual(["should match 1"]);
  });

  it("should match for all criterias", () => {
    const input = [
      {
        text: "should match 1",
        showFor: matchAll([
          Visningskriterier.UforesoknadTilBehandling,
          Visningskriterier.Uforetrygd,
        ]),
      },
      {
        text: "should match 2",
        showFor: matchAll([
          Visningskriterier.UforesoknadTilBehandling,
          Visningskriterier.Uforetrygd,
        ]),
      },
      {
        text: "should not match 1",
        showFor: matchAll([
          Visningskriterier.UforesoknadTilBehandling,
          Visningskriterier.GradertUfore,
        ]),
      },
    ];

    const actual = filterShowFor(
      [
        Visningskriterier.Uforetrygd,
        Visningskriterier.UforesoknadTilBehandling,
      ],
      input,
    );
    expect(actual.map((it) => it.text)).toEqual([
      "should match 1",
      "should match 2",
    ]);
  });

  it("should match for some criterias", () => {
    const input = [
      {
        text: "should match 1",
        showFor: matchSome([
          Visningskriterier.UforesoknadTilBehandling,
          Visningskriterier.Uforetrygd,
        ]),
      },
      {
        text: "should not match 1",
        showFor: matchAll([
          Visningskriterier.UforesoknadTilBehandling,
          Visningskriterier.Uforetrygd,
        ]),
      },
    ];

    const actual = filterShowFor(
      [Visningskriterier.UforesoknadTilBehandling],
      input,
    );
    expect(actual.map((it) => it.text)).toEqual(["should match 1"]);
  });
});
