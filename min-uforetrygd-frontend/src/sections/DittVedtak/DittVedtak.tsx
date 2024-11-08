import { Visningskriterier } from "@/const";
import { ShowMore } from "@/components/ShowMore";
import { BodyShort, Heading, Link, List } from "@navikt/ds-react";
import { ListItem } from "@navikt/ds-react/List";
import { dittUforevedtak } from "@/api/endpoints";
import { format, parseISO } from "date-fns";

interface IDittVedtak {
  visningskriterier: Visningskriterier[];
  pid?: string;
}

export const DittVedtak: React.FC<IDittVedtak> = async ({
  visningskriterier,
  pid,
}) => {
  if (visningskriterier.includes(Visningskriterier.Uforetrygd)) {
    const dittUforevedtakData = await dittUforevedtak(pid);
    const uforegrad = dittUforevedtakData?.uforegrad ?? 0;
    const uforetidspunkt = format(
      parseISO(dittUforevedtakData?.uforetidspunkt ?? ""),
      "dd.MM.yyyy",
    );
    const uforetrygdInnvilget = format(
      parseISO(dittUforevedtakData?.virkFom ?? ""),
      "dd.MM.yyyy",
    );
    const hasVarigTilrettelagtArbeid =
      dittUforevedtakData?.hasVarigTilrettelagtArbeid ?? false;
    const hasBarnetilleggFellesBarn =
      dittUforevedtakData?.hasBarnetilleggFellesBarn ?? false;
    const hasBarnetilleggSaerkullsbarn =
      dittUforevedtakData?.hasBarnetilleggSaerkullsbarn ?? false;
    const hasGjenlevendeTillegg =
      dittUforevedtakData?.hasGjenlevendeTillegg ?? false;

    return (
      <section>
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
            <ListItem>Uføregrad {uforegrad} prosent</ListItem>
            <ListItem>Uføretidspunkt {uforetidspunkt}</ListItem>
            <ListItem>Uføretrygd ble invilget {uforetrygdInnvilget}</ListItem>
            {hasVarigTilrettelagtArbeid && (
              <ListItem>Du har tiltaket Varig tilrettelagt arbeid</ListItem>
            )}
          </List>
          <Heading level="3" size="small">
            Tillegg til uføretrygden
          </Heading>
          <List>
            {hasBarnetilleggFellesBarn && (
              <ListItem>Barnetillegg for fellesbarn</ListItem>
            )}
            {hasBarnetilleggSaerkullsbarn && (
              <ListItem>Barnetillegg for særkullsbarn</ListItem>
            )}
            {hasGjenlevendeTillegg && <ListItem>Gjenlevendetillegg</ListItem>}
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
      </section>
    );
  }
};

