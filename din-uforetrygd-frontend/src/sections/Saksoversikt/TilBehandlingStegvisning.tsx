import { CheckmarkHeavyIcon } from '@navikt/aksel-icons'
import { Process } from '@navikt/ds-react'
import type { StegType } from '@/sections/Saksoversikt/saksoversiktType'
import { formatterDatoTekst } from '@/utils/formatter/formatter'

interface Props {
  steg: StegType[]
}

// Denne tar utgangspunkt i at vi bare har to steg i en behandling. Må utvides hvis det blir flere steg i framtida.
export const TilBehandlingStegvisning = ({ steg }: Props) => {
  const førsteSteg = steg[steg.length - 2]
  const sisteSteg = steg[steg.length - 1]

  return (
    <Process>
      <Process.Event
        key={`${førsteSteg.dato}-${førsteSteg.tittel}`}
        status={'active'}
        title={førsteSteg.tittel}
        timestamp={formatterDatoTekst(førsteSteg.dato)}
        bullet={<CheckmarkHeavyIcon />}
      >
        {førsteSteg.undertekst}
      </Process.Event>
      <Process.Event
        key={`${sisteSteg.dato}-${sisteSteg.tittel}`}
        status={undefined}
        title={sisteSteg.tittel}
        timestamp={undefined}
        bullet={undefined}
      />
    </Process>
  )
}
