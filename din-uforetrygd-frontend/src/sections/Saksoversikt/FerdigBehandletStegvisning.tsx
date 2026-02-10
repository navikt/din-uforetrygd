import { Process } from '@navikt/ds-react'
import { formatterDatoTekst } from '@/utils/formatter/formatter'
import { CheckmarkHeavyIcon } from '@navikt/aksel-icons'
import React from 'react'
import { StegType } from '@/sections/Saksoversikt/saksoversiktType'

interface Props {
  steg: StegType[]
}

export const FerdigBehandletStegvisning = ({ steg }: Props) => {
  return (
    <Process>
      {steg.map((steg) => (
        <Process.Event
          key={`${steg.dato}-${steg.tittel}`}
          status={'completed'}
          title={steg.tittel}
          timestamp={formatterDatoTekst(steg.dato)}
          bullet={<CheckmarkHeavyIcon />}
        >
          {steg.undertekst}
        </Process.Event>
      ))}
    </Process>
  )
}
