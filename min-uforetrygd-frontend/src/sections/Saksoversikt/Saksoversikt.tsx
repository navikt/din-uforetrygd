import { Visningskriterier } from '@/const'

import { components } from '@/api/api'
import { VStack } from '@navikt/ds-react'
import { Hendelser } from '@/components/Hendelser'
import { Dokumenter } from '@/components/Dokumenter'

interface Saksoversikt {
  visningskriterier: Visningskriterier[]
  pid?: string
  journalposter: components['schemas']['Journalpost'][]
  hendelser: components['schemas']['SakHendelse'][]
  sakstype: string
}

export const Saksoversikt: React.FC<Saksoversikt> = async ({
  visningskriterier,
  hendelser,
  pid,
  sakstype,
  journalposter,
}) => {
  if (visningskriterier.includes(Visningskriterier.IngenUforesak)) {
    return null
  }

  return (
    <section>
      <VStack gap="6">
        <Hendelser hendelser={hendelser!} sakstype={sakstype} />
        <Dokumenter pid={pid} journalposter={journalposter!} />
      </VStack>
    </section>
  )
}
