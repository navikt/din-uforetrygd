import { FilesIcon, FolderFileIcon } from '@navikt/aksel-icons'
import { VStack } from '@navikt/ds-react'
import type React from 'react'
import { Innloggingstype, Visningskriterier } from '@/const'
import { env } from '@/env'
import { matchSome } from '@/utils/filterShowFor/filterShowFor'
import { Lenkekort } from '@/components/Lenkekort/Lenkekort'

interface InterneLenkerProps {
  visningskriterier: Visningskriterier[]
  sakId: string | undefined
  pid?: string
}

export const InterneLenker: React.FC<InterneLenkerProps> = async ({ visningskriterier, sakId, pid }) => {
  return (
    <>
      {matchSome([
        Visningskriterier.SakTilBehandling,
        Visningskriterier.Uforetrygd,
        Visningskriterier.AvsluttetUforetrygdSak,
      ])(visningskriterier) && (
        <VStack as="section" gap="space-24" aria-label="Interne lenker til saksoversikt og dokumentoversikt">
          {/* TODO: Fiks innloggsinstype */}
          <Lenkekort
            tittel="Saksoversikt"
            undertittel="Behandlinger knyttet til saken din"
            href={`/uforetrygd/selvbetjening/saksoversikt?saksid=${sakId?.toString()}${env('MODE') === 'veileder' ? `&pid=${pid}` : ''}`}
            icon={<FilesIcon />}
            innloggingstype={Innloggingstype.LEVEL3}
          />
          <Lenkekort
            tittel="Dokumenter knyttet til saken din"
            undertittel="Brev og informasjon om din uføretrygd"
            href={`/uforetrygd/selvbetjening/dokumenter${env('MODE') === 'veileder' ? `?pid=${pid}` : ''}`}
            icon={<FolderFileIcon />}
            // TODO: Fiks innloggsinstype *
            innloggingstype={Innloggingstype.LEVEL3}
          />
        </VStack>
      )}
    </>
  )
}
