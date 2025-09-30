import { Visningskriterier } from '@/const'

import { components } from '@/api/api'
import { Heading, VStack } from '@navikt/ds-react'
import { Dokumenter } from '@/components/Dokumenter'
import React from 'react'

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
        <Heading size="medium" level="2">
          Saksoversikt
        </Heading>
        {/* <Hendelser hendelser={hendelser!} sakstype={sakstype} /> */}
        <Dokumenter pid={pid} journalposter={journalposter!} />
      </VStack>
    </section>
  )
}
