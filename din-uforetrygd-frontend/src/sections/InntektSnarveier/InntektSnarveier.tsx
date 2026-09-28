import { CalculatorIcon, WalletIcon } from '@navikt/aksel-icons'
import type React from 'react'
import { Visningskriterier } from '@/const'
import { env } from '@/env'
import { HGrid } from '@navikt/ds-react'
import { Lenkekort } from '@/components/Lenkekort/Lenkekort'
import { leggTilPidHvisVeileder } from '@/utils/getUrl/getUrl'

interface InntektSnarveierProps {
  visningskriterier: Visningskriterier[]
  pid?: string
}

export const InntektSnarveier: React.FC<InntektSnarveierProps> = async ({ visningskriterier, pid }) => {
  if (!visningskriterier.includes(Visningskriterier.Uforetrygd)) return null

  return (
    <HGrid as="section" gap="space-24" columns={{ md: 2 }} aria-label="Snarvei til inntektsplanlegger og utbetalinger">
      <Lenkekort
        tittel="Inntektsplanlegger"
        undertittel="Meld fra om endring i inntekt"
        href={leggTilPidHvisVeileder(env('LINK_INNTEKTSPLANLEGGER'), pid)}
        icon={<CalculatorIcon />}
      />
      <Lenkekort
        tittel="Utbetalinger"
        undertittel={
          env('MODE') === 'borger' ? 'Oversikt og detaljer' : 'Veiledere må bruke Salesforce for utbetalinger'
        }
        href={env('LINK_UTBETALINGER')}
        icon={<WalletIcon />}
        disabled={env('MODE') === 'veileder'}
      />
    </HGrid>
  )
}
